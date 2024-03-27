import React, { useState, useEffect } from "react";
import './App.css';
import { Routes, Route} from 'react-router-dom'
import HomePage from './pages/HomePage';
import Header from './components/Header';
import Footer from './components/Footer';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme();

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <div className="App">
        <main>
          <Routes>
            <Route path='/' element={<HomePage />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
