import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-6">
        <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-2">Oops! Page not found</p>
        <p className="mb-6 text-gray-500">
          The page <code>{location.pathname}</code> does not exist.
        </p>
        <Link
          to="/"
          className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
