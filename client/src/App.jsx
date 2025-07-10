import "./App.css";
import Login from "./pages/Login";
import { Outlet } from "react-router";
function App() {
  return (
    <>
      <Outlet />
    </>
  );
}

export default App;
