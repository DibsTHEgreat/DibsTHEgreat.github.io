// ===================================
// Smooth Scrolling Navigation
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            const navMenu = document.getElementById('nav-menu');
            const mobileToggle = document.getElementById('mobile-menu-toggle');
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        }
    });
});

// ===================================
// Mobile Menu Toggle
// ===================================
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const navMenu = document.getElementById('nav-menu');

mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    }
});

// ===================================
// Navbar Background on Scroll
// ===================================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===================================
// Scroll Animation Observer
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, observerOptions);

// Observe all sections for fade-in animation
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('fade-in-section');
        observer.observe(section);
    });

    // Observe timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.classList.add('fade-in-section');
        item.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(item);
    });

    // Observe skill categories
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach((category, index) => {
        category.classList.add('fade-in-section');
        category.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(category);
    });

    // Observe education cards
    const educationCards = document.querySelectorAll('.education-card');
    educationCards.forEach((card, index) => {
        card.classList.add('fade-in-section');
        card.style.transitionDelay = `${index * 0.15}s`;
        observer.observe(card);
    });

    // Observe contact cards
    const contactCards = document.querySelectorAll('.contact-card');
    contactCards.forEach((card, index) => {
        card.classList.add('fade-in-section');
        card.style.transitionDelay = `${index * 0.15}s`;
        observer.observe(card);
    });
});

// ===================================
// Dynamic Year in Footer
// ===================================
document.getElementById('current-year').textContent = new Date().getFullYear();

// ===================================
// Parallax Effect for Hero Background
// ===================================
window.addEventListener('scroll', () => {
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        const scrolled = window.pageYOffset;
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// ===================================
// Active Navigation Link Highlighting
// ===================================
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// ===================================
// Typing Effect for Hero Subtitle (Optional Enhancement)
// ===================================
const subtitleElement = document.querySelector('.hero-subtitle');
if (subtitleElement) {
    const originalText = subtitleElement.textContent;
    const roles = [
        'Software Developer | .NET Specialist | Full-Stack Engineer',
        'Building Scalable Solutions | Cloud Enthusiast',
        'C# Developer | Web Designer | Problem Solver'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentRole = roles[0];

    function typeEffect() {
        const currentText = currentRole.substring(0, charIndex);
        subtitleElement.textContent = currentText;

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            currentRole = roles[roleIndex];
            typeSpeed = 500; // Pause before typing next
        }

        charIndex += isDeleting ? -1 : 1;

        setTimeout(typeEffect, typeSpeed);
    }

    // Uncomment the line below to enable typing effect
    // setTimeout(typeEffect, 1000);
}

// ===================================
// Smooth Reveal for Elements
// ===================================
const revealElements = document.querySelectorAll('.highlight-item, .cert-item');

revealElements.forEach((element, index) => {
    element.classList.add('fade-in-section');
    element.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(element);
});

// ===================================
// Console Easter Egg
// ===================================
console.log('%c👋 Hello, Developer!', 'color: #6366f1; font-size: 20px; font-weight: bold;');
console.log('%cLooking at the code? I like your style! 🚀', 'color: #8b5cf6; font-size: 14px;');
console.log('%cFeel free to reach out: pateliyandivya@gmail.com', 'color: #ec4899; font-size: 12px;');
