// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('authenticated') === 'true') {
        showMainContent();
    } else {
        showLogin();
    }
});

function showMainContent() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
}

function showLogin() {
    document.getElementById('login-section').style.display = 'flex';
    document.getElementById('main-content').style.display = 'none';
}

// Login button handler
document.getElementById('login-button').addEventListener('click', function() {
    const password = document.getElementById('password-input').value;
    if (password === 'DesertLife') {
        localStorage.setItem('authenticated', 'true');
        showMainContent();
    } else {
        document.getElementById('error-message').style.display = 'block';
    }
});

// Allow enter key to submit password
document.getElementById('password-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('login-button').click();
    }
});

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
    const arrivalTime = document.getElementById('arrivalTime').value;
    const additionalCampers = parseInt(document.getElementById('additionalCampers').value);
    const dietary = document.getElementById('dietary').value;
    
    // Get additional campers
    const campers = [];
    for (let i = 1; i <= additionalCampers; i++) {
        const camperName = document.getElementById(`camper${i}Name`).value;
        const camperAge = document.getElementById(`camper${i}Age`).value;
        if (camperName && camperAge) {
            campers.push({ name: camperName, age: parseInt(camperAge) });
        }
    }
    
    // Validate form
    if (!name || !email) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Create registration data
    const registrationData = {
        name: name,
        email: email,
        phone: phone,
        arrivalTime: arrivalTime,
        additionalCampers: additionalCampers,
        campers: campers,
        dietary: dietary,
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
    // Hide all camper fields
    for (let i = 1; i <= 5; i++) {
        document.getElementById(`camper${i}`).style.display = 'none';
    }
    
    // Log to console (in production, this would send to a server)
    console.log('Registration data:', registrationData);
});

// Handle additional campers selection
document.getElementById('additionalCampers').addEventListener('change', function() {
    const numCampers = parseInt(this.value);
    for (let i = 1; i <= 5; i++) {
        const camperDiv = document.getElementById(`camper${i}`);
        if (i <= numCampers) {
            camperDiv.style.display = 'block';
        } else {
            camperDiv.style.display = 'none';
        }
    }
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
