import React from "react";
import { useSelector } from "react-redux";

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth); // Get user from Redux state

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <h2 className="text-xl">
                {user?.role === "admin" ? "Hello Admin " : `Hello x${user?.role}`} {/* Role-based greeting */}
            </h2>
        </div>
    );
};

export default Dashboard;
