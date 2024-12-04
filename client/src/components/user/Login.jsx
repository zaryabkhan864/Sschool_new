import React, { Fragment, useState, useEffect } from 'react';

import { Link, useLocation, useNavigate } from "react-router-dom";
import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { login, clearErrors } from "../../actions/userActions";
import loginImage from "../../assets/loginImage.png";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const alert = useAlert();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { isAuthenticated, error, loading, user } = useSelector((state) => state?.auth);
    console.log("test from Login user, isAuthenticated, Loading", user, isAuthenticated, loading);
    // const { user = {}, isAuthenticated, error, loading } = useSelector((state) => state.auth);
    const redirect = new URLSearchParams(location.search).get("redirect") || "/dashboard";

    useEffect(() => {
        if (isAuthenticated) {
            navigate(redirect);
        }

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
    }, [dispatch, alert, isAuthenticated, error, navigate, redirect]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(email, password));
    };

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <MetaData title="Login" />
                    <div className="flex flex-col md:flex-row h-screen items-center">
                        {/* Left Side - Image */}
                        <div className="hidden md:block w-full md:w-1/2 h-full">
                            <img
                                src={loginImage}
                                alt="Login"
                                className="object-cover w-full h-full"
                            />
                        </div>

                        {/* Right Side - Login Form */}
                        <div className="flex justify-center items-center w-full md:w-1/2 px-6 md:px-16">
                            <form
                                className="w-full bg-white shadow-md rounded-lg p-8"
                                onSubmit={submitHandler}
                            >
                                <h1 className="text-2xl font-bold mb-6">Login</h1>
                                <div className="mb-4">
                                    <label
                                        htmlFor="email_field"
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email_field"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="password_field"
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                    >
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password_field"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <Link
                                    to="/password/forgot"
                                    className="text-blue-500 text-sm block text-right mb-4"
                                >
                                    Forgot Password?
                                </Link>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
                                >
                                    LOGIN
                                </button>
                                <Link
                                    to="/register"
                                    className="text-blue-500 text-sm block text-center mt-4"
                                >
                                    New User?
                                </Link>
                            </form>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

export default Login;