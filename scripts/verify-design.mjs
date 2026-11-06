// Run against the local Vite server. Chrome and Node 22+ are the only requirements.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const base = process.env.QA_URL || 'http://127.0.0.1:5173';
const chromePath = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const profile = await mkdtemp(join(tmpdir(), 'trackpay-design-qa-'));
const output = resolve('artifacts/design-qa');
await mkdir(output, { recursive: true });
const chrome = spawn(chromePath, ['--headless=new', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let socket;
const report = { routes: [], interactions: [], errors: [] };
try {
  let port;
  for (let i = 0; i < 100; i++) {
    try { port = (await readFile(join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]; break; } catch { await sleep(200); }
  }
  assert(port, 'Chrome did not start');
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  socket = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((r, reject) => { socket.onopen = r; socket.onerror = reject; });
  let id = 0;
  const pending = new Map();
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    if (message.id) {
      const item = pending.get(message.id);
      if (item) { pending.delete(message.id); clearTimeout(item.timer); message.error ? item.reject(message.error) : item.resolve(message.result); }
    }
    if (message.method === 'Runtime.exceptionThrown') report.errors.push(message.params.exceptionDetails.text + ': ' + message.params.exceptionDetails.exception?.description);
  };
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const key = ++id;
    const timer = setTimeout(() => { pending.delete(key); reject(new Error(`CDP timeout: ${method}`)); }, 15000);
    pending.set(key, { resolve, reject, timer }); socket.send(JSON.stringify({ id: key, method, params }));
  });
  const evaluate = async expression => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || 'Page evaluation failed');
    return result.result.value;
  };
  const until = async expression => { for (let i = 0; i < 60; i++) { if (await evaluate(expression)) return; await sleep(100); } throw new Error(`State not reached: ${expression}`); };
  const navigate = async path => { await send('Page.navigate', { url: base + path }); await until(`document.readyState === 'complete' && !!document.querySelector('.tp-site') && location.pathname === ${JSON.stringify(path)}`); await evaluate('document.fonts.ready.then(() => true)'); await sleep(450); };
  const click = async selector => {
    await until(`!!document.querySelector(${JSON.stringify(selector)})`);
    const point = await evaluate(`(() => {const e=document.querySelector(${JSON.stringify(selector)});e.scrollIntoView({block:'center',behavior:'instant'});const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', clickCount: 1, ...point });
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', clickCount: 1, ...point });
    await sleep(350);
  };
  const screenshot = async name => { const shot = await send('Page.captureScreenshot', { format: 'png' }); await writeFile(join(output, `${name}.png`), Buffer.from(shot.data, 'base64')); };
  const text = selector => evaluate(`document.querySelector(${JSON.stringify(selector)})?.innerText`);
  const input = async (selector, value) => { await evaluate(`(() => {const e=document.querySelector(${JSON.stringify(selector)});Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(e,${JSON.stringify(value)});e.dispatchEvent(new Event('input',{bubbles:true}));})()`); await sleep(150); };
  await send('Page.enable'); await send('Runtime.enable');
  const paths = ['/', '/product', '/vision', '/team', '/survey', '/faq', '/journal', '/journal/connected', '/journal/goals', '/journal/conversation'];
  for (const width of [1440, 390, 320]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: width === 1440 ? 1000 : 844, deviceScaleFactor: 1, mobile: false });
    for (const path of paths) {
      await navigate(path);
      const layout = await evaluate(`({headings:document.querySelectorAll('h1').length,title:document.title,brokenImages:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),phones:[...document.querySelectorAll('.tp-phone')].filter(e=>e.getClientRects().length).map(e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right}}),pageWidth:document.documentElement.scrollWidth})`);
      assert.equal(layout.headings, 1, `${path} must have one h1`);
      assert.deepEqual(layout.brokenImages, [], `Broken image: ${path}`);
      assert(layout.pageWidth <= width + 1, `Horizontal overflow: ${path} at ${width}`);
      assert(await evaluate(`(() => {const a=document.querySelector('.tp-header-identity').getBoundingClientRect();const b=document.querySelector('.tp-header-actions').getBoundingClientRect();return a.right <= b.left && b.right <= innerWidth;})()`), `Header overlap: ${path} at ${width}`);
      if (width < 768) assert(layout.phones.every(p => p.left >= -1 && p.right <= width + 1), `Phone clipped: ${path} at ${width}: ${JSON.stringify(layout.phones)}`);
      report.routes.push({ path, width, title: layout.title, status: 'passed' });
      if (width !== 320) await screenshot(`${path === '/' ? 'home' : path.slice(1).replaceAll('/', '-')}-${width}`);
      if (width === 1440 && ['/', '/product', '/vision', '/team'].includes(path)) {
        await evaluate(`(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=800){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,100));}window.scrollTo(0,0);await new Promise(r=>setTimeout(r,700));return true;})()`);
        const height = await evaluate('document.documentElement.scrollHeight');
        const shot = await send('Page.captureScreenshot', { format:'png', captureBeyondViewport:true, clip:{x:0,y:0,width,height,scale:.4} });
        await writeFile(join(output, `${path === '/' ? 'home' : path.slice(1)}-full.png`), Buffer.from(shot.data,'base64'));
      }
    }
  }
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: false });
  await navigate('/');
  const phone = '.tp-hero-handset .tp-phone';
  await click(`${phone} .tp-phone-nav button:nth-child(2)`);
  await click(`${phone} .tp-primary`);
  assert.match(await text(`${phone} .tp-insight`), /3,158/); report.interactions.push('Sample payment confirmation and budget');
  await screenshot('payment-mobile');
  await click(`${phone} .tp-phone-nav button:nth-child(1)`);
  await click(`${phone} .tp-filter button:nth-child(3)`);
  assert.equal(await evaluate(`document.querySelectorAll('${phone} .tp-transactions>div').length`), 2);
  assert.match(await text(`${phone} .tp-transactions`), /Monthly salary/);
  assert.doesNotMatch(await text(`${phone} .tp-transactions`), /Chai Point/); report.interactions.push('Bank transaction filter');
  await click(`${phone} .tp-phone-nav button:nth-child(3)`);
  await click(`${phone} .tp-filter button:nth-child(2)`);
  assert.match(await text(`${phone} .tp-chat-answer`), /SIP/);
  await click(`${phone} .tp-primary`); assert.match(await text(`${phone} .tp-primary`), /Saved/);
  await click(`${phone} .tp-filter button:nth-child(3)`); assert.match(await text(`${phone} .tp-chat-answer`), /policies/);
  assert.match(await text(`${phone} .tp-primary`), /Save this insight/); report.interactions.push('AI topics, saving and topic reset');
  await click(`${phone} .tp-phone-nav button:nth-child(4)`);
  await click(`${phone} input[type=range]`);
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Home', code: 'Home', windowsVirtualKeyCode: 36 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Home', code: 'Home', windowsVirtualKeyCode: 36 });
  assert.match(await text(`${phone} .tp-goal-sum`), /8,000/);
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'End', code: 'End', windowsVirtualKeyCode: 35 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'End', code: 'End', windowsVirtualKeyCode: 35 });
  assert.match(await text(`${phone} .tp-goal-sum`), /2,000/); report.interactions.push('Phone goal slider via keyboard');
  await click('#stories button:nth-child(2)'); assert.match(await text('#stories h3'), /Every account/);
  await click('#stories button:nth-child(3)'); assert.match(await text('#stories h3'), /trade-off/); report.interactions.push('Persona stories update');
  await click('#stories button:first-child'); assert.match(await text('#stories .tp-chat-user'), /Mum/); assert.match(await text('#stories .tp-chat-answer'), /3,200/); report.interactions.push('Persona question and phone answer match');
  await click('.tp-flow-tabs button:nth-child(2)'); assert.match(await text('.tp-flow-explanation'), /One timeline/);
  assert.equal(await evaluate("document.querySelector('.tp-flow-device').getAttribute('aria-hidden')"), 'false');
  await screenshot('connected-flow-mobile');
  await click('.tp-flow-tabs button:first-child'); assert.equal(await evaluate("document.querySelector('.tp-flow-device').getAttribute('aria-hidden')"), 'true'); report.interactions.push('Scattered-to-connected animated illustration');
  for (const [months, amount, remaining] of [['3','8,000','2,000'],['12','2,000','8,000']]) {
    await input('#trip-timing', months); assert.match(await text('.tp-planner-result'), new RegExp(amount)); assert.match(await text('.tp-planner-result b'), new RegExp(remaining));
  }
  report.interactions.push('Goal calculator endpoints');
  await click('.tp-voice-tabs button:nth-child(2)'); assert.match(await text('.tp-voice-answer'), /24,000 remaining/);
  await click('.tp-detail-toggle'); assert.match(await text('.tp-voice-detail'), /Dividing/); report.interactions.push('AI voice and reasoning');
  await screenshot('voice-mobile');
  await click('.tp-consent-row:nth-of-type(1)'); await click('.tp-consent-row:nth-of-type(2)');
  assert.match(await text('.tp-consent-total'), /0 accounts/); assert.match(await text('.tp-consent-total'), /empty/); report.interactions.push('Consent switches and empty state');
  await screenshot('consent-mobile');
  await click('header button[aria-label="Open site navigation"]'); await click('header nav:not(.hidden) a:first-child');
  assert.equal(await evaluate('location.pathname'), '/product');
  await evaluate('history.back()'); await until(`location.pathname === '/' && !!document.querySelector('.tp-hero-copy')`);
  await evaluate('history.forward()'); await until(`location.pathname === '/product' && !!document.querySelector('.tp-pair-front')`);
  report.interactions.push('Mobile navigation and browser back/forward');
  await click('section.border-y button:nth-child(3)');
  assert.match(await text('section.border-y .tp-phone-heading'), /Artha AI/);
  await click('section.border-y button:nth-child(4)');
  assert.match(await text('section.border-y .tp-phone-body'), /weekend by the sea/); report.interactions.push('Product walkthrough tabs update the phone');
  await navigate('/faq'); await click('.tp-faq-topics nav button:nth-child(4)');
  assert.equal(await evaluate("document.querySelectorAll('.tp-faq-results details').length"), 3);
  await input('#faq-search', 'zzzz'); assert.match(await text('.tp-no-results'), /No matching/);
  await input('#faq-search', 'move all'); await click('.tp-faq-results summary'); assert.equal(await evaluate("document.querySelector('.tp-faq-results details').open"), true);
  report.interactions.push('FAQ category, search, empty state and accordion');
  await navigate('/journal'); await click('.tp-journal-card'); assert.equal(await evaluate('location.pathname'), '/journal/connected');
  await click('.tp-article>.tp-back-link'); assert.equal(await evaluate('location.pathname'), '/journal'); report.interactions.push('Journal article and return link');
  await navigate('/'); await click('.tp-motion-control'); assert.equal(await evaluate("getComputedStyle(document.querySelector('.tp-flow-lines')).animationPlayState"), 'paused');
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.tp-flow-lines')).animationName"), 'none'); report.interactions.push('Pause control and reduced motion');
  assert.equal((await fetch(base + '/trackpay-demo.html')).status, 200);
  await send('Emulation.setEmulatedMedia', { features: [{name:'prefers-color-scheme',value:'dark'}, {name:'prefers-reduced-motion',value:'reduce'}] });
  await evaluate("localStorage.removeItem('trackpay-theme')");
  await navigate('/');
  assert.equal(await evaluate('document.documentElement.dataset.theme'), 'light', 'Default to light even when the OS prefers dark');
  await click('.tp-theme-toggle');
  await evaluate("document.querySelector('.tp-theme-toggle').focus()");
  await send('Input.dispatchKeyEvent', {type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r'});
  await send('Input.dispatchKeyEvent', {type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
  await until("document.documentElement.dataset.theme === 'light'");
  assert.equal(await evaluate("localStorage.getItem('trackpay-theme')"), 'light');
  await navigate('/product');
  assert.equal(await evaluate('document.documentElement.dataset.theme'), 'light', 'Saved preference overrides dark OS after navigation');
  await click('.tp-theme-toggle');
  for (const width of [1440, 768, 390, 320]) {
    await send('Emulation.setDeviceMetricsOverride', {width,height:width===1440?1000:844,deviceScaleFactor:1,mobile:false});
    for (const path of width===768 ? ['/'] : paths) {
      await navigate(path);
      assert.equal(await evaluate('document.documentElement.dataset.theme'), 'dark');
      assert.equal(await evaluate("document.querySelector('.tp-theme-toggle').getAttribute('aria-pressed')"), 'true');
      assert.equal(await evaluate("getComputedStyle(document.querySelector('.tp-site')).backgroundColor"), 'rgb(20, 17, 28)');
      if (path.startsWith('/journal/')) assert.equal(await evaluate("getComputedStyle(document.querySelector('.tp-article-heading h1')).color"), 'rgb(240, 232, 246)', 'Article heading must remain readable in dark mode');
      assert(await evaluate(`(() => {const a=document.querySelector('.tp-header-identity').getBoundingClientRect();const b=document.querySelector('.tp-header-actions').getBoundingClientRect();const img=document.querySelector('.tp-affiliation img');return a.right<=b.left && b.right<=innerWidth && img.naturalWidth>0 && document.documentElement.scrollWidth<=innerWidth;})()`), `Dark header layout: ${path} at ${width}`);
      assert.match(await text('.tp-affiliation'), /Currently Pre-Incubating at/);
      report.routes.push({path,width,theme:'dark',status:'passed'});
      if (width!==320) await screenshot(`${path==='/'?'home':path.slice(1).replaceAll('/','-')}-dark-${width}`);
    }
  }
  await navigate('/');
  await click('.tp-hero-handset .tp-phone-nav button:nth-child(2)');
  await click('.tp-hero-handset .tp-primary');
  assert.match(await text('.tp-hero-handset .tp-primary'), /Payment complete/);
  await screenshot('payment-dark-mobile');
  await click('.tp-theme-toggle');
  assert.equal(await evaluate('document.documentElement.dataset.theme'), 'light');
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.tp-site')).backgroundColor"), 'rgb(252, 250, 247)');
  report.interactions.push('Light default, keyboard switch, saved preference across reload/navigation, dark phone interaction, light-mode restoration and responsive Nirmaan badge');
  assert.deepEqual(report.errors, [], 'Browser runtime errors');
  report.status = 'passed';
  await send('Browser.close');
  console.log(JSON.stringify({ status: report.status, routeChecks: report.routes.length, interactions: report.interactions }, null, 2));
} catch (error) {
  report.status = 'failed'; report.failure = error.stack || String(error); console.error(report.failure); process.exitCode = 1;
} finally {
  await writeFile(join(output, 'report.json'), JSON.stringify(report, null, 2));
  socket?.close(); chrome.kill();
  await sleep(500);
  if (resolve(profile).startsWith(resolve(tmpdir()) + '\\') || resolve(profile).startsWith(resolve(tmpdir()) + '/')) await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 250 }).catch(() => {});
}
