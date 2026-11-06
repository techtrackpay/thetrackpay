import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Heart, Landmark, LockKeyhole, Pause, Play, ShieldCheck, Sparkles, Target } from 'lucide-react';
import Phone from './interactive-phone';

export function HeroStory({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [paused, setPaused] = useState(false);
  return <div className={`tp-hero-story ${paused ? 'tp-paused' : ''}`}>
    <svg className="tp-flow-lines" viewBox="0 0 1440 700" fill="none" preserveAspectRatio="none" aria-hidden="true">
      {Array.from({length: 24}, (_,i) => <path key={i} d={`M-100 ${290+i*5} C260 ${680+i*3}, 500 ${-90+i*6}, 880 ${220+i*4} S1300 ${530+i*5}, 1540 ${290+i*4}`} stroke={i%2 ? '#9165bc' : '#5275c5'} strokeOpacity=".17" />)}
    </svg>
    <div className="tp-hero-copy">
      <span className="tp-mini-label">TRACK. ANALYZE. SAVE.</span>
      <motion.h1 initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.7}}>Your money has a story.<br/><i>See where it can take you.</i></motion.h1>
      <p>Pay with UPI. Connect your financial world.<br className="hidden sm:block"/> Find your next step with Artha AI — all in TrackPay.</p>
      <div className="tp-hero-actions"><button onClick={() => onNavigate('product')}>Explore TrackPay <ArrowRight size={16}/></button><a href="#stories">Find your money moment ↓</a></div>
      <div className="tp-hero-pill"><span/> Made for the way India moves money</div>
    </div>
    <button className="tp-motion-control" onClick={() => setPaused(!paused)} aria-label={paused ? 'Play background animation' : 'Pause background animation'}>{paused ? <Play size={14}/> : <Pause size={14}/>}</button>
    <div className="tp-hero-preview">
      <div className="tp-floating-note tp-note-left"><span className="tp-note-icon"><Landmark size={20}/></span><small>THE WHOLE PICTURE</small><b>Different accounts.<br/>Same you.</b><span>UPI · NEFT · RTGS · Cards</span><div className="tp-note-lines"><i/><i/><i/></div></div>
      <div className="tp-hero-handset"><Phone mode="track"/></div>
      <div className="tp-floating-note tp-note-right"><span className="tp-note-icon"><Sparkles size={20}/></span><small>A LITTLE GUIDANCE</small><b>“What can I set aside<br/>this month?”</b><p>Let’s look at your bills,<br/>your goals, and what’s left.</p><span className="tp-note-chip">Artha AI is here to help ↗</span></div>
    </div>
  </div>;
}

const transformations = [
  { before:'Scattered balances', after:'A connected picture', body:'A salary account here, a UPI app there, a card bill somewhere else. TrackPay brings supported financial activity into one place, with the context that makes it useful.', icon:Landmark },
  { before:'A record of what happened', after:'A view of what comes next', body:'Yesterday’s transactions matter because of tomorrow’s choices. Seeing bills, regular spending and goals together helps you understand what a decision changes.', icon:Target },
  { before:'Questions left unanswered', after:'A conversation that helps', body:'Ask about the purchase, the monthly budget or the goal that feels too far away. Artha AI is designed to explain the possibilities in everyday language.', icon:Sparkles },
];

function LineIllustration({ index }: { index:number }) {
  return <div className={`tp-line-illustration tp-line-${index}`} aria-hidden="true">
    {index === 0 ? <><span className="tp-account-node">₹</span><span className="tp-account-node">↗</span><span className="tp-account-node">≋</span><div className="tp-connected-logo"><img src="/image/Trackpay.jpg" alt=""/></div><svg viewBox="0 0 400 220"><path d="M65 65 Q200 10 245 110 M60 150 Q160 230 245 110 M330 170 Q350 110 245 110" fill="none" stroke="currentColor" strokeDasharray="4 6"/></svg></> : <svg viewBox="0 0 400 220" fill="none"><path d={index === 1 ? 'M35 170 C105 180 85 120 160 130 S230 55 285 75 S330 35 365 45' : 'M30 130 C90 30 120 210 190 115 S280 70 370 120'} stroke="currentColor" strokeWidth="2"/>{index === 1 ? [70,140,210,285,365].map((x,i)=><circle key={x} cx={x} cy={[168,130,109,75,45][i]} r="5" fill="currentColor"/>) : <path d="M30 146 C90 46 120 226 190 131 S280 86 370 136" stroke="currentColor" strokeOpacity=".2" strokeWidth="2"/>}</svg>}
  </div>;
}

