import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import api from "../../lib/api";
import toast from "react-hot-toast";
import { dateFormat } from "../../lib/dateFormat";

const ListUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllUsers = async () => {
    try {
      const { data } = await api.get("/auth/users");

      if (data.success) {
        setUsers(data.users);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmDelete) return;

    try {
      const { data } = await api.delete(`/auth/users/${id}`);

      if (data.success) {
        toast.success(data.message);

        setUsers((prev) => prev.filter((user) => user._id !== id));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return !loading ? (
    <>
      <div className="mb-8">
        <Title text1="List" text2="Users" />

        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage registered users and their account information.
        </p>
      </div>

      <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mt-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Registered Users</h2>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            View, manage and remove registered users.
          </p>
        </div>
        <div className="md:hidden space-y-4">
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user._id}
                className="bg-gray-100 dark:bg-black/20 border border-primary/20 rounded-2xl p-4"
              >
                <div className="flex items-center gap-3">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 break-all">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between mt-4 gap-2 text-sm">
                  <span
                    className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === "admin"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {user.role}
                  </span>

                  <span className="text-gray-600 dark:text-gray-400">
                    {dateFormat(user.createdAt)}
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(user._id)}
                  className="w-full mt-5 bg-red-500 hover:bg-red-600 py-2 rounded-xl text-gray-900 dark:text-white transition"
                >
                  Delete User
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-600 dark:text-gray-400">
              No users found.
            </div>
          )}
        </div>
        <table className="hidden md:table w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="bg-primary/20 text-gray-200">
              <th className="text-left px-6 py-4 font-semibold rounded-l-xl">
                Name
              </th>

              <th className="text-left px-6 py-4 font-semibold">Email</th>

              <th className="text-left px-6 py-4 font-semibold">Role</th>

              <th className="text-left px-6 py-4 font-semibold">Joined</th>

              <th className="text-center px-6 py-4 font-semibold rounded-r-xl">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="bg-gray-100 dark:bg-black/20 hover:bg-primary/10 transition-all duration-300"
                >
                  <td className="px-6 py-4 rounded-l-xl">
                    <div className="flex items-center gap-3">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover border border-primary/20"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-gray-900 dark:text-white font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-900 dark:text-gray-300">{user.email}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === "admin"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-900 dark:text-gray-300">
                    {dateFormat(user.createdAt)}
                  </td>

                  <td className="px-6 py-4 rounded-r-xl text-center">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 hover:bg-red-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg transition cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-600 dark:text-gray-400">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default ListUsers;
