// Mobile menu functionality
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.classList.toggle('menu-open');
});

// Close menu when clicking a link
navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Active section highlighting
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - sectionHeight / 3) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').slice(1) === current) {
            item.classList.add('active');
        }
    });
});

// Typing animation for role text
const roleText = document.querySelector('.role .highlight');
const roles = ['Full Stack Developer', 'Web Designer', 'Problem Solver'];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 200;
let erasingDelay = 100;
let newTextDelay = 2000;

function typeRole() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        roleText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        roleText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        setTimeout(typeRole, newTextDelay);
        return;
    }

    if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
    }

    setTimeout(typeRole, isDeleting ? erasingDelay : typingDelay);
}

typeRole();

// Contact form submission
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: contactForm.querySelector('#name').value,
        email: contactForm.querySelector('#email').value,
        message: contactForm.querySelector('#message').value
    };

    // Store in localStorage (for demo purposes)
    const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    messages.push({
        ...formData,
        date: new Date().toISOString()
    });
    localStorage.setItem('contactMessages', JSON.stringify(messages));

    // Show success message
    showNotification('Message sent successfully!', 'success');
    contactForm.reset();
});

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Add styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                bottom: -100px;
                left: 50%;
                transform: translateX(-50%);
                padding: 1rem 2rem;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                transition: all 0.3s ease;
                z-index: 1000;
                opacity: 0;
            }

            .notification.success {
                background: linear-gradient(45deg, #10B981, #059669);
            }

            .notification.error {
                background: linear-gradient(45deg, #EF4444, #DC2626);
            }

            .notification.show {
                bottom: 20px;
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add scroll reveal animations
window.addEventListener('load', () => {
    const revealElements = document.querySelectorAll('.hero-text, .hero-image, .about-content, .service-card, .project-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease-out';
        observer.observe(element);
    });
});

// GitHub username
const GITHUB_USERNAME = 'nilesh0002';

// Fetch GitHub repositories
async function fetchGitHubRepos() {
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos`);
        const repos = await response.json();
        
        const repoContainer = document.getElementById('github-repos');
        repoContainer.innerHTML = '';

        repos.forEach(repo => {
            const repoCard = document.createElement('div');
            repoCard.className = 'repo-card';
            repoCard.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${repo.description || 'No description available'}</p>
                <div class="repo-stats">
                    <span><i class="far fa-star"></i> ${repo.stargazers_count}</span>
                    <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                    <span><i class="fas fa-code"></i> ${repo.language || 'N/A'}</span>
                </div>
                <a href="${repo.html_url}" target="_blank" class="repo-link">View Repository</a>
            `;
            repoContainer.appendChild(repoCard);
        });
    } catch (error) {
        console.error('Error fetching GitHub repositories:', error);
        document.getElementById('github-repos').innerHTML = '<p>Error loading repositories. Please try again later.</p>';
    }
}

// Star rating functionality
const stars = document.querySelectorAll('.stars i');
let currentRating = 0;

stars.forEach(star => {
    star.addEventListener('click', () => {
        currentRating = parseInt(star.dataset.rating);
        updateStars(currentRating);
    });

    star.addEventListener('mouseover', () => {
        updateStars(parseInt(star.dataset.rating));
    });

    star.addEventListener('mouseout', () => {
        updateStars(currentRating);
    });
});

function updateStars(rating) {
    stars.forEach(star => {
        const starRating = parseInt(star.dataset.rating);
        if (starRating <= rating) {
            star.classList.remove('far');
            star.classList.add('fas');
        } else {
            star.classList.remove('fas');
            star.classList.add('far');
        }
    });
}

// Feedback storage in localStorage
function getFeedbackFromStorage() {
    return JSON.parse(localStorage.getItem('portfolioFeedback') || '[]');
}

function saveFeedbackToStorage(feedback) {
    localStorage.setItem('portfolioFeedback', JSON.stringify(feedback));
}

// Feedback form submission
const feedbackForm = document.getElementById('feedback-form');
const feedbackList = document.createElement('div');
feedbackList.className = 'feedback-list';
document.querySelector('.feedback .rating-container').appendChild(feedbackList);

feedbackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (currentRating === 0) {
        showNotification('Please select a rating', 'error');
        return;
    }

    const message = feedbackForm.querySelector('textarea').value;
    if (!message.trim()) {
        showNotification('Please enter your feedback message', 'error');
        return;
    }
    
    const newFeedback = {
        rating: currentRating,
        message: message,
        date: new Date().toISOString()
    };

    const allFeedback = getFeedbackFromStorage();
    allFeedback.push(newFeedback);
    saveFeedbackToStorage(allFeedback);

    feedbackForm.reset();
    currentRating = 0;
    updateStars(0);
    loadFeedback();
    showNotification('Thank you for your feedback!', 'success');
});

