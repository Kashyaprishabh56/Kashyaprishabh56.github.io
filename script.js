const profile = {
  email: "kashyaprishabh56@gmail.com",
  phone: "+919717496492",
  github: "https://github.com/kashyaprishabh56",
  linkedin: "https://www.linkedin.com/in/rishabh-kashyap-5ab78930a/",
};

const roles = [
  "IT Lead",
  "Research Analyst",
  "Frontend Developer",
  "Python Automation Builder",
];

const experiences = [
  {
    company: "Eagle/Spartan Network Supply Private Limited",
    role: "IT Lead",
    period: "April 2025 - Present",
    location: "Gurugram",
    summary:
      "Leading tech work across WMS, SAP B1 integrations, Python automation, scraper systems, reconciliation workflows, and an internal task management system named Task 1.",
    impact: [
      "Developed Python scrapers and reconciliation queries for operational file workflows.",
      "Owned tech coordination for warehouse systems, APIs, and SAP B1 integration work.",
      "Built internal process tooling to make tasks easier to track and move across teams.",
    ],
    stack: ["Python", "WMS", "SAP B1", "API Integration", "Automation"],
  },
  {
    company: "IIIT Delhi",
    role: "Research Analyst",
    period: "January 2025 - December 2025",
    location: "Delhi",
    summary:
      "Worked on AI research projects covering RAG, LlamaIndex, RankRAG, Hugging Face, Google AI Studio, data collection, tuning, visualization, and React authentication flows.",
    impact: [
      "Created login and registration UI/UX in React, with authentication support through MongoDB.",
      "Tuned models on a 2 lakh plus multimodal PCMB JEE Advanced and Mains dataset.",
      "Supported next generation AI model training and data collection for a health ministry flagship project.",
    ],
    stack: ["RAG", "LlamaIndex", "React", "MongoDB", "Hugging Face"],
  },
  {
    company: "Bharati Airtel",
    role: "Network Engineer",
    period: "October 2024 - January 2025",
    location: "India",
    summary:
      "Handled FTTH network support, signal testing, first level testing, TAC-1 operations, and live user query resolution.",
    impact: [
      "Worked with HummingBard tooling to monitor Fiber to the Home network lines.",
      "Tested network signals and supported first level troubleshooting workflows.",
      "Handled TAC-1 operations while responding to live user queries.",
    ],
    stack: ["FTTH", "FLT", "TAC-1", "Network Operations"],
  },
  {
    company: "Rank Math",
    role: "Frontend Support Moderator",
    period: "April 2024 - May 2024",
    location: "Remote",
    summary:
      "Supported WordPress users by debugging Rank Math plugin issues, troubleshooting frontend behavior, and helping end users reach a fix faster.",
    impact: [
      "Debugged WordPress plugin issues across user-facing scenarios.",
      "Translated end-user reports into actionable troubleshooting paths.",
      "Built stronger instincts for support quality, reproduction, and frontend diagnostics.",
    ],
    stack: ["WordPress", "JavaScript", "Frontend Debugging", "Support"],
  },
];

const projects = [
  {
    title: "Fresh Meal Ecommerce",
    type: "Web",
    icon: "shopping-bag",
    summary:
      "A food ecommerce website built with HTML, CSS, JavaScript, Bootstrap, and a PHP localhost setup.",
    tags: ["HTML", "CSS", "JavaScript", "Bootstrap", "PHP"],
  },
  {
    title: "Comfy Furniture Store",
    type: "Web",
    icon: "armchair",
    summary:
      "A polished furniture shopping site focused on product browsing, layout clarity, and responsive UI.",
    tags: ["HTML", "CSS", "JavaScript"],
  },
  {
    title: "Portfolio Website",
    type: "Web",
    icon: "layout-dashboard",
    summary:
      "A personal portfolio built with HTML, CSS, ReactJS, Bootstrap, PHP localhost, Yarn, and NPM workflows.",
    tags: ["ReactJS", "Bootstrap", "NPM", "Yarn"],
  },
  {
    title: "Gesture Volume Control",
    type: "AI",
    icon: "hand",
    summary:
      "Python computer vision project for controlling system volume through hand gestures.",
    tags: ["Python", "MediaPipe", "NumPy", "Dlib"],
  },
  {
    title: "Face Detection System",
    type: "AI",
    icon: "scan-face",
    summary:
      "Face detection workflow using Python libraries for recognition and realtime visual analysis.",
    tags: ["Python", "Face Detection", "MediaPipe", "Dlib"],
  },
  {
    title: "Object, Motion, Mask and Drowsiness Detection",
    type: "AI",
    icon: "activity",
    summary:
      "A multi-detection Python system covering object, motion, mask, and drowsiness scenarios.",
    tags: ["Python", "Computer Vision", "NumPy"],
  },
  {
    title: "KAVACH-2023 FRS with ANPR",
    type: "Research",
    icon: "shield-check",
    summary:
      "College-level selected team project combining Face Recognition System and Advanced Number Plate Recognition.",
    tags: ["FRS", "ANPR", "Team Project", "Computer Vision"],
  },
];

