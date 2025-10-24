# CodeKeep - Personal Code Snippet Manager

A modern, full-stack MERN application for managing and organizing code snippets with a beautiful, animated UI.

## 🚀 Features

- **3-Column Layout**: Native app-style interface similar to Apple Notes or Bear
- **Authentication**: Secure JWT-based user authentication
- **Collections**: Organize snippets into custom collections
- **Favorites**: Mark important snippets as favorites
- **Tags**: Categorize snippets with custom tags
- **Search**: Find snippets by title, language, or code content
- **Syntax Highlighting**: Beautiful code display with syntax highlighting
- **Markdown Support**: Rich text explanations with Markdown support
- **Animations**: Smooth, modern animations with Framer Motion
- **Responsive Design**: Works perfectly on desktop and mobile

## 🛠 Tech Stack

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **shadcn/ui** components (New York style, Slate color)
- **Framer Motion** for animations
- **Zustand** for state management
- **React Router** for navigation
- **Axios** for API calls
- **React Syntax Highlighter** for code display
- **React Markdown** for rich text

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CodeKeep
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   
   Create `backend/.env`:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/codekeep
   JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
   JWT_EXPIRE=7d
   ```

   Create `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the application**
   ```bash
   npm run dev
   ```

   This will start both the backend (port 5000) and frontend (port 5173) concurrently.

## 🎯 Usage

### Getting Started
1. Open your browser and navigate to `http://localhost:5173`
2. Create a new account or sign in
3. Create your first collection
4. Add code snippets with explanations
5. Organize with tags and favorites

### Key Features

#### Collections
- Create custom collections to organize your snippets
- Switch between collections to filter snippets
- View favorites across all collections

#### Snippets
- Add snippets with title, code, language, and explanation
- Use Markdown for rich explanations
- Tag snippets for easy categorization
- Mark important snippets as favorites
- Copy code with one click

#### Search & Filter
- Search snippets by title, language, or code content
- Filter by tags
- View only favorites
- Sort by collection

## 🏗 Project Structure

```
CodeKeep/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── collection.controller.js
│   │   └── snippet.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── collection.model.js
│   │   └── snippet.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── collection.routes.js
│   │   └── snippet.routes.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/          # shadcn/ui components
│   │   │   ├── Layout.jsx
│   │   │   ├── SnippetCard.jsx
│   │   │   ├── SnippetDisplay.jsx
│   │   │   └── NewSnippetDialog.jsx
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── store/
│   │   │   └── useAppStore.js
│   │   ├── lib/
│   │   │   └── utils.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Collections
- `GET /api/collections` - Get all collections
- `GET /api/collections/:id` - Get single collection
- `POST /api/collections` - Create collection
- `PUT /api/collections/:id` - Update collection
- `DELETE /api/collections/:id` - Delete collection

### Snippets
- `GET /api/snippets` - Get all snippets
- `GET /api/snippets/:id` - Get single snippet
- `POST /api/snippets` - Create snippet
- `PUT /api/snippets/:id` - Update snippet
- `DELETE /api/snippets/:id` - Delete snippet
- `PATCH /api/snippets/:id/favorite` - Toggle favorite

## 🎨 UI Components

Built with shadcn/ui components:
- **Button** - Interactive buttons with variants
- **Card** - Content containers
- **Dialog** - Modal dialogs for forms
- **Sheet** - Collapsible sidebar
- **Input** - Form inputs
- **DropdownMenu** - Action menus
- **Badge** - Tags and labels
- **Select** - Dropdown selections
- **Textarea** - Multi-line text input

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or use a cloud MongoDB service
2. Update `MONGODB_URI` in environment variables
3. Set `NODE_ENV=production`
4. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the frontend: `cd frontend && npm run build`
2. Deploy the `dist` folder to platforms like Vercel, Netlify, or GitHub Pages
3. Update `VITE_API_URL` to point to your deployed backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [React Syntax Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter) for code highlighting
- [React Markdown](https://github.com/remarkjs/react-markdown) for Markdown support
