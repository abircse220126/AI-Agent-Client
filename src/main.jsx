import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Root from "./Layout/Root.jsx";
import Container from "./Component/Container/Container.jsx";
import Register from "./Component/Register/Register.jsx";
import Login from "./Component/Login/Login.jsx";
import Home from "./Component/Home/Home.jsx";
import DashboardLayout from "./Layout/DashboardLayout.jsx";
import Facebook from "./Component/Ads/Facebook.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    Component:Root,
    children:[
      {
        index:true,
        Component:Home
      },
      {
        path:"/container",
        Component:Container

      },
      {
        path:"/register",
        Component:Register
      },
      {
        path:"/login",
        Component:Login
      },
    ]
  },
  {
    path:"/dashboard",
    Component:DashboardLayout,
    children:[
      {
        index:true,
        Component:Container
      },
      {
        path:"/dashboard/facebook",
        Component:Facebook
      }
    ]

  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
     <RouterProvider router={router} />,
  </StrictMode>
);
