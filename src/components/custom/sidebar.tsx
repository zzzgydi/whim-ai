import React, { useState } from "react";
import { Link } from "react-router-dom";

export interface Route {
  path: string;
  icon: React.ReactNode;
  label: string;
}

const SidebarIcon = ({ icon, label, path }: Route) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative">
      <Link
        to={path}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex items-center justify-center h-12 w-12 rounded hover:bg-gray-200"
      >
        {icon}
      </Link>
      {isHovered && (
        <div className="absolute left-12 top-0 px-4 py-2 bg-white border rounded shadow">
          {label}
        </div>
      )}
    </div>
  );
};

interface SidebarProps {
  routes: Route[];
}

export const Sidebar = ({ routes }: SidebarProps) => {
  // your code here

  return (
    <div className="h-full border-r">
      <div className="flex flex-col items-center">
        {routes.map((route) => (
          <SidebarIcon
            key={route.path}
            icon={route.icon}
            label={route.label}
            path={route.path}
          />
        ))}
      </div>
    </div>
  );
};
