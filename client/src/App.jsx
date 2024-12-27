import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Register from "./components/Register";
import LoginPage from "./components/LoginPage";
import LandingPage from "./components/LandingPage";
import VerifyOTP from "./components/verifyOTP";
// import Chatboard from "./components/chatContent/Chatboard.jsx";
import DasbBoard from "./components/chatContent/DasbBoard";
import GroupCreator from "./components/chatContent/GroupCreater.jsx";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/verify-OTP" element={<VerifyOTP />} />
          <Route path="/chatboard" element={<DasbBoard />} />
          <Route path="/group" element={<GroupCreator />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
