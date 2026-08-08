# 🪶 VibeNest - Mini Social Media Platform

VibeNest is a modern, clean, and lightweight full-stack social media web application built with **Node.js, Express.js, MySQL, and Vanilla Frontend technologies (HTML5, CSS3, JavaScript)**.

---

## 🚀 Key Features

* **User Authentication:** 
  * Secure password hashing using `bcryptjs`.
  * Stateless token-based authentication using **JWT (JSON Web Token)**.
* **Home Feed:**
  * Real-time post feed displayed in reverse chronological order (newest first).
  * Quick visibility of like and comment counts.
* **Post Management:**
  * Create text and image posts.
  * Edit and delete your own posts.
* **Like & Comment System:**
  * Toggle like/unlike on posts with duplicate-like prevention.
  * Add comments to posts and delete your own comments.
* **Follow System:**
  * Follow and unfollow users (prevents self-following and duplicates).
  * Real-time followers and following counters on profiles.
* **User Profile & Search:**
  * Search registered users by name.
  * Customizable profile with bio, avatar, and user-specific post timeline.
* **Responsive Design:** 
  * Modern UI styled with a clean Blue & Purple accent layout.
  * Fully responsive across desktop, tablet, and mobile browsers.

---

## 🛠️ Technology Stack

* **Frontend:** HTML5, CSS3, Vanilla JavaScript (Fetch API)
* **Backend:** Node.js, Express.js (REST API)
* **Database:** MySQL (`mysql2` connection pooling)
* **Security:** `jsonwebtoken` (JWT), `bcryptjs`

---

## 📁 Project Structure

```text
VibeNest/
├── database/
│   └── vibenest.sql
├── backend/
│   ├── .env
│   ├── package.json
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── postController.js
│   │   ├── commentController.js
│   │   ├── likeController.js
│   │   └── followController.js
│   └── routes/
│       ├── userRoutes.js
│       ├── postRoutes.js
│       ├── commentRoutes.js
│       ├── likeRoutes.js
│       └── followRoutes.js
└── frontend/
    ├── index.html
    ├── login.html
    ├── register.html
    ├── profile.html
    ├── create-post.html
    ├── style.css
    └── script.js