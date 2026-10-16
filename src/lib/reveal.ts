import { useEffect, useRef } from "react";

/** Adds a gentle fade-up reveal when elements with [data-reveal] enter the viewport. */
export function useRevealRoot<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = root.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => {
      // Stagger siblings (cards in a grid) so they cascade in one after another.
      const siblings = el.parentElement
        ? Array.from(el.parentElement.children).filter((c) => c.hasAttribute("data-reveal"))
        : [];
      const idx = siblings.indexOf(el);
      if (idx > 0) el.style.transitionDelay = `${Math.min(idx, 6) * 90}ms`;
      el.addEventListener(
        "transitionend",
        () => {
          el.style.transitionDelay = "";
        },
        { once: true },
      );
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return ref;
}
