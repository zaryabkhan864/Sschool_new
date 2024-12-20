import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, useNavigate } from "react-router-dom";
import useUserRoutes from "./routes/userRoutes";
import useAdminRoutes from "./routes/adminRoutes";
import { Toaster } from "react-hot-toast";
function App() {
  const userRoutes = useUserRoutes();
  const adminRoutes = useAdminRoutes();
  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        {userRoutes}
        {adminRoutes}
      </Routes>
    </Router>
  );
}
export default App;
