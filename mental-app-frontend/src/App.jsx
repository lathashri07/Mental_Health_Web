import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import SleepTracker from "./SleepTracker";
import DoctorsPage from "./DoctorsPage";
import VirtualDoctor from "./VirtualDoctor";
import ForgotPassword from "../components/utils/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Chatbot from "./Chatbot";
import MusicTherapy from "./MusicTherapy";
import MusicPlayer from "./MusicPlayer";
import VideoTherapy from "./VideoTherapy";
import VideoPlayer from "./VideoPlayer";
import BooksLibrary from "./BooksLibrary";
import BookReader from "./BookReader";
import LandingPage from "../pages/LandingPage";
import FaceRecognition from "./FaceRecognition";
import Feedback from "./Feedback";


function App() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword/>} />
      <Route path="/reset-password/:token" element={<ResetPassword/>} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/sleep-tracker" element={<SleepTracker />} />
      <Route path="/doctors" element={<DoctorsPage />} />
      <Route path="/virtual-doctor" element={<VirtualDoctor />} />
      <Route path="/chatbot" element={<Chatbot />} />
      <Route path="/music-therapy" element={<MusicTherapy />} />
      <Route path="/music-player" element={<MusicPlayer />} />
      <Route path="/video-therapy" element={<VideoTherapy />} />
      <Route path="/video-player" element={<VideoPlayer />} />
      <Route path="/books-library" element={<BooksLibrary />} />
      <Route path="/book-reader" element={<BookReader />} />
      <Route path="/face-recognition" element={<FaceRecognition />} />
      <Route path="/feedback" element={<Feedback/>} />  
      <Route path="/" element={<LandingPage />} />
    </Routes>
  );
}

export default App;
