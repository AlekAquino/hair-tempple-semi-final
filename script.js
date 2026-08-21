(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "summary",
    "[tabindex]:not([tabindex='-1'])",
  ].join(",");

  const menu = document.querySelector("[data-menu]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const menuClose = document.querySelector("[data-menu-close]");
  const menuBackdrop = document.querySelector("[data-menu-backdrop]");
  let lastFocusedElement = null;

  const menuIsOpen = () => Boolean(menu && !menu.hidden);

  const openMenu = () => {
    if (!menu || !menuToggle || !menuBackdrop) return;
    lastFocusedElement = document.activeElement;
    menu.hidden = false;
    menuBackdrop.hidden = false;
    document.body.classList.add("menu-open");
    menuToggle.setAttribute("aria-expanded", "true");
    requestAnimationFrame(() => {
      menu.classList.add("is-open");
      menuBackdrop.classList.add("is-open");
      menu.querySelector(focusableSelector)?.focus();
    });
  };

  const closeMenu = ({ restoreFocus = true } = {}) => {
    if (!menu || !menuToggle || !menuBackdrop || !menuIsOpen()) return;
    menu.classList.remove("is-open");
    menuBackdrop.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    window.setTimeout(() => {
      menu.hidden = true;
      menuBackdrop.hidden = true;
      if (restoreFocus && lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
    }, reducedMotion ? 0 : 180);
  };

  menuToggle?.addEventListener("click", () => (menuIsOpen() ? closeMenu() : openMenu()));
  menuClose?.addEventListener("click", () => closeMenu());
  menuBackdrop?.addEventListener("click", () => closeMenu());
  menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => closeMenu({ restoreFocus: false })));

  document.addEventListener("keydown", (event) => {
    if (!menuIsOpen()) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu();
      return;
    }
    if (event.key !== "Tab" || !menu) return;
    const focusable = [...menu.querySelectorAll(focusableSelector)].filter(
      (element) => element instanceof HTMLElement && element.offsetParent !== null,
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  document.querySelectorAll("[data-before-after]").forEach((comparison) => {
    const range = comparison.querySelector("input[type='range']");
    if (!(range instanceof HTMLInputElement)) return;
    const update = () => {
      const value = Number(range.value);
      comparison.style.setProperty("--position", `${value}%`);
      range.setAttribute("aria-valuetext", `${value}% da foto Antes à esquerda e ${100 - value}% da foto Depois à direita`);
    };
    range.addEventListener("input", update);
    range.addEventListener("keydown", (event) => {
      const currentValue = Number(range.value);
      const keyboardSteps = {
        ArrowLeft: -1,
        ArrowDown: -1,
        ArrowRight: 1,
        ArrowUp: 1,
        PageDown: -10,
        PageUp: 10,
      };
      if (event.key === "Home") {
        event.preventDefault();
        range.value = range.min;
      } else if (event.key === "End") {
        event.preventDefault();
        range.value = range.max;
      } else if (event.key in keyboardSteps) {
        event.preventDefault();
        const nextValue = Math.min(Number(range.max), Math.max(Number(range.min), currentValue + keyboardSteps[event.key]));
        range.value = String(nextValue);
      } else {
        return;
      }
      range.dispatchEvent(new Event("input", { bubbles: true }));
    });
    update();
  });

  document.querySelectorAll("[data-carousel-shell]").forEach((shell) => {
    const carousel = shell.querySelector("[data-carousel]");
    const previousButton = shell.querySelector("[data-carousel-prev]");
    const nextButton = shell.querySelector("[data-carousel-next]");
    const status = shell.querySelector("[data-carousel-status]");
    if (!(carousel instanceof HTMLElement)) return;
    const cards = [...carousel.children].filter((element) => element instanceof HTMLElement);
    const stepSize = () => {
      if (!cards.length) return carousel.clientWidth;
      const cardWidth = cards[0].getBoundingClientRect().width;
      const gap = Number.parseFloat(getComputedStyle(carousel).columnGap || "0");
      return cardWidth + gap;
    };
    const activeIndex = () => Math.min(cards.length - 1, Math.max(0, Math.round(carousel.scrollLeft / Math.max(stepSize(), 1))));
    const updateState = () => {
      const maxScroll = Math.max(0, carousel.scrollWidth - carousel.clientWidth - 2);
      if (previousButton instanceof HTMLButtonElement) previousButton.disabled = carousel.scrollLeft <= 2;
      if (nextButton instanceof HTMLButtonElement) nextButton.disabled = carousel.scrollLeft >= maxScroll;
      if (status) status.textContent = `${activeIndex() + 1} de ${cards.length}`;
    };
    const scrollByCard = (direction) => carousel.scrollBy({ left: direction * stepSize(), behavior: reducedMotion ? "auto" : "smooth" });
    previousButton?.addEventListener("click", () => scrollByCard(-1));
    nextButton?.addEventListener("click", () => scrollByCard(1));
    carousel.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollByCard(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollByCard(1);
      } else if (event.key === "Home") {
        event.preventDefault();
        carousel.scrollTo({ left: 0, behavior: reducedMotion ? "auto" : "smooth" });
      } else if (event.key === "End") {
        event.preventDefault();
        carousel.scrollTo({ left: carousel.scrollWidth, behavior: reducedMotion ? "auto" : "smooth" });
      }
    });
    let scrollTimer;
    carousel.addEventListener("scroll", () => {
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(updateState, 60);
    }, { passive: true });
    window.addEventListener("resize", updateState, { passive: true });
    updateState();
  });

  const lightbox = document.querySelector("[data-lightbox-dialog]");
  if (lightbox instanceof HTMLDialogElement) {
    const lightboxImage = lightbox.querySelector("[data-lightbox-image]");
    const lightboxCaption = lightbox.querySelector("[data-lightbox-caption]");
    const lightboxCounter = lightbox.querySelector("[data-lightbox-counter]");
    const closeButton = lightbox.querySelector("[data-lightbox-close]");
    const previousButton = lightbox.querySelector("[data-lightbox-prev]");
    const nextButton = lightbox.querySelector("[data-lightbox-next]");
    const triggers = [...document.querySelectorAll("[data-lightbox]")];
    let currentIndex = 0;
    let returnFocus = null;

    const renderLightbox = () => {
      const trigger = triggers[currentIndex];
      if (!trigger || !(lightboxImage instanceof HTMLImageElement)) return;
      const source = trigger.getAttribute("data-lightbox-src") || trigger.querySelector("img")?.currentSrc || trigger.querySelector("img")?.src;
      const alt = trigger.getAttribute("data-lightbox-alt") || trigger.querySelector("img")?.alt || "Fotografia ampliada";
      const caption = trigger.getAttribute("data-lightbox-caption") || alt;
      if (!source) return;
      lightboxImage.src = source;
      lightboxImage.alt = alt;
      if (lightboxCaption) lightboxCaption.textContent = caption;
      if (lightboxCounter) lightboxCounter.textContent = `${currentIndex + 1} de ${triggers.length}`;
      if (previousButton instanceof HTMLButtonElement) previousButton.disabled = triggers.length < 2;
      if (nextButton instanceof HTMLButtonElement) nextButton.disabled = triggers.length < 2;
    };

    const openLightbox = (trigger) => {
      const index = triggers.indexOf(trigger);
      if (index < 0) return;
      currentIndex = index;
      returnFocus = trigger;
      renderLightbox();
      lightbox.showModal();
      document.body.classList.add("lightbox-open");
      closeButton?.focus();
    };

    const closeLightbox = () => lightbox.close();
    const moveLightbox = (direction) => {
      currentIndex = (currentIndex + direction + triggers.length) % triggers.length;
      renderLightbox();
    };

    triggers.forEach((trigger) => trigger.addEventListener("click", () => openLightbox(trigger)));
    closeButton?.addEventListener("click", closeLightbox);
    previousButton?.addEventListener("click", () => moveLightbox(-1));
    nextButton?.addEventListener("click", () => moveLightbox(1));
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    lightbox.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") moveLightbox(-1);
      if (event.key === "ArrowRight") moveLightbox(1);
    });
    lightbox.addEventListener("close", () => {
      document.body.classList.remove("lightbox-open");
      if (lightboxImage instanceof HTMLImageElement) lightboxImage.removeAttribute("src");
      if (returnFocus instanceof HTMLElement) returnFocus.focus();
    });
  }

  const revealItems = document.querySelectorAll("[data-reveal]");
  if (!reducedMotion && "IntersectionObserver" in window) {
    document.documentElement.classList.add("has-reveal");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
    revealItems.forEach((item) => observer.observe(item));
  }
})();
