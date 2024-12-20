import React, { useEffect, useState } from "react";
import loginImage from "../assets/loginImage.png";
import { useLoginMutation } from "../redux/api/authApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const [login, { isLoading, error, data }] = useLoginMutation();
    const { isAuthenticated } = useSelector((state) => state.auth);

    // This effect should only run when `isAuthenticated` changes
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        }
        if (error) {
            toast.error(error?.data?.message);
        }
    }, [isAuthenticated, error, navigate]);  // Add the proper dependencies here

    // Submit function
    const submitHandler = (e) => {
        e.preventDefault();

        const loginData = {
            email,
            password,
        };

        login(loginData); // Call the login mutation
    };

    return (
        <div className="flex h-screen">
            {/* Left Side - Image */}
            <div className="w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${loginImage})` }} />
            
            {/* Right Side - Login Form */}
            <div className="w-1/2 flex items-center justify-center bg-gray-100">
                <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

                    <form className="space-y-4" onSubmit={submitHandler}>
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {isLoading ? "Authenticating..." : "LOGIN"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-600 mt-4">
                        Don’t have an account?
                        <a href="/register" className="text-blue-500 hover:underline">
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
