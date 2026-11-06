import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, CreditCard, Menu, MessageCircle,
  Target, X, Moon, Sun,
} from "lucide-react";
import FeedbackForm from "./feedback-form";
import Phone from "./interactive-phone";
import { MotionConfig } from "framer-motion";
import { HeroStory, MissionStory, AboutStory, ConsentStory, VoiceStory, MoneyFlowStory } from "./trackpay-stories";
import Journal from "./trackpay-journal";
import { SECTION_PATHS } from "../../lib/routes";
import "./trackpay-theme.css";

type Page = string;
type Props = { page: Page; onNavigate: (page: string) => void };
type PhoneMode = "pay" | "track" | "ask" | "goal";

const pages = [
  ["Product", "product"],
  ["Our vision", "vision"],
  ["Team", "team"],
  ["Journal", "journal"],
  ["FAQ", "faq"],
] as const;

const stories = [
  {
    label: "I want to spend without second-guessing",
    title: "A plan that makes room for today.",
    question: "Can I take Mum out this weekend?",
    answer: "Yes. ₹3,200 is free after bills, goals and your SIP. Keep dinner under ₹1,500 and nothing shifts.",
    stat: "₹3,200", sub: "free this week", mode: "ask" as PhoneMode,
  },
  {
    label: "I am done with five different apps",
    title: "Every account finally has a place.",
    question: "What did I really spend this month?",
    answer: "₹21,460 across UPI, cards and bank transfers. Food is up ₹1,180 — mostly delivery after 9 PM.",
    stat: "₹21,460", sub: "tracked across channels", mode: "track" as PhoneMode,
  },
  {
    label: "I have a bigger goal in mind",
    title: "See the trade-off before it becomes regret.",
    question: "Can I make Goa happen in June?",
    answer: "Yes. Set aside ₹4,000 more for three months. Your emergency fund stays untouched.",
    stat: "Jun ’27", sub: "for your Goa goal", mode: "goal" as PhoneMode,
  },
];

const team = [
  ["Ashutosh", "Founder & CEO", "/image/Team/Ashutosh.png"],
  ["Siddhi", "Cofounder · Finance", "/image/Team/Siddhi.jpg"],
  ["Sarthak", "Cofounder · Technology", "/image/Team/Sarthak.jpg"],
  ["Prathamesh", "Cofounder · AI/ML", "/image/Team/Prathamesh.png"],
  ["Shaurya", "Cofounder · Application", "/image/Team/Shaurya.jpg"],
];

function Mark() {
  return <img className="tp-brand-image" src="/image/Trackpay.jpg" alt="" />;
}

function PageLink({ page, onNavigate, children, className = "", onFollow }: { page: string; onNavigate: Props["onNavigate"]; children: ReactNode; className?: string; onFollow?: () => void }) {
  const href = SECTION_PATHS[page] ?? "/";
  return <a href={href} className={className} aria-current={window.location.pathname === href ? "page" : undefined} onClick={e => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault(); onFollow?.(); onNavigate(page);
  }}>{children}</a>;
}

function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.dataset.theme === "dark");
  const toggle = () => {
    const theme = dark ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    setDark(!dark);
    try { localStorage.setItem("trackpay-theme", theme); } catch { /* Keep the switch working when storage is unavailable. */ }
  };
  return <button type="button" className="tp-theme-toggle" onClick={toggle} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} aria-pressed={dark} title={dark ? "Switch to light mode" : "Switch to dark mode"}>{dark ? <Sun size={18}/> : <Moon size={18}/>}</button>;
}

