import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home, BarChart3 } from 'lucide-react';
import SurveyPage from './pages/SurveyPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                {/* <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div> */}
                <span className="font-bold text-gray-900">Evaluación Técnica</span>
              </div>
              
              <div className="flex gap-4">
                <Link
                  to="/"
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span className="font-medium">Encuesta</span>
                </Link>
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="font-medium">Admin</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>
        
        {/* Routes */}
        <Routes>
          <Route path="/" element={<SurveyPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
