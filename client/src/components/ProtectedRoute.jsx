import { Navigate, Outlet } from "react-router-dom";
import toast from "react-hot-toast";

function ProtectedRoute() {
  const token = localStorage.getItem("token");
  if(!token){
    return (
      <Navigate to="/login" replace />
    );
  }else{
    return (
      <Outlet />
    );
  }
}

export default ProtectedRoute;
