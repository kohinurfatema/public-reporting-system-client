import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import useAuth from '../hooks/useAuth';
import useAxiosSecure from '../hooks/useAxiosSecure';
import SocialLogin from './SocialLogin';
import toast from 'react-hot-toast';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signInUser } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const [isLoading, setIsLoading] = useState(false);


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
            <h3 className="text-3xl text-center">Welcome back</h3>
            <p className='text-center'>Please Login</p>
            <form className="card-body" onSubmit={handleSubmit(handleLogin)}>
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