const skills = [
  {
    group: "Frontend",
    note: "Interfaces, responsive layouts, and user-facing debugging.",
    items: [
      ["JavaScript", 90],
      ["HTML5", 92],
      ["CSS", 88],
      ["ReactJS", 82],
    ],
  },
  {
    group: "AI and Data",
    note: "Model workflows, interpretation, and applied computer vision.",
    items: [
      ["Python", 86],
      ["ML", 78],
      ["AI", 80],
      ["Data Interpretation", 76],
    ],
  },
  {
    group: "Systems",
    note: "Operational tools, databases, support, and integrations.",
    items: [
      ["MySQL", 76],
      ["DSA", 72],
      ["API Integration", 78],
      ["Network Ops", 70],
    ],
  },
  {
    group: "Research Workflow",
    note: "RAG experiments, data collection, tuning, and visualization.",
    items: [
      ["RAG", 74],
      ["LlamaIndex", 72],
      ["Hugging Face", 70],
      ["Google AI Studio", 68],
    ],
  },
];

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let activeExperienceIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  applySavedTheme();
  renderExperienceTabs();
  setupExperienceSwitcher();
  selectExperience(0);
  renderProjects("All");
  renderProjectFilters();
  renderSkills();
  setupNavigation();
  setupMobileMenu();
  setupThemeToggle();
  setupResumeModal();
  setupContactForm();
  setupRevealObserver();
  setupCounters();
  setupTyping();
  setupAmbientCanvas();
  refreshIcons();
});

window.showExperience = (event, index) => {
  if (event) event.preventDefault();
  selectExperience(index);
};

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function applySavedTheme() {
  const saved = localStorage.getItem("portfolio-theme");
  if (saved === "light") {
    document.body.classList.add("light-mode");
  }
  updateThemeIcon();
}

function setupThemeToggle() {
  const toggle = document.querySelector("[data-theme-toggle]");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    localStorage.setItem(
      "portfolio-theme",
      document.body.classList.contains("light-mode") ? "light" : "dark"
    );
    updateThemeIcon();
    refreshIcons();
  });
}

function updateThemeIcon() {
  const toggle = document.querySelector("[data-theme-toggle]");
  if (!toggle) return;
  const isLight = document.body.classList.contains("light-mode");
  toggle.innerHTML = `<i data-lucide="${isLight ? "sun" : "moon"}"></i>`;
}

function getExperienceIndex(index) {
  const parsedIndex = Number(index);
  if (!Number.isInteger(parsedIndex)) return 0;
  return Math.min(Math.max(parsedIndex, 0), experiences.length - 1);
}

function renderExperienceTabs() {
  const tabs = document.getElementById("experienceTabs");
  if (!tabs) return;

  tabs.innerHTML = experiences
    .map(
      (item, index) => `
        <button
          class="experience-tab"
          type="button"
          role="tab"
          id="exp-tab-${index}"
          aria-controls="experiencePanel"
          aria-selected="false"
          tabindex="-1"
          data-experience-index="${index}"
          aria-label="Show ${item.role} experience at ${item.company}"
        >
          <strong>${item.role}</strong>
          <span>${item.company}</span>
        </button>
      `
    )
    .join("");
}

function renderExperience(activeIndex = activeExperienceIndex) {
  if (!document.querySelector("[data-experience-index]")) {
    renderExperienceTabs();
  }
  selectExperience(activeIndex);
}

