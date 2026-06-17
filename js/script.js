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

    // Scroll progress
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = (scrollTop / scrollHeight) * 100;
            scrollProgress.style.width = progress + '%';
        });
    }

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

    // Form submission — Web3Forms
    const form = document.querySelector('.contact-form');
    const formSuccess = document.getElementById('formSuccess');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = this.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;

        const formData = new FormData(this);
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        }).then(() => {
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Sent!';
            btn.style.background = '#333';
            btn.style.color = '#fff';
            formSuccess.classList.add('active');
            form.reset();
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.style.color = '';
                btn.disabled = false;
                formSuccess.classList.remove('active');
            }, 3000);
        }).catch(() => {
            btn.innerHTML = '<i class="fa-solid fa-xmark"></i> Error';
            btn.style.background = '#dc2626';
            btn.style.color = '#fff';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.style.color = '';
                btn.disabled = false;
            }, 3000);
        });
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

    // Feedback modal
    const feedbackBtn = document.createElement('button');
    feedbackBtn.className = 'feedback-toggle';
    feedbackBtn.id = 'feedbackBtn';
    feedbackBtn.title = 'Send Feedback';
    feedbackBtn.innerHTML = '<i class="fa-solid fa-comment-dots"></i>';
    document.body.appendChild(feedbackBtn);

    const feedbackModal = document.getElementById('feedbackModal');
    const feedbackClose = document.getElementById('feedbackClose');
    const feedbackBackdrop = document.getElementById('feedbackBackdrop');
    const starRating = document.getElementById('starRating');
    const ratingInput = document.getElementById('ratingInput');
    const feedbackForm = document.querySelector('.feedback-form');
    const feedbackSuccess = document.getElementById('feedbackSuccess');

    if (feedbackBtn && feedbackModal) {
        feedbackBtn.addEventListener('click', () => {
            feedbackModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        feedbackClose.addEventListener('click', () => {
            feedbackModal.classList.remove('active');
            document.body.style.overflow = '';
        });
        feedbackBackdrop.addEventListener('click', () => {
            feedbackModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Star rating
    if (starRating) {
        const stars = starRating.querySelectorAll('i');
        stars.forEach(star => {
            star.addEventListener('mouseenter', () => {
                const rating = parseInt(star.dataset.rating);
                stars.forEach((s, i) => {
                    s.classList.toggle('active', i < rating);
                });
            });
            star.addEventListener('click', () => {
                ratingInput.value = star.dataset.rating;
            });
        });
        starRating.addEventListener('mouseleave', () => {
            const rating = parseInt(ratingInput.value) || 0;
            stars.forEach((s, i) => {
                s.classList.toggle('active', i < rating);
            });
        });
    }

    // Feedback form submission
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            btn.disabled = true;

            const formData = new FormData(this);
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            }).then(() => {
                feedbackSuccess.classList.add('active');
                feedbackForm.reset();
                const stars = starRating.querySelectorAll('i');
                stars.forEach(s => s.classList.remove('active'));
                ratingInput.value = '';
                setTimeout(() => {
                    feedbackModal.classList.remove('active');
                    document.body.style.overflow = '';
                    feedbackSuccess.classList.remove('active');
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }, 2500);
            }).catch(() => {
                btn.innerHTML = '<i class="fa-solid fa-xmark"></i> Error';
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }, 3000);
            });
        });
    }

    // Cursor tooltip on project cards
    const cursorTooltip = document.getElementById('cursorTooltip');
    if (cursorTooltip) {
        let tooltipVisible = false;

        document.addEventListener('mousemove', (e) => {
            if (tooltipVisible) {
                cursorTooltip.style.left = e.clientX + 'px';
                cursorTooltip.style.top = e.clientY + 'px';
            }
        });

        document.querySelectorAll('.project-thumb-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                cursorTooltip.textContent = 'Click to view';
                cursorTooltip.classList.add('active');
                tooltipVisible = true;
                document.body.style.cursor = 'none';
            });
            card.addEventListener('mouseleave', () => {
                cursorTooltip.classList.remove('active');
                tooltipVisible = false;
                document.body.style.cursor = '';
            });
        });
    }

    // Share widget
    const shareToggle = document.getElementById('shareToggle');
    const shareOptions = document.querySelector('.share-options');
    const copyLink = document.getElementById('copyLink');

    if (shareToggle && shareOptions) {
        shareToggle.addEventListener('click', () => {
            shareToggle.classList.toggle('active');
            shareOptions.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.share-widget')) {
                shareToggle.classList.remove('active');
                shareOptions.classList.remove('active');
            }
        });
    }

    if (copyLink) {
        copyLink.addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href).then(() => {
                const toast = document.createElement('div');
                toast.className = 'share-copied';
                toast.textContent = 'Link copied!';
                document.body.appendChild(toast);
                requestAnimationFrame(() => toast.classList.add('active'));
                setTimeout(() => {
                    toast.classList.remove('active');
                    setTimeout(() => toast.remove(), 300);
                }, 1500);
            });
        });
    }

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

    // Command Palette
    const cmdPalette = document.getElementById('cmdPalette');
    const cmdInput = document.getElementById('cmdInput');
    const cmdBody = document.getElementById('cmdBody');
    const cmdNavResults = document.getElementById('cmdNavResults');
    const cmdProjectResults = document.getElementById('cmdProjectResults');
    const cmdSkillResults = document.getElementById('cmdSkillResults');
    const cmdLinkResults = document.getElementById('cmdLinkResults');

    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const cmdKeyLabel = isMac ? '⌘K' : 'Ctrl+K';
    document.getElementById('cmdShortcut').textContent = cmdKeyLabel;
    document.querySelector('.cmd-palette-footer').innerHTML = `<span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span><span><kbd>↵</kbd> Select</span><span><kbd>ESC</kbd> Close</span>`;

    const cmdData = {
        nav: [
            { icon: 'fa-solid fa-house', title: 'Home', desc: 'Hero section', href: '#hero' },
            { icon: 'fa-solid fa-briefcase', title: 'Experience', desc: 'Work history', href: '#experience' },
            { icon: 'fa-solid fa-quote-left', title: 'Testimonials', desc: 'What people say', href: '#testimonials' },
            { icon: 'fa-solid fa-laptop-code', title: 'Tech Stack', desc: 'Skills & technologies', href: '#techstack' },
            { icon: 'fa-solid fa-graduation-cap', title: 'Education', desc: 'Academic background', href: '#education' },
            { icon: 'fa-solid fa-diagram-project', title: 'Projects', desc: 'Featured work', href: '#projects' },
            { icon: 'fa-solid fa-palette', title: 'Creative Work', desc: 'Digital art & graphics', href: '#creative' },
            { icon: 'fa-solid fa-star', title: 'Hobbies', desc: 'Personal interests', href: '#hobbies' },
            { icon: 'fa-solid fa-paper-plane', title: 'Contact', desc: 'Get in touch', href: '#contact' },
        ],
        projects: [
            { icon: 'fa-solid fa-globe', title: 'Portfolio Website', desc: 'Laravel + Bootstrap', href: '#projects' },
            { icon: 'fa-solid fa-clipboard-list', title: 'Applicant Tracking System', desc: 'Capstone project', href: 'pages/ats-project.html' },
            { icon: 'fa-solid fa-gamepad', title: "Yeyeniya's Pilot Service", desc: 'Magic Chess service', href: 'https://yeyeniya.vercel.app/', external: true },
            { icon: 'fa-solid fa-wallet', title: 'Personal Budget Tracker', desc: 'Laravel + Vue 3 + Inertia', href: '#projects' },
        ],
        skills: [
            { icon: 'fa-brands fa-html5', title: 'HTML', desc: 'Frontend', badge: '80%' },
            { icon: 'fa-brands fa-css3-alt', title: 'CSS', desc: 'Frontend', badge: '75%' },
            { icon: 'fa-brands fa-js', title: 'JavaScript', desc: 'Frontend', badge: '65%' },
            { icon: 'fa-brands fa-vuejs', title: 'Vue 3', desc: 'Frontend', badge: '55%' },
            { icon: 'fa-solid fa-bolt', title: 'Inertia.js', desc: 'Frontend', badge: '55%' },
            { icon: 'fa-solid fa-wind', title: 'Tailwind CSS', desc: 'Frontend', badge: '60%' },
            { icon: 'fa-brands fa-bootstrap', title: 'Bootstrap', desc: 'Frontend', badge: '75%' },
            { icon: 'fa-brands fa-php', title: 'PHP', desc: 'Backend', badge: '70%' },
            { icon: 'fa-solid fa-fire', title: 'Laravel', desc: 'Backend', badge: '65%' },
            { icon: 'fa-solid fa-database', title: 'MySQL', desc: 'Backend', badge: '70%' },
            { icon: 'fa-solid fa-database', title: 'PostgreSQL', desc: 'Backend', badge: '55%' },
            { icon: 'fa-brands fa-node-js', title: 'Node.js', desc: 'Backend', badge: '50%' },
            { icon: 'fa-solid fa-fire', title: 'Firebase', desc: 'Backend', badge: '50%' },
            { icon: 'fa-brands fa-git-alt', title: 'Git', desc: 'Tools', badge: '60%' },
            { icon: 'fa-brands fa-github', title: 'GitHub', desc: 'Tools', badge: '60%' },
            { icon: 'fa-solid fa-code', title: 'VS Code', desc: 'Tools', badge: '75%' },
        ],
        links: [
            { icon: 'fa-solid fa-envelope', title: 'Email', desc: 'liamjedmflores@gmail.com', href: 'mailto:liamjedmflores@gmail.com' },
            { icon: 'fa-brands fa-github', title: 'GitHub', desc: 'github.com/liamflores-09', href: 'https://github.com/liamflores-09', external: true },
            { icon: 'fa-brands fa-linkedin-in', title: 'LinkedIn', desc: 'linkedin.com/in/liamjedmflores', href: 'https://linkedin.com/in/liamjedmflores', external: true },
            { icon: 'fa-solid fa-file-pdf', title: 'View Resume', desc: 'Open PDF resume', href: '#resume', action: 'resume' },
        ],
    };

    let cmdActiveIndex = -1;
    let cmdFlatItems = [];

    function cmdRenderItem(item, idx) {
        const div = document.createElement('div');
        div.className = 'cmd-item';
        div.dataset.index = idx;
        div.innerHTML = `
            <div class="cmd-item-icon"><i class="${item.icon}"></i></div>
            <div class="cmd-item-text">
                <div class="cmd-item-title">${item.title}</div>
                <div class="cmd-item-desc">${item.desc}</div>
            </div>
            ${item.badge ? `<span class="cmd-item-badge">${item.badge}</span>` : ''}
            ${item.external ? '<span class="cmd-item-badge">↗</span>' : ''}
        `;
        div.addEventListener('click', () => cmdSelect(item));
        return div;
    }

    function cmdSelect(item) {
        cmdPalette.classList.remove('active');
        document.body.style.overflow = '';
        if (item.action === 'resume') {
            document.getElementById('resumeModal').classList.add('active');
        } else if (item.href) {
            if (item.external) {
                showExtConfirm(item.href, item.title);
            } else {
                window.location.hash = item.href;
            }
        }
    }

    // External link confirmation
    const extConfirm = document.getElementById('extConfirm');
    const extConfirmUrl = document.getElementById('extConfirmUrl');
    const extConfirmGo = document.getElementById('extConfirmGo');
    const extConfirmCancel = document.getElementById('extConfirmCancel');

    function showExtConfirm(url, title) {
        extConfirmUrl.textContent = url;
        extConfirmGo.href = url;
        extConfirmGo.target = '_blank';
        extConfirm.classList.add('active');
    }

    extConfirmCancel.addEventListener('click', () => {
        extConfirm.classList.remove('active');
    });

    extConfirm.addEventListener('click', (e) => {
        if (e.target === extConfirm) extConfirm.classList.remove('active');
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && extConfirm.classList.contains('active')) {
            extConfirm.classList.remove('active');
        }
    });

    // Global external link confirmation
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="http"]');
        if (!link || link.target !== '_blank') return;
        if (link.classList.contains('ext-confirm-go')) return;
        e.preventDefault();
        showExtConfirm(link.href, link.textContent.trim());
    });

    function cmdFilter(query) {
        const q = query.toLowerCase().trim();
        const groups = { nav: cmdNavResults, projects: cmdProjectResults, skills: cmdSkillResults, links: cmdLinkResults };
        cmdFlatItems = [];
        cmdActiveIndex = -1;

        Object.values(groups).forEach(g => { g.innerHTML = ''; });

        let hasAny = false;
        Object.entries(cmdData).forEach(([key, items]) => {
            const group = groups[key];
            const parent = group.parentElement;
            let groupHas = false;
            items.forEach((item, i) => {
                const match = !q || item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q);
                if (match) {
                    const flatIdx = cmdFlatItems.length;
                    cmdFlatItems.push(item);
                    const el = cmdRenderItem(item, flatIdx);
                    group.appendChild(el);
                    groupHas = true;
                    hasAny = true;
                }
            });
            parent.classList.toggle('has-results', groupHas);
        });

        if (!hasAny) {
            cmdBody.innerHTML = '<div class="cmd-empty">No results found</div>';
        } else {
            if (!cmdBody.querySelector('.cmd-group')) {
                cmdBody.innerHTML = '';
                Object.values(groups).forEach(g => cmdBody.appendChild(g.parentElement));
            }
        }
    }

    function cmdUpdateActive() {
        document.querySelectorAll('.cmd-item').forEach((el, i) => {
            el.classList.toggle('active', i === cmdActiveIndex);
        });
        const active = document.querySelector('.cmd-item.active');
        if (active) active.scrollIntoView({ block: 'nearest' });
    }

    function cmdOpen() {
        cmdPalette.classList.add('active');
        document.body.style.overflow = 'hidden';
        cmdInput.value = '';
        cmdFilter('');
        setTimeout(() => cmdInput.focus(), 50);
    }

    function cmdClose() {
        cmdPalette.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            if (cmdPalette.classList.contains('active')) {
                cmdClose();
            } else {
                cmdOpen();
            }
        }
    });

    cmdInput.addEventListener('input', () => cmdFilter(cmdInput.value));

    cmdInput.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            cmdActiveIndex = Math.min(cmdActiveIndex + 1, cmdFlatItems.length - 1);
            cmdUpdateActive();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            cmdActiveIndex = Math.max(cmdActiveIndex - 1, 0);
            cmdUpdateActive();
        } else if (e.key === 'Enter' && cmdActiveIndex >= 0) {
            e.preventDefault();
            cmdSelect(cmdFlatItems[cmdActiveIndex]);
        } else if (e.key === 'Escape') {
            cmdClose();
        }
    });

    cmdPalette.addEventListener('click', (e) => {
        if (e.target === cmdPalette) cmdClose();
    });

    document.getElementById('cmdTrigger').addEventListener('click', cmdOpen);
});
