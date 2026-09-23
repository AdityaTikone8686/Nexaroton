import React from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import ToastHost from "./components/ToastHost.jsx";
import Home from "./pages/Home.jsx";
import Plans from "./pages/Plans.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Forum from "./pages/Forum.jsx";
import ForumCategory from "./pages/ForumCategory.jsx";
import ForumThread from "./pages/ForumThread.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import VerifyResetOTP from "./pages/VerifyResetOTP.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Payment from "./pages/Payment.jsx";

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/forum/c/:catId" element={<ForumCategory />} />
          <Route path="/forum/t/:threadId" element={<ForumThread />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-reset-otp" element={<VerifyResetOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/payment" element={<Payment />} />
        </Routes>
      </main>
      <Footer />
      <ToastHost />
    </>
  );
}
