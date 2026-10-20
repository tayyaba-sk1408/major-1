
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navItems = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function closeMenu() {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    document.body.classList.remove("menu-open");
}

menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

    if (isOpen) {
        closeMenu();
    } else {
        navLinks.classList.add("open");
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation menu");
        document.body.classList.add("menu-open");
    }
});

navItems.forEach((link) => {
    link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
        closeMenu();
    }
});

const revealElements = document.querySelectorAll(".reveal");
const skillFills = document.querySelectorAll(".skill-fill");

function animateSkills() {
    skillFills.forEach((fill) => {
        fill.style.width = fill.dataset.level;
    });
}

function revealElement(element) {
    element.classList.add("visible");

    if (element.closest("#skills")) {
        animateSkills();
    }
}

if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                revealElement(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12
    });

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach(revealElement);
    animateSkills();
}

const navigationObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            navItems.forEach((link) => {
                const isActive = link.getAttribute("href") === `#${entry.target.id}`;

                link.classList.toggle("active", isActive);

                if (isActive) {
                    link.setAttribute("aria-current", "location");
                } else {
                    link.removeAttribute("aria-current");
                }
            });
        }
    });
}, {
    rootMargin: "-25% 0px -60% 0px",
    threshold: 0
});

sections.forEach((section) => {
    navigationObserver.observe(section);
});

document.getElementById("currentYear").textContent = new Date().getFullYear();

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

const validationRules = {
    name: {
        element: document.getElementById("name"),
        validate(value) {
            return value.trim().length >= 2
                ? ""
                : "Please enter a name with at least 2 characters.";
        }
    },
    email: {
        element: document.getElementById("email"),
        validate(value) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
                ? ""
                : "Please enter a valid email address.";
        }
    },
    subject: {
        element: document.getElementById("subject"),
        validate(value) {
            return value.trim().length >= 3
                ? ""
                : "Please enter a subject with at least 3 characters.";
        }
    },
    message: {
        element: document.getElementById("message"),
        validate(value) {
            return value.trim().length >= 10
                ? ""
                : "Please enter a message with at least 10 characters.";
        }
    }
};

function validateField(field) {
    const error = field.validate(field.element.value);
    const errorElement = field.element.parentElement.querySelector(".field-error");

    field.element.classList.toggle("invalid", Boolean(error));
    field.element.setAttribute("aria-invalid", String(Boolean(error)));
    errorElement.textContent = error;

    return !error;
}

Object.values(validationRules).forEach((field) => {
    field.element.addEventListener("input", () => {
        validateField(field);
        formStatus.textContent = "";
        formStatus.className = "form-status";
    });

    field.element.addEventListener("blur", () => {
        validateField(field);
    });
});

contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const fields = Object.values(validationRules);
    const results = fields.map(validateField);
    const isValid = results.every(Boolean);

    formStatus.className = "form-status";

    if (!isValid) {
        formStatus.textContent = "Please correct the highlighted fields before continuing.";

        const firstInvalidField = fields.find((field) => {
            return field.element.getAttribute("aria-invalid") === "true";
        });

        if (firstInvalidField) {
            firstInvalidField.element.focus();
        }

        return;
    }

    const name = validationRules.name.element.value.trim();
    const email = validationRules.email.element.value.trim();
    const subject = validationRules.subject.element.value.trim();
    const message = validationRules.message.element.value.trim();

    const mailtoUrl = new URL("mailto:sktayyaba1408@gmail.com");
    mailtoUrl.searchParams.set("subject", subject);
    mailtoUrl.searchParams.set(
        "body",
        `Name: ${name}\nEmail: ${email}\n\n${message}`
    );

    formStatus.classList.add("success");
    formStatus.textContent = "Your details are valid. Opening your email application...";

    window.location.href = mailtoUrl.href;
});

contactForm.addEventListener("reset", () => {
    formStatus.textContent = "";

    Object.values(validationRules).forEach((field) => {
        field.element.classList.remove("invalid");
        field.element.removeAttribute("aria-invalid");
        field.element.parentElement.querySelector(".field-error").textContent = "";
    });
});
