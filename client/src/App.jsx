import React from "react";
import { useAppContext } from "./context/AppContext";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import SeatLayout from "./pages/SeatLayout";
import MyBooking from "./pages/MyBooking";
import Favorite from "./pages/Favorite";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import Layout from "./pages/admin/Layout";
import Dashboard from "./pages/admin/Dashboard";
import AddShows from "./pages/admin/AddShows";
import ListBookings from "./pages/admin/ListBookings";
import ListShows from "./pages/admin/ListShows";
import AddMovie from "./pages/admin/AddMovie";
import ListMovies from "./pages/admin/ListMovies";
import Profile from "./pages/Profile";
import EditMovie from "./pages/admin/EditMovie";
import AdminRoute from "./components/AdminRoute";
import ListUsers from "./pages/admin/ListUsers";
import AdminSettings from "./pages/admin/AdminSettings";
import SettingsPage from "./pages/Settings";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";

// Import Login Popup
import Login from "./components/Login";
import EditShow from "./pages/admin/EditShow";

const App = () => {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");
const isMovieDetails = /^\/movies\/[^/]+$/.test(location.pathname);
const isSeatLayout = /^\/movies\/[^/]+\/[^/]+$/.test(location.pathname);
const { showLogin, setShowLogin } = useAppContext();

  return (
    <>
      <Toaster />

      {/* Login Popup */}
      {showLogin && <Login setShowLogin={setShowLogin} />}

      {!isAdminRoute && !isMovieDetails && !isSeatLayout && <Navbar setShowLogin={setShowLogin} />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/movies/:id/:date" element={<SeatLayout />} />
        <Route path="/my-bookings" element={<MyBooking />} />
        <Route path="/favorites" element={<Favorite />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />

        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <Layout />
            </AdminRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="add-movie" element={<AddMovie />} />
          <Route path="edit-movie/:id" element={<EditMovie />} />
          <Route path="add-shows" element={<AddShows />} />
          <Route path="edit-show/:id" element={<EditShow />} />
          <Route path="list-shows" element={<ListShows />} />
          <Route path="list-users" element={<ListUsers />} />
          <Route path="list-bookings" element={<ListBookings />} />
          <Route path="list-movies" element={<ListMovies />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>

      {!isAdminRoute && !isSeatLayout && !isMovieDetails && <Footer />}
    </>
  );
};

export default App;
