import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import { FaUserTie, FaUserCog, FaUser } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import useAxiosSecure from '../hooks/useAxiosSecure';
import SocialLogin from './SocialLogin';
import toast from 'react-hot-toast';

const Login = () => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const { signInUser } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const [isLoading, setIsLoading] = useState(false);

    // Demo credentials
    const demoCredentials = {
        admin: {
            email: 'admin@publicreport.com',
            password: 'Admin123!@#'
        },
        staff: {
            email: 'staff@publicreport.com',
            password: 'Staff123!@#'
        },
        citizen: {
            email: 'citizen@publicreport.com',
            password: 'Citizen123!@#'
        }
    };

    // Auto-fill demo credentials
    const fillDemoCredentials = (role) => {
        const creds = demoCredentials[role];
        setValue('email', creds.email);
        setValue('password', creds.password);
        toast.success(`${role.charAt(0).toUpperCase() + role.slice(1)} credentials loaded!`);
    };


    const handleLogin = async (data) => {
        setIsLoading(true);
        const toastId = toast.loading('Signing in...');

        try {
            const result = await signInUser(data.email, data.password);

            // Save/check user in MongoDB
            await axiosSecure.post('/users', {
                email: result.user.email,
                name: result.user.displayName,
                photoURL: result.user.photoURL
            });

            toast.success('Login successful! Welcome back.', { id: toastId });
            navigate(location?.state || '/');
        } catch (error) {
            const errorMessage = error.code === 'auth/invalid-credential'
                ? 'Invalid email or password'
                : error.message || 'Login failed. Please try again.';
            toast.error(errorMessage, { id: toastId });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="card bg-base-100 w-full mx-auto max-w-sm shrink-0 shadow-2xl">
            <h3 className="text-3xl text-center pt-6">Welcome back</h3>
            <p className='text-center text-base-content/70'>Please Login</p>

            {/* Demo Credentials Section */}
            <div className="px-6 pt-4">
                <div className="bg-base-200 rounded-lg p-4">
                    <p className="text-xs font-semibold text-center mb-3 text-base-content/60 uppercase tracking-wider">
                        Quick Demo Access
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                        {/* Admin Button */}
                        <button
                            type="button"
                            onClick={() => fillDemoCredentials('admin')}
                            className="btn btn-sm btn-outline btn-primary flex-col h-auto py-2 px-2"
                            title="Login as Admin"
                        >
                            <FaUserTie className="text-lg mb-1" />
                            <span className="text-xs">Admin</span>
                        </button>

                        {/* Staff Button */}
                        <button
                            type="button"
                            onClick={() => fillDemoCredentials('staff')}
                            className="btn btn-sm btn-outline btn-secondary flex-col h-auto py-2 px-2"
                            title="Login as Staff"
                        >
                            <FaUserCog className="text-lg mb-1" />
                            <span className="text-xs">Staff</span>
                        </button>

                        {/* Citizen Button */}
                        <button
                            type="button"
                            onClick={() => fillDemoCredentials('citizen')}
                            className="btn btn-sm btn-outline btn-accent flex-col h-auto py-2 px-2"
                            title="Login as Citizen"
                        >
                            <FaUser className="text-lg mb-1" />
                            <span className="text-xs">Citizen</span>
                        </button>
                    </div>
                    <p className="text-xs text-center mt-2 text-base-content/50">
                        Click to auto-fill credentials
                    </p>
                </div>
            </div>

            <div className="divider px-6 text-xs text-base-content/50">OR LOGIN MANUALLY</div>

            <form className="card-body pt-0" onSubmit={handleSubmit(handleLogin)}>
                <fieldset className="fieldset">
                    {/* email field */}
                    <label className="label">Email</label>
                    <input type="email" {...register('email', { required: true })} className="input" placeholder="Email" />
                    {
                        errors.email?.type === 'required' && <p className='text-red-500'>Email is required</p>
                    }

                    {/* password field */}
                    <label className="label">Password</label>
                    <input type="password" {...register('password', { required: true, minLength: 6 })} className="input" placeholder="Password" />
                    {
                        errors.password?.type === 'minLength' && <p className='text-red-500'>Password must be 6 characters  or longer </p>
                    }


                    <div><a className="link link-hover">Forgot password?</a></div>
                    <button className="btn btn-neutral mt-4" disabled={isLoading}>
                        {isLoading ? <span className="loading loading-spinner loading-sm"></span> : 'Login'}
                    </button>
                </fieldset>
                <p>New to Potholes patrols <Link
                    state={location.state}
                    className='text-blue-400 underline'
                    to="/register">Register</Link></p>
            </form>
            <SocialLogin></SocialLogin>
        </div>
    );
};

export default Login;