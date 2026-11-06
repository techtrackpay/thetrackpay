import { ArrowLeft, ArrowUpRight, Landmark, MessageCircle, Target } from 'lucide-react';

const stories = [
  {
    page: 'journal-connected', category: 'The connected picture', title: 'Your money moves across apps. Your understanding should travel with it.',
    excerpt: 'Why we are bringing payments and the bigger financial picture into the same conversation.', time: '3 min read', Icon: Landmark,
    sections: [
      ['One day. Many money moments.', 'The day starts with a coffee paid by UPI. Later, a salary lands in a different account. A rent payment is due, a subscription renews, and a weekend plan arrives in the group chat. Each moment is small. Together, they shape what is available for the rest of the month.'],
      ['The useful question comes afterwards.', '“Where did my money go?” is only the beginning. The next question is often “What does that leave for me?” We are designing TrackPay around the connection between the transaction and that next decision.'],
      ['Connection needs context.', 'Our Account Aggregator vision brings supported account activity into a shared view with your consent. A payment, its category and its place in a plan should be easy to understand together. The interactive previews show the experience we are working towards, using example accounts and transactions.'],
      ['A smaller gap between seeing and doing.', 'Pay, see, ask. Those three actions guide the product. We want the next useful step to feel close to the money moment that prompted it.'],
    ],
  },
  {
    page: 'journal-goals', category: 'Room for your plans', title: 'A goal is more useful when you can play with the plan.',
    excerpt: 'Change the date. See the monthly commitment. Make the trade-off visible before you decide.', time: '2 min read', Icon: Target,
    sections: [
      ['Start with something real to you.', 'A weekend away, a course, a new laptop. A goal does not need to be grand to deserve a plan. In the TrackPay preview, we start with a simple example: ₹24,000 still to save for a trip.'],
      ['Give the date a little movement.', 'Spread ₹24,000 over six months and the monthly amount is ₹4,000. Over eight months, it becomes ₹3,000. The goal stays the same; the room required each month changes. That relationship is why our preview puts a slider beside the plan.'],
      ['Keep the rest of life in view.', 'The homepage calculator uses an example monthly surplus of ₹10,000 after bills and existing savings. Moving the date updates both the goal contribution and what stays available. It is a deliberately simple illustration, with every assumption visible.'],
      ['The point is the choice.', 'A sooner date and a smaller monthly commitment are different priorities. TrackPay is designed to help you see the difference so you can choose what fits your life. Try the calculator on our homepage and explore a few possibilities.'],
    ],
  },
  {
    page: 'journal-conversation', category: 'Building Artha AI', title: 'A better money conversation starts with your question.',
    excerpt: 'Everyday language, visible reasoning and a little more room to think.', time: '3 min read', Icon: MessageCircle,
    sections: [
      ['You already know how to ask.', '“Can I make this trip happen?” “What changed this month?” “What should I look at before reviewing my insurance?” These are the kinds of questions we are designing Artha AI to help people explore.'],
      ['The answer needs a reason.', 'A number on its own can leave you with more questions. Our vision is an explanation that connects the answer to the relevant commitments, goals and assumptions, so you can understand where it comes from.'],
      ['Different people want different detail.', 'Sometimes a short answer is enough. Sometimes you want to work through the steps. Our personalization preview lets you switch between a warm, direct or step-by-step explanation of the same example goal, and reveal the calculation behind it.'],
      ['A conversation that leaves you in control.', 'Artha AI is part of TrackPay’s broader vision for payments, tracking and financial management. We are building towards guidance that supports your decisions. Explore the sample conversations and tell us which questions you would bring first.'],
    ],
  },
];

export default function Journal({ page, onNavigate }: { page: string; onNavigate: (page: string) => void }) {
  const story = stories.find(s => s.page === page);
  const navigateLink = (target: string) => ({ href: target === 'journal' ? '/journal' : `/journal/${target.replace('journal-', '')}`, onClick: (e: React.MouseEvent<HTMLAnchorElement>) => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) { e.preventDefault(); onNavigate(target); } } });
  if (story) return <main className="tp-article">
    <a {...navigateLink('journal')} className="tp-back-link"><ArrowLeft size={15}/> Back to the journal</a>
    <header className="tp-article-heading"><span className="tp-mini-label">{story.category} · {story.time}</span><h1>{story.title}</h1><p>{story.excerpt}</p><span className="tp-article-byline">From the TrackPay team · Product perspectives</span></header>
    <div className={`tp-journal-art tp-art-${stories.indexOf(story)}`} aria-hidden="true"><div className="tp-art-orbit"/><story.Icon size={70} strokeWidth={1}/><span>TRACKPAY / JOURNAL</span></div>
    <div className="tp-article-body">{story.sections.map(([title, body]) => <section key={title}><h2>{title}</h2><p>{body}</p></section>)}<a href="/product" onClick={e => { e.preventDefault(); onNavigate('product'); }} className="tp-back-link">Explore the interactive product <ArrowUpRight size={16}/></a></div>
    <aside className="tp-related"><span className="tp-mini-label">KEEP EXPLORING</span>{stories.filter(s => s.page !== page).map(s => <a key={s.page} {...navigateLink(s.page)}>{s.title}<ArrowUpRight size={22}/></a>)}</aside>
  </main>;
  return <main className="tp-journal"><div className="tp-journal-heading"><span className="tp-mini-label">THE TRACKPAY JOURNAL</span><h1>A little perspective.<br/><i>A clearer money life.</i></h1><p>Ideas behind the product, everyday money moments and the experience we’re building.</p></div><div className="tp-journal-grid">{stories.map(({page, category, title, excerpt, time, Icon},i) => <a key={page} {...navigateLink(page)} className="tp-journal-card"><div className={`tp-journal-art tp-art-${i}`} aria-hidden="true"><div className="tp-art-orbit"/><Icon size={68} strokeWidth={1}/><span>0{i+1} / TRACKPAY JOURNAL</span></div><div className="tp-journal-card-copy"><span className="tp-mini-label">{category}</span><h2>{title}</h2><p>{excerpt}</p><div><span>{time}</span><ArrowUpRight size={20}/></div></div></a>)}</div></main>;
}