export function MissionStory() {
  return <main className="tp-editorial">
    <section className="tp-mission-hero"><span className="tp-mini-label">OUR VISION</span><h1>Give every money move<br/><i>a little more meaning.</i></h1><p>We’re bringing payments, visibility and financial guidance together so your money can support the life you want.</p><div className="tp-value-pills"><span>Scattered → Connected</span><span>Uncertain → Informed</span><span>Overwhelmed → In control</span></div><svg viewBox="0 0 1200 100" preserveAspectRatio="none" aria-hidden="true">{[0,1,2,3].map(i=><path key={i} d={`M-30 ${25+i*16} C230 ${-30+i*16} 400 ${120+i*16} 680 ${40+i*16} S1000 ${50+i*16} 1240 ${20+i*16}`} fill="none" stroke="#cdb0e5" strokeOpacity=".35"/>)}</svg></section>
    <section className="tp-transformation-section"><div className="tp-section-title"><span className="tp-mini-label">THE EXPERIENCE WE’RE BUILDING</span><h2>Three shifts.<br/><i>One better relationship with money.</i></h2></div>
      {transformations.map(({before,after,body,icon:Icon},i)=><motion.article key={before} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{duration:.6}} className={`tp-transformation ${i%2 ? 'tp-reverse' : ''}`}><LineIllustration index={i}/><div><span className="tp-mini-label">0{i+1}</span><p className="tp-before">{before}</p><h3><Icon size={24}/>{after}</h3><p>{body}</p></div></motion.article>)}
    </section>
    <section className="tp-values"><div className="tp-section-title"><span className="tp-mini-label">WHAT GUIDES THE WORK</span><h2>Useful technology.<br/><i>Human priorities.</i></h2></div><div className="tp-value-grid"><article><Heart/><h3>Room for life today.</h3><p>A sensible plan should leave space for dinner with friends, a gift for your parents and the things that make a week feel good.</p></article><article><ShieldCheck/><h3>The decision is yours.</h3><p>TrackPay can make the options easier to understand. Your priorities, your comfort and your choices stay at the centre.</p></article></div></section>
    <section className="tp-mission-statement"><span className="tp-mini-label">THE LONG VIEW</span><h2>A clearer picture today.<br/><i>More possibilities tomorrow.</i></h2><p>That’s the future we’re working towards, one useful money moment at a time.</p></section>
  </main>;
}

export function AboutStory() {
  return <section className="tp-about-story"><div><span className="tp-mini-label">WHY TRACKPAY</span><h2>Moving money is easy.<br/><i>Understanding it should be, too.</i></h2><p>India’s payment habits have changed. We pay in seconds, across apps, banks and channels. But understanding the full picture can still take a spreadsheet and a quiet Sunday.</p><p>TrackPay’s idea connects those two experiences: the everyday act of paying and the bigger question of what your money is doing for you.</p></div><div className="tp-about-art"><div className="tp-question-orbit"><span>Spend?</span><span>Save?</span><span>Plan?</span></div><img src="/image/Trackpay.jpg" alt="TrackPay"/><b>One place to connect the dots.</b><div className="tp-about-steps"><span>Pay</span><ArrowRight size={14}/><span>See</span><ArrowRight size={14}/><span>Ask</span></div></div></section>;
}

