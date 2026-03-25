import { createBrowserRouter } from "react-router";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Browse } from "./pages/Browse";
import { MovieDetails } from "./pages/MovieDetails";
import { MyRatings } from "./pages/MyRatings";
import { Profile } from "./pages/Profile";
import { Layout } from "./components/Layout";
import { NotFound } from "./pages/NotFound";
const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Landing },
      { path: "login", Component: Login },
      { path: "dashboard", Component: Dashboard },
      { path: "browse", Component: Browse },
      { path: "movie/:id", Component: MovieDetails },
      { path: "my-ratings", Component: MyRatings },
      { path: "profile", Component: Profile },
      { path: "*", Component: NotFound }
    ]
  }
]);
export {
  router
};
