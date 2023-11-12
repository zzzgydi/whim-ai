import { BrowserRouter, Route, Routes } from "react-router-dom";
import { routes } from "./_routes";
import { Sidebar } from "@/components/custom/sidebar";

export const Layout = () => {
  return (
    <BrowserRouter>
      <div className="flex h-screen">
        <Sidebar routes={routes} />

        <div className="flex-1">
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<route.component />}
              />
            ))}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};
