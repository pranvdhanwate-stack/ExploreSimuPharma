/* ============================================
   SimuPharma - Main Interactive Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Initialize Animation Library (AOS)
    // This reveals the hidden elements
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,            // Animation happens only once
        offset: 50,            // Offset (in px) from the original trigger point
        delay: 50,             // Values from 0 to 3000, with step 50ms
    });

    // 2. Navigation Logic
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky Navbar on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Scroll Top Button Visibility
        toggleScrollTopBtn();
    });

    // Mobile Menu Toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Animate hamburger lines
        const spans = hamburger.querySelectorAll('span');
        if (hamburger.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            // Reset hamburger icon
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // 3. Instrument Tab Switching (HPLC / FTIR / GC)
    const tabBtns = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.instrument-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and panels
            tabBtns.forEach(b => b.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            // Show corresponding panel
            const targetId = btn.getAttribute('data-tab');
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
                
                // Re-trigger animations for the new panel elements
                // This makes the graphs draw again when switching tabs
                const animatedElements = targetPanel.querySelectorAll('.peak, .gc-peak, .spectrum-line');
                animatedElements.forEach(el => {
                    el.style.animation = 'none';
                    el.offsetHeight; /* trigger reflow */
                    el.style.animation = null; 
                });
            }
        });
    });

    // 4. Number Counter Animation
    // Animates numbers from 0 to final value (e.g., 98.7%, ₹35-100L)
    const animateValue = (obj, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    // specific observer for stats to trigger counting
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Logic to handle different types of numbers could go here
                // For this demo, we rely on CSS animations, but JS 
                // ensures the section is viewed before triggering
                entry.target.classList.add('viewed');
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-item, .impact-card').forEach(item => {
        statObserver.observe(item);
    });

    // 5. Scroll to Top Functionality
    const scrollTopBtn = document.getElementById('scrollTop');

    function toggleScrollTopBtn() {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
    }

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 6. Hero Parallax Effect (Mouse Movement)
    // Moves the floating cards slightly based on mouse position
    const heroSection = document.querySelector('.hero');
    const floatingCards = document.querySelectorAll('.floating-card');
    const visualGlow = document.querySelector('.visual-glow');

    heroSection.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        floatingCards.forEach((card, index) => {
            const speed = (index + 1) * 20;
            const xOffset = (x - 0.5) * speed;
            const yOffset = (y - 0.5) * speed;
            
            // Apply translation while keeping the float animation
            // We use CSS variable to not override the keyframe animation completely
            // Or simpler: just standard transform if keyframes aren't essential for hover
            // Ideally, we'd use a wrapper, but simple parallax works:
            card.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });

        if (visualGlow) {
            visualGlow.style.transform = `translate(-50%, -50%) translate(${(x-0.5)*30}px, ${(y-0.5)*30}px)`;
        }
    });

    // Reset transform on mouse leave
    heroSection.addEventListener('mouseleave', () => {
        floatingCards.forEach(card => {
            card.style.transform = 'translate(0, 0)';
        });
        if (visualGlow) {
            visualGlow.style.transform = 'translate(-50%, -50%)';
        }
    });

    // 7. Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Calculate offset for fixed header
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
                
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                    const spans = hamburger.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            }
        });
    });

    // 8. Dynamic Particle Background (Simple Canvas Implementation)
    // Only if the particles container exists
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '1';
        particlesContainer.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let particles = [];

        // Resize handling
        const resizeCanvas = () => {
            canvas.width = particlesContainer.offsetWidth;
            canvas.height = particlesContainer.offsetHeight;
        };
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Particle Class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.color = `rgba(99, 102, 241, ${Math.random() * 0.5})`; // Primary color
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.size > 0.2) this.size -= 0.01;
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Animation Loop
        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (particles.length < 50) {
                particles.push(new Particle());
            }
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                if (particles[i].size <= 0.2) {
                    particles.splice(i, 1);
                    i--;
                }
            }
            requestAnimationFrame(animateParticles);
        };
        animateParticles();
    }
});