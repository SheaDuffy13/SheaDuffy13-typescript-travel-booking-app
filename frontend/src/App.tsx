import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SignInSignUpPage from "./pages/SignInSignUpPage";
import ProfilePage from "./pages/ProfilePage";
import BookingPage from "./pages/BookingPage";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AuthProvider } from "./context/AuthContext";

const theme = createTheme();

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <Header />
                <div className="App">
                    <main>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route
                                path="/signup"
                                element={<SignInSignUpPage />}
                            />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route
                                path="/booking/:id"
                                element={<BookingPage />}
                            />
                        </Routes>
                    </main>
                </div>
                <Footer />
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;