function Header({ onNavigate }: { onNavigate: Props["onNavigate"] }) {
  const [open, setOpen] = useState(false);
  return <header onKeyDown={e => { if (e.key === "Escape") { setOpen(false); e.currentTarget.querySelector<HTMLButtonElement>("[aria-expanded]")?.focus(); } }} className="tp-site-header">
    <div className="tp-header-identity">
      <PageLink page="home" onNavigate={onNavigate} className="tp-header-brand"><Mark />TrackPay</PageLink>
      <div className="tp-affiliation">
        <img src="/image/Nirmaan.png" alt="Nirmaan logo" width="34" height="34"/>
        <span><small>Currently Pre-Incubating at</small><strong>Nirmaan IITM</strong></span>
      </div>
    </div>
    <div className="tp-header-actions">
      <nav aria-label="Main" className="hidden tp-desktop-nav">
        {pages.map(([label, page]) => <PageLink key={page} page={page} onNavigate={onNavigate} className="tp-nav-link transition hover:opacity-60">{label}</PageLink>)}
        <button onClick={() => onNavigate("survey")} className="tp-header-cta">Join early access <ArrowUpRight size={14}/></button>
      </nav>
      <ThemeToggle/>
      <button onClick={() => setOpen(!open)} aria-label={open ? "Close site navigation" : "Open site navigation"} aria-expanded={open} aria-controls="tp-mobile-navigation" className="tp-menu-toggle">{open ? <X size={19}/> : <Menu size={19}/>}</button>
    </div>
    <AnimatePresence>{open && <motion.nav id="tp-mobile-navigation" aria-label="Main" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="tp-mobile-nav">
      {pages.map(([label, page]) => <PageLink key={page} page={page} onNavigate={onNavigate} onFollow={() => setOpen(false)} className="tp-nav-link block w-full rounded-2xl px-4 py-3 text-left text-sm hover:bg-white/10">{label}</PageLink>)}
      <button onClick={() => { setOpen(false); onNavigate("survey"); }} className="tp-header-cta">Join early access <ArrowUpRight size={14}/></button>
    </motion.nav>}</AnimatePresence>
  </header>;
}

function Footer({ onNavigate }: { onNavigate: Props["onNavigate"] }) {
  return <footer className="bg-[#30213f] text-[#fcfaf7]"><div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-14 md:grid-cols-[1.2fr_.8fr_.8fr] md:px-8"><div><PageLink page="home" onNavigate={onNavigate} className="flex items-center gap-2.5 text-lg font-semibold tracking-[-.06em]"><Mark />TrackPay</PageLink><p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">A more useful relationship with money — from the tap to the long-term plan.</p></div><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#e6cafa]">Explore</p><div className="mt-4 grid gap-3 text-sm text-white/65">{pages.map(([name, page]) => <PageLink key={page} page={page} onNavigate={onNavigate} className="text-left hover:text-white">{name}</PageLink>)}</div></div><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#e6cafa]">TrackPay</p><p className="mt-4 text-sm leading-relaxed text-white/65">UPI payments, unified tracking and guidance that starts with what matters to you.</p><button onClick={() => onNavigate("survey")} className="mt-5 flex items-center gap-2 text-sm font-bold text-[#e6cafa]">Get early access <ArrowUpRight size={14} /></button></div></div><div className="border-t border-white/10 px-5 py-5 text-center text-[11px] text-white/40">© {new Date().getFullYear()} TrackPay · Made for India</div></footer>;
}

