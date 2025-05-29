
import * as React from "react"

const MOBILE_BREAKPOINT = 768 // Corresponds to Tailwind's 'md' breakpoint

export function useIsMobile(): boolean | undefined {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    }

    // Check if window is defined (i.e., we are on the client-side)
    if (typeof window !== 'undefined') {
      handleResize(); // Set the initial value
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
    // Return undefined or a default value for SSR if needed,
    // but undefined is fine as components will handle it.
  }, []);

  return isMobile;
}
