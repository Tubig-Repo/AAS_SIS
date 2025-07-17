import { useEffect, useState } from "react";

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
      <div className="p-4 flex-grow-1">
        <h3>This is the main content!</h3>
      </div>
    </div>
  );  
}

