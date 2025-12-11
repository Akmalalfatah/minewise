import { useLocation } from "react-router-dom";
import { userStore } from "../../store/userStore";
import Navbar from "./Navbar";

function NavbarWrapper() {
  const location = useLocation();
  const isAuthenticated = userStore((state) => state.isAuthenticated);

  const hiddenRoutes = ["/login", "/register"];

  if (!isAuthenticated || hiddenRoutes.includes(location.pathname)) {
    return null;
  }

  return <Navbar />;
}

export default NavbarWrapper;
