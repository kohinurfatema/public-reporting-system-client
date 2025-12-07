import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';



const Login = () => {
    const { register,handleSubmit, formState: { errors } } = useForm();


     const handleRegistration = (data) => {

        console.log('after register', data)
     }
   
    return (
        <div className="card bg-base-100 w-full mx-auto max-w-sm shrink-0 shadow-2xl">
            <h3 className="text-3xl text-center">Welcome back</h3>
            <p className='text-center'>Please Register</p>
            <form className="card-body" onSubmit={handleSubmit(handleRegistration)}>
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
                    <button className="btn btn-neutral mt-4">Register</button>
                </fieldset>
                <p>New to Pothole Patrol <Link
                    state={location.state}
                    className='text-blue-400 underline'
                    to="/login">Login</Link></p>
            </form>
           
        </div>
    );
};

export default Login;