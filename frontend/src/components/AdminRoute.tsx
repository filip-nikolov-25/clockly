import { Navigate } from "react-router-dom";
import type { UserType } from "../interfaces/types";

interface Props {
  user: UserType | null;
  children: React.ReactNode;
}

const AdminRoute = ({ user, children }: Props) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/calendar" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;