/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

function ProtectedRoute({ children, allowedRoles }) {
  const { token, role } = useContext(AuthContext);

  if (!token || !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace={true} />;
  }

  return children;
}

export default ProtectedRoute;