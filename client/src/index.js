import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import "./index.css";
import PostDetail from "./pages/PostDetail";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import Categories from "./pages/Categories";
import EditCategory from "./pages/EditCategory";
import Blog from './pages/Blog';
import Likes from "./pages/Likes";
import { Toaster } from "react-hot-toast";
import EmailVerificationPage from "./pages/EmailVerification";
import Profile from "./pages/Profile";
import CategoryPosts from "./components/Category/CategoryPosts";
import Users from "./components/Users";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

 
const router = createBrowserRouter([
  // AUTH
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },

  { path: '/', element: <Home /> },

  // POST
  { path: '/blog', element: <Blog /> },
  { path: '/blog/:slug/:post_id', element: <PostDetail /> },
  { path: '/post/create', element: <CreatePost /> },
  { path: '/post/edit/:slug', element: <EditPost /> },
  { path: '/likes', element: <Likes /> },

  // CATEGORY
  { path: '/categories', element: <Categories /> },
  { path: '/categories/edit/:category_id', element: <EditCategory /> },
  { path: '/category-posts/:category_id', element: <CategoryPosts /> },

  { path: '/verify-email', element: <EmailVerificationPage /> },
  { path: '/forget-password', element: <ForgotPassword /> },
  { path: '/reset-password/:token', element: <ResetPassword /> },


  { path: '/users', element: <Users /> },  
  { path: '/profile/:user_id', element: <Profile /> },
]);



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
  </React.StrictMode>

  
)
