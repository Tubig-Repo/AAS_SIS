import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="p-4 flex-grow-1">
        <Outlet />
      </div>
    </div>
  );
}
