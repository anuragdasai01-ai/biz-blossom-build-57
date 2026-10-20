import { useEffect, useRef } from "react";

/** Adds a gentle fade-up reveal when elements with [data-reveal] enter the viewport. */
export function useRevealRoot<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const observed = new WeakSet<Element>();
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

    const watch = (el: HTMLElement) => {
      if (observed.has(el)) return;
      observed.add(el);
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
    };

    const watchTree = (node: HTMLElement) => {
      if (node.matches("[data-reveal]")) watch(node);
      node.querySelectorAll<HTMLElement>("[data-reveal]").forEach(watch);
    };

    watchTree(root);
    const mutations = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) watchTree(node);
        });
      });
    });
    mutations.observe(root, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);

  return ref;
}