// Load and display feedback
let currentPage = 1;
const feedbacksPerPage = 5;

function loadFeedback(page = 1) {
    const allFeedback = getFeedbackFromStorage();
    
    // Calculate pagination
    const totalPages = Math.ceil(allFeedback.length / feedbacksPerPage);
    const startIndex = (page - 1) * feedbacksPerPage;
    const feedbackToShow = [...allFeedback].reverse();
    
    feedbackList.innerHTML = `
        <h3>All Feedback (${allFeedback.length} total)</h3>
        <div class="feedback-items"></div>
        <div class="pagination">
            ${page > 1 ? `<button onclick="loadFeedback(${page - 1})" class="page-btn">Previous</button>` : ''}
            <span class="page-info">Page ${page} of ${Math.max(1, totalPages)}</span>
            ${page < totalPages ? `<button onclick="loadFeedback(${page + 1})" class="page-btn">Next</button>` : ''}
        </div>
    `;

    const feedbackItems = feedbackList.querySelector('.feedback-items');
    
    if (allFeedback.length === 0) {
        feedbackItems.innerHTML = '<p class="no-feedback">Be the first to leave feedback!</p>';
        return;
    }

    feedbackToShow.slice(startIndex, startIndex + feedbacksPerPage).forEach(item => {
        const date = new Date(item.date).toLocaleDateString();
        const stars = '⭐'.repeat(item.rating);
        
        const feedbackItem = document.createElement('div');
        feedbackItem.className = 'feedback-item';
        feedbackItem.innerHTML = `
            <div class="feedback-rating">${stars}</div>
            <div class="feedback-message">${item.message}</div>
            <div class="feedback-date">${date}</div>
        `;
        feedbackItems.appendChild(feedbackItem);
    });

    // Add feedback statistics
    if (allFeedback.length > 0) {
        const avgRating = (allFeedback.reduce((sum, item) => sum + item.rating, 0) / allFeedback.length).toFixed(1);
        const statsDiv = document.createElement('div');
        statsDiv.className = 'feedback-stats';
        statsDiv.innerHTML = `
            <div class="stat-item">
                <span class="stat-label">Average Rating</span>
                <span class="stat-value">${avgRating} ⭐</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Total Feedback</span>
                <span class="stat-value">${allFeedback.length}</span>
            </div>
        `;
        feedbackList.insertBefore(statsDiv, feedbackList.firstChild);
    }
}

// Initialize GitHub repos and feedback on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchGitHubRepos();
    loadFeedback();

    // Prevent body scroll when menu is open
    document.body.style.overflow = 'auto';
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains('menu-open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });
    });

    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class'],
    });
});

// Add styles for repository cards and notifications
const style = document.createElement('style');
style.textContent = `
    .repo-card {
        background: var(--card-bg);
        border-radius: 10px;
        padding: 1.5rem;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        transition: transform 0.3s;
        margin-bottom: 2rem;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .repo-card:hover {
        transform: translateY(-5px);
        border-color: var(--primary-color);
        box-shadow: 0 8px 15px rgba(0,0,0,0.2);
    }

    .repo-card h3 {
        color: var(--text-primary);
        margin-bottom: 0.5rem;
        font-size: 1.5rem;
    }

    .repo-stats {
        display: flex;
        gap: 1.5rem;
        margin: 1rem 0;
        color: var(--text-secondary);
        justify-content: center;
    }

    .repo-stats span {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .repo-link {
        display: inline-block;
        padding: 0.8rem 1.5rem;
        background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
        color: var(--text-primary);
        text-decoration: none;
        border-radius: 25px;
        transition: all 0.3s;
        margin-top: 1rem;
    }

    .repo-link:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 216, 255, 0.3);
    }

    .notification {
        position: fixed;
        bottom: -100px;
        left: 50%;
        transform: translateX(-50%);
        padding: 1rem 2rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        transition: all 0.3s ease;
        z-index: 1000;
    }

    .notification.success {
        background: linear-gradient(45deg, #10B981, #059669);
    }

    .notification.error {
        background: linear-gradient(45deg, #EF4444, #DC2626);
    }

    .notification.show {
        bottom: 20px;
    }

    .no-feedback {
        text-align: center;
        color: var(--text-secondary);
        font-style: italic;
        padding: 2rem;
    }
`;
document.head.appendChild(style); 