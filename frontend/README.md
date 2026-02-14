# RAG Chat Frontend

Modern React frontend for the RAG (Retrieval Augmented Generation) chat application.

## Features

- **Authentication**: JWT-based login/signup with role management
- **Protected Routes**: Role-based access control (user/admin)
- **Chat Interface**: Interactive AI chat with document Q&A
- **Admin Dashboard**: Document upload and management
- **Pure CSS**: No inline styles or CSS-in-JS libraries

## Tech Stack

- React 18
- Vite
- React Router DOM
- Axios
- Pure CSS

## Installation

```bash
npm install
```

## Environment Setup

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

For production, update to your deployed backend URL.

## Running the App

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── app/
│   ├── router.jsx       # React Router configuration
│   └── axios.js         # Axios instance with interceptors
├── pages/
│   ├── Landing.jsx      # Main landing page with chat
│   ├── Login.jsx        # Login page
│   ├── Signup.jsx       # Registration page
│   ├── AdminDashboard.jsx  # Admin panel
│   └── NotFound.jsx     # 404 page
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx           # Navigation bar
│   │   └── ProtectedRoute.jsx   # Route guard
│   ├── chat/
│   │   ├── ChatWidget.jsx       # Floating chat button
│   │   ├── ChatWindow.jsx       # Chat interface
│   │   ├── MessageBubble.jsx    # Message component
│   │   └── TypingIndicator.jsx  # Loading animation
│   └── admin/
│       ├── UploadForm.jsx       # File upload
│       └── DocumentList.jsx     # Document table
├── context/
│   └── AuthContext.jsx  # User state management
├── hooks/
│   └── useAuth.js       # Auth context hook
├── services/
│   ├── auth.service.js      # Auth API calls
│   ├── chat.service.js      # Chat API calls
│   └── document.service.js  # Document API calls
└── styles/
    ├── variables.css    # CSS variables (colors, spacing)
    ├── base.css         # Global reset & base styles
    ├── layout.css       # Layout & navbar styles
    ├── auth.css         # Login/signup styles
    ├── chat.css         # Chat interface styles
    ├── admin.css        # Admin dashboard styles
    └── pages.css        # Landing & 404 styles
```

## User Roles

### Regular User
- Access landing page
- Use chat to ask questions about documents
- View their own data

### Admin
- All user permissions
- Upload documents (PDF, TXT)
- View all documents
- Delete documents

## Usage Flow

1. **Sign Up / Login**: Create an account or sign in
2. **Chat**: Ask questions about uploaded documents
3. **Admin Access** (if admin role): 
   - Navigate to Admin Dashboard
   - Upload documents
   - Manage document library

## Deployment

Deploy to any static hosting service (Vercel, Netlify, etc.):

1. Build the production bundle: `npm run build`
2. Deploy the `dist/` folder
3. Set environment variable `VITE_API_URL` to your backend URL

## Notes

- All styling is done with pure CSS (no Tailwind, no inline styles)
- JWT authentication with automatic token refresh handling
- Responsive design for mobile and desktop
