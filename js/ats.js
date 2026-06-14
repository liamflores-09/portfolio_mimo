document.addEventListener('DOMContentLoaded', function() {
    // Page transition
    const pageTransition = document.getElementById('pageTransition');
    if (pageTransition) {
        pageTransition.style.transformOrigin = 'top';
        pageTransition.style.transform = 'scaleY(1)';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                pageTransition.style.transition = 'transform 0.35s cubic-bezier(0.7, 0, 0.3, 1)';
                pageTransition.style.transform = 'scaleY(0)';
            });
        });

        document.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http') || link.target === '_blank') return;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                pageTransition.style.transformOrigin = 'bottom';
                pageTransition.style.transform = 'scaleY(0)';
                requestAnimationFrame(() => {
                    pageTransition.style.transition = 'transform 0.35s cubic-bezier(0.7, 0, 0.3, 1)';
                    pageTransition.style.transform = 'scaleY(1)';
                });
                setTimeout(() => { window.location.href = href; }, 350);
            });
        });
    }

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
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

    // Scroll progress
    const scrollProgress = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress.style.width = (scrollTop / docHeight) * 100 + '%';
    });

    // Back to top
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 500);
    });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Smooth anchor scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });

    // Scroll animations — staggered per element
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const siblings = entry.target.parentElement.children;
                const index = Array.from(siblings).indexOf(entry.target);
                entry.target.style.transitionDelay = (index * 0.08) + 's';
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.overview-split, .overview-team-banner, .tech-category, .deploy-step, .tl-item, .obj-item, .feat-card, .screenshot-card').forEach(el => {
        animateOnScroll.observe(el);
    });

    // Timeline fill animation
    const tlFill = document.getElementById('timelineProgress');
    if (tlFill) {
        const tlObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) tlFill.classList.add('animate');
            });
        }, { threshold: 0.3 });
        tlObserver.observe(tlFill.closest('.tl-wrapper'));
    }

    // Stat counters — observe both tl-stats and hl-stats
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    function animateCounters() {
        statNumbers.forEach(num => {
            const target = parseInt(num.dataset.target);
            if (isNaN(target)) return;
            const duration = 2000;
            const start = performance.now();
            function update(currentTime) {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                num.textContent = Math.floor(eased * target);
                if (progress < 1) requestAnimationFrame(update);
                else num.textContent = target;
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
    }, { threshold: 0.1 });

    document.querySelectorAll('.tl-stats, .hl-stats').forEach(el => {
        statsObserver.observe(el);
    });

    // Screenshot tabs
    const screenshotTabs = document.querySelectorAll('.screenshot-tab');
    const screenshotCards = document.querySelectorAll('.screenshot-card');

    screenshotTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            screenshotTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const side = tab.dataset.tab;
            screenshotCards.forEach(card => {
                if (card.dataset.side === side) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // Carousel functionality — only for cards with multiple images
    document.querySelectorAll('.screenshot-carousel.has-carousel').forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const slides = track.querySelectorAll('img');
        const totalSlides = slides.length;
        if (totalSlides <= 1) return;

        const dots = carousel.querySelectorAll('.carousel-dots span');
        const prevBtn = carousel.querySelector('.carousel-prev');
        const nextBtn = carousel.querySelector('.carousel-next');
        let current = 0;
        let startX = 0;
        let isDragging = false;

        function goTo(index) {
            current = (index + totalSlides) % totalSlides;
            track.style.transform = `translateX(-${current * 100}%)`;
            dots.forEach((d, i) => d.classList.toggle('active', i === current));
        }

        if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));
        dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

        // Touch/swipe support
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });

        carousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            const diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) {
                if (diff > 0) goTo(current + 1);
                else goTo(current - 1);
            }
        }, { passive: true });
    });

    // Screenshot lightbox
    const ssLightbox = document.getElementById('ssLightbox');
    const ssLightboxImg = document.getElementById('ssLightboxImg');
    const ssLightboxTitle = document.getElementById('ssLightboxTitle');
    const ssLightboxDesc = document.getElementById('ssLightboxDesc');
    const ssLightboxClose = document.getElementById('ssLightboxClose');
    const ssLightboxPrev = document.getElementById('ssLightboxPrev');
    const ssLightboxNext = document.getElementById('ssLightboxNext');
    const ssLightboxCounter = document.getElementById('ssLightboxCounter');
    const ssLightboxDots = document.getElementById('ssLightboxDots');
    const ssLightboxBackdrop = document.getElementById('ssLightboxBackdrop');

    let lbCurrentCard = null;
    let lbCurrentSlide = 0;
    let lbImages = [];

    function openLightbox(card) {
        lbCurrentCard = card;
        const track = card.querySelector('.carousel-track');
        lbImages = Array.from(track.querySelectorAll('img'));
        lbCurrentSlide = 0;
        const title = card.querySelector('.screenshot-info h4').textContent;
        const desc = card.querySelector('.screenshot-info p').textContent;
        ssLightboxTitle.textContent = title;
        ssLightboxDesc.textContent = desc;
        updateLightboxSlide();
        ssLightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        ssLightbox.classList.remove('active');
        document.body.style.overflow = '';
        lbCurrentCard = null;
    }

    function updateLightboxSlide() {
        ssLightboxImg.src = lbImages[lbCurrentSlide].src;
        ssLightboxImg.alt = lbImages[lbCurrentSlide].alt;
        ssLightboxCounter.textContent = (lbCurrentSlide + 1) + ' / ' + lbImages.length;
        ssLightboxDots.innerHTML = '';
        if (lbImages.length > 1) {
            lbImages.forEach((_, i) => {
                const dot = document.createElement('span');
                if (i === lbCurrentSlide) dot.classList.add('active');
                dot.addEventListener('click', () => { lbCurrentSlide = i; updateLightboxSlide(); });
                ssLightboxDots.appendChild(dot);
            });
        }
    }

    document.querySelectorAll('.screenshot-card').forEach(card => {
        card.addEventListener('click', () => openLightbox(card));
    });

    if (ssLightboxClose) ssLightboxClose.addEventListener('click', closeLightbox);
    if (ssLightboxBackdrop) ssLightboxBackdrop.addEventListener('click', closeLightbox);
    if (ssLightboxPrev) ssLightboxPrev.addEventListener('click', () => {
        lbCurrentSlide = (lbCurrentSlide - 1 + lbImages.length) % lbImages.length;
        updateLightboxSlide();
    });
    if (ssLightboxNext) ssLightboxNext.addEventListener('click', () => {
        lbCurrentSlide = (lbCurrentSlide + 1) % lbImages.length;
        updateLightboxSlide();
    });
    document.addEventListener('keydown', (e) => {
        if (!ssLightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') { lbCurrentSlide = (lbCurrentSlide - 1 + lbImages.length) % lbImages.length; updateLightboxSlide(); }
        if (e.key === 'ArrowRight') { lbCurrentSlide = (lbCurrentSlide + 1) % lbImages.length; updateLightboxSlide(); }
    });

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
});