function selectExperience(index, options = {}) {
  const normalizedIndex = getExperienceIndex(index);
  activeExperienceIndex = normalizedIndex;

  document.querySelectorAll("[data-experience-index]").forEach((tab) => {
    const isActive = Number(tab.dataset.experienceIndex) === normalizedIndex;
    tab.setAttribute("aria-selected", String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
  });

  renderExperiencePanel(normalizedIndex);

  if (options.focusTab) {
    const activeTab = document.querySelector(`[data-experience-index="${normalizedIndex}"]`);
    if (activeTab) activeTab.focus({ preventScroll: true });
  }
}

function renderExperiencePanel(activeIndex) {
  const panel = document.getElementById("experiencePanel");
  if (!panel) return;

  const item = experiences[activeIndex];
  panel.setAttribute("role", "tabpanel");
  panel.setAttribute("aria-labelledby", `exp-tab-${activeIndex}`);
  panel.innerHTML = `
    <p class="eyebrow">${item.period} / ${item.location}</p>
    <h3>${item.role}</h3>
    <p>${item.summary}</p>
    <div class="experience-meta">
      ${item.stack.map((tag) => `<span class="pill">${tag}</span>`).join("")}
    </div>
    <ul class="impact-list">
      ${item.impact.map((point) => `<li>${point}</li>`).join("")}
    </ul>
  `;
  refreshIcons();
}

function setupExperienceSwitcher() {
  const tabs = document.getElementById("experienceTabs");
  if (!tabs) return;

  const activateTab = (tab) => {
    selectExperience(tab.dataset.experienceIndex, { focusTab: true });
  };

  tabs.addEventListener("pointerdown", (event) => {
    const tab = event.target.closest("[data-experience-index]");
    if (tab) selectExperience(tab.dataset.experienceIndex);
  });

  tabs.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-experience-index]");
    if (!tab) return;
    event.preventDefault();
    activateTab(tab);
  });

  tabs.addEventListener("keydown", (event) => {
    const current = event.target.closest("[data-experience-index]");
    if (!current) return;

    const buttons = Array.from(tabs.querySelectorAll("[data-experience-index]"));
    const currentIndex = buttons.indexOf(current);
    const lastIndex = buttons.length - 1;
    let nextIndex = currentIndex;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") nextIndex = Math.min(lastIndex, currentIndex + 1);
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") nextIndex = Math.max(0, currentIndex - 1);
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = lastIndex;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activateTab(current);
      return;
    }

    if (nextIndex !== currentIndex) {
      event.preventDefault();
      activateTab(buttons[nextIndex]);
    }
  });
}

function renderProjectFilters() {
  const filterRoot = document.getElementById("projectFilters");
  if (!filterRoot) return;

  const filters = ["All", ...Array.from(new Set(projects.map((project) => project.type)))];
  filterRoot.innerHTML = filters
    .map(
      (filter) => `
        <button class="filter-button ${filter === "All" ? "is-active" : ""}" type="button" data-filter="${filter}">
          ${filter}
        </button>
      `
    )
    .join("");

  filterRoot.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      filterRoot
        .querySelectorAll("[data-filter]")
        .forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      renderProjects(button.dataset.filter);
    });
  });
}

function renderProjects(filter) {
  const grid = document.getElementById("projectGrid");
  if (!grid) return;

  const filtered = filter === "All" ? projects : projects.filter((project) => project.type === filter);
  grid.innerHTML = filtered
    .map(
      (project, index) => `
        <article class="project-card reveal is-visible" style="--delay: ${index * 70}ms">
          <div>
            <div class="project-topline">
              <span class="project-icon" aria-hidden="true"><i data-lucide="${project.icon}"></i></span>
              <span class="pill">${project.type}</span>
            </div>
            <h3>${project.title}</h3>
            <p>${project.summary}</p>
          </div>
          <div class="tag-row">
            ${project.tags.map((tag) => `<span class="pill">${tag}</span>`).join("")}
          </div>
        </article>
      `
    )
    .join("");
  refreshIcons();
}

function renderSkills() {
  const root = document.getElementById("stackBoard");
  if (!root) return;

  root.innerHTML = skills
    .map(
      (group) => `
        <article class="stack-group">
          <h3>${group.group}</h3>
          <p>${group.note}</p>
          ${group.items
            .map(
              ([name, value]) => `
                <div class="skill-meter">
                  <header>
                    <span>${name}</span>
                    <span>${value}%</span>
                  </header>
                  <div class="meter-track"><div class="meter-fill" style="--value: ${value}%"></div></div>
                </div>
              `
            )
            .join("")}
        </article>
      `
    )
    .join("");
}

