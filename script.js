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

// Feedback form submission
const feedbackForm = document.getElementById('feedback-form');
const feedbackList = document.createElement('div');
feedbackList.className = 'feedback-list';
document.querySelector('.feedback .rating-container').appendChild(feedbackList);

feedbackForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (currentRating === 0) {
        alert('Please select a rating');
        return;
    }

    const message = feedbackForm.querySelector('textarea').value;
    
    try {
        const response = await fetch('http://localhost:3000/api/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                rating: currentRating,
                message: message
            })
        });

        if (response.ok) {
            feedbackForm.reset();
            currentRating = 0;
            updateStars(0);
            loadFeedback();
            alert('Thank you for your feedback!');
        }
    } catch (error) {
        console.error('Error submitting feedback:', error);
        alert('Error submitting feedback. Please try again.');
    }
});

// Load and display feedback
async function loadFeedback() {
    try {
        const response = await fetch('http://localhost:3000/api/feedback');
        const feedback = await response.json();
        
        feedbackList.innerHTML = '<h3>Recent Feedback</h3>';
        
        feedback.reverse().slice(0, 5).forEach(item => {
            const date = new Date(item.date).toLocaleDateString();
            const stars = '⭐'.repeat(item.rating);
            
            const feedbackItem = document.createElement('div');
            feedbackItem.className = 'feedback-item';
            feedbackItem.innerHTML = `
                <div class="feedback-rating">${stars}</div>
                <div class="feedback-message">${item.message}</div>
                <div class="feedback-date">${date}</div>
            `;
            feedbackList.appendChild(feedbackItem);
        });
    } catch (error) {
        console.error('Error loading feedback:', error);
    }
}

// Load initial feedback
loadFeedback();

// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Initialize GitHub repos on page load
document.addEventListener('DOMContentLoaded', fetchGitHubRepos);

// Add some CSS styles for repository cards
const style = document.createElement('style');
style.textContent = `
    .repo-card {
        background: white;
        border-radius: 10px;
        padding: 1.5rem;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        transition: transform 0.3s;
        margin-bottom: 2rem;
    }

    .repo-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 15px rgba(0,0,0,0.1);
    }

    .repo-card h3 {
        color: #2c3e50;
        margin-bottom: 0.5rem;
        font-size: 1.5rem;
    }

    .repo-stats {
        display: flex;
        gap: 1.5rem;
        margin: 1rem 0;
        color: #64748b;
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
        background-color: #3b82f6;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        transition: all 0.3s;
        margin-top: 1rem;
    }

    .repo-link:hover {
        background-color: #2563eb;
        transform: translateY(-2px);
    }
`;
document.head.appendChild(style); 