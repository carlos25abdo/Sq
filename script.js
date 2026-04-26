gsap.registerPlugin(ScrollTrigger);

const loader = document.getElementById("loader");
const nav = document.querySelector(".site-nav");
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");
const cursorGlow = document.querySelector(".cursor-glow");
const tiltCards = document.querySelectorAll(".tilt-card");
const countItems = document.querySelectorAll("[data-count]");
const sections = document.querySelectorAll("main section[id]");

window.addEventListener("load", () => {
    const loaderTl = gsap.timeline({
        onComplete: () => {
            loader.style.display = "none";
            runIntroAnimations();
            initCounters();
        }
    });

    loaderTl
        .from(".loader-photo", { y: 24, opacity: 0, duration: 0.8, ease: "power3.out" })
        .from(".loader-kicker, .loader-name, .loader-en-name", { y: 18, opacity: 0, stagger: 0.12, duration: 0.6 }, "-=0.35")
        .fromTo(".loader-line span", { xPercent: -120 }, { xPercent: 250, duration: 1.4, ease: "power2.inOut" }, "-=0.2")
        .to("#loader", { opacity: 0, duration: 0.8, delay: 0.1 });
});

function runIntroAnimations() {
    gsap.set(".reveal-up", { y: 32, opacity: 0 });
    gsap.set(".reveal-right", { x: 40, opacity: 0 });
    gsap.set(".reveal-left", { x: -40, opacity: 0 });
    gsap.set(".reveal-scale", { scale: 0.92, opacity: 0 });

    gsap.to(".hero .reveal-up", {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.14,
        ease: "power3.out"
    });

    gsap.to(".hero .reveal-right, .hero .reveal-left", {
        x: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.16,
        ease: "power3.out",
        delay: 0.25
    });

    gsap.to(".hero .reveal-scale", {
        scale: 1,
        opacity: 1,
        duration: 1.1,
        ease: "expo.out",
        delay: 0.18
    });

    gsap.to(".orb-one", {
        y: 24,
        x: -18,
        repeat: -1,
        yoyo: true,
        duration: 5.2,
        ease: "sine.inOut"
    });

    gsap.to(".orb-two", {
        y: -20,
        x: 16,
        repeat: -1,
        yoyo: true,
        duration: 6.4,
        ease: "sine.inOut"
    });
}

document.querySelectorAll(".section-shell").forEach((section) => {
    const ups = section.querySelectorAll(".reveal-up:not(.hero .reveal-up)");
    const rights = section.querySelectorAll(".reveal-right:not(.hero .reveal-right)");
    const lefts = section.querySelectorAll(".reveal-left:not(.hero .reveal-left)");
    const scales = section.querySelectorAll(".reveal-scale:not(.hero .reveal-scale)");

    if (ups.length) {
        gsap.to(ups, {
            scrollTrigger: { trigger: section, start: "top 78%" },
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: "power2.out"
        });
    }

    if (rights.length) {
        gsap.to(rights, {
            scrollTrigger: { trigger: section, start: "top 78%" },
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out"
        });
    }

    if (lefts.length) {
        gsap.to(lefts, {
            scrollTrigger: { trigger: section, start: "top 78%" },
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out"
        });
    }

    if (scales.length) {
        gsap.to(scales, {
            scrollTrigger: { trigger: section, start: "top 78%" },
            scale: 1,
            opacity: 1,
            duration: 0.95,
            ease: "expo.out"
        });
    }
});

window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 40);
});

menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
});

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        document.body.classList.remove("menu-open");
        menuToggle.setAttribute("aria-expanded", "false");
    });
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) {
            return;
        }

        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
    });
}, { threshold: 0.45 });

sections.forEach((section) => observer.observe(section));

function initCounters() {
    countItems.forEach((item) => {
        const target = Number(item.dataset.count || 0);

        gsap.fromTo(item,
            { innerText: 0 },
            {
                innerText: target,
                duration: 2,
                ease: "power2.out",
                snap: { innerText: 1 },
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%"
                },
                onUpdate: function () {
                    item.textContent = `${Math.floor(this.targets()[0].innerText)}+`;
                },
                onComplete: () => {
                    item.textContent = `${target}+`;
                }
            }
        );
    });
}

tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateX = ((y / rect.height) - 0.5) * -8;
        const rotateY = ((x / rect.width) - 0.5) * 8;

        gsap.to(card, {
            rotateX,
            rotateY,
            transformPerspective: 900,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    card.addEventListener("mouseleave", () => {
        gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.4,
            ease: "power3.out"
        });
    });
});

document.addEventListener("mousemove", (event) => {
    if (!cursorGlow) {
        return;
    }

    cursorGlow.style.opacity = "1";
    gsap.to(cursorGlow, {
        x: event.clientX,
        y: event.clientY,
        duration: 0.35,
        ease: "power2.out"
    });
});

document.addEventListener("mouseleave", () => {
    if (cursorGlow) {
        cursorGlow.style.opacity = "0";
    }
});

document.querySelectorAll(".magnetic").forEach((button) => {
    button.addEventListener("mousemove", (event) => {
        const rect = button.getBoundingClientRect();
        const moveX = (event.clientX - rect.left - rect.width / 2) * 0.16;
        const moveY = (event.clientY - rect.top - rect.height / 2) * 0.16;

        gsap.to(button, {
            x: moveX,
            y: moveY,
            duration: 0.25,
            ease: "power2.out"
        });
    });

    button.addEventListener("mouseleave", () => {
        gsap.to(button, {
            x: 0,
            y: 0,
            duration: 0.35,
            ease: "power3.out"
        });
    });
});
