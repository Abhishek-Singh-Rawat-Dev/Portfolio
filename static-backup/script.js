document.addEventListener('DOMContentLoaded', () => {
    // --- THEME TOGGLER ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'light') {
        htmlElement.setAttribute('data-theme', 'light');
    } else if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        htmlElement.setAttribute('data-theme', 'dark');
    } else {
        htmlElement.setAttribute('data-theme', 'light'); // Default fallback
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        let newTheme = 'dark';
        if (currentTheme === 'dark') {
            newTheme = 'light';
        }
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // --- MOBILE MENU TOGGLE ---
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            const icon = menuToggle.querySelector('i');
            if (navMenu.classList.contains('open')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });

        // Close menu when clicking links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                menuToggle.querySelector('i').className = 'fas fa-bars';
            });
        });
    }

    // --- DYNAMIC TYPING EFFECT ---
    const words = ["Software Engineer", "Problem Solver", "Competitive Programmer", "Full-Stack Developer"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpan = document.getElementById('typed-text');
    let typingSpeed = 100;

    function typeEffect() {
        if (!typingSpan) return;
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typingSpan.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingSpan.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 150;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at full word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Pause before typing next word
        }

        setTimeout(typeEffect, typingSpeed);
    }
    
    if (typingSpan) {
        setTimeout(typeEffect, 1000);
    }

    // --- PROJECT FILTERING ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card-wrapper');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    // Trigger reflow for animation
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        card.style.transition = 'all 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // --- ACTIVE LINK ON SCROLL ---
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                const correspondingLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);
                if (correspondingLink) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    correspondingLink.classList.add('active');
                }
            }
        });
    });

    // --- CONTACT FORM HANDLER ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            // Show Loading State
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Mock API send delay
            setTimeout(() => {
                try {
                    // Success display
                    formStatus.className = 'form-status success';
                    formStatus.innerHTML = '<i class="fas fa-check-circle"></i> Message sent successfully! I will get back to you soon.';
                    contactForm.reset();
                } catch (err) {
                    // Error display
                    formStatus.className = 'form-status error';
                    formStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> Something went wrong. Please email me directly.';
                } finally {
                    // Reset Button State
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                    
                    // Hide alert after 5 seconds
                    setTimeout(() => {
                        formStatus.style.display = 'none';
                    }, 5000);
                }
            }, 1500);
        });
    }
});
