document.addEventListener('DOMContentLoaded', function() {
    // Page transition — blur dissolve (Index → ATS only)
    const pageTransition = document.getElementById('pageTransition');
    if (pageTransition) {
        document.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http') || link.target === '_blank') return;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                pageTransition.classList.add('active');
                document.body.style.filter = 'blur(8px)';
                document.body.style.transition = 'filter 0.4s ease';
                setTimeout(() => { window.location.href = href; }, 400);
            });
        });
    }

    // Local time
    const localTime = document.getElementById('localTime');
    if (localTime) {
        function updateTime() {
            const now = new Date();
            localTime.textContent = now.toLocaleTimeString('en-US', {
                hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
            });
        }
        updateTime();
        setInterval(updateTime, 1000);
    }

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Resume modal
    const resumeBtn = document.getElementById('resumeBtn');
    const resumeModal = document.getElementById('resumeModal');
    const resumeClose = document.getElementById('resumeClose');
    const resumeBackdrop = document.getElementById('resumeBackdrop');

    if (resumeBtn && resumeModal) {
        resumeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            resumeModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        resumeClose.addEventListener('click', () => {
            resumeModal.classList.remove('active');
            document.body.style.overflow = '';
        });
        resumeBackdrop.addEventListener('click', () => {
            resumeModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // About modal
    const aboutBtn = document.getElementById('aboutBtn');
    const aboutModal = document.getElementById('aboutModal');
    const modalClose = document.getElementById('modalClose');

    if (aboutBtn && aboutModal && modalClose) {
        aboutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            aboutModal.classList.add('active');
        });

        modalClose.addEventListener('click', () => {
            aboutModal.classList.remove('active');
        });

        aboutModal.addEventListener('click', (e) => {
            if (e.target === aboutModal) {
                aboutModal.classList.remove('active');
            }
        });
    }

    // Gradient trail cursor
    const trailContainer = document.getElementById('cursorTrail');
    const trailCount = 8;
    const trailDots = [];
    const mousePos = { x: 0, y: 0 };
    const dotPositions = [];

    for (let i = 0; i < trailCount; i++) {
        const dot = document.createElement('div');
        dot.className = 'trail-dot';
        dot.style.opacity = (1 - i / trailCount) * 0.5;
        dot.style.width = (8 - i * 0.8) + 'px';
        dot.style.height = (8 - i * 0.8) + 'px';
        trailContainer.appendChild(dot);
        trailDots.push(dot);
        dotPositions.push({ x: 0, y: 0 });
    }

    document.addEventListener('mousemove', (e) => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
    });

    function animateTrail() {
        dotPositions[0].x += (mousePos.x - dotPositions[0].x) * 0.35;
        dotPositions[0].y += (mousePos.y - dotPositions[0].y) * 0.35;

        for (let i = 1; i < trailCount; i++) {
            dotPositions[i].x += (dotPositions[i - 1].x - dotPositions[i].x) * 0.25;
            dotPositions[i].y += (dotPositions[i - 1].y - dotPositions[i].y) * 0.25;
        }

        for (let i = 0; i < trailCount; i++) {
            trailDots[i].style.left = dotPositions[i].x + 'px';
            trailDots[i].style.top = dotPositions[i].y + 'px';
        }

        requestAnimationFrame(animateTrail);
    }
    animateTrail();

    // Page loader
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-logo">LF</div>
            <div class="loader-line"></div>
            <div class="loader-sub">Portfolio</div>
        </div>
    `;
    document.body.prepend(loader);

    setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 600);
    }, 2000);

    // Magnetic effect — all interactive elements
    const magneticElements = document.querySelectorAll('.cta-button');
    
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            el.style.transition = 'none';
        });

        el.addEventListener('mouseleave', () => {
            el.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            el.style.transform = 'translate(0, 0)';
        });
    });

    // Tilt effect on cards
    const tiltElements = document.querySelectorAll('.hobby-item, .project-card');
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const tiltX = (y - 0.5) * 2;
            const tiltY = (x - 0.5) * -2;
            el.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            el.style.transition = 'none';
        });

        el.addEventListener('mouseleave', () => {
            el.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    // Smooth anchor scrolling with offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });

    // Glass cards parallax
    const heroVisual = document.getElementById('heroVisual');
    const glassCards = document.querySelectorAll('.glass-card');

    if (heroVisual) {
        document.addEventListener('mousemove', (e) => {
            const rect = heroVisual.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const moveX = (e.clientX - centerX) / 30;
            const moveY = (e.clientY - centerY) / 30;

            glassCards.forEach(card => {
                const speed = parseFloat(card.dataset.speed) || 2;
                const x = moveX * (speed / 3);
                const y = moveY * (speed / 3);
                card.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }

    // Navbar scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Scroll counters
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    function animateCounters() {
        statNumbers.forEach(num => {
            const target = parseInt(num.dataset.target);
            const duration = 2000;
            const start = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                num.textContent = Math.floor(eased * target);

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    num.textContent = target;
                }
            }
            requestAnimationFrame(update);
        });
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersStarted) {
                countersStarted = true;
                animateCounters();
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // Magnetic buttons
    const magneticBtns = document.querySelectorAll('.cta-button, .resume-btn');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            btn.style.transition = 'transform 0.1s ease';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
            btn.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Back to top button
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Skill bars animation
    const skillFills = document.querySelectorAll('.skill-fill');
    let skillsAnimated = false;

    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !skillsAnimated) {
                skillsAnimated = true;
                skillFills.forEach(fill => {
                    fill.style.width = fill.dataset.width + '%';
                });
            }
        });
    }, { threshold: 0.3 });

    const skillsSection = document.querySelector('.skills-grid');
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    // Scroll reveal - sections
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('section').forEach(el => {
        sectionObserver.observe(el);
    });

    // Scroll reveal - staggered items
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const siblings = entry.target.parentElement.children;
                const index = Array.from(siblings).indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 100);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.experience-item, .skill-category, .project-card, .hobby-item, .creative-item').forEach(el => {
        staggerObserver.observe(el);
    });

    // Active nav
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === `#${current}`) {
                link.style.color = '#ffffff';
            }
        });

        const sideDots = document.querySelectorAll('.side-dot');
        sideDots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('data-section') === current) {
                dot.classList.add('active');
            }
        });
    });

    // Parallax on hero
    const heroContent = document.querySelector('.hero-content');
    const heroGrid = document.querySelector('.hero-grid');
    const heroVisualEl = document.querySelector('.hero-visual');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroContent.style.opacity = 1 - (scrolled / 600);
        }
        if (heroGrid) {
            heroGrid.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
        if (heroVisualEl) {
            heroVisualEl.style.transform = `translateY(calc(-50% + ${scrolled * 0.15}px))`;
            heroVisualEl.style.opacity = 1 - (scrolled / 800);
        }
    });

    // Form submission
    const form = document.querySelector('.contact-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = this.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Sent ✓';
        btn.style.background = '#333';
        btn.style.color = '#fff';

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.style.color = '';
            this.reset();
        }, 2500);
    });

    // Stagger animations - removed, handled by staggerObserver

    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        document.querySelectorAll('.mobile-nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Typewriter effect for role
    const typingRole = document.getElementById('typingRole');
    if (typingRole) {
        const roles = ['IT Specialist', 'Web Developer', 'Graphics Designer', 'Freelance Designer'];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeDelay = 100;

        function typeEffect() {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                typingRole.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingRole.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                isDeleting = true;
                typeDelay = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeDelay = 300;
            } else {
                typeDelay = isDeleting ? 40 : 80;
            }

            setTimeout(typeEffect, typeDelay);
        }

        setTimeout(typeEffect, 2000);
    }

    // Particle canvas background
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 60;
        const connectionDistance = 120;
        const mouseRepelRadius = 150;
        let mouse = { x: null, y: null };

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        document.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        function getParticleColor() {
            return document.documentElement.getAttribute('data-theme') === 'light'
                ? 'rgba(15, 15, 15, 0.5)'
                : 'rgba(255, 255, 255, 0.5)';
        }

        function getLineColor() {
            return document.documentElement.getAttribute('data-theme') === 'light'
                ? 'rgba(15, 15, 15, 0.15)'
                : 'rgba(255, 255, 255, 0.15)';
        }

        function createParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    r: Math.random() * 2 + 1
                });
            }
        }
        createParticles();

        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const colorBase = getLineColor();

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < connectionDistance) {
                        const opacity = (1 - dist / connectionDistance);
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = colorBase.replace('0.15', (0.15 * opacity).toFixed(3));
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            const pColor = getParticleColor();
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = pColor;
                ctx.fill();
            });
        }

        function updateParticles() {
            particles.forEach(p => {
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = p.x - mouse.x;
                    const dy = p.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouseRepelRadius) {
                        const force = (mouseRepelRadius - dist) / mouseRepelRadius;
                        p.vx += (dx / dist) * force * 0.5;
                        p.vy += (dy / dist) * force * 0.5;
                    }
                }

                p.x += p.vx;
                p.y += p.vy;

                p.vx *= 0.99;
                p.vy *= 0.99;

                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
            });
        }

        function animate() {
            updateParticles();
            drawParticles();
            requestAnimationFrame(animate);
        }
        animate();
    }

    // Escape key closes modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (resumeModal && resumeModal.classList.contains('active')) {
                resumeModal.classList.remove('active');
                document.body.style.overflow = '';
            }
            if (aboutModal && aboutModal.classList.contains('active')) {
                aboutModal.classList.remove('active');
            }
        }
    });

    // Easter egg
    let keys = [];
    const sequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    document.addEventListener('keydown', (e) => {
        keys.push(e.keyCode);
        if (keys.length > 10) keys.shift();
        if (JSON.stringify(keys) === JSON.stringify(sequence)) {
            document.body.style.transition = 'filter 0.5s';
            document.body.style.filter = 'invert(1)';
            setTimeout(() => { document.body.style.filter = ''; }, 2000);
        }
    });

    // Creative tabs
    const creativeTabs = document.querySelectorAll('.creative-tab');
    const creativeItems = document.querySelectorAll('.creative-item');
    creativeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            creativeTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const tabName = tab.dataset.tab;
            creativeItems.forEach(item => {
                if (item.dataset.tab === tabName) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // Lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    let currentLightboxIndex = 0;
    let visibleItems = [];

    function updateVisibleItems() {
        visibleItems = Array.from(document.querySelectorAll('.creative-item:not(.hidden) img'));
    }

    function openLightbox(index) {
        updateVisibleItems();
        currentLightboxIndex = index;
        lightboxImg.src = visibleItems[currentLightboxIndex].src;
        lightboxImg.alt = visibleItems[currentLightboxIndex].alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function prevImage() {
        currentLightboxIndex = (currentLightboxIndex - 1 + visibleItems.length) % visibleItems.length;
        lightboxImg.src = visibleItems[currentLightboxIndex].src;
    }

    function nextImage() {
        currentLightboxIndex = (currentLightboxIndex + 1) % visibleItems.length;
        lightboxImg.src = visibleItems[currentLightboxIndex].src;
    }

    document.querySelectorAll('.creative-item').forEach((item, i) => {
        item.addEventListener('click', () => {
            updateVisibleItems();
            const imgIndex = visibleItems.indexOf(item.querySelector('img'));
            if (imgIndex !== -1) openLightbox(imgIndex);
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', prevImage);
    lightboxNext.addEventListener('click', nextImage);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
    });
});
