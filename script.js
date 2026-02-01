// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Animate hamburger bars
        const bars = hamburger.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            if (hamburger.classList.contains('active')) {
                if (index === 0) {
                    bar.style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                } else if (index === 1) {
                    bar.style.opacity = '0';
                } else {
                    bar.style.transform = 'rotate(45deg) translate(-5px, -6px)';
                }
            } else {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            }
        });
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            const bars = hamburger.querySelectorAll('.bar');
            bars.forEach(bar => {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            });
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Navbar background change on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    });
    
    // Typing animation for hero: write plaintext into #hero-typed, keep highlighted name static
    const heroTyped = document.getElementById('hero-typed');
    if (heroTyped) {
        const baseText = "Hi, I'm"; // prefix text to type
        heroTyped.textContent = ''; // ensure empty
        let i = 0;

        // Use faster typing on small screens
        const baseDelay = window.innerWidth <= 420 ? 30 : 80;

        function typeWriter() {
            if (i < baseText.length) {
                heroTyped.textContent += baseText.charAt(i);
                i++;
                setTimeout(typeWriter, baseDelay);
            } else {
                // add a non-breaking space so highlight name sits nicely
                heroTyped.textContent = heroTyped.textContent.trim();
            }
        }

        setTimeout(typeWriter, 300);
        // Recompute delay on resize (keeps behavior responsive)
        window.addEventListener('resize', () => {
            // nothing needed immediately; typing speed applied on next load
        });
    }
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.skill-category, .project-card, .timeline-item, .contact-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Counter animation for stats
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + '+';
            }
        }
        
        updateCounter();
    }
    
    // Animate stats when they come into view
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statElements = entry.target.querySelectorAll('.stat h4');
                statElements.forEach((stat, index) => {
                    const targets = [10, 3, 5]; // Corresponding to the stats in HTML
                    animateCounter(stat, targets[index]);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const aboutStats = document.querySelector('.about-stats');
    if (aboutStats) {
        statsObserver.observe(aboutStats);
    }
    
    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Simple form validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Submit form: if you provide a Formspree endpoint below it will POST to that endpoint
            // otherwise the code falls back to the previous simulated behaviour.
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;

            // TODO: replace with your Formspree endpoint (e.g. https://formspree.io/f/XXXXXXXX)
            const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xkgvlowb';

            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            if (FORMSPREE_ENDPOINT) {
                // Build FormData payload
                const payload = new FormData();
                payload.append('name', name);
                payload.append('email', email);
                payload.append('subject', subject);
                payload.append('message', message);

                fetch(FORMSPREE_ENDPOINT, {
                    method: 'POST',
                    body: payload,
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
                        contactForm.reset();
                    } else {
                        // Try to read JSON error message if any
                        response.json().then(data => {
                            const errorMsg = (data && data.error) ? data.error : 'Submission failed. Please try again later.';
                            showNotification(errorMsg, 'error');
                        }).catch(() => {
                            showNotification('Submission failed. Please try again later.', 'error');
                        });
                    }
                })
                .catch(err => {
                    console.error('Form submit error:', err);
                    showNotification('Network error. Please try again later.', 'error');
                })
                .finally(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                });

            } else {
                // Fallback: simulate send (original behaviour)
                setTimeout(() => {
                    showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
                    contactForm.reset();
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }, 2000);
            }
        });
    }
    
    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notification if any
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Close button functionality
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 5000);
    }
    
    // Skill items hover effect - removed scaling to prevent overflow
    // CSS now handles hover effects with contained animations
    
    // Project cards tilt effect - contained and subtle
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', function(e) {
            // Only apply tilt on larger screens to prevent issues
            if (window.innerWidth < 768) return;
            
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Reduced rotation for more subtle effect
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(5px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });

        // Add click functionality to go to the project's GitHub repo
        card.addEventListener('click', function(e) {
            // Only open repo if not clicking on a link inside the card
            if (!e.target.closest('a')) {
                const repoLink = this.querySelector('a[href*="github.com"]');
                if (repoLink && repoLink.href !== '#') {
                    window.open(repoLink.href, '_blank');
                }
            }
        });
    });
    
    // Add loading animation
    window.addEventListener('load', function() {
        const loader = document.createElement('div');
        loader.id = 'page-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-spinner"></div>
                <p>Loading Portfolio...</p>
            </div>
        `;
        
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            color: white;
            font-family: 'Poppins', sans-serif;
            transition: opacity 0.5s ease;
        `;
        
        const loaderContent = loader.querySelector('.loader-content');
        loaderContent.style.cssText = `
            text-align: center;
        `;
        
        const spinner = loader.querySelector('.loader-spinner');
        spinner.style.cssText = `
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        `;
        
        // Add spinner animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(loader);
        
        // Remove loader after a short delay
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
            }, 500);
        }, 1500);
    });
    
    // Add parallax effect to hero section on larger screens only
    function handleParallax() {
        const minWidth = 900; // disable parallax on small/touch screens
        if (window.innerWidth < minWidth) {
            // Reset any transforms
            const hero = document.querySelector('.hero');
            const heroContent = document.querySelector('.hero-content');
            if (hero) hero.style.transform = '';
            if (heroContent) heroContent.style.transform = '';
            return;
        }

        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');

        if (hero && heroContent) {
            hero.style.transform = `translateY(${scrolled * 0.2}px)`;
            heroContent.style.transform = `translateY(${scrolled * 0.08}px)`;
        }
    }

    window.addEventListener('scroll', handleParallax);
    window.addEventListener('resize', handleParallax);
    // Call once to set correct state on load
    handleParallax();
    
    // Add active navigation link highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Add CSS for active nav link
    const navStyle = document.createElement('style');
    navStyle.textContent = `
        .nav-link.active {
            color: #3498db !important;
        }
        .nav-link.active::after {
            width: 100% !important;
        }
    `;
    document.head.appendChild(navStyle);
});