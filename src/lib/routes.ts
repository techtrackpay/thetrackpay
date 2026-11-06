export const SECTION_PATHS: Record<string, string> = {
  home: "/",
  team: "/team",
  vision: "/vision",
  product: "/product",
  survey: "/survey",
  faq: "/faq",
  journal: "/journal",
  "journal-connected": "/journal/connected",
  "journal-goals": "/journal/goals",
  "journal-conversation": "/journal/conversation",
};

export const SECTION_TITLES: Record<string, string> = {
  home: "TrackPay | UPI, unified money tracking & AI financial guidance",
  product: "TrackPay Product | Pay, see & ask",
  vision: "Why TrackPay | A more human money experience",
  team: "The people building TrackPay",
  survey: "Join TrackPay early access",
  faq: "Your questions, answered | TrackPay",
  journal: "The TrackPay Journal | Ideas for a clearer money life",
  "journal-connected": "Your money, connected | TrackPay Journal",
  "journal-goals": "Make room for your goals | TrackPay Journal",
  "journal-conversation": "A better money conversation | TrackPay Journal",
};

export function sectionFromPath(pathname: string): string {
  const path = pathname.replace(/\/+$/, "") || "/";
  const match = Object.entries(SECTION_PATHS).find(([, sectionPath]) => sectionPath === path);
  return match ? match[0] : "home";
}
