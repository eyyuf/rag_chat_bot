import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Landing from './pages/Landing';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/Global.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <Admin />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Chatbot />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
