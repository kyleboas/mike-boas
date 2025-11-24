---
---

document.addEventListener("DOMContentLoaded", () => {
    const images = document.querySelectorAll(".cake-shot");

    // If user prefers reduced motion, just show everything
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      images.forEach(img => img.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target); // fade only once
          }
        });
      },
      {
        root: null,
        threshold: 0.15,         // % visible before triggering
        rootMargin: "0px 0px -5% 0px" // trigger slightly before fully in view
      }
    );

    images.forEach(img => observer.observe(img));
});