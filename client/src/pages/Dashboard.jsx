import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Failed to fetch admin data:", err);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="d-flex">
      <Sidebar />
      {/* Main Content */}
      <div className="p-4">
        <h1>Main content area</h1>
        <p>
          This is where your main content goes alongside the sidebar navigation.
        </p>
      </div>
    </div>
  );
}
