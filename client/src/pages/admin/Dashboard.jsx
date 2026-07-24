import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import Title from "../../components/admin/Title";
import Loading from "../../components/Loading";
import toast from "react-hot-toast";
import { saveAs } from "file-saver";
import {
  Users,
  Film,
  MonitorPlay,
  Ticket,
  ArrowRight,
  Zap,
  IndianRupee,
  RefreshCw,
  CalendarDays,
  UserPlus,
  Armchair,
  TrendingUp,
  BarChart3,
  Activity,
  Server,
  CircleDollarSign,
  Download,
  ChartSpline,
  Receipt,
  Bell,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

const Dashboard = () => {
  const currency = import.meta.env.VITE_CURRENCY || "₹";
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMovies: 0,
    totalShows: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const chartData = [
    { name: "Users", value: stats.totalUsers },
    { name: "Movies", value: stats.totalMovies },
    { name: "Shows", value: stats.totalShows },
    { name: "Bookings", value: stats.totalBookings },
  ];
  const [revenueChart, setRevenueChart] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [topMovies, setTopMovies] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [period, setPeriod] = useState("30days");

  const formattedRevenueData = revenueChart.map((item) => ({
    date: new Date(item._id).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    }),
    revenue: item.revenue,
    bookings: item.bookings,
  }));

  const getDashboardData = async () => {
    try {
      const { data } = await api.get("/admin/dashboard");

      if (data.success) {
        console.log(data.data.recentBookings);
        setStats(data.data);
        setRecentBookings(data.data.recentBookings || []);
        setTopMovies(data.data.topMovies || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };
  const getRevenueChart = async () => {
    try {
      const { data } = await api.get(`/admin/revenue-chart?period=${period}`);

      if (data.success) {
        setRevenueChart(data.revenueData);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load revenue chart");
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      await Promise.all([getDashboardData(), getRevenueChart()]);

      toast.success("Dashboard refreshed");
    } catch (error) {
      toast.error("Refresh failed");
    } finally {
      setRefreshing(false);
    }
  };

  const exportBookings = () => {
    if (recentBookings.length === 0) {
      toast.error("No bookings to export");
      return;
    }

    const csv = [
      ["Movie", "User", "Seats", "Amount", "Payment", "Date"],
      ...recentBookings.map((booking) => [
        booking.movie?.title || "",
        booking.user?.name || "",
        `"${booking.seats.join(", ")}"`,
        booking.totalAmount,
        booking.paymentStatus,
        new Date(booking.createdAt).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    saveAs(blob, "recent-bookings.csv");

    toast.success("Bookings exported successfully");
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  useEffect(() => {
    getRevenueChart();
  }, [period]);

  if (loading) {
    return <Loading />;
  }

  const notifications = [
    {
      id: 1,
      type: "success",
      message: `${stats.totalBookings} bookings have been made.`,
    },
    {
      id: 2,
      type: "info",
      message: `${stats.totalUsers} users are registered.`,
    },
    {
      id: 3,
      type: "warning",
      message: `${topMovies.length} popular movies available.`,
    },
  ];

  const hour = new Date().getHours();

  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const currentTime = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex flex-col gap-8">

      <Title text1="Admin" text2="Dashboard" />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 bg-primary/10 border border-primary/20 rounded-2xl p-4 md:p-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">
            {greeting}, Admin 👋
          </h2>

          <p className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-lg leading-6">
            Monitor your movie platform, track bookings, manage users, and
            analyze business performance—all from one dashboard.
          </p>
        </div>

        <div className="mt-2 md:mt-0 text-left md:text-right">
          <p className="text-gray-600 dark:text-gray-400 text-sm uppercase tracking-widest">
            Today
          </p>

          <h3 className="font-semibold text-base md:text-lg">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </h3>
          <p className="text-primary text-sm md:text-base font-semibold mt-1">
            {currentTime}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className={`w-full md:w-auto flex items-center justify-center gap-2 px-4 md:px-5 py-2.5 md:py-3 rounded-xl font-medium transition-all duration-300 shadow-lg ${
            refreshing
              ? "bg-primary/50 cursor-not-allowed"
              : "bg-primary hover:bg-primary/90 hover:scale-105"
          }`}
        >
          <RefreshCw
            className={`w-4 h-4 md:w-5 md:h-5 ${refreshing ? "animate-spin" : ""}`}
          />

          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
        <div className="bg-primary/10 border border-primary/20 rounded-xl md:rounded-2xl p-3 md:p-5 flex items-center gap-3 md:gap-4 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
          <div className="bg-green-500/20 p-2.5 md:p-3 rounded-lg md:rounded-xl">
            <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
          </div>

          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Growth Today</p>

            <h3 className="text-lg md:text-2xl font-bold text-green-400">
              +12%
            </h3>

            <p className="hidden md:block text-xs text-gray-500 mt-1">
              Compared to yesterday
            </p>
          </div>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-xl md:rounded-2xl p-3 md:p-5 flex items-center gap-3 md:gap-4 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
          <div className="bg-blue-500/20 p-2.5 md:p-3 rounded-lg md:rounded-xl">
            <Ticket className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
          </div>

          <div>
            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">Tickets Sold</p>
            <h3 className="text-lg md:text-xl font-bold">
              {stats.totalBookings}
            </h3>
          </div>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-xl md:rounded-2xl p-3 md:p-5 flex items-center gap-3 md:gap-4 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
          <div className="bg-yellow-500/20 p-2.5 md:p-3 rounded-lg md:rounded-xl">
            <CircleDollarSign className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
          </div>

          <div>
            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">Avg Revenue</p>
            <h3 className="text-lg md:text-xl font-bold">
              {currency}
              {stats.totalBookings
                ? Math.round(stats.totalRevenue / stats.totalBookings)
                : 0}
            </h3>
          </div>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-xl md:rounded-2xl p-3 md:p-5 flex items-center gap-3 md:gap-4 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
          <div className="bg-green-500/20 p-2.5 md:p-3 rounded-lg md:rounded-xl">
            <Server className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
          </div>

          <div>
            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">Server Status</p>
            <h3 className="text-lg md:text-xl font-bold text-green-400 flex items-center gap-2">
              <Activity className="w-3 h-3 md:w-4 md:h-4" />
              <p className="text-green-400 text-sm">Online</p>
            </h3>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4 md:mb-5">
          <Zap className="w-5 h-5 md:w-6 md:h-6 text-primary" />
          <h2 className="text-xl md:text-2xl font-bold">Quick Actions</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <button
            onClick={() => navigate("/admin/add-movie")}
            className="group bg-primary/10 border border-primary/20 rounded-xl md:rounded-2xl p-4 md:p-6 text-left hover:bg-primary/20 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div className="bg-primary/20 p-2.5 md:p-3 rounded-lg md:rounded-xl">
                <Film className="w-5 h-5 md:w-7 md:h-7 text-primary" />
              </div>

              <ArrowRight className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition" />
            </div>

            <h3 className="font-bold text-base md:text-lg mt-3 md:mt-5">
              Add Movie
            </h3>

            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mt-1 md:mt-2 leading-5">
              Create and publish a new movie.
            </p>
          </button>

          <button
            onClick={() => navigate("/admin/add-shows")}
            className="group bg-primary/10 border border-primary/20 rounded-xl md:rounded-2xl p-4 md:p-6 text-left hover:bg-primary/20 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div className="bg-primary/20 p-2.5 md:p-3 rounded-lg md:rounded-xl">
                <MonitorPlay className="w-5 h-5 md:w-7 md:h-7 text-primary" />
              </div>

              <ArrowRight className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition" />
            </div>

            <h3 className="font-bold text-base md:text-lg mt-3 md:mt-5">
              Add Show
            </h3>

            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mt-1 md:mt-2 leading-5">
              Schedule movie shows quickly.
            </p>
          </button>

          <button
            onClick={() => navigate("/admin/list-users")}
            className="group bg-primary/10 border border-primary/20 rounded-xl md:rounded-2xl p-4 md:p-6 text-left hover:bg-primary/20 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div className="bg-primary/20 p-2.5 md:p-3 rounded-lg md:rounded-xl">
                <Users className="w-5 h-5 md:w-7 md:h-7 text-primary" />
              </div>

              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-gray-600 dark:text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition" />
            </div>

            <h3 className="font-bold text-base md:text-lg mt-3 md:mt-5">
              Users
            </h3>

            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mt-1 md:mt-2 leading-5">
              View and manage all registered users.
            </p>
          </button>

          <button
            onClick={() => navigate("/admin/list-bookings")}
            className="group bg-primary/10 border border-primary/20 rounded-xl md:rounded-2xl p-4 md:p-6 text-left hover:bg-primary/20 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div className="bg-primary/20 p-2.5 md:p-3 rounded-lg md:rounded-xl">
                <Ticket className="w-5 h-5 md:w-7 md:h-7 text-primary" />
              </div>

              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-gray-600 dark:text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition" />
            </div>

            <h3 className="font-bold text-base md:text-lg mt-3 md:mt-5">
              Bookings
            </h3>

            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mt-1 md:mt-2 leading-5">
              Check recent and upcoming bookings.
            </p>
          </button>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-4 md:mb-5">
          <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-primary" />
          <h2 className="text-xl md:text-2xl font-bold">Today's Overview</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Today's Bookings */}
          <div className="group bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl md:rounded-2xl p-4 md:p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  Today's Bookings
                </p>

                <h2 className="text-3xl md:text-4xl font-bold mt-2 md:mt-3 text-green-400">
                  {stats.todayBookings || 0}
                </h2>

                <p className="text-[11px] md:text-xs text-green-300 mt-1 md:mt-2">
                  Bookings completed today
                </p>
              </div>

              <div className="bg-green-500/20 p-3 md:p-4 rounded-xl md:rounded-2xl">
                <CalendarDays className="w-6 h-6 md:w-8 md:h-8 text-green-400" />
              </div>
            </div>
          </div>

          {/* New Users */}
          <div className="group bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl md:rounded-2xl p-4 md:p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">New Users</p>

                <h2 className="text-3xl md:text-4xl font-bold mt-2 md:mt-3 text-green-400">
                  {stats.newUsers || 0}
                </h2>

                <p className="text-[11px] md:text-xs text-green-300 mt-1 md:mt-2">
                  Joined this week
                </p>
              </div>

              <div className="bg-green-500/20 p-3 md:p-4 rounded-xl md:rounded-2xl">
                <UserPlus className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
              </div>
            </div>
          </div>

          {/* Occupancy */}
          <div className="group bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border border-yellow-500/20 rounded-xl md:rounded-2xl p-4 md:p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  Occupancy Rate
                </p>

                <h2 className="text-3xl md:text-4xl font-bold mt-2 md:mt-3 text-green-400">
                  {stats.occupancy || 0}%
                </h2>

                <p className="text-[11px] md:text-xs text-green-300 mt-1 md:mt-2">
                  Average seats filled
                </p>
              </div>

              <div className="bg-green-500/20 p-3 md:p-4 rounded-xl md:rounded-2xl">
                <Armchair className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-start md:items-center justify-between gap-3 mb-4 md:mb-5">
          <div>
            <h2 className="flex items-center gap-2 text-xl md:text-2xl font-bold">
              <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              Platform Statistics
            </h2>

            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
              Overall performance of your EasyBook platform
            </p>
          </div>

          <span className="bg-green-500/20 text-green-400 px-2.5 md:px-3 py-1 rounded-full text-[11px] md:text-xs font-semibold whitespace-nowrap">
            ● Live
          </span>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-5 gap-3 md:gap-6">
          {/* Users */}
          <div className="group bg-primary/10 border border-primary/20 rounded-xl md:rounded-2xl p-4 md:p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Total Users</p>

                <h2 className="text-2xl md:text-4xl font-bold mt-2 md:mt-3">
                  {stats.totalUsers}
                </h2>
              </div>

              <div className="bg-primary/20 p-2.5 md:p-3 rounded-lg md:rounded-xl">
                <Users className="w-5 h-5 md:w-7 md:h-7 text-primary" />
              </div>
            </div>
          </div>

          {/* Movies */}
          <div className="group bg-primary/10 border border-primary/20 rounded-xl md:rounded-2xl p-4 md:p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Movies</p>

                <h2 className="text-2xl md:text-4xl font-bold mt-2 md:mt-3">
                  {stats.totalMovies}
                </h2>
              </div>

              <div className="bg-primary/20 p-2.5 md:p-3 rounded-lg md:rounded-xl">
                <Film className="w-5 h-5 md:w-7 md:h-7 text-primary" />
              </div>
            </div>
          </div>

          {/* Shows */}
          <div className="group bg-primary/10 border border-primary/20 rounded-xl md:rounded-2xl p-4 md:p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Shows</p>

                <h2 className="text-2xl md:text-4xl font-bold mt-2 md:mt-3">
                  {stats.totalShows}
                </h2>
              </div>

              <div className="bg-primary/20 p-2.5 md:p-3 rounded-lg md:rounded-xl">
                <MonitorPlay className="w-5 h-5 md:w-7 md:h-7 text-primary" />
              </div>
            </div>
          </div>

          {/* Bookings */}
          <div className="group bg-primary/10 border border-primary/20 rounded-xl md:rounded-2xl p-4 md:p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Bookings</p>

                <h2 className="text-2xl md:text-4xl font-bold mt-2 md:mt-3">
                  {stats.totalBookings}
                </h2>
              </div>

              <div className="bg-primary/20 p-2.5 md:p-3 rounded-lg md:rounded-xl">
                <Ticket className="w-5 h-5 md:w-7 md:h-7 text-primary" />
              </div>
            </div>
          </div>

          {/* Revenue */}
          <div className="group bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-xl md:rounded-2xl p-4 md:p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Revenue</p>

                <h2 className="text-xl md:text-3xl font-bold mt-2 md:mt-3 text-primary break-all">
                  {currency}
                  {stats.totalRevenue.toLocaleString("en-IN")}
                </h2>
              </div>

              <div className="bg-primary/20 p-2.5 md:p-3 rounded-lg md:rounded-xl">
                <IndianRupee className="w-4 h-4 md:w-7 md:h-7 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary/10 border border-primary/20 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg">
        <div className="flex items-start md:items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="flex items-center gap-2 text-xl md:text-2xl font-bold">
              <Activity className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              Recent Activity
            </h2>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
              Latest booking activities
            </p>
          </div>

          <span className="px-2.5 md:px-3 py-1 text-[11px] md:text-xs rounded-full bg-primary/20 text-primary whitespace-nowrap">
            {recentBookings.length} Activities
          </span>
        </div>

        {recentBookings.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-3xl">
              🎬
            </div>

            <h3 className="mt-4 text-lg font-semibold">No Recent Activity</h3>

            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              New bookings will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-5">
            {recentBookings.slice(0, 5).map((booking) => (
              <div
                key={booking._id}
                className="group flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-black/10 hover:bg-primary/10 transition duration-300"
              >
                {/* Avatar */}
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary text-gray-900 dark:text-white flex items-center justify-center font-bold text-base md:text-lg shadow-lg flex-shrink-0">
                  {booking.user?.name?.charAt(0).toUpperCase()}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p className="text-sm md:text-base font-medium leading-5 md:leading-6">
                    <span className="text-primary font-semibold">
                      {booking.user?.name}
                    </span>{" "}
                    booked{" "}
                    <span className="text-gray-900 dark:text-white">{booking.movie?.title}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] md:text-xs text-gray-600 dark:text-gray-400">
                    <span>
                      {new Date(booking.createdAt).toLocaleDateString("en-IN")}
                    </span>

                    <span>•</span>

                    <span>
                      {new Date(booking.createdAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div className="flex flex-col items-end flex-shrink-0">
                  <span className="px-2 md:px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-[10px] md:text-xs font-medium">
                    Completed
                  </span>

                  <span className="text-sm md:text-base text-primary font-bold mt-2">
                    {currency}
                    {booking.totalAmount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Revenue Chart */}

        <div className="lg:col-span-2 bg-primary/10 rounded-xl border border-primary/20 p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                <ChartSpline className="w-6 h-6 text-primary" />
                Analytics
              </h2>

              <p className="text-sm text-gray-600 dark:text-gray-400">Revenue and bookings</p>
            </div>
          </div>
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex gap-2">
              {["7days", "30days", "1year"].map((item) => (
                <button
                  key={item}
                  onClick={() => setPeriod(item)}
                  className={`px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 ${
                    period === item
                      ? "bg-primary text-gray-900 dark:text-white shadow-lg shadow-primary/30"
                      : "bg-gray-100 dark:bg-black/20 text-gray-900 dark:text-gray-300 hover:bg-primary/20"
                  }`}
                >
                  {item === "7days"
                    ? "7 Days"
                    : item === "30days"
                      ? "30 Days"
                      : "1 Year"}
                </button>
              ))}
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold">
                Revenue Analytics
              </h2>

              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Daily revenue performance
              </p>
            </div>

            <div className="text-left md:text-right">
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Revenue</p>

              <h2 className="text-2xl md:text-3xl font-bold text-primary">
                {currency}
                {stats.totalRevenue.toLocaleString("en-IN")}
              </h2>

              <p className="text-green-400 text-sm mt-1 flex justify-end items-center gap-1">
                ↗ Growing steadily
              </p>
            </div>
          </div>

          <div className="h-[250px] md:h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={formattedRevenueData}>
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.6} />

                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>

                  <linearGradient
                    id="bookingGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.5} />

                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="#374151"
                />

                <XAxis dataKey="date" stroke="#9CA3AF" />

                <YAxis stroke="#9CA3AF" />

                <Tooltip
                  contentStyle={{
                    background: "#111827",
                    border: "1px solid #6366f1",
                    borderRadius: "12px",
                  }}
                  formatter={(value, name) => {
                    if (name === "revenue") {
                      return [`${currency}${value}`, "Revenue"];
                    }

                    return [value, "Bookings"];
                  }}
                />

                <Legend />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  fill="url(#revenueGradient)"
                  strokeWidth={3}
                  animationDuration={1200}
                />

                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="#22c55e"
                  fill="url(#bookingGradient)"
                  strokeWidth={3}
                  animationDuration={1200}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Movies */}
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 md:p-6 shadow-xl hover:shadow-primary/20 transition-all duration-300 h-[520px] md:h-[730px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg md:text-xl font-bold">
                Top Performing Movies
              </h2>

              <p className="text-gray-600 dark:text-gray-400 text-sm">Based on total bookings</p>
            </div>

            <span className="text-2xl md:text-3xl">🎬</span>
          </div>

          {topMovies.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No booking data available.</p>
          ) : (
            <div className="space-y-5 overflow-y-auto pr-2 flex-1 custom-scroll">
              {topMovies.map((item, index) => (
                <div
                  key={item.movie._id}
                  className="group flex gap-3 md:gap-4 items-center p-2 md:p-3 rounded-xl hover:bg-primary/10 hover:scale-[1.02] transition-all duration-300"
                >
                  {/* Ranking */}
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0
                        ? "bg-yellow-500/20 text-yellow-400"
                        : index === 1
                          ? "bg-gray-500/20 text-gray-900 dark:text-gray-300"
                          : index === 2
                            ? "bg-orange-500/20 text-orange-400"
                            : "bg-primary/20 text-primary"
                    }`}
                  >
                    {index + 1}
                  </div>

                  {/* Poster */}
                  <img
                    src={item.movie.poster_path}
                    alt={item.movie.title}
                    className="w-12 h-18 md:w-16 md:h-24 rounded-xl object-cover shadow-lg border border-gray-600 dark:border-white/10 transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm md:text-base text-gray-900 dark:text-white truncate">
                      {item.movie.title}
                    </h3>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="px-2 md:px-3 py-1 text-[10px] md:text-xs rounded-full bg-primary/15 text-primary text-xs font-medium">
                        🎟️ {item.bookings} Bookings
                      </span>

                      <span className="px-2 md:px-3 py-1 text-[10px] md:text-xs rounded-full bg-green-500/15 text-green-400 text-xs font-medium">
                        💰 {currency}
                        {item.revenue}
                      </span>
                    </div>

                    {/* Popularity bar */}
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400 font-medium">
                          Popularity Score
                        </span>

                        <span className="text-[10px] md:text-xs font-semibold text-primary">
                          {Math.min(item.bookings * 10, 100)}%
                        </span>
                      </div>

                      <div className="w-full h-2.5 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 transition-all duration-1000"
                          style={{
                            width: `${Math.min(item.bookings * 10, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-primary/10 rounded-xl border border-primary/20 p-4 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <Receipt className="w-6 h-6 text-primary" />
              Recent Bookings
            </h2>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Latest customer ticket purchases
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <span className="bg-primary/15 text-primary px-3 py-2 rounded-full text-xs md:text-sm font-medium text-center">
              {recentBookings.length} Records
            </span>

            <button
              onClick={exportBookings}
              className="flex items-center justify-center gap-2 bg-primary text-gray-900 dark:text-white px-4 py-2 rounded-lg text-sm md:text-base"
            >
              <Download size={18} />
              Export CSV
            </button>
          </div>
        </div>

        {recentBookings.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No bookings found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1000px] w-full text-left">
              <thead>
                <tr className="border-b border-primary/20 text-gray-600 dark:text-gray-400 text-sm">
                  <th className="py-3">Movie</th>
                  <th className="py-3">User</th>
                  <th className="py-3">Seats</th>
                  <th className="py-3">Amount</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Date</th>
                  <th className="py-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {recentBookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="border-b border-primary/10 hover:bg-primary/5 transition"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={booking.movie?.poster_path}
                          alt=""
                          className="w-8 h-12 md:w-10 md:h-14 rounded object-cover"
                        />

                        <div>
                          <p className="font-medium text-sm md:text-base">
                            {booking.movie?.title || "Deleted Movie"}
                          </p>

                          <p className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400">
                            Booking ID: {booking._id.slice(-6)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div>
                        <p className="font-medium">{booking.user?.name}</p>

                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {booking.user?.email}
                        </p>
                      </div>
                    </td>

                    <td>
                      <div className="flex flex-wrap gap-1">
                        {booking.seats.map((seat) => (
                          <span
                            key={seat}
                            className="bg-primary/20 px-2 py-1 rounded text-[10px] md:text-xs"
                          >
                            {seat}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td>
                      <p className="font-semibold text-green-400">
                        {currency}
                        {booking.totalAmount}
                      </p>
                    </td>

                    <td>
                      <span
                        className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs ${
                          booking.paymentStatus === "paid"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {booking.paymentStatus}
                      </span>
                    </td>

                    <td>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(booking.createdAt).toLocaleDateString(
                          "en-IN",
                        )}
                      </p>
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="bg-primary/20 text-primary px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm hover:bg-primary/30 transition"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-[#111827] w-[95%] max-w-lg rounded-2xl p-4 md:p-7 border border-primary/20 shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between border-b border-primary/10 pb-4 mb-6">
              <h2 className="text-xl font-bold">Booking Details</h2>

              <button
                onClick={() => setSelectedBooking(null)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-primary/10 hover:bg-red-500 hover:text-gray-900 dark:text-white transition-all duration-300 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-5 items-center sm:items-start text-center sm:text-left">
              <img
                src={selectedBooking.movie?.poster_path}
                alt=""
                className="w-24 h-36 md:w-28 md:h-40 rounded-xl object-cover shadow-lg"
              />

              <div>
                <h3 className="text-xl md:text-2xl font-bold">
                  {selectedBooking.movie?.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">Booking ID:</p>

                <p className="text-xs">{selectedBooking._id}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="bg-primary/10 rounded-xl p-4 border border-primary/10">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Customer</p>
                <p className="font-semibold">{selectedBooking.user?.name}</p>
              </div>

              <div className="bg-primary/10 rounded-xl p-4 border border-primary/10">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Payment</p>

                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    selectedBooking.paymentStatus === "paid"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {selectedBooking.paymentStatus}
                </span>
              </div>

              <div className="bg-primary/10 rounded-xl p-4 border border-primary/10">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Seats</p>

                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedBooking.seats.map((seat) => (
                    <span
                      key={seat}
                      className="bg-primary/20 px-2 py-1 rounded text-xs"
                    >
                      {seat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-primary/10 rounded-xl p-4 border border-primary/10">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Amount</p>

                <p className="text-xl md:text-2xl font-bold text-green-400">
                  {currency}
                  {selectedBooking.totalAmount}
                </p>
              </div>
            </div>

            <div className="mt-5 border-t border-primary/10 pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Booking Date</p>

              <p className="mt-1">
                {new Date(selectedBooking.createdAt).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 md:p-6">
        <h2 className="flex items-center gap-2 text-lg md:text-xl font-bold mb-4 md:mb-5">
          <Bell className="w-6 h-6 text-primary" />
          Dashboard Notifications
        </h2>

        <div className="space-y-4">
          {notifications.map((item) => (
            <div
              key={item.id}
              className="flex items-start md:items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg bg-gray-100 dark:bg-black/20 hover:bg-black/30 transition"
            >
              <div
                className={`w-4 h-4 rounded-full ${
                  item.type === "success"
                    ? "bg-green-500"
                    : item.type === "warning"
                      ? "bg-yellow-500"
                      : "bg-blue-500"
                }`}
              ></div>

              <div className="flex-1">
                <p className="text-sm md:text-base text-gray-900 dark:text-gray-300 leading-5">
                  {item.message}
                </p>

                <p className="text-[11px] md:text-xs text-gray-500 mt-1">
                  {item.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