function setupNavigation() {
  const header = document.getElementById("siteHeader");
  const progress = document.getElementById("scrollProgress");
  const links = Array.from(document.querySelectorAll(".nav-link"));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const update = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progressValue = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progress.style.width = `${Math.min(100, Math.max(0, progressValue))}%`;
    header.classList.toggle("is-scrolled", window.scrollY > 18);

    let active = "";
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= 120) {
        active = section.id;
      }
    });

    links.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${active}`);
    });
  };

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

function setupMobileMenu() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.getElementById("mobileMenu");
  if (!toggle || !menu) return;

  const closeMenu = () => {
    menu.classList.add("hidden");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = '<i data-lucide="menu"></i>';
    refreshIcons();
  };

  toggle.addEventListener("click", () => {
    const isOpen = !menu.classList.contains("hidden");
    menu.classList.toggle("hidden", isOpen);
    toggle.setAttribute("aria-expanded", String(!isOpen));
    toggle.innerHTML = `<i data-lucide="${isOpen ? "menu" : "x"}"></i>`;
    refreshIcons();
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

function setupResumeModal() {
  const modal = document.getElementById("resumeModal");
  const openers = document.querySelectorAll("[data-open-resume]");
  const closers = document.querySelectorAll("[data-close-resume]");
  let lastFocused = null;

  if (!modal || !openers.length) return;

  const open = () => {
    lastFocused = document.activeElement;
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    const closeButton = modal.querySelector("[data-close-resume].icon-button");
    if (closeButton) closeButton.focus();
  };

  const close = () => {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  };

  openers.forEach((button) => button.addEventListener("click", open));
  closers.forEach((button) => button.addEventListener("click", close));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.classList.contains("hidden")) {
      close();
    }
  });
}

function setupContactForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  if (!form || !status) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !email || !message) {
      status.textContent = "Please fill out every field before sending.";
      return;
    }

    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
    status.textContent = "Opening your email app with the message ready.";
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  });
}

function setupRevealObserver() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length || reducedMotion) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  items.forEach((item) => observer.observe(item));
}

function setupCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  const animate = (node) => {
    const target = Number(node.dataset.count);
    const duration = reducedMotion ? 1 : 1300;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      node.textContent = target >= 100000 ? `${Math.round(value / 1000)}k+` : `${value}+`;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function setupTyping() {
  const target = document.getElementById("typedRole");
  if (!target || reducedMotion) return;

  let roleIndex = 0;
  let letterIndex = roles[0].length;
  let deleting = true;

  setInterval(() => {
    const current = roles[roleIndex];
    if (deleting) {
      letterIndex -= 1;
      if (letterIndex <= 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    } else {
      letterIndex += 1;
      if (letterIndex >= roles[roleIndex].length) {
        deleting = true;
      }
    }
    target.textContent = roles[roleIndex].slice(0, letterIndex) || roles[roleIndex].slice(0, 1);
  }, 95);
}

function setupAmbientCanvas() {
  const canvas = document.getElementById("ambientCanvas");
  if (!canvas || reducedMotion) return;
  const context = canvas.getContext("2d");
  if (!context) return;

  const palette = ["#7df7d4", "#ffd166", "#ff8fab", "#9bf6ff"];
  let width = 0;
  let height = 0;
  let particles = [];
  let animationFrame = null;

  const resize = () => {
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = Math.floor(width * window.devicePixelRatio);
    canvas.height = Math.floor(height * window.devicePixelRatio);
    context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    particles = Array.from({ length: Math.min(54, Math.floor(width / 18)) }, (_, index) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.34,
      vy: (Math.random() - 0.5) * 0.34,
      size: Math.random() * 1.6 + 0.7,
      color: palette[index % palette.length],
    }));
  };

  const draw = () => {
    context.clearRect(0, 0, width, height);
    context.globalCompositeOperation = "lighter";

    particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > height) particle.vy *= -1;

      context.beginPath();
      context.fillStyle = particle.color;
      context.globalAlpha = 0.42;
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();

      for (let otherIndex = index + 1; otherIndex < particles.length; otherIndex += 1) {
        const other = particles[otherIndex];
        const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
        if (distance < 132) {
          context.beginPath();
          context.strokeStyle = particle.color;
          context.globalAlpha = (1 - distance / 132) * 0.16;
          context.lineWidth = 1;
          context.moveTo(particle.x, particle.y);
          context.lineTo(other.x, other.y);
          context.stroke();
        }
      }
    });

    context.globalAlpha = 1;
    context.globalCompositeOperation = "source-over";
    animationFrame = requestAnimationFrame(draw);
  };

  resize();
  draw();
  window.addEventListener("resize", resize);
  window.addEventListener("beforeunload", () => {
    if (animationFrame) cancelAnimationFrame(animationFrame);
  });
}
