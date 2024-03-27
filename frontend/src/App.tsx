import React, { useState, useEffect } from "react";
import './App.css';
import { Routes, Route} from 'react-router-dom'
import HomePage from './pages/HomePage';
import Header from './components/Header';
import Footer from './components/Footer';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme();

const App: React.FC = () => {
  const [data, setData] = useState<string | null>(null);

  // useEffect(() => {
  //   const callBackendAPI = async () => {
  //     try {
  //       const response = await fetch("/api");
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch data");
  //       }
  //       const body = await response.json();
  //       setData(body.message);
  //     } catch (error) {
  //       if (error instanceof Error) {
  //         console.error(error.message);
  //       }
  //     }
  //   };
  //   callBackendAPI();
  // }, []);
  
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <div className="App">
        <main>
          <Routes>
            <Route path='/' element={<HomePage />} />
            {/* <Route path='profile' element={<ProfilePage />} /> */}
          </Routes>
        </main>
      </div>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
