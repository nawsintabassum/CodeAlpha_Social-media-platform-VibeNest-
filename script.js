const API_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
    setupPostSubmission();
    setupCreatePostButton();
});


function setupPostSubmission() {
    const postBtn = document.getElementById('submit-post-btn');
    const contentInput = document.getElementById('post-text-input');
    const imageInput = document.getElementById('post-image-input');

    if (postBtn) {
        postBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const content = contentInput ? contentInput.value.trim() : '';
            const imageUrl = imageInput ? imageInput.value.trim() : '';
            const token = localStorage.getItem('token');

            if (!token) {
                alert('Please login first to create a post!');
                return;
            }

            if (!content && !imageUrl) {
                alert('Please write something or provide an image link!');
                return;
            }

            try {
                const res = await fetch(`${API_URL}/posts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ content, image_url: imageUrl })
                });

                if (res.ok) {
                    if (contentInput) contentInput.value = '';
                    if (imageInput) imageInput.value = '';
                    loadPosts();
                } else {
                    const data = await res.json();
                    alert(data.message || 'Error creating post');
                }
            } catch (err) {
                console.error('Post Error:', err);
                alert('Server network error while posting!');
            }
        });
    }
}

function setupCreatePostButton() {
    const createBtn = document.getElementById('open-modal-btn');
    if (createBtn) {
        createBtn.addEventListener('click', () => {
            focusPostInput();
        });
    }
}

function focusPostInput() {
    const input = document.getElementById('post-text-input');
    if (input) {
        input.focus();
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}


async function loadPosts() {
    const feedContainer = document.getElementById('posts-feed');
    if (!feedContainer) return;

    try {
        const res = await fetch(`${API_URL}/posts`);
        const posts = await res.json();

        if (Array.isArray(posts) && posts.length > 0) {
            feedContainer.innerHTML = posts.map(post => `
                <div class="post-card">
                    <div class="post-header">
                        <img src="${post.profile_image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}" class="profile-pic">
                        <div>
                            <h4>${post.author_name || 'User'}</h4>
                            <small>${new Date(post.created_at).toLocaleString()}</small>
                        </div>
                    </div>
                    <p style="margin-top: 8px;">${post.content || ''}</p>
                    ${post.image_url ? `
                        <div class="post-media">
                            <img src="${post.image_url}">
                        </div>` : ''}
                    <div class="post-stats">
                        <span>❤️ ${post.like_count || 0} Likes</span>
                        <span>${post.comment_count || 0} Comments</span>
                    </div>
                    <div class="post-footer-actions">
                        <button type="button" onclick="handleLike(${post.id})"><i class="fa-regular fa-thumbs-up"></i> Like</button>
                        <button type="button" onclick="alert('Comment section clicked')"><i class="fa-regular fa-comment"></i> Comment</button>
                        <button type="button" onclick="alert('Post Shared!')"><i class="fa-solid fa-share"></i> Share</button>
                    </div>
                </div>
            `).join('');
        } else {
            feedContainer.innerHTML = '<p style="text-align:center; color:gray; padding:20px;">No posts available yet. Create one!</p>';
        }
    } catch (err) {
        console.error('Error loading posts:', err);
    }
}

async function handleLike(postId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to like posts');
        return;
    }

    try {
        const res = await fetch(`${API_URL}/likes/toggle`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ postId })
        });

        if (res.ok) {
            loadPosts();
        }
    } catch (err) {
        console.error('Like error:', err);
    }
}

function toggleFollow(button) {
    if (button.innerText === 'Follow') {
        button.innerText = 'Following';
        button.classList.add('following');
    } else {
        button.innerText = 'Follow';
        button.classList.remove('following');
    }
}

function addStory() {
    const url = prompt('Enter Image URL for your Story:');
    if (url) {
        alert('Story uploaded successfully!');
    }
}