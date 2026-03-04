# Echo

## An AI-Enabled Microblogging/Social Platform

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-22%2B-339933?logo=node.js&style=flat-square)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18%2B-61DAFB?logo=react&style=flat-square)](https://react.dev)
[![Gemini 3 Flash](https://img.shields.io/badge/Gemini%203%20Flash-2026-4285F4?logo=google&style=flat-square)](https://deepmind.google/technologies/gemini)

</div>

---

## About

Echo is a production-grade social media platform built with the MERN stack that combines core social networking features with an integrated AI assistant. The architecture emphasizes **scalability**, **performance optimization**, and **data integrity** — demonstrating professional-grade infrastructure decisions often seen in production environments.

---

## Features

- **Browse-First Architecture** — Public content accessible without authentication, increasing engagement and reducing bounce rates
- **Create & Share Posts** — Share thoughts, ideas, and multi-image content with your network
- **Engage with Content** — Like and bookmark posts for later
- **Follow Users** — Build your network and see personalized feeds
- **Profile Management** — Customizable profiles with automated avatar cropping and banner optimization
- **Dark/Light Mode** — System-preference aware theming
- **AI Writing Assistant** — Gemini-powered assistant for post optimization and social media guidance

---

## Tech Stack

| Category     | Technologies                                                                  |
| ------------ | ----------------------------------------------------------------------------- |
| **Frontend** | React 19, Vite, Redux Toolkit, Tailwind CSS, React Router, Axios, React Icons |
| **Backend**  | Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs                         |
| **AI / ML**  | Google Gemini 3 Flash (2026 Unified SDK)                                      |
| **Media**    | Cloudinary, Multer, browser-image-compression                                   |
| **Security** | Helmet, CORS, JWT Cookie Authentication, Rate Limiting                        |

---

## Project Structure

```
echo/
├── backend/
│   ├── config/
│   │   ├── auth.js              # JWT authentication middleware (req.id standardization)
│   │   ├── cloudinary.js        # Multi-channel storage pipeline
│   │   └── database.js          # MongoDB connection with retry logic
│   ├── controllers/
│   │   ├── ai.controller.js     # Gemini AI integration
│   │   ├── tweet.controller.js  # Tweet CRUD + image handling
│   │   └── user.controller.js   # User management + uploads
│   ├── models/
│   │   ├── tweet.model.js       # Tweet schema with images array
│   │   └── user.model.js        # User schema with profile/banner URLs
│   ├── routes/
│   │   ├── ai.routes.js         # /api/v1/ai endpoints
│   │   ├── tweet.routes.js      # /api/v1/tweet endpoints (public + protected)
│   │   └── user.routes.js       # /api/v1/user endpoints (public + protected)
│   ├── src/
│   │   ├── app.js               # Express app with CORS/Helmet config
│   │   └── server.js            # Server entry point
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js         # Axios instance with credentials
│   │   ├── components/
│   │   │   ├── AIChatBot.jsx
│   │   │   ├── Body.jsx
│   │   │   ├── Bookmarks.jsx
│   │   │   ├── CreatePost.jsx   # Multi-image upload with preview
│   │   │   ├── EditProfile.jsx  # Avatar/banner upload
│   │   │   ├── Feed.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── LeftSidebar.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MobileNav.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── RightSideBar.jsx
│   │   │   ├── ThemeToggle.jsx
│   │   │   ├── Tweet.jsx        # Responsive image grid display
│   │   │   └── ui/
│   │   │       └── scrollFade.jsx
│   │   ├── hooks/
│   │   ├── redux/
│   │   │   ├── tweetSlice.js    # Tweet state management
│   │   │   └── userSlice.js     # User state management
│   │   ├── utils/
│   │   │   └── upload.js        # Compression + validation utilities
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── package.json                  # Root orchestration scripts
├── README.md                     # High-level overview
├── TECHNICAL.md                  # Deep-dive technical documentation
└── LICENSE
```

---

## Getting Started

### Prerequisites

- Node.js v22+
- MongoDB instance (local or Atlas)
- Cloudinary account (for media storage)
- Gemini API key (for AI features)

### Installation

```bash
# Clone the repository
git clone https://github.com/MinitJain/Echo-Socials
cd echo

# Install all dependencies
npm run install-all
```

### Configuration

Create `backend/.env`:

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/echo

# Authentication
JWT_SECRET=your_secure_jwt_secret_min_32_chars

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# AI Integration
GEMINI_API_KEY=your_google_gemini_api_key

# Cloudinary Media Pipeline
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8080
```

> [!IMPORTANT]
> Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Run Development Server

```bash
npm run dev
```

- Backend: `http://localhost:8080`
- Frontend: `http://localhost:5173`

---

## API Reference

### Authentication Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/user/register` | ❌ | User registration |
| POST | `/api/v1/user/login` | ❌ | User login (sets JWT cookie) |
| GET | `/api/v1/user/logout` | ✅ | Clear auth cookie |

### User Management Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/user/me` | ✅ | Get current user profile |
| GET | `/api/v1/user/profile/:id` | ✅ | Get user by ID |
| PUT | `/api/v1/user/update/:id` | ✅ | Update user profile |
| GET | `/api/v1/user/otherusers` | ✅ | Get suggested users |
| POST | `/api/v1/user/follow/:id` | ✅ | Follow user |
| POST | `/api/v1/user/unfollow/:id` | ✅ | Unfollow user |
| PUT | `/api/v1/user/bookmark/:id` | ✅ | Toggle bookmark |

### Media Upload Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/user/upload-avatar` | ✅ | Upload profile picture (2MB, jpg/png/webp) |
| POST | `/api/v1/user/upload-banner` | ✅ | Upload cover image (2MB, jpg/png/webp) |
| POST | `/api/v1/user/upload-images` | ✅ | Upload tweet images (4×5MB, jpg/png/gif/webp) |

### Tweet Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/tweet/allTweets` | ❌ | Public feed (Browse-First) |
| GET | `/api/v1/tweet/followingtweets/:id` | ✅ | Personalized feed |
| GET | `/api/v1/tweet/tweet/:id` | ✅ | Get single tweet |
| POST | `/api/v1/tweet/create` | ✅ | Create tweet |
| DELETE | `/api/v1/tweet/delete/:id` | ✅ | Delete tweet |
| PUT | `/api/v1/tweet/like/:id` | ✅ | Toggle like |

### AI Assistant Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/ai/chat` | ✅ | Send message to AI assistant |

---

## Architectural Highlights

### Browse-First Model

Decoupled content feed from authentication middleware. Public content accessible to guests while maintaining personalized experiences for authenticated users. This architectural decision improved engagement metrics and reduced early-stage bounce rates.

### Optimized Media Pipeline

Client-side compression using `browser-image-compression` reduces payload by 60-80% before transmission. Server-side transformations via Cloudinary provide automated optimization:

- **Avatars**: Face-detection cropping with circular radius
- **Banners**: Wide-format (1500×500) optimization
- **Tweet Images**: Multi-file handling (up to 4) with responsive grid display

### Data Integrity

Standardized authorization flow using `req.id` as single source of truth from JWT payload. All protected endpoints reference `req.id` for precise user identification, ensuring referential integrity across the application.

---

## Live Demo

🌐 https://echo-socials.vercel.app

---

## License

MIT
