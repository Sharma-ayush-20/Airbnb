import React, { useContext, useState } from 'react';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../Context/AppContext';
import { toast } from 'react-toastify'

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { serverUrl } = useContext(AppContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${serverUrl}/api/auth/login`, { email, password }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            })
            if (response.status === 201 || response.status === 200) {
                toast.success("User Login SuccessFully!")
                setEmail('')
                setPassword('')
                navigate('/')
            }
        } catch (error) {
            if (error.response) {
                // console.log("Error ", error.response);
                toast.error("Something went Wrong", error.response)
            }
            else {
                // console.log("unKnown Error", error.message);
                toast.error("Something went Wrong", error.message)
            }
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mb-4">
                        <User className="w-6 h-6 text-white cursor-pointer" onClick={() => navigate('/')} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h1>
                    <p className="text-slate-600">Sign in to your StayEase account</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                    <form className="space-y-6" onSubmit={handleLogin} >
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-slate-700">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-slate-400 transition-all duration-200"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-slate-700">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-slate-400 transition-all duration-200"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-slate-600 transition-colors"
                                >
                                    {/* <Eye className="h-5 w-5 text-slate-400" /> */}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <a href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                        >
                            Sign In
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-600">
                            Don't have an account?{' '}
                            <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                                Create account
                            </a>
                        </p>
                    </div>
                </div>

                {/* Terms */}
                <p className="text-xs text-slate-500 text-center mt-6">
                    By signing in, you agree to our{' '}
                    <a href="/terms" className="underline hover:text-slate-700">Terms of Service</a>
                    {' '}and{' '}
                    <a href="/privacy" className="underline hover:text-slate-700">Privacy Policy</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
