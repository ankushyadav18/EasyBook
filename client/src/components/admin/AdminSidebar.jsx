import {
  LayoutDashboardIcon,
  ListIcon,
  PlusSquareIcon,
  ListCollapseIcon,
  UsersIcon,
  HomeIcon,
} from "lucide-react";
import React from "react";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router";
import { useAuth } from "../../context/AuthContext";

const AdminSidebar = () => {
  const { user } = useAuth();

  const adminNavlinks = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboardIcon,
    },
    {
      name: "Add Movie",
      path: "/admin/add-movie",
      icon: PlusSquareIcon,
    },

    {
      name: "List Movies",
      path: "/admin/list-movies",
      icon: ListIcon,
    },
    {
      name: "Add Shows",
      path: "/admin/add-shows",
      icon: PlusSquareIcon,
    },
    {
      name: "List Shows",
      path: "/admin/list-shows",
      icon: ListIcon,
    },
    {
      name: "Users",
      path: "/admin/list-users",
      icon: UsersIcon,
    },
    {
      name: "List Bookings",
      path: "/admin/list-bookings",
      icon: ListCollapseIcon,
    },
    {
      name: "Back to Website",
      path: "/",
      icon: HomeIcon,
    },
  ];

  return (
    <div className="h-[calc(100vh-64px)] md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-gray-300/20 text-sm">
      <img
        className="h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto object-cover"
        src={user?.image || assets.profile}
        alt="sidebar"
      />

      <p className="mt-2 text-base max-md:hidden font-medium">
        {user?.name || "Admin"}
      </p>

      <div className="w-full">
        {adminNavlinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            end
            className={({ isActive }) =>
              `relative flex items-center max-md:justify-center gap-2 w-full py-2.5 min-md:pl-10 first:mt-6 text-gray-400 ${
                isActive ? "bg-primary/15 text-primary group" : ""
              }`
            }
          >
            <link.icon className="w-5 h-5" />
            <p className="max-md:hidden">{link.name}</p>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;
