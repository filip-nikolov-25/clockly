import { Navigate, Outlet } from "react-router-dom";
import type { UserType } from "../interfaces/types";

interface Props {
  user: UserType | null;
}

const ProtectedRoute = ({ user }: Props) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;