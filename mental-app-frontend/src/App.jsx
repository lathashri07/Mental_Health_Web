import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import SleepTracker from "./SleepTracker";
import DoctorsPage from "./DoctorsPage";
import ForgotPassword from "../components/utils/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup" />} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword/>} />
      <Route path="/reset-password/:token" element={<ResetPassword/>} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/sleep-tracker" element={<SleepTracker />} />
      <Route path="/doctors" element={<DoctorsPage />} />
      <Route path="/" element={<Login />} />
    </Routes>
  );
}

export default App;
