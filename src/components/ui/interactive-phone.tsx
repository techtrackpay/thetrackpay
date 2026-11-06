import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Check, Home, Landmark, ScanLine, Send, Sparkles, Target, Wifi, BatteryFull } from 'lucide-react';
import './trackpay-polish.css';

export type PhoneMode = 'pay' | 'track' | 'ask' | 'goal';
const prompts = [
  ['Spending', 'Where can I cut back?', 'Your food delivery totals ₹3,600 this month. Cooking twice more each week could leave about ₹1,200 for your travel goal.'],
  ['Investments', 'Can I increase my SIP?', 'In this example, ₹4,000 remains after bills and savings. Compare a smaller SIP increase with keeping that amount available for unexpected expenses.'],
  ['Insurance', 'Help me review my cover.', 'Start with your existing policies, dependants and monthly commitments. Check cover, exclusions and waiting periods before choosing a policy.'],
];
const activity = [
  { name: 'Chai Point', detail: 'Today · UPI', amount: '− ₹42', channel: 'UPI', icon: '☕' },
  { name: 'Monthly salary', detail: '01 Nov · NEFT', amount: '+ ₹86,500', channel: 'Bank', icon: '↙' },
  { name: 'Home rent', detail: '01 Nov · Bank transfer', amount: '− ₹19,500', channel: 'Bank', icon: '⌂' },
  { name: 'Groceries', detail: '02 Nov · Card', amount: '− ₹1,840', channel: 'Card', icon: '↗' },
];

export default function InteractivePhone({ mode = 'track', className = '', conversation }: { mode?: PhoneMode; className?: string; conversation?: { question: string; answer: string } }) {
  const [tab, setTab] = useState<PhoneMode>(mode);
  const [paid, setPaid] = useState(false);
  const [filter, setFilter] = useState('All');
  const [prompt, setPrompt] = useState(conversation ? -1 : 0);
  const [saved, setSaved] = useState(false);
  const [months, setMonths] = useState(6);
  const [previousMode, setPreviousMode] = useState(mode);
  if (previousMode !== mode) { setPreviousMode(mode); setTab(mode); }
  const question = prompt === -1 && conversation ? conversation.question : prompts[Math.max(0, prompt)][1];
  const answer = prompt === -1 && conversation ? conversation.answer : prompts[Math.max(0, prompt)][2];
  return <div className={`tp-phone ${className}`}>
    <div className="tp-phone-screen">
      <div className="tp-status"><b>9:41</b><span className="tp-island" /><span><Wifi size={13} /><BatteryFull size={17} /></span></div>
      <div className="tp-phone-heading"><span className="tp-avatar">T₹</span><div><b>{tab === 'ask' ? 'Artha AI' : 'TrackPay'}</b><small>{tab === 'ask' ? 'Your money, in conversation' : 'A little clarity for your day'}</small></div><span className="tp-online" /></div>
      <AnimatePresence mode="wait"><motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .2 }} className="tp-phone-body">
      {tab === 'pay' && <><small className="tp-label">EVERYDAY PAYMENTS</small><h3>A tap. And you’re done.</h3><div className="tp-recipient"><span>☕</span><b>Chai Point</b><small>chaipoint@upi</small></div><div className="tp-payment-amount">₹42<span>.00</span></div><div className="tp-account"><Landmark size={18} /><span>Everyday account<small>•••• 2048</small></span><Check size={15} /></div><button className="tp-primary" onClick={() => setPaid(!paid)}>{paid ? <Check size={17} /> : <Send size={16} />}{paid ? 'Payment complete' : 'Try paying ₹42'}</button><div role="status" className="tp-insight"><Sparkles size={15} /><span>{paid ? 'Added to Food & drinks. ₹3,158 left in your weekly budget.' : 'This payment fits your weekly food budget.'}</span></div>{paid && <button className="tp-text-button" onClick={() => setTab('track')}>See it in your money view <ArrowUpRight size={13} /></button>}</>}
      {tab === 'track' && <><small className="tp-label">GOOD MORNING, PRIYA</small><h3>Your money, together.</h3><div className="tp-balance"><span>Total across accounts</span><strong>₹4,82,600</strong><small>3 accounts · one clear picture</small><svg viewBox="0 0 240 55" aria-label="Illustrative balance trend"><path d="M0 46 Q20 50 40 35 T80 36 T120 23 T160 25 T200 12 T240 3" fill="none" stroke="currentColor" strokeWidth="3" /></svg></div><div className="tp-filter" aria-label="Filter transactions">{['All','UPI','Bank','Card'].map(f => <button key={f} aria-pressed={f === filter} onClick={() => setFilter(f)}>{f}</button>)}</div><div className="tp-transactions">{activity.filter(a => filter === 'All' || a.channel === filter).map(a => <div key={a.name}><span className="tp-transaction-icon">{a.icon}</span><span><b>{a.name}</b><small>{a.detail}</small></span><strong>{a.amount}</strong></div>)}</div></>}
      {tab === 'ask' && <><small className="tp-label">A QUESTION IS A GOOD START</small><h3>What’s on your mind?</h3><div className="tp-filter">{prompts.map(([label], i) => <button key={label} aria-pressed={prompt === i} onClick={() => { setPrompt(i); setSaved(false); }}>{label}</button>)}</div><div className="tp-chat-user">{question}</div><motion.div key={prompt} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="tp-chat-answer"><Sparkles size={16} /><p>{answer}</p><div className="tp-chat-tags"><span>Your choice</span><span>Your pace</span></div></motion.div><button className="tp-primary" onClick={() => setSaved(!saved)}>{saved ? <Check size={16} /> : <Target size={16} />}{saved ? 'Saved to your plan' : 'Save this insight'}</button><p className="tp-note" role="status">{saved ? 'Your insight is ready to revisit in this preview.' : 'Explore the topics above to change the conversation.'}</p></>}
      {tab === 'goal' && <><small className="tp-label">A LITTLE CLOSER, EVERY MONTH</small><h3>A weekend by the sea.</h3><div className="tp-trip-art"><span>☀</span><i /><b>GOA</b></div><div className="tp-goal-sum"><span>Still to save<strong>₹24,000</strong></span><span>Monthly saving<strong>₹{Math.ceil(24000 / months).toLocaleString('en-IN')}</strong></span></div><label className="tp-range-label">Make it happen in <b>{months} months</b><input aria-label="Months until your trip" type="range" min="3" max="12" value={months} onChange={e => setMonths(Number(e.target.value))} /></label><div className="tp-insight"><Target size={16} /><span>{months < 6 ? 'A sooner trip needs more room in your monthly budget.' : 'A little more time leaves more room for everyday life.'}</span></div></>}
      </motion.div></AnimatePresence>
      <nav className="tp-phone-nav" aria-label="Preview app screens">{([{key:'track',label:'Overview',Icon:Home},{key:'pay',label:'Pay',Icon:ScanLine},{key:'ask',label:'Artha AI',Icon:Sparkles},{key:'goal',label:'Goals',Icon:Target}] as const).map(({key,label,Icon}) => <button key={key} onClick={() => setTab(key)} aria-pressed={key === tab}><Icon size={18}/><span>{label}</span></button>)}</nav>
      <div className="tp-home-indicator" />
    </div>
    <span className="tp-demo-caption">Interactive preview · sample data</span>
  </div>;
}
