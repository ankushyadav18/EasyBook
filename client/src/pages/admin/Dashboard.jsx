import React from "react";
import { StarIcon } from "lucide-react";
import { dummyDashboardData, dummyShowsData } from "../../assets/assets";
import Title from "../../components/admin/Title";
import BlurCircle from "../../components/BlurCircle";

// ✅ Import environment currency
const currency = import.meta.env.VITE_CURRENCY || "₹";

// ✅ Helper function for Indian currency format
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const Dashboard = () => {
  // Calculate basic stats
  const calculateStats = () => {
    const totalBookings = dummyDashboardData.totalBookings || 0;
    const totalRevenue = dummyDashboardData.totalRevenue || 0;
    const totalUsers = dummyDashboardData.totalUser || 0;
    const activeShows = dummyDashboardData.activeShows?.length || 0;

    return { totalBookings, totalRevenue, totalUsers, activeShows };
  };

  const stats = calculateStats();

  // Prepare active shows data
  const activeShows =
    dummyDashboardData.activeShows?.map((show) => ({
      id: show._id,
      title: show.movie?.title || "Unknown Show",
      price: show.showPrice || 50,
      date: formatShowDate(show.showDateTime),
      seats: calculateSeatAvailability(show),
      rating: show.movie?.vote_average?.toFixed(1) || 0,
      showData: show,
    })) || [];

  // Format date
  function formatShowDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  // Calculate seat availability
  function calculateSeatAvailability(show) {
    const totalSeats = 50;
    const occupiedSeats = Object.keys(show.occupiedSeats || {}).length;
    const availableSeats = totalSeats - occupiedSeats;

    return availableSeats === 0
      ? "Sold Out"
      : availableSeats === totalSeats
      ? "Max"
      : `${availableSeats} left`;
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <Title text1="Admin" text2="Dashboard" />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Bookings */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-blue-100 text-sm font-medium">
                Total Bookings
              </h3>
              <p className="text-3xl font-bold mt-2">{stats.totalBookings}</p>
            </div>
            <div className="text-3xl bg-blue-400 bg-opacity-30 p-3 rounded-full">
              📊
            </div>
          </div>
        </div>

        {/* ✅ Total Revenue (changed to ₹) */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-green-100 text-sm font-medium">
                Total Revenue
              </h3>
              <p className="text-3xl font-bold mt-2">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
            <div className="text-3xl bg-green-400 bg-opacity-30 p-3 rounded-full">
              💰
            </div>
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-purple-100 text-sm font-medium">Total Users</h3>
              <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
            </div>
            <div className="text-3xl bg-purple-400 bg-opacity-30 p-3 rounded-full">
              👥
            </div>
          </div>
        </div>

        {/* Active Shows */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-orange-100 text-sm font-medium">Active Shows</h3>
              <p className="text-3xl font-bold mt-2">{stats.activeShows}</p>
            </div>
            <div className="text-3xl bg-orange-400 bg-opacity-30 p-3 rounded-full">
              🎭
            </div>
          </div>
        </div>
      </div>

      {/* Active Shows Section */}
      <div className="rounded-xl shadow-sm border border-gray-100/20 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-400">Active Shows</h2>
          <span className="text-sm text-gray-500 bg-gray-100/20 px-3 py-1 rounded-full">
            {activeShows.length} shows
          </span>
        </div>

        {activeShows.length > 0 ? (
          <div className="relative flex flex-wrap mt-4 max-w-5xl gap-6">
            <BlurCircle top="100px" left="-10%" />
            {activeShows.map((show) => (
              <div
                key={show.id}
                className="border border-primary/20 bg-primary/10 w-55 rounded-lg pb-3 overflow-hidden h-full hover:-translate-y-1 transition duration-300"
              >
                {/* Poster & Info */}
                <div className="flex flex-col items-start mb-3">
                  <img
                    src={show.showData.movie.poster_path}
                    alt={show.title}
                    className="w-full h-60 rounded object-cover mb-2"
                  />
                  <div className="flex justify-between w-full px-2">
                    <h3 className="text-lg font-semibold text-gray-500 line-clamp-2 flex-1 mr-2">
                      {show.title}
                    </h3>
                    {/* ✅ Updated to Indian currency */}
                    <span className="text-blue-600 font-bold text-lg whitespace-nowrap">
                      {formatCurrency(show.price)}
                    </span>
                  </div>

                  {/* Rating */}
                  <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 px-2">
                    <StarIcon className="w-4 h-4 text-primary fill-primary" />
                    {show.rating}
                  </p>

                  {/* Genres */}
                  <div className="flex flex-wrap gap-1 mt-2 px-2">
                    {show.showData.movie.genres?.slice(0, 2).map((genre) => (
                      <span
                        key={genre.id}
                        className="text-xs bg-blue-100/30 text-blue-800 px-2 py-1 rounded-full"
                      >
                        {genre.name}
                      </span>
                    ))}
                    {show.showData.movie.genres?.length > 2 && (
                      <span className="text-xs bg-gray-100/30 text-gray-600 px-2 py-1 rounded-full">
                        +{show.showData.movie.genres.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                {/* Seat Info */}
                <div className="space-y-2 px-2">
                  <span
                    className={`text-sm font-medium px-2 py-1 rounded-full ${
                      show.seats === "Sold Out"
                        ? "bg-red-100/30 text-red-800"
                        : show.seats === "Max"
                        ? "bg-green-100/30 text-green-800"
                        : "bg-yellow-100/30 text-yellow-800"
                    }`}
                  >
                    {show.seats}
                  </span>
                  <p className="text-gray-500 text-sm flex items-center">
                    <span className="mr-2">📅</span>
                    {show.date}
                  </p>
                </div>

                {/* Extra Info */}
                <div className="mt-3 pt-3 border-t border-gray-100/20 px-2">
                  <p className="text-xs text-gray-400">
                    Show ID: {show.id.substring(0, 8)}...
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎭</div>
            <p className="text-gray-500 text-lg">No active shows scheduled</p>
            <p className="text-gray-400 text-sm mt-2">
              Add new shows to see them here
            </p>
          </div>
        )}
      </div>

      {/* Bottom Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="bg-primary/10 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">Total Movies in Database</p>
          <p className="text-xl font-bold text-gray-800">{dummyShowsData.length}</p>
        </div>
        <div className="bg-primary/10 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">Average Ticket Price</p>
          {/* ✅ Changed to Indian currency */}
          <p className="text-xl font-bold text-gray-800">
            {formatCurrency(
              Math.round(
                activeShows.reduce((acc, show) => acc + show.price, 0) /
                  (activeShows.length || 1)
              )
            )}
          </p>
        </div>
        <div className="bg-primary/10 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">Upcoming Shows</p>
          <p className="text-xl font-bold text-gray-800">
            {activeShows.filter(
              (show) => new Date(show.showData.showDateTime) > new Date()
            ).length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
