(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------
     Sticky navbar background on scroll
     --------------------------------------------------------------- */
  const navbar = document.getElementById("navbar");
  const onScroll = () => {
    navbar.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------------------------------------------------------------
     Mobile menu toggle
     --------------------------------------------------------------- */
  const navToggle = document.getElementById("navToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  const closeMenu = () => {
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    mobileMenu.classList.remove("is-open");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
    mobileMenu.classList.toggle("is-open", !isOpen);
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  /* ---------------------------------------------------------------
     Scroll-reveal for sections (IntersectionObserver)
     --------------------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal");

  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add("reveal--visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal--visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------------------------------------------------------------
     Hero terminal — simulates a test run tied to the tagline
     --------------------------------------------------------------- */
  const terminalBody = document.getElementById("terminalBody");

  const terminalLines = [
    { type: "prompt", text: "run-tests --suite=all" },
    { type: "check", text: "mobile-automation.spec", status: "passed" },
    { type: "check", text: "api-collection.spec", status: "passed" },
    { type: "check", text: "performance-load.spec", status: "passed" },
    { type: "summary", text: "3/3 passed · quality confirmed" },
  ];

  const buildLine = (line) => {
    const row = document.createElement("div");
    row.className = "terminal__line";

    if (line.type === "prompt") {
      row.classList.add("terminal__line--prompt");
      row.textContent = line.text;
    } else if (line.type === "check") {
      const check = document.createElement("span");
      check.className = "terminal__check";
      check.textContent = "✓";
      const label = document.createElement("span");
      label.textContent = line.text;
      const status = document.createElement("span");
      status.className = "terminal__status";
      status.textContent = line.status;
      row.append(check, label, status);
    } else {
      row.classList.add("terminal__line--prompt");
      row.textContent = line.text;
    }

    return row;
  };

  const runTerminal = () => {
    if (!terminalBody) return;

    if (prefersReducedMotion) {
      terminalLines.forEach((line) => {
        const row = buildLine(line);
        row.classList.add("is-visible");
        terminalBody.appendChild(row);
      });
      return;
    }

    terminalLines.forEach((line, index) => {
      window.setTimeout(() => {
        const row = buildLine(line);
        terminalBody.appendChild(row);
        requestAnimationFrame(() => row.classList.add("is-visible"));

        if (index === terminalLines.length - 1) {
          const cursor = document.createElement("span");
          cursor.className = "terminal__cursor";
          row.appendChild(cursor);
        }
      }, 260 * index + 300);
    });
  };

  runTerminal();

  /* ---------------------------------------------------------------
     Footer year — always accurate, never hardcoded
     --------------------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
