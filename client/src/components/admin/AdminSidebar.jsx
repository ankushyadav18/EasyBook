import {
  LayoutDashboardIcon,
  ListIcon,
  PlusSquareIcon,
  ListCollapseIcon,
  UsersIcon,
  HomeIcon,
} from "lucide-react";
import React from "react";

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
    <div className="h-full flex flex-col max-w-13 md:max-w-60 w-full border-r border-gray-300/20 text-sm">
      <div className="w-full">
        {adminNavlinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            end
            className={({ isActive }) =>
              `relative flex items-center max-md:justify-center gap-2 w-full py-2.5 min-md:pl-10 text-gray-400 transition-all duration-300
  ${
    isActive
      ? "bg-primary/15 text-primary shadow-[0_0_15px_rgba(229,9,20,0.25)]"
      : "hover:bg-primary/10 hover:text-white hover:shadow-[0_0_12px_rgba(229,9,20,0.18)]"
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
