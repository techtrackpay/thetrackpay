import { useState, useEffect } from "react";
import TrackPayExperience from "./components/ui/trackpay-experience";
import { SECTION_PATHS, SECTION_TITLES, sectionFromPath } from "./lib/routes";

function App() {
  const [activeSection, setActiveSectionState] = useState(() =>
    sectionFromPath(window.location.pathname)
  );

  const navigate = (section: string) => {
    setActiveSectionState(section);
    const path = SECTION_PATHS[section] ?? "/";
    if (window.location.pathname !== path) {
      window.history.pushState({ section }, "", path);
    }
  };

  // Keep activeSection in sync with browser back/forward navigation
  useEffect(() => {
    const onPopState = () => {
      setActiveSectionState(sectionFromPath(window.location.pathname));
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.title = SECTION_TITLES[activeSection] ?? SECTION_TITLES.home;
  }, [activeSection]);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <TrackPayExperience page={activeSection} onNavigate={navigate} />
    </div>
  );
}

export default App;
