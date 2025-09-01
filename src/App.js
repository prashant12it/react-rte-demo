import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TinyMCEPage from './pages/TinyMCEPage';
import QuillPage from './pages/QuillPage';
import LexicalPage from './pages/LexicalPage';
import EditorJSPage from './pages/EditorJSPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

/**
 * Main App Component
 * Sets up React Router with all RTE pages and navigation
 */
function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="" element={<Home />} /> 
            <Route path="/tinymce" element={<TinyMCEPage />} />
            <Route path="/quill" element={<QuillPage />} />
            <Route path="/lexical" element={<LexicalPage />} />
            <Route path="/editorjs" element={<EditorJSPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
