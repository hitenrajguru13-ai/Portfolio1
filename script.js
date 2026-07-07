const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = [...document.querySelectorAll(".nav-link")];
const revealItems = [...document.querySelectorAll(".reveal")];
const barItems = [...document.querySelectorAll(".bar-item")];
const typewriter = document.querySelector("[data-typewriter]");
const year = document.querySelector("[data-year]");
const cursorGlow = document.querySelector(".cursor-glow");
const contactForm = document.querySelector("[data-contact-form]");
const formNote = document.querySelector("[data-form-note]");

const roles = ["Web Designer", "UI/UX Designer", "Graphic Designer"];
let roleIndex = 0;
let letterIndex = 0;
let isDeleting = false;

if (year) {
  year.textContent = new Date().getFullYear();
}

const setHeaderState = () => {
  header?.classList.toggle("scrolled", window.scrollY > 18);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("open");
  document.body.classList.toggle("menu-open", Boolean(isOpen));
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  navToggle.innerHTML = isOpen ? '<i class="bi bi-x-lg"></i>' : '<i class="bi bi-list"></i>';
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav?.classList.remove("open");
    document.body.classList.remove("menu-open");
    navToggle?.setAttribute("aria-expanded", "false");
    if (navToggle) navToggle.innerHTML = '<i class="bi bi-list"></i>';
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const barObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      barObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.4 }
);

barItems.forEach((item) => barObserver.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
      });
    });
  },
  { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
);

document.querySelectorAll("main section[id]").forEach((section) => {
  sectionObserver.observe(section);
});

const tickTypewriter = () => {
  if (!typewriter) return;

  const currentRole = roles[roleIndex];
  const visibleText = currentRole.slice(0, letterIndex);
  typewriter.textContent = visibleText;

  if (!isDeleting && letterIndex < currentRole.length) {
    letterIndex += 1;
    window.setTimeout(tickTypewriter, 72);
    return;
  }

  if (!isDeleting && letterIndex === currentRole.length) {
    isDeleting = true;
    window.setTimeout(tickTypewriter, 1250);
    return;
  }

  if (isDeleting && letterIndex > 0) {
    letterIndex -= 1;
    window.setTimeout(tickTypewriter, 38);
    return;
  }

  isDeleting = false;
  roleIndex = (roleIndex + 1) % roles.length;
  window.setTimeout(tickTypewriter, 280);
};

tickTypewriter();

document.addEventListener(
  "pointermove",
  (event) => {
    if (!cursorGlow || window.matchMedia("(max-width: 760px)").matches) return;
    cursorGlow.style.opacity = "1";
    cursorGlow.style.transform = "translate3d(" + (event.clientX - 160) + "px, " + (event.clientY - 160) + "px, 0)";
  },
  { passive: true }
);

document.querySelectorAll("[data-tilt]").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (window.matchMedia("(max-width: 760px)").matches) return;

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    card.style.transform = "perspective(1000px) rotateX(" + y * -5 + "deg) rotateY(" + x * 7 + "deg) translateY(-4px)";
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = formData.get("name");
  const email = formData.get("email");
  const project = formData.get("project");
  const message = formData.get("message");
  const subject = encodeURIComponent("Portfolio enquiry from " + name);
  const body = encodeURIComponent(
    "Name: " + name + "\nEmail: " + email + "\nProject Type: " + project + "\n\n" + message
  );

  if (formNote) {
    formNote.textContent = "Opening your email app with the message ready.";
  }

  window.location.href = "mailto:hitenrajguru@example.com?subject=" + subject + "&body=" + body;
});
