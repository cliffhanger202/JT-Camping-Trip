// Shooting stars on image hover
const heroImage = document.querySelector('.hero-illustration');

if (heroImage) {
    heroImage.addEventListener('mouseenter', function() {
        createShootingStars();
    });
}

function createShootingStars() {
    const hero = document.querySelector('.hero');
    const numStars = Math.random() * 3 + 3; // 3-6 stars
    
    for (let i = 0; i < numStars; i++) {
        setTimeout(() => {
            const star = document.createElement('div');
            star.className = 'shooting-star';
            
            // Random starting position
            const startX = Math.random() * 100;
            const startY = Math.random() * 50;
            
            star.style.left = startX + '%';
            star.style.top = startY + '%';
            
            hero.appendChild(star);
            
            // Remove star after animation completes
            setTimeout(() => star.remove(), 2000);
        }, i * 100);
    }
}

// Form handling
document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const experience = document.getElementById('experience').value;
    const dietary = document.getElementById('dietary').value;
    const message = document.getElementById('message').value;
    
    // Get selected activities
    const activities = [];
    document.querySelectorAll('input[name="activities"]:checked').forEach(checkbox => {
        activities.push(checkbox.value);
    });
    
    // Validate form
    if (!name || !email || !experience) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Create registration data
    const registrationData = {
        name: name,
        email: email,
        phone: phone,
        experience: experience,
        activities: activities,
        dietary: dietary,
        message: message,
        registrationDate: new Date().toLocaleString()
    };
    
    // Store in localStorage (for demo purposes)
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    registrations.push(registrationData);
    localStorage.setItem('registrations', JSON.stringify(registrations));
    
    // Show success message
    showSuccessMessage(email);
    
    // Reset form
    this.reset();
    
    // Log to console (in production, this would send to a server)
    console.log('Registration data:', registrationData);
});

function showSuccessMessage(email) {
    const form = document.getElementById('registrationForm');
    const successMessage = document.getElementById('successMessage');
    const confirmEmail = document.getElementById('confirmEmail');
    
    confirmEmail.textContent = email;
    form.style.display = 'none';
    successMessage.style.display = 'block';
    
    // Scroll to the success message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add active state to navigation links
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    const sections = [
        { id: 'home', offset: 0 },
        { id: 'details', offset: document.getElementById('details').offsetTop },
        { id: 'activities', offset: document.getElementById('activities').offsetTop },
        { id: 'packing', offset: document.getElementById('packing').offsetTop },
        { id: 'register', offset: document.getElementById('register').offsetTop }
    ];
    
    let currentSection = sections[0];
    for (let section of sections) {
        if (scrollY >= section.offset - 100) {
            currentSection = section;
        }
    }
    
    navLinks.forEach(link => {
        link.style.color = 'var(--light-text)';
        if (link.getAttribute('href') === '#' + currentSection.id) {
            link.style.color = 'var(--accent-color)';
        }
    });
});

// Packing list persistence
document.querySelectorAll('.packing-category input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const packingState = {};
        document.querySelectorAll('.packing-category input[type="checkbox"]').forEach(cb => {
            const label = cb.nextElementSibling ? cb.nextElementSibling.textContent : '';
            packingState[label] = cb.checked;
        });
        localStorage.setItem('packingList', JSON.stringify(packingState));
    });
});

// Load saved packing list on page load
window.addEventListener('load', () => {
    const packingState = JSON.parse(localStorage.getItem('packingList') || '{}');
    document.querySelectorAll('.packing-category input[type="checkbox"]').forEach(checkbox => {
        const label = checkbox.parentElement.textContent;
        if (packingState[label]) {
            checkbox.checked = true;
        }
    });
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
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

// Observe all cards for animation
document.querySelectorAll('.detail-card, .activity-card, .packing-category').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});
