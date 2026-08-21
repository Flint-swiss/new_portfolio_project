document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("is-ready");

  const header = document.getElementById("siteHeader");
  const heroScene = document.getElementById("heroScene");
  const menuButton = document.querySelector(".menu-button");
  const menuButtonText = document.querySelector(".menu-button-text");
  const mobileMenu = document.getElementById("mobileMenu");

  // ------------------------------------------------------------------ //
  // Menu toggle (full-screen overlay, MENU <-> CLOSE)
  // ------------------------------------------------------------------ //
  if (menuButton && mobileMenu) {
    const closeMenu = () => {
      mobileMenu.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open menu");
      if (menuButtonText) menuButtonText.textContent = "MENU";
    };

    menuButton.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.contains("is-open");
      if (isOpen) {
        closeMenu();
      } else {
        mobileMenu.classList.add("is-open");
        menuButton.setAttribute("aria-expanded", "true");
        menuButton.setAttribute("aria-label", "Close menu");
        if (menuButtonText) menuButtonText.textContent = "CLOSE";
      }
    });

    mobileMenu.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", closeMenu)
    );
  }

  // ------------------------------------------------------------------ //
  // Header state: full nav on the hero; DENSEL + MENU only after it.
  // ------------------------------------------------------------------ //
  const THRESHOLD_PROP = 0.55;
  let ticking = false;

  const updateHeaderState = () => {
    if (!header || !heroScene) return;
    const rect = heroScene.getBoundingClientRect();
    const compact = rect.top <= -window.innerHeight * THRESHOLD_PROP;
    if (header.classList.contains("is-compact") !== compact) {
      header.classList.toggle("is-compact", compact);
    }
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      updateHeaderState();
      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  updateHeaderState();

  // ------------------------------------------------------------------ //
  // "let's work" handwritten interaction — floats across the whole hero,
  // follows the cursor with a smooth lag. One single element, and it is
  // enabled only for pointer (mouse) devices.
  // ------------------------------------------------------------------ //
  const hero = document.querySelector(".hero");
  const handwritten = document.querySelector(".handwritten");

  if (hero && handwritten) {
    const hoverSupported =
      !window.matchMedia ||
      typeof window.matchMedia("(hover: hover)").matches !== "boolean" ||
      window.matchMedia("(hover: hover)").matches;

    if (hoverSupported) {
      const target = { x: 0, y: 0 };
      const current = { x: 0, y: 0 };
      let frame = null;
      let moving = false;

      const follow = () => {
        const k = 0.12;
        current.x += (target.x - current.x) * k;
        current.y += (target.y - current.y) * k;
        handwritten.style.setProperty("--hx", `${current.x}px`);
        handwritten.style.setProperty("--hy", `${current.y}px`);

        const settled =
          Math.abs(target.x - current.x) < 0.4 &&
          Math.abs(target.y - current.y) < 0.4;

        if (settled) {
          current.x = target.x;
          current.y = target.y;
          moving = false;
          frame = null;
        } else {
          frame = window.requestAnimationFrame(follow);
        }
      };

      const startMoving = () => {
        if (!moving) {
          moving = true;
          frame = window.requestAnimationFrame(follow);
        }
      };

      hero.addEventListener("mouseenter", (e) => {
        hero.classList.add("is-writing");
        const rect = hero.getBoundingClientRect();
        target.x = e.clientX - rect.left + 14;
        target.y = Math.max(6, e.clientY - rect.top - 46);
        startMoving();
      });

      hero.addEventListener("mousemove", (e) => {
        const rect = hero.getBoundingClientRect();
        target.x = e.clientX - rect.left + 14;
        target.y = Math.max(6, e.clientY - rect.top - 46);
        startMoving();
      });

      hero.addEventListener("mouseleave", () => {
        hero.classList.remove("is-writing");
      });
    }
  }
});