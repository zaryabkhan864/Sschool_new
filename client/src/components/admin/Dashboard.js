import React, { Fragment } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
    return (
        <Fragment>
            <div className="flex">
                <div className="w-1/5 bg-gray-800 text-white h-screen">
                    {/* Sidebar Content */}
                </div>
                <div className="w-4/5 p-8">
                    <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold">Products</h2>
                            <Link to="/admin/products" className="text-sm underline">
                                View Details
                            </Link>
                        </div>
                        <div className="bg-green-500 text-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold">Orders</h2>
                            <Link to="/admin/orders" className="text-sm underline">
                                View Details
                            </Link>
                        </div>
                        <div className="bg-red-500 text-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold">Users</h2>
                            <Link to="/admin/users" className="text-sm underline">
                                View Details
                            </Link>
                        </div>
                        <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold">Out of Stock</h2>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Dashboard;
