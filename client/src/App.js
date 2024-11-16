import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from "./Components/Auth/Login";
import Signup from './Components/Auth/Signup';
import ProfilePage from './Pages/ProfilePage';
import HomePage from "./Pages/HomePage";
import BattlePage from "./Pages/BattlePage";
import JoinTeamPage from "./Pages/JoinTeamPage";
import ErrorPage from "./Pages/ErrorPage";
import { GoogleOAuthProvider } from '@react-oauth/google';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<GoogleOAuthProvider clientId={`47807524301-97t2ovb411oua4s6crhbbkotoiu5127r.apps.googleusercontent.com`}><Login /></GoogleOAuthProvider>} />
          <Route path="/signup" element={<GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}><Signup /></GoogleOAuthProvider>} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/battle" element={<BattlePage />} />
          <Route path="/practice" element={<JoinTeamPage />} />
          <Route path="*" element={<ErrorPage />} /> {/* Catch-all route for 404 */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
