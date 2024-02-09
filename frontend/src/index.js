import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import App from "./App.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import store from "./store.js";
import { Provider } from "react-redux";
import HomeScreen from "./screens/HomeScreen.js";
import LoginScreen from "./screens/LoginScreen.js";
import RegisterScreen from "./screens/RegisterScreen.js";
import ProfileScreen from "./screens/ProfileScreen.js";
import PrivateRoute from "./components/PrivateRoute.js";
import reportWebVitals from "./reportWebVitals.js";
import DashBoard from "./screens/DashBoard.js";
import PublicStories from "./screens/PublicStories.js";
import StoryScreen from "./screens/StoryScreen.js";
import AddScreen from "./screens/AddScreen.js";
import EditScreen from "./screens/EditScreen.js";
import UserStories from "./screens/UserStories.js";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      {/* Private routes */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile/:userId" element={<ProfileScreen />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/stories" element={<PublicStories />} />
        <Route path="/stories/:id" element={<StoryScreen />} />
        <Route path="/stories/add" element={<AddScreen />} />
        <Route path="/stories/edit/:id" element={<EditScreen />} />
        <Route path="/stories/user/:userId" element={<UserStories />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
