// Navigation active link
const navLinks = document.querySelectorAll('nav ul li a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// Update active link on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Home section animations
function initHomeAnimations() {
    const canvas = document.getElementById('stars-canvas');
    const ctx = canvas.getContext('2d');
    let stars = [];
    let shootingStars = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function createStar() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5 + 0.5,
            alpha: Math.random() * 0.5 + 0.5,
            speed: Math.random() * 0.02 + 0.01
        };
    }

    function createShootingStar() {
        return {
            x: Math.random() * canvas.width,
            y: -10,
            length: Math.random() * 50 + 50,
            speed: Math.random() * 5 + 5,
            alpha: 1
        };
    }

    for (let i = 0; i < 100; i++) {
        stars.push(createStar());
    }

    function animateStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
            ctx.fill();
            star.alpha += star.speed;
            if (star.alpha > 1 || star.alpha < 0.5) star.speed = -star.speed;
        });

        shootingStars = shootingStars.filter(star => star.y < canvas.height);
        shootingStars.forEach(star => {
            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(star.x - star.length, star.y + star.length);
            ctx.strokeStyle = `rgba(30, 144, 255, ${star.alpha})`;
            ctx.lineWidth = 2;
            ctx.stroke();
            star.x -= star.speed;
            star.y += star.speed;
            star.alpha -= 0.02;
        });

        if (Math.random() < 0.01) {
            shootingStars.push(createShootingStar());
        }

        requestAnimationFrame(animateStars);
    }
    animateStars();

    const starsContainer = document.querySelector('#home .stars');
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star falling';
        star.style.left = `${Math.random() * 100}%`;
        star.style.width = `${Math.random() * 1 + 0.5}px`;
        star.style.height = star.style.width;
        star.style.animationDelay = `${Math.random() * 5}s`;
        starsContainer.appendChild(star);
    }

    document.querySelector('#home').addEventListener('click', (e) => {
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${e.clientX}px`;
            particle.style.top = `${e.clientY}px`;
            particle.style.width = '5px';
            particle.style.height = '5px';
            particle.style.setProperty('--x', `${Math.random() * 60 - 30}px`);
            particle.style.setProperty('--y', `${Math.random() * 60 - 30}px`);
            starsContainer.appendChild(particle);
            setTimeout(() => particle.remove(), 800);
        }
    });

    const starryText = document.querySelector('.starry-text');
    starryText.innerHTML = starryText.textContent.replace(/\S/g, '<span>$&</span>');
    const letters = starryText.querySelectorAll('span');
    letters.forEach((letter, i) => {
        letter.style.animationDelay = `${i * 0.1}s`;
    });

    starryText.addEventListener('mousemove', (e) => {
        const rect = starryText.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const tiltX = (y / rect.height) * 15;
        const tiltY = -(x / rect.width) * 15;
        starryText.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    starryText.addEventListener('mouseleave', () => {
        starryText.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });

    let mouseX = 0, mouseY = 0;
    starryText.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function drawConstellation() {
        stars.forEach(star => {
            const dist = Math.hypot(star.x - mouseX, star.y - mouseY);
            if (dist < 100) {
                ctx.beginPath();
                ctx.moveTo(star.x, star.y);
                ctx.lineTo(mouseX, mouseY);
                ctx.strokeStyle = `rgba(30, 144, 255, ${1 - dist / 100})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        });
    }

    function animateConstellation() {
        animateStars();
        drawConstellation();
        requestAnimationFrame(animateConstellation);
    }
    animateConstellation();

    document.querySelector('.explore-btn').addEventListener('click', () => {
        document.querySelector('#about').scrollIntoView({ behavior: 'smooth' });
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const btn = document.querySelector('.explore-btn');
            const rect = btn.getBoundingClientRect();
            particle.style.left = `${rect.left + rect.width / 2}px`;
            particle.style.top = `${rect.top + rect.height / 2}px`;
            particle.style.width = '5px';
            particle.style.height = '5px';
            particle.style.setProperty('--x', `${Math.random() * 80 - 40}px`);
            particle.style.setProperty('--y', `${Math.random() * 80 - 40}px`);
            starsContainer.appendChild(particle);
            setTimeout(() => particle.remove(), 800);
        }
    });
}
initHomeAnimations();

// Skill card animation
const skillCards = document.querySelectorAll('.skill-card');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('active');
            }, index * 150); // Increased delay for smoother stagger
        }
    });
}, { threshold: 0.3 });

skillCards.forEach(card => skillObserver.observe(card));

// Spark effect on skill card hover
skillCards.forEach(card => {
    card.addEventListener('mouseenter', (e) => {
        for (let i = 0; i < 6; i++) {
            const spark = document.createElement('div');
            spark.className = 'spark';
            spark.style.left = `${Math.random() * card.offsetWidth}px`;
            spark.style.top = `${Math.random() * card.offsetHeight}px`;
            spark.style.setProperty('--x', `${Math.random() * 30 - 15}px`);
            spark.style.setProperty('--y', `${Math.random() * 30 - 15}px`);
            card.appendChild(spark);
            setTimeout(() => spark.remove(), 600);
        }
    });
});

// Project animation
const projects = document.querySelectorAll('.project');
const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('active');
            }, index * 200);
        }
    });
}, { threshold: 0.3 });

projects.forEach(project => projectObserver.observe(project));

// Certification animation
const certCards = document.querySelectorAll('.cert-card');
const certObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('active');
            }, index * 200);
        }
    });
}, { threshold: 0.3 });

certCards.forEach(card => certObserver.observe(card));

// Achievement animation
const achievementCards = document.querySelectorAll('.achievement-card');
const achievementObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('active');
            }, index * 200);
        }
    });
}, { threshold: 0.3 });

achievementCards.forEach(card => achievementObserver.observe(card));

// Contact section animations
function initContactAnimations() {
    const contactParticles = document.querySelector('.contact-particles');
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'contact-particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.width = `${Math.random() * 3 + 1}px`;
        particle.style.height = particle.style.width;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        contactParticles.appendChild(particle);
    }

    const contactItems = document.querySelectorAll('#contact p, .social-icon, .contact-btn');
    const contactObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, index * 200);
            }
        });
    }, { threshold: 0.5 });

    contactItems.forEach(item => contactObserver.observe(item));

    const contactBtn = document.querySelector('.contact-btn');
    const modal = document.querySelector('.contact-modal');
    const closeBtn = document.querySelector('.modal-close');
    const form = document.querySelector('.modal-content form');

    contactBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Message sent! (Demo alert - add actual form handling)');
        modal.classList.remove('active');
        form.reset();
    });
}
initContactAnimations();
document.querySelector('.nav-resume a').addEventListener('click', (e) => {
    for (let i = 0; i < 5; i++) {
        const spark = document.createElement('div');
        spark.className = 'spark';
        spark.style.left = `${e.clientX}px`;
        spark.style.top = `${e.clientY}px`;
        spark.style.setProperty('--x', `${Math.random() * 20 - 10}px`);
        spark.style.setProperty('--y', `${Math.random() * 20 - 10}px`);
        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 500);
    }
});