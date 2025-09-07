import Home from "./Home";
import ToWatchList from "./ToWatchList";
import WatchedList from "./WatchedList";
import Error from "./Error";
import MovieDetails from "../MovieDetails"; // Component to display movie details by ID
import Login from "../login/Login"
import { AuthProvider } from "../login/AuthContext";
import ProtectedRoute from "../login/ProtectedRoute";
const routes = [
  {
    path: "/",
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      </AuthProvider>
    ),
    errorElement: <Error />
  },
  {
    path: "/ToWatchList",
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <ToWatchList />
        </ProtectedRoute>
      </AuthProvider>
    )
  },
  {
    path: "/Login",
    element: (
      <AuthProvider>
         <Login />
      </AuthProvider>
            )
  },
  {
    path: "/WatchedList",
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <WatchedList />
        </ProtectedRoute>
      </AuthProvider>
    )
  },
  {
    path: "/movie/:id",
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <MovieDetails />
        </ProtectedRoute>
      </AuthProvider>
    ) // Display movie details for the given ID
  }
];

export default routes;