function Eyebrow({ children }: { children: ReactNode }) { return <p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#886697]">{children}</p>; }
function Button({ children, onClick, light = false }: { children: ReactNode; onClick?: () => void; light?: boolean }) { return <button onClick={onClick} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition hover:-translate-y-0.5 ${light ? "bg-[#e6cafa] text-[#30213f]" : "bg-[#30213f] text-[#fcfaf7]"}`}>{children}<ArrowRight size={15} /></button>; }

function Home({ onNavigate }: Pick<Props, "onNavigate">) {
  const [story, setStory] = useState(0);
  const selected = stories[story];
  return <div className="bg-[#fcfaf7] text-[#30213f]"><section><Header onNavigate={onNavigate}/><HeroStory onNavigate={onNavigate}/></section>

    <section id="stories" className="mx-auto max-w-[1240px] px-5 py-24 md:px-8 md:py-32"><div className="max-w-2xl"><Eyebrow>Which one sounds like you?</Eyebrow><h2 className="mt-4 text-4xl font-medium leading-[.95] tracking-[-.065em] md:text-6xl">Your everyday questions.<br /><i className="font-serif font-normal">A clearer way forward.</i></h2><p className="mt-6 text-lg leading-relaxed text-[#30213f]/65">Start with the decision in front of you, not a dashboard full of things to decode.</p></div><div className="mt-12 grid gap-6 lg:grid-cols-[.64fr_1.36fr]"><div className="grid content-start gap-2">{stories.map((item, index) => <button key={item.label} aria-pressed={story === index} onClick={() => setStory(index)} className={`rounded-2xl border p-5 text-left transition ${story === index ? "border-[#30213f] bg-[#30213f] text-[#fcfaf7]" : "border-[#30213f]/12 hover:border-[#30213f]/35"}`}><span className="text-[11px] font-bold uppercase tracking-wider opacity-55">0{index + 1}</span><p className="mt-2 text-sm font-semibold">{item.label}</p></button>)}</div><motion.div key={selected.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="grid overflow-hidden rounded-[2rem] bg-[#f5f0f7] p-6 md:grid-cols-[1fr_288px] md:p-9"><div className="flex flex-col"><Eyebrow>TrackPay in the moment</Eyebrow><h3 className="mt-5 text-3xl font-medium leading-[.98] tracking-[-.06em] md:text-5xl">{selected.title}</h3><div className="mt-auto pt-12"><p className="text-xs text-[#30213f]/55">A decision you can understand:</p><p className="mt-2 text-lg font-medium">“{selected.question}”</p><p className="mt-5 max-w-md text-sm leading-relaxed text-[#30213f]/70">{selected.answer}</p></div></div><div className="relative mt-7 min-h-[610px] md:mt-0"><div className="absolute inset-x-3 bottom-0 top-5 rounded-[2rem] bg-[#e1d2ed]" /><Phone mode={selected.mode} conversation={{question:selected.question,answer:selected.answer}} className="relative top-0 rotate-[4deg]" /><div className="pointer-events-none absolute -right-2 -bottom-3 rounded-2xl bg-[#fcfaf7] p-3 text-center shadow-lg"><p className="text-xl font-semibold tracking-[-.07em]">{selected.stat}</p><p className="mt-1 text-[9px] text-[#30213f]/55">{selected.sub}</p></div></div></motion.div></div></section>

    <section className="tp-empathy overflow-hidden bg-[#30213f] text-[#fcfaf7]"><div className="mx-auto grid max-w-[1240px] gap-12 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><div><p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#e6cafa]">Not another finance app</p><h2 className="mt-5 text-4xl font-medium leading-[.94] tracking-[-.065em] md:text-6xl">The whole picture, <i className="font-serif font-normal">before</i> the next tap.</h2><p className="mt-7 max-w-md text-lg leading-relaxed text-white/65">A payment is rarely just a payment. TrackPay keeps your accounts, goals and plans close enough to make every choice feel informed.</p><Button light onClick={() => onNavigate("product")}>See the three layers</Button></div><div className="relative grid min-h-[650px] place-items-center"><div className="absolute h-[330px] w-[330px] rounded-full border border-dashed border-[#e6cafa]/35" /><Phone mode="track" className="relative z-10 -rotate-[7deg]" /><Phone mode="ask" className="tp-pair-back absolute z-0 translate-x-[118px] translate-y-3 rotate-[8deg] opacity-95" /><div className="pointer-events-none absolute left-0 top-6 max-w-[170px] rounded-2xl border border-white/15 bg-white/10 p-3 text-xs leading-relaxed backdrop-blur">“Can I afford it?” should be a question with context.</div></div></div></section>

    <MoneyFlowStory/>
    <ProductChapters /><GoalPlanner /><VoiceStory /><ConsentStory /><Questions /><Closing onNavigate={onNavigate} /><Footer onNavigate={onNavigate} /></div>;
}

function Product({ onNavigate }: Pick<Props, "onNavigate">) {
  const [mode, setMode] = useState<PhoneMode>("pay");
  const copy: Record<PhoneMode, [string, string, string]> = {
    pay: ["Pay without leaving the picture.", "A UPI payment is quick. TrackPay keeps the rest of your money context close, too.", "UPI, built into the plan"],
    track: ["Every channel, one timeline.", "Understand your money across the accounts and payment rails you already use.", "A view with less noise"],
    ask: ["The question behind the transaction.", "Ask in the words you would use with a person. Get a clear option back.", "Guidance that starts with you"],
    goal: ["Turn someday into a date.", "See what a different choice does to the thing you are saving for.", "Goals, with trade-offs visible"],
  };
  const [title, body, overline] = copy[mode];
  return <div className="bg-[#fcfaf7] text-[#30213f]"><Header onNavigate={onNavigate} /><section className="mx-auto grid max-w-[1240px] gap-10 px-5 pb-20 pt-16 md:px-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:pb-28"><div><Eyebrow>The TrackPay product</Eyebrow><h1 className="mt-4 text-5xl font-medium leading-[.9] tracking-[-.08em] md:text-7xl">Your money.<br /><i className="font-serif font-normal">Finally working</i><br />together.</h1><p className="mt-7 max-w-lg text-lg leading-relaxed text-[#30213f]/65">Each part is designed to answer the next thing you need — whether you are paying, checking, asking or planning.</p></div><div className="relative min-h-[660px] rounded-[2.5rem] bg-[#e1d2ed]"><Phone mode="pay" className="tp-pair-back absolute left-[5%] top-8 -rotate-[8deg]" /><Phone mode="track" className="tp-pair-front absolute right-[5%] top-14 rotate-[7deg]" /></div></section><section className="border-y border-[#30213f]/10 bg-[#f5f0f7]"><div className="mx-auto max-w-[1240px] px-5 py-20 md:px-8"><div className="flex flex-wrap gap-2">{(["pay", "track", "ask", "goal"] as PhoneMode[]).map(key => <button key={key} aria-pressed={mode === key} onClick={() => setMode(key)} className={`rounded-full px-4 py-2 text-xs font-bold capitalize transition ${mode === key ? "bg-[#30213f] text-[#fcfaf7]" : "border border-[#30213f]/15"}`}>{key}</button>)}</div><div className="mt-8 grid gap-8 rounded-[2rem] bg-[#fcfaf7] p-6 md:grid-cols-2 md:p-12"><motion.div key={mode} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}><Eyebrow>{overline}</Eyebrow><h2 className="mt-5 text-4xl font-medium leading-[.95] tracking-[-.065em] md:text-6xl">{title}</h2><p className="mt-6 max-w-md text-lg leading-relaxed text-[#30213f]/65">{body}</p><a href="/trackpay-demo.html" className="mt-8 flex items-center gap-2 text-sm font-bold">Open the full app prototype <ArrowRight size={15} /></a></motion.div><div className="grid place-items-center rounded-[1.75rem] bg-[#efe5f7] py-8"><Phone mode={mode} /></div></div></div></section><section className="mx-auto max-w-[1240px] px-5 py-24 md:px-8"><div className="grid gap-6 md:grid-cols-2"><div className="rounded-[2rem] bg-[#30213f] p-8 text-[#fcfaf7]"><CreditCard className="text-[#e6cafa]" /><h3 className="mt-16 text-3xl font-medium tracking-[-.055em]">Designed for the everyday.</h3><p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">The grocery run, a rent split and a small treat should be effortless to pay and easy to understand later.</p></div><div className="rounded-[2rem] bg-[#efe5f7] p-8"><Target className="text-[#886697]" /><h3 className="mt-16 text-3xl font-medium tracking-[-.055em]">Designed for the longer view.</h3><p className="mt-4 max-w-sm text-sm leading-relaxed text-[#30213f]/65">Goals and commitments are part of every decision, so the next move has a clear place in the larger plan.</p></div></div></section><VoiceStory/><ConsentStory/><Closing onNavigate={onNavigate} /><Footer onNavigate={onNavigate} /></div>;
}

function Vision({ onNavigate }: Pick<Props, "onNavigate">) {
  return <div className="bg-[#fcfaf7] text-[#30213f]"><Header onNavigate={onNavigate}/><MissionStory/><Closing onNavigate={onNavigate}/><Footer onNavigate={onNavigate}/></div>;
}

function Team({ onNavigate }: Pick<Props, "onNavigate">) {
  return <div className="bg-[#fcfaf7] text-[#30213f]"><Header onNavigate={onNavigate} /><section className="mx-auto max-w-[1240px] px-5 pb-16 pt-16 md:px-8 md:pb-24 lg:pt-24"><Eyebrow>People building TrackPay</Eyebrow><h1 className="mt-5 max-w-4xl text-5xl font-medium leading-[.9] tracking-[-.08em] md:text-8xl">A team that thinks money software can feel <i className="font-serif font-normal">more human.</i></h1><p className="mt-9 max-w-2xl text-lg leading-relaxed text-[#30213f]/65">We are designers, builders and finance thinkers working on a calmer, more useful money experience for India.</p></section><AboutStory/><section className="border-y border-[#30213f]/10 bg-[#f5f0f7]"><div className="mx-auto grid max-w-[1240px] gap-4 px-5 py-16 sm:grid-cols-2 md:px-8 lg:grid-cols-5">{team.map(([name, role, image], i) => <motion.article key={name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .06 }} className="group overflow-hidden rounded-[1.6rem] bg-[#30213f] text-white"><div className="aspect-[.82] overflow-hidden"><img src={image} alt={name} className="h-full w-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0" /></div><div className="p-4"><p className="font-semibold tracking-tight">{name}</p><p className="mt-1 text-xs text-white/55">{role}</p></div></motion.article>)}</div></section><section className="mx-auto max-w-3xl px-5 py-24 text-center md:px-8 md:py-32"><MessageCircle className="mx-auto text-[#886697]" /><h2 className="mt-7 font-serif text-4xl md:text-5xl">Help us build the money experience<br/><i>you wish you already had.</i></h2><p className="mt-6 text-sm leading-relaxed text-[#30213f]/55">Good products come from listening. Tell us about the accounts you juggle, the questions you ask and the moments your current apps miss.</p><a href="mailto:founder@thetrackpay.com" className="mt-7 inline-flex items-center gap-2 text-sm text-[#67338e]">Talk to the founders <ArrowUpRight size={15}/></a></section><Footer onNavigate={onNavigate} /></div>;
}

function Survey({ onNavigate }: Pick<Props, "onNavigate">) {
  return <div className="min-h-screen bg-[#f5f0f7] text-[#30213f]"><Header onNavigate={onNavigate} /><section className="mx-auto grid max-w-[1120px] gap-12 px-5 pb-24 pt-14 md:px-8 lg:grid-cols-[.72fr_1.28fr]"><div><Eyebrow>Early access</Eyebrow><h1 className="mt-5 text-5xl font-medium leading-[.9] tracking-[-.075em] md:text-6xl">Help shape a calmer money app.</h1><p className="mt-7 text-lg leading-relaxed text-[#30213f]/65">Tell us where money apps lose you, what you would trust, and what would make life easier. We read every response.</p><div className="relative mt-10 min-h-[650px] rounded-[2rem] bg-[#30213f]"><Phone mode="ask" className="absolute left-1/2 top-7 -translate-x-1/2 rotate-[5deg]" /></div></div><div className="rounded-[2rem] border border-[#30213f]/10 bg-[#30213f] p-2 text-white shadow-xl sm:p-7"><p className="px-5 pt-5 text-sm leading-relaxed text-white/65">Take the detailed TrackPay feedback survey. Your answers are used to prioritize the product roadmap.</p><FeedbackForm /></div></section><Footer onNavigate={onNavigate} /></div>;
}

function Closing({ onNavigate }: Pick<Props, "onNavigate">) { return <section className="bg-[#e1d2ed]"><div className="mx-auto flex max-w-[1240px] flex-col items-start justify-between gap-8 px-5 py-20 md:flex-row md:items-end md:px-8"><div><Eyebrow>Bring your next decision</Eyebrow><h2 className="mt-4 max-w-3xl text-4xl font-medium leading-[.94] tracking-[-.065em] md:text-6xl">There is a clearer way to move your money.</h2></div><Button onClick={() => onNavigate("survey")}>Get early access</Button></div></section>; }


function ProductChapters() {
  return <div className="bg-[#fcfaf7]">
    <motion.section initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}} transition={{duration:.6}} className="tp-chapter">
      <div className="tp-stage"><Phone mode="pay" /></div>
      <div><span className="tp-step">01 / Move your money</span><h2>One payment.<br /><i>Everything stays in view.</i></h2><p>Pay with UPI inside TrackPay. Then see the transaction become part of your spending picture, with its category and budget context already beside it.</p><p className="mt-5">Try the payment on the phone. Then open Overview to explore your activity.</p><div className="mt-7 flex gap-3 text-xs text-[#67338e]"><span>UPI payments</span><span>·</span><span>Budget context</span></div></div>
    </motion.section>
    <motion.section initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}} transition={{duration:.6}} className="tp-chapter">
      <div><span className="tp-step">02 / Connect the dots</span><h2>Different accounts.<br /><i>A single money story.</i></h2><p>Your salary comes by NEFT. Rent leaves through a bank transfer. Coffee goes on UPI. TrackPay’s Account Aggregator vision brings supported account activity together, so the channel doesn’t hide the pattern.</p><p className="mt-5">Filter the phone’s timeline to see how each payment channel fits into the whole.</p></div>
      <div className="tp-stage"><Phone mode="track" /></div>
    </motion.section>
    <motion.section initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}} transition={{duration:.6}} className="tp-chapter">
      <div className="tp-stage"><Phone mode="ask" /></div>
      <div><span className="tp-step">03 / Find your next step</span><h2>For the big plans.<br /><i>And the everyday doubts.</i></h2><p>Spending, savings, investments, insurance. Artha AI gives your questions a place to land, with explanations you can understand and choices you can think through.</p><p className="mt-5">Pick a topic on the phone and save an insight to your example plan.</p></div>
    </motion.section>
  </div>;
}

function GoalPlanner() {
  const [months, setMonths] = useState(6);
  const monthly = Math.ceil(24000 / months);
  return <section className="tp-planner">
    <div className="tp-section-title"><span className="tp-mini-label">A plan you can play with</span><h2>Change the timing.<br /><i>See the room it creates.</i></h2><p>A ₹24,000 goal. A ₹10,000 monthly surplus. Move the slider and see the trade-off immediately.</p></div>
    <div className="tp-planner-card">
      <div><span className="tp-mini-label">Your next getaway</span><h3 className="mt-3 font-serif text-2xl">A weekend by the sea</h3><label className="mt-6" htmlFor="trip-timing">How long would you like to save?</label><strong>{months} months</strong><input id="trip-timing" type="range" min="3" max="12" value={months} onChange={e => setMonths(Number(e.target.value))}/><div className="flex justify-between text-xs text-[#897593]"><span>Sooner · 3 months</span><span>More breathing room · 12</span></div></div>
      <div className="tp-planner-result" aria-live="polite"><span className="tp-mini-label">What changes each month</span><strong>₹{monthly.toLocaleString('en-IN')}</strong><p>set aside for your trip</p><div className="my-5 h-px bg-[#e3d8eb]"/><b className="text-lg text-[#653784]">₹{(10000-monthly).toLocaleString('en-IN')} stays available</b><p className="mt-2">Your bills and existing savings are already accounted for in this example. More time means a smaller monthly commitment.</p></div>
    </div>
  </section>;
}

const questions = [
  { group: 'Getting started', q: 'What brings TrackPay together?', a: 'UPI payments, a unified view of your financial activity, and Artha AI for spending, budgeting, savings, investments and insurance questions. Each part is designed to work with the same money picture.' },
  { group: 'Connected accounts', q: 'Will I have to move all my money?', a: 'The vision is to connect supported accounts through consent-based Account Aggregator integration. You should be able to understand money across accounts without moving it all to a new one.' },
  { group: 'Payments', q: 'Can I track payments made through another UPI app?', a: 'Supported account transaction data can provide the bank-side activity of payments made through different apps. Coverage depends on connected institutions and the information they provide.' },
  { group: 'Artha AI', q: 'Does the AI make decisions for me?', a: 'You choose what to do. Artha AI is designed to explain options and trade-offs, with your goals and commitments in view.' },
  { group: 'Getting started', q: 'Can I try TrackPay now?', a: 'The website contains interactive previews and a full sample-data prototype on the Product page. Early access interest and product feedback can be shared through the survey.' },
  { group: 'Payments', q: 'What can I try in the payment preview?', a: 'Tap “Try paying ₹42” to see a sample confirmation and its budget context. Then open Overview to explore the example timeline. The preview does not move money.' },
  { group: 'Connected accounts', q: 'Which accounts appear in the overview?', a: 'The preview uses three fictional accounts. For the planned connected experience, availability will depend on supported institutions and the accounts you choose to share through consent.' },
  { group: 'Connected accounts', q: 'Can I choose what I connect?', a: 'That is central to the experience we are designing. Try the account switches on the Home or Product page to see an illustrative overview change with your selections.' },
  { group: 'Artha AI', q: 'What can I ask Artha AI about?', a: 'Our vision covers spending, budgets, savings, goals, investments, insurance and financial planning. The phone preview includes sample spending, investment and insurance conversations.' },
  { group: 'Artha AI', q: 'Can I change how answers are explained?', a: 'The personalization preview offers Warm, Direct and Step by step explanations. You can also reveal the reasoning behind the example calculation.' },
  { group: 'Getting started', q: 'How can I share feedback?', a: 'Open Join early access for the detailed product survey. Tell us how you manage money today and what you would want TrackPay to help with.' },
];
function Questions({ full = false }: { full?: boolean }) {
  const [category, setCategory] = useState('All questions');
  const [search, setSearch] = useState('');
  const visible = full ? questions.filter(item => (category === 'All questions' || item.group === category) && (item.q + item.a).toLowerCase().includes(search.toLowerCase().trim())) : questions.slice(0, 5);
  return <section className={full ? 'tp-faq-browser' : 'tp-faq'}>
    {full ? <aside className="tp-faq-topics"><label htmlFor="faq-search">Find an answer</label><input id="faq-search" type="search" placeholder="Search questions…" value={search} onChange={e => setSearch(e.target.value)}/><nav aria-label="FAQ topics">{['All questions','Getting started','Payments','Connected accounts','Artha AI'].map(group => <button key={group} aria-pressed={category === group} onClick={() => setCategory(group)}>{group}<ArrowRight size={14}/></button>)}</nav><p>Have something else in mind?<br/><a href="mailto:support@thetrackpay.com">Talk to our team ↗</a></p></aside> : <div className="tp-section-title"><span className="tp-mini-label">A few things you might be wondering</span><h2>Let’s make it clear.</h2></div>}
    <div className={full ? 'tp-faq tp-faq-results' : ''}>{full && <div className="tp-faq-results-heading"><h2>{category}</h2><span role="status">{visible.length} answers</span></div>}{visible.map(({q,a},i)=><details key={q}><summary><span className="mr-4 text-xs text-[#9a87a7]">{String(i+1).padStart(2,'0')}</span>{q}</summary><p>{a}</p></details>)}{!visible.length && <p className="tp-no-results">No matching questions. Try “accounts”, “AI” or “payments”.</p>}</div>
    {!full && <p className="mt-8 text-center text-sm text-[#897593]">Still curious? <a className="text-[#67338e]" href="/faq">Explore all questions ↗</a></p>}
  </section>;
}

export default function TrackPayExperience({ page, onNavigate }: Props) {
  if (page.startsWith("journal")) return <div className="tp-site"><Header onNavigate={onNavigate}/><Journal page={page} onNavigate={onNavigate}/><Closing onNavigate={onNavigate}/><Footer onNavigate={onNavigate}/></div>;
  if (page === "faq") return <div className="tp-site bg-[#fcfaf7] text-[#30213f]"><Header onNavigate={onNavigate}/><div className="tp-section-title pt-20 px-5"><span className="tp-mini-label">TrackPay, explained</span><h1>Good questions.<br/><i className="font-serif">Clearer answers.</i></h1><p className="mt-7">Payments, connected accounts and Artha AI. Here is how they fit together.</p></div><Questions full/><Closing onNavigate={onNavigate}/><Footer onNavigate={onNavigate}/></div>;
  if (page === "product") return <div className="tp-site"><MotionConfig reducedMotion="user"><Product onNavigate={onNavigate} /></MotionConfig></div>;
  if (page === "vision") return <div className="tp-site"><MotionConfig reducedMotion="user"><Vision onNavigate={onNavigate} /></MotionConfig></div>;
  if (page === "team") return <div className="tp-site"><MotionConfig reducedMotion="user"><Team onNavigate={onNavigate} /></MotionConfig></div>;
  if (page === "survey") return <div className="tp-site"><MotionConfig reducedMotion="user"><Survey onNavigate={onNavigate} /></MotionConfig></div>;
  return <div className="tp-site"><MotionConfig reducedMotion="user"><Home onNavigate={onNavigate} /></MotionConfig></div>;
}
