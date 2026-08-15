document.addEventListener('DOMContentLoaded', () => {
    initOrbitCanvas();
    initNavigation();
    initTabSwitching();
    initGalleryFilter();
    initLightbox();
    initContactForm();
    initScrollReveal();
    fetchGoogleDriveGallery();
});

function initOrbitCanvas() {
    const canvas = document.getElementById('orbitCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    });

    const particles = [];
    const numParticles = 40;

    for (let i = 0; i < numParticles; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            alpha: Math.random() * 0.5 + 0.2
        });
    }

    const orbits = [
        { rx: 180, ry: 60, angle: Math.PI / 4, speed: 0.008, pos: 0 },
        { rx: 240, ry: 80, angle: -Math.PI / 3, speed: 0.006, pos: Math.PI },
        { rx: 300, ry: 100, angle: Math.PI / 6, speed: 0.004, pos: Math.PI / 2 }
    ];

    function animate() {
        ctx.clearRect(0, 0, width, height);

        const centerX = width * 0.75;
        const centerY = height * 0.45;

        ctx.fillStyle = 'rgba(201, 161, 90, 0.4)';
        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(201, 161, 90, ${p.alpha})`;
            ctx.fill();
        });

        if (width > 768) {
            ctx.save();
            ctx.translate(centerX, centerY);

            ctx.beginPath();
            ctx.arc(0, 0, 8, 0, Math.PI * 2);
            ctx.fillStyle = '#C9A15A';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#C9A15A';
            ctx.fill();

            orbits.forEach(orbit => {
                ctx.save();
                ctx.rotate(orbit.angle);

                ctx.beginPath();
                ctx.ellipse(0, 0, orbit.rx, orbit.ry, 0, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(201, 161, 90, 0.2)';
                ctx.lineWidth = 1;
                ctx.stroke();

                orbit.pos += orbit.speed;
                const electronX = orbit.rx * Math.cos(orbit.pos);
                const electronY = orbit.ry * Math.sin(orbit.pos);

                ctx.beginPath();
                ctx.arc(electronX, electronY, 4, 0, Math.PI * 2);
                ctx.fillStyle = '#E2BA70';
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#E2BA70';
                ctx.fill();

                ctx.restore();
            });

            ctx.restore();
        }

        requestAnimationFrame(animate);
    }

    animate();
}

function initNavigation() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = hamburgerBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (hamburgerBtn) {
                    const icon = hamburgerBtn.querySelector('i');
                    if (icon) {
                        icon.classList.add('fa-bars');
                        icon.classList.remove('fa-xmark');
                    }
                }
            }
        });
    });

    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    });
}

function initTabSwitching() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetPane = document.getElementById(targetTab);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
}

function initGalleryFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');

            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filterValue === 'all' || filterValue === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

function initLightbox() {
    const modal = document.getElementById('lightboxModal');
    const modalImg = document.getElementById('lightboxImg');
    const captionText = document.getElementById('lightboxCaption');
    const closeBtn = document.getElementById('lightboxClose');
    const galleryCards = document.querySelectorAll('.gallery-card');

    galleryCards.forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('img');
            const title = card.querySelector('h4') ? card.querySelector('h4').innerText : '';
            const desc = card.querySelector('p') ? card.querySelector('p').innerText : '';

            if (img && modal && modalImg) {
                modalImg.src = img.src;
                if (captionText) captionText.innerText = `${title} — ${desc}`;
                modal.classList.add('active');
                modal.setAttribute('aria-hidden', 'false');
            }
        });
    });

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                modal.setAttribute('aria-hidden', 'true');
            }
        });
    }
}

function fetchGoogleDriveGallery() {
    const appsScriptEndpoint = '';
    if (!appsScriptEndpoint) return;

    fetch(appsScriptEndpoint)
        .then(response => response.json())
        .then(data => {
            if (data && data.images && data.images.length > 0) {
                const grid = document.getElementById('galleryGrid');
                if (!grid) return;

                grid.innerHTML = '';
                data.images.forEach(imgData => {
                    const item = document.createElement('div');
                    item.className = 'gallery-item';
                    item.setAttribute('data-category', imgData.category || 'all');

                    item.innerHTML = `
                        <div class="gallery-card">
                            <img src="${imgData.url}" alt="${imgData.title || 'Physics Gallery Image'}" loading="lazy">
                            <div class="gallery-overlay">
                                <h4>${imgData.title || 'Lab Moment'}</h4>
                                <p>${imgData.description || 'GR Institute Physics Research'}</p>
                                <span class="gallery-zoom-icon"><i class="fa-solid fa-magnifying-glass-plus"></i></span>
                            </div>
                        </div>
                    `;
                    grid.appendChild(item);
                });
                initLightbox();
            }
        })
        .catch(err => {
        });
}

function initContactForm() {
    const form = document.getElementById('contactForm');
    const statusMsg = document.getElementById('formStatus');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (statusMsg) {
                statusMsg.className = 'form-status-msg success';
                statusMsg.innerText = 'Thank you! Your enrollment inquiry has been submitted. Santheep Sir will contact you shortly.';
            }
            form.reset();
        });
    }
}

function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.course-card, .testimonial-card, .contact-hub-wrapper, .hub-card, .table-card, .gallery-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}
