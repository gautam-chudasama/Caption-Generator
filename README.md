# 📸 PicCaption

**AI-powered image captioning application that brings your photos to life with creative, funny Hinglish captions!**

[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen.svg)](https://mongodb.com/)
[![Gemini AI](https://img.shields.io/badge/AI-Google%20Gemini-orange.svg)](https://ai.google.dev/)

## ✨ Features

- 🤖 **AI-Powered Captions**: Generate creative and funny Hinglish captions using Google Gemini AI
- 📱 **Responsive Design**: Beautiful, modern UI that works seamlessly across all devices
- 🔐 **User Authentication**: Secure registration and login system with JWT tokens
- 🖼️ **Image Upload**: Easy drag-and-drop image upload with preview
- 🌟 **Feed System**: Browse and discover posts from the community
- 💾 **Cloud Storage**: Images stored securely using ImageKit CDN
- 🎨 **Glass Morphism UI**: Modern, aesthetic design with glass-like effects
- 📸 **Modal Gallery**: Full-screen image viewing with detailed captions
- 🔄 **Real-time Updates**: Dynamic loading states and error handling

<!-- ## 🚀 Live Demo

[View Live Application](https://your-deployed-app.com) *(Replace with your deployed URL)* -->

## 🛠️ Tech Stack

### Frontend
- **React 19.1.1** - Modern UI library with hooks
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Custom styling with CSS variables and animations

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **Multer** - File upload handling
- **bcryptjs** - Password hashing

### AI & Cloud Services
- **Google Gemini AI** - Caption generation
- **ImageKit** - Image CDN and optimization
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
piccaption/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   └── post.controller.js
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   └── post.model.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── post.routes.js
│   │   ├── middlewares/
│   │   │   └── auth.middleware.js
│   │   ├── services/
│   │   │   ├── ai.service.js
│   │   │   └── storage.service.js
│   │   ├── db/
│   │   │   └── db.js
│   │   └── app.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.jsx
│   │   ├── pages/
│   │   │   ├── Feed.jsx
│   │   │   ├── CreatePost.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- Google Gemini AI API key
- ImageKit account

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/piccaption.git
cd piccaption
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
# Database
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/piccaption

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
VITE_API_BASE_URL=http://localhost:3000
```

### 4. Running the Application

**Start Backend Server:**
```bash
cd backend
node server.js
```
Server will run on `http://localhost:3000`

**Start Frontend Development Server:**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### Posts
- `POST /api/posts` - Create new post with image
- `GET /api/posts` - Get all posts

## 🎯 Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Upload Image**: Click on "Create" to upload an image
3. **AI Caption Generation**: The system automatically generates a funny Hinglish caption
4. **View Feed**: Browse all posts in the community feed
5. **Interactive Gallery**: Click on any post to view in full screen

## 🎨 Features Showcase

### AI Caption Generation
The app uses Google Gemini AI to generate creative, funny captions in Hinglish style with:
- Emojis and hashtags
- Humorous context understanding
- Cultural references
- Trendy social media language

### Modern UI/UX
- **Glass Morphism Design**: Beautiful translucent cards with backdrop blur
- **Responsive Layout**: Seamless experience across desktop, tablet, and mobile
- **Smooth Animations**: Engaging transitions and hover effects
- **Dark Mode Support**: Automatic dark mode based on system preferences

### Performance Optimizations
- **Lazy Loading**: Images load as needed for better performance
- **Optimized Assets**: ImageKit CDN for fast image delivery
- **Error Boundaries**: Graceful error handling and retry mechanisms

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@gautam-chudasama](https://github.com/gautam-chudasama)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/gautam-chudasama)

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for AI-powered caption generation
- [ImageKit](https://imagekit.io/) for image CDN and optimization
- [React](https://reactjs.org/) community for excellent documentation
- [MongoDB](https://mongodb.com/) for database services

## 📊 Project Stats

- **React Components**: 8+
- **API Endpoints**: 5
- **Database Models**: 2
- **UI States**: Loading, Error, Success handling
- **Authentication**: JWT-based secure auth

## 🔮 Future Enhancements

- [ ] **Multiple Languages**: Support for more regional languages
- [ ] **Social Features**: Like, comment, and share functionality
- [ ] **User Profiles**: Detailed user profiles and post history
- [ ] **Image Filters**: Built-in image editing capabilities
- [ ] **Mobile App**: React Native mobile application
- [ ] **AI Improvements**: More AI models for diverse caption styles

---

**Made with ❤️ and AI magic**

*If you found this project helpful, please consider giving it a ⭐ star!*