export function MoneyFlowStory() {
  const [connected, setConnected] = useState(false);
  const transactions = [
    { channel: 'BANK ACCOUNT', name: 'Your salary arrived', detail: 'NEFT · 1 November', amount: '+ ₹86,500', symbol: '↙' },
    { channel: 'UPI APP', name: 'A coffee on the way', detail: 'UPI · Chai Point', amount: '− ₹42', symbol: '☕' },
    { channel: 'CREDIT CARD', name: 'The weekly essentials', detail: 'Card · Groceries', amount: '− ₹1,840', symbol: '↗' },
  ];
  return <section className="tp-money-flow">
    <div className="tp-flow-copy"><span className="tp-mini-label">THE SAME DAY. A DIFFERENT VIEW.</span><h2>Every app tells a part.<br/><i>Connect the whole day.</i></h2><p>Money moves through different places. TrackPay brings supported activity together, so you spend less time piecing it back together.</p><div className="tp-flow-tabs" aria-label="Compare your money views"><button aria-pressed={!connected} onClick={() => setConnected(false)}>Across apps</button><button aria-pressed={connected} onClick={() => setConnected(true)}>With TrackPay <ArrowRight size={14}/></button></div><p className="tp-flow-explanation" aria-live="polite">{connected ? 'One timeline. Three channels. Your example day, connected.' : 'A salary here. A payment there. Three places to check, before the picture starts to make sense.'}</p></div>
    <div className={`tp-flow-scene ${connected ? 'tp-flow-connected' : ''}`}>
      <div className="tp-flow-orbit" aria-hidden="true"/>
      <motion.div aria-hidden={!connected} animate={{opacity:connected?1:0,scale:connected?1:.94}} className="tp-flow-device"><div className="tp-flow-island"/><div className="tp-flow-device-heading"><img src="/image/Trackpay.jpg" alt=""/><b>Your day, together.<small>All accounts · all channels</small></b></div><div className="tp-flow-device-bottom"><span>IN TODAY<b>₹86,500</b></span><span>OUT TODAY<b>₹1,882</b></span></div><div className="tp-flow-home"/></motion.div>
      {transactions.map((transaction,i)=><motion.div layout transition={{type:'spring',stiffness:125,damping:21}} key={transaction.channel} className={`tp-flow-transaction tp-flow-transaction-${i}`}><small>{transaction.channel}</small><div><span>{transaction.symbol}</span><p><b>{transaction.name}</b><small>{transaction.detail}</small></p><strong>{transaction.amount}</strong></div></motion.div>)}
      <span className="tp-flow-caption">Interactive illustration · sample activity</span>
    </div>
  </section>;
}

export function ConsentStory() {
  const [accounts, setAccounts] = useState([true,true,false]);
  return <section className="tp-consent-section"><div className="tp-consent-copy"><span className="tp-mini-label">YOUR PICTURE. YOUR CHOICE.</span><h2>Connection starts<br/><i>with your say.</i></h2><p>TrackPay’s Account Aggregator approach is built around consent. You choose supported accounts to connect, and the purpose for sharing their data.</p><p>Explore how choosing accounts changes this example overview.</p><a href="/faq">More about connected accounts <ArrowRight size={14}/></a></div><div className="tp-consent-panel"><div className="tp-consent-heading"><LockKeyhole size={20}/><div><b>Choose your accounts</b><small>Illustrative consent experience</small></div></div>{['Salary account','Everyday account','Savings account'].map((name,i)=><button key={name} className="tp-consent-row" role="switch" aria-checked={accounts[i]} onClick={()=>setAccounts(a=>a.map((v,n)=>n===i?!v:v))}><Landmark size={18}/><span>{name}<small>•••• {[2048,9012,6371][i]}</small></span><span className={`tp-switch ${accounts[i]?'tp-switch-on':''}`}><i/></span></button>)}<div className="tp-consent-total" aria-live="polite"><span>Included in this example</span><b>{accounts.filter(Boolean).length} accounts</b><p>{accounts.some(Boolean)?'Your overview includes only the accounts you selected.':'No accounts selected. Your example overview is empty.'}</p></div></div></section>;
}

export function VoiceStory() {
  const [voice,setVoice] = useState(0);
  const [detail,setDetail] = useState(false);
  const answers = ['You can make room for that weekend. Put ₹4,000 aside each month and your trip is six months away.','₹24,000 remaining. ₹4,000 monthly. Six months to your goal.','Start with ₹4,000 this month. Keep that rhythm for six months, and your travel fund is ready.'];
  return <section className="tp-voice-section"><div><span className="tp-mini-label">GUIDANCE THAT FITS YOU</span><h2>Your priorities.<br/><i>Your kind of conversation.</i></h2><p>Some days you want the number. Some days you want to talk it through. Explore a voice and level of detail that feel right.</p></div><div className="tp-voice-card"><span className="tp-mini-label">ARTHA AI · PERSONALIZE</span><h3>How do you like things explained?</h3><div className="tp-voice-tabs">{['Warm','Direct','Step by step'].map((v,i)=><button key={v} aria-pressed={voice===i} onClick={()=>setVoice(i)}>{v}</button>)}</div><motion.div key={`${voice}-${detail}`} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} className="tp-voice-answer"><Sparkles size={17}/><p>{answers[voice]}</p>{detail&&<p className="tp-voice-detail">The example goal is ₹24,000. Dividing it over six months gives ₹4,000 per month. This uses money left after bills and existing savings.</p>}</motion.div><button className="tp-detail-toggle" aria-pressed={detail} onClick={()=>setDetail(!detail)}><span className={`tp-check ${detail?'tp-checked':''}`}>{detail&&<Check size={12}/>}</span>Show me the reasoning</button><small className="tp-voice-footnote">An interactive example of the experience we’re building.</small></div></section>;
}
