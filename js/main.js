// ============================================
// Africa ICON — site interactions
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  initHeaderScroll();
  initNavToggle();
  initCountdown();
  initStatRings();
  initWaitlistForm();
  initScrollReveal();
  document.getElementById("footer-year").textContent = new Date().getFullYear();
});

/* ---------- Sticky header shadow ---------- */
function initHeaderScroll() {
  const header = document.getElementById("site-header");
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- Mobile nav toggle ---------- */
function initNavToggle() {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("main-nav");

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------- Countdown ---------- */
// EDIT THIS: target start date/time for Africa ICON.
// Format: new Date("YYYY-MM-DDTHH:MM:SS") — uses the visitor's local timezone.
const AFRICA_ICON_START = new Date("2027-02-26T09:00:00");

function initCountdown() {
  const els = {
    days: document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    minutes: document.getElementById("cd-minutes"),
    seconds: document.getElementById("cd-seconds"),
  };

  function tick() {
    const now = new Date();
    let diff = AFRICA_ICON_START.getTime() - now.getTime();

    if (diff <= 0) {
      els.days.textContent = "00";
      els.hours.textContent = "00";
      els.minutes.textContent = "00";
      els.seconds.textContent = "00";
      return;
    }

    const pad = (n) => String(n).padStart(2, "0");
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    els.days.textContent = pad(days);
    els.hours.textContent = pad(hours);
    els.minutes.textContent = pad(minutes);
    els.seconds.textContent = pad(seconds);
  }

  tick();
  setInterval(tick, 1000);
}

/* ---------- Animated stat rings + count-up (traction section) ---------- */
function initStatRings() {
  const cards = document.querySelectorAll(".stat-ring-card");
  if (!cards.length) return;

  const CIRCUMFERENCE = 2 * Math.PI * 70; // r=70, matches SVG markup

  const animateCard = (card) => {
    const ring = card.querySelector(".ring-fill");
    const numberEl = card.querySelector(".stat-number");
    const targetPct = parseFloat(ring.dataset.targetPct) || 0;
    const targetCount = parseInt(numberEl.dataset.countTo, 10) || 0;
    const suffix = numberEl.dataset.suffix || "";

    // Ring fill
    const offset = CIRCUMFERENCE - (targetPct / 100) * CIRCUMFERENCE;
    requestAnimationFrame(() => {
      ring.style.strokeDashoffset = String(offset);
    });

    // Count-up
    const duration = 1500;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      numberEl.textContent = Math.round(eased * targetCount) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCard(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  cards.forEach((card) => observer.observe(card));
}

/* ---------- Waitlist form (Mailchimp) ---------- */
// EDIT THIS: paste your Mailchimp embedded-form action URL here.
// Find it in Mailchimp: Audience > Signup forms > Embedded forms > copy the <form action="...">.
// It looks like: https://yourorg.usXX.list-manage.com/subscribe/post?u=XXXXXXXX&id=YYYYYYYY
const MAILCHIMP_URL = "https://theafricaicon.us20.list-manage.com/subscribe/post?u=5dce5f486e620e436cd92db47&id=268d06fa3d&f_id=00fba7e4f0";

// Optional: if you add a custom "University" field to your Mailchimp audience, put its
// merge tag here (e.g. "MMERGE3", shown in Audience > Settings > Audience fields). Leave
// blank to skip sending university to Mailchimp.
const MAILCHIMP_UNIVERSITY_MERGE_TAG = "";

function initWaitlistForm() {
  const form = document.getElementById("waitlist-form");
  const status = document.getElementById("form-status");
  const submitBtn = document.getElementById("waitlist-submit");
  if (!form) return;

  const fields = form.querySelectorAll("input");
  fields.forEach((field) => {
    field.addEventListener("input", () => field.classList.remove("field-error"));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (MAILCHIMP_URL.includes("YOUR_SUBDOMAIN")) {
      status.textContent =
        "Waitlist isn't connected yet — add your Mailchimp form URL in js/main.js (see README).";
      status.className = "form-status error";
      return;
    }

    if (!form.checkValidity()) {
      fields.forEach((field) => {
        field.classList.toggle("field-error", !field.checkValidity());
      });
      form.reportValidity();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Joining...";
    status.textContent = "";
    status.className = "form-status";

    subscribeToMailchimp({
      name: document.getElementById("wl-name").value,
      email: document.getElementById("wl-email").value,
      university: document.getElementById("wl-university").value,
    })
      .then(() => {
        status.textContent = "You're on the list! We'll be in touch soon.";
        status.className = "form-status success";
        form.reset();
      })
      .catch((err) => {
        status.textContent = err.message || "Something went wrong. Please try again in a moment.";
        status.className = "form-status error";
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = "Join the Waitlist";
      });
  });
}

// Mailchimp's public subscribe endpoint has no CORS headers, so a normal fetch() can't read
// the response. This uses Mailchimp's supported JSONP callback instead — no page reload,
// no external library.
function subscribeToMailchimp({ name, email, university }) {
  return new Promise((resolve, reject) => {
    const match = MAILCHIMP_URL.match(/[?&]u=([^&]+).*[?&]id=([^&]+)/);
    if (!match) {
      reject(new Error("Mailchimp URL is misconfigured."));
      return;
    }
    const [, u, id] = match;
    const jsonpUrl = MAILCHIMP_URL.replace("/post?", "/post-json?");
    const callbackName = "mcCallback_" + Math.round(performance.now());

    const params = new URLSearchParams({
      EMAIL: email,
      FNAME: name,
      [`b_${u}_${id}`]: "", // honeypot field Mailchimp expects to stay empty
      c: callbackName,
    });
    if (MAILCHIMP_UNIVERSITY_MERGE_TAG && university) {
      params.set(MAILCHIMP_UNIVERSITY_MERGE_TAG, university);
    }

    const script = document.createElement("script");
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error("Request timed out. Please try again."));
    }, 10000);

    function cleanup() {
      clearTimeout(timeout);
      delete window[callbackName];
      script.remove();
    }

    window[callbackName] = (data) => {
      cleanup();
      const msg = (data && data.msg) || "";
      if (data && data.result === "success") {
        resolve();
      } else if (/already subscribed/i.test(msg)) {
        // Treat "already on the list" as a success from the visitor's perspective.
        resolve();
      } else {
        reject(new Error(cleanMailchimpMessage(msg) || "Something went wrong."));
      }
    };

    script.src = `${jsonpUrl}&${params.toString()}`;
    script.onerror = () => {
      cleanup();
      reject(new Error("Could not reach Mailchimp. Please try again."));
    };
    document.body.appendChild(script);
  });
}

function cleanMailchimpMessage(msg) {
  return msg
    .replace(/<[^>]*>/g, "") // strip HTML Mailchimp sometimes embeds in error messages
    .replace(/^\d+\s*-\s*/, "") // strip leading error codes like "0 - "
    .trim();
}

/* ---------- Scroll-in reveal animation ---------- */
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal, .reveal-fade");
  if (!items.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  // Stagger elements that share a parent (e.g. cards in a row, FAQ items in a list).
  const siblingGroups = new Map();
  items.forEach((el) => {
    const group = siblingGroups.get(el.parentElement) || [];
    group.push(el);
    siblingGroups.set(el.parentElement, group);
  });
  siblingGroups.forEach((group) => {
    group.forEach((el, i) => {
      el.style.transitionDelay = `${i * 90}ms`;
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => observer.observe(el));
}
