import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useScrollHighlight() {
  const location = useLocation();

  useEffect(() => {
    // Check if there is a pending scroll target in sessionStorage after a route change
    const pendingScroll = sessionStorage.getItem("pendingScrollId");
    
    if (pendingScroll) {
      // Small timeout to allow the new page to render completely
      const timer = setTimeout(() => {
        const element = document.getElementById(pendingScroll);
        if (element) {
          // Clear it
          sessionStorage.removeItem("pendingScrollId");
          
          // Scroll smoothly
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          
          // Apply highlight class
          element.classList.add("nav-highlight-active");
          
          // Cleanup class after 3 seconds
          setTimeout(() => {
            element.classList.remove("nav-highlight-active");
          }, 3000);
        }
      }, 350);

      return () => clearTimeout(timer);
    }
  }, [location]);

  const triggerScroll = (path: string, scrollId: string) => {
    // If we're already on the destination path, scroll immediately
    if (location.pathname === path) {
      const element = document.getElementById(scrollId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.classList.add("nav-highlight-active");
        setTimeout(() => {
          element.classList.remove("nav-highlight-active");
        }, 3000);
      }
    } else {
      // Save it and navigate
      sessionStorage.setItem("pendingScrollId", scrollId);
    }
  };

  return { triggerScroll };
}
