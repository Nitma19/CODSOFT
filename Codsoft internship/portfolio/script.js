document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // THEME TOGGLE (LIGHT/DARK MODE)
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const bodyElement = document.body;
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    // Set initial theme
    if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
        setTheme('light');
    } else {
        setTheme('dark');
    }

    themeToggleBtn.addEventListener('click', () => {
        if (bodyElement.classList.contains('dark-theme')) {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    });

    function setTheme(theme) {
        const icon = themeToggleBtn.querySelector('i');
        if (theme === 'light') {
            bodyElement.classList.replace('dark-theme', 'light-theme');
            icon.className = 'fa-solid fa-sun';
            localStorage.setItem('theme', 'light');
        } else {
            bodyElement.classList.replace('light-theme', 'dark-theme');
            icon.className = 'fa-solid fa-moon';
            localStorage.setItem('theme', 'dark');
        }
    }

    // ==========================================================================
    // MOBILE NAVIGATION DRAWER
    // ==========================================================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    mobileMenuBtn.addEventListener('click', () => {
        const expanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
        mobileMenuBtn.setAttribute('aria-expanded', !expanded);
        mobileMenuBtn.classList.toggle('active');
        mobileNavMenu.classList.toggle('active');
        // Prevent background scrolling when menu is open
        bodyElement.style.overflow = expanded ? '' : 'hidden';
    });

    // Close menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            mobileMenuBtn.classList.remove('active');
            mobileNavMenu.classList.remove('active');
            bodyElement.style.overflow = '';
        });
    });

    // ==========================================================================
    // SCROLL REVEAL ANIMATIONS (IntersectionObserver)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Unobserve once animated to prevent repeat execution on scroll
                observer.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // ==========================================================================
    // ACTIVE NAVIGATION LINKS HIGHLIGHTING
    // ==========================================================================
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const navObserverOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Trigger near center-top of viewport
        threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                
                // Remove active class from all links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => {
        navObserver.observe(section);
    });

    // ==========================================================================
    // CONTACT FORM VALIDATION & MOCK SUBMISSION
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const statusMessage = document.getElementById('form-status-msg');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Reset statuses
        statusMessage.className = 'form-status';
        statusMessage.textContent = '';
        
        let isValid = true;
        const formFields = [
            { id: 'form-name', errorId: 'name-error', validation: (val) => val.trim().length > 0 },
            { id: 'form-email', errorId: 'email-error', validation: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) },
            { id: 'form-subject', errorId: 'subject-error', validation: (val) => val.trim().length > 0 },
            { id: 'form-message', errorId: 'message-error', validation: (val) => val.trim().length > 0 }
        ];

        formFields.forEach(field => {
            const input = document.getElementById(field.id);
            const errorSpan = document.getElementById(field.errorId);
            const formGroup = input.parentElement;
            
            if (!field.validation(input.value)) {
                formGroup.classList.add('invalid');
                isValid = false;
            } else {
                formGroup.classList.remove('invalid');
            }
            
            // Remove error styling on input typing
            input.addEventListener('input', () => {
                formGroup.classList.remove('invalid');
            });
        });

        if (!isValid) return;

        // Perform mock submission
        const submitBtn = document.getElementById('submit-form-btn');
        const submitBtnText = submitBtn.querySelector('span');
        const submitBtnIcon = submitBtn.querySelector('i');
        
        const originalText = submitBtnText.textContent;
        const originalIconClass = submitBtnIcon.className;

        // Loading state
        submitBtn.disabled = true;
        submitBtnText.textContent = 'Sending...';
        submitBtnIcon.className = 'fa-solid fa-circle-notch fa-spin';
        statusMessage.className = 'form-status';

        try {
            // Mock network latency (1.5 seconds)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show Success status
            statusMessage.className = 'form-status success';
            statusMessage.textContent = 'Thank you! Your message has been sent successfully.';
            
            // Reset form
            contactForm.reset();
        } catch (error) {
            statusMessage.className = 'form-status error';
            statusMessage.textContent = 'Oops! Something went wrong. Please try again later.';
        } finally {
            // Restore button state
            submitBtn.disabled = false;
            submitBtnText.textContent = originalText;
            submitBtnIcon.className = originalIconClass;
        }
    });
});
