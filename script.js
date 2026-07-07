/* ==========================================================================
   HITEN RAJGURU — PORTFOLIO SCRIPTS
   ========================================================================== */

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Page loader ---------- */
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  setTimeout(() => loader.classList.add("hide"), reducedMotion ? 0 : 500);
});

/* ---------- Typed rotating roles ---------- */
const roles = ["Web Designer", "UI/UX Designer", "Graphic Designer"];
const typedEl = document.getElementById("typedRole");

if (reducedMotion) {
  typedEl.textContent = roles.join(" · ");
} else {
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeLoop() {
    const current = roles[roleIndex];

    if (!deleting) {
      typedEl.textContent = current.slice(0, ++charIndex);
      if (charIndex === current.length) {
        deleting = true;
        return setTimeout(typeLoop, 1800); // pause on full word
      }
      return setTimeout(typeLoop, 75);
    }

    typedEl.textContent = current.slice(0, --charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      return setTimeout(typeLoop, 350);
    }
    setTimeout(typeLoop, 40);
  }
  setTimeout(typeLoop, 1000);
}

/* ---------- Navbar: scrolled state + mobile menu + active link ---------- */
const nav = document.getElementById("nav");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 30);
}, { passive: true });

navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", open);
  document.body.style.overflow = open ? "hidden" : "";
});

// close mobile menu when a link is tapped
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  });
});

// highlight the nav link of the section currently in view
const sections = document.querySelectorAll("section[id]");
const linkMap = {};
navLinks.querySelectorAll("a[href^='#']").forEach((a) => {
  linkMap[a.getAttribute("href").slice(1)] = a;
});

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && linkMap[entry.target.id]) {
      navLinks.querySelectorAll(".nav-link").forEach((l) => l.classList.remove("active"));
      linkMap[entry.target.id].classList.add("active");
    }
  });
}, { rootMargin: "-40% 0px -55% 0px" });

sections.forEach((s) => sectionObserver.observe(s));

/* ---------- Scroll reveal ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal, .skill").forEach((el) => revealObserver.observe(el));

/* ---------- Animated stat counters ---------- */
function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  if (reducedMotion) { el.textContent = target; return; }

  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      countObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll(".stat-num").forEach((el) => countObserver.observe(el));

/* ---------- Cursor glow + card spotlight (desktop only) ---------- */
const glow = document.getElementById("cursorGlow");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (finePointer && !reducedMotion) {
  document.addEventListener("mousemove", (e) => {
    glow.style.opacity = "1";
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  });

  // spotlight follows the cursor inside service cards
  document.querySelectorAll(".service-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", ((e.clientX - rect.left) / rect.width) * 100 + "%");
      card.style.setProperty("--my", ((e.clientY - rect.top) / rect.height) * 100 + "%");
    });
  });
}

/* ---------- Footer year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();