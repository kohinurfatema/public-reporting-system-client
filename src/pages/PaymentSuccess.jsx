// src/pages/PaymentSuccess.jsx

import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router';
import { FaCheckCircle, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import useAxiosSecure from '../hooks/useAxiosSecure';
import useAuth from '../hooks/useAuth';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');
    const [paymentDetails, setPaymentDetails] = useState(null);

    const sessionId = searchParams.get('session_id');
    const type = searchParams.get('type');

    useEffect(() => {
        const verifyPayment = async () => {
            if (!sessionId) {
                setStatus('error');
                setMessage('No session ID found. Invalid payment session.');
                return;
            }

            if (!user) {
                setStatus('error');
                setMessage('Please log in to verify your payment.');
                return;
            }

            try {
                const response = await axiosSecure.post('/payments/verify', { sessionId });

                setStatus('success');
                setPaymentDetails(response.data.payment);

                if (response.data.alreadyProcessed) {
                    setMessage('This payment was already processed.');
                } else {
                    setMessage(type === 'subscription'
                        ? 'Welcome to Premium! You now have unlimited issue reporting.'
                        : 'Your issue has been boosted to HIGH priority!'
                    );
                }
            } catch (error) {
                console.error('Payment verification error:', error);
                setStatus('error');
                setMessage(error.response?.data?.message || 'Failed to verify payment. Please contact support.');
            }
        };

        if (user) {
            verifyPayment();
        }
    }, [sessionId, user, axiosSecure, type]);

    // Redirect based on payment type after success
    const getRedirectPath = () => {
        if (type === 'subscription') {
            return '/dashboard/citizen/profile';
        }
        return '/dashboard/citizen/my-issues';
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
            <div className="card bg-base-100 shadow-xl max-w-md w-full">
                <div className="card-body text-center">
                    {status === 'verifying' && (
                        <>
                            <FaSpinner className="text-6xl text-primary mx-auto animate-spin" />
                            <h2 className="card-title justify-center mt-4">Verifying Payment...</h2>
                            <p className="text-base-content/70">Please wait while we confirm your payment.</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <FaCheckCircle className="text-6xl text-success mx-auto" />
                            <h2 className="card-title justify-center mt-4 text-success">Payment Successful!</h2>
                            <p className="text-base-content/70">{message}</p>

                            {paymentDetails && (
                                <div className="bg-base-200 rounded-lg p-4 mt-4 text-left">
                                    <h3 className="font-semibold mb-2">Payment Details</h3>
                                    <div className="space-y-1 text-sm">
                                        <p><span className="text-base-content/60">Transaction ID:</span> {paymentDetails.transactionId}</p>
                                        <p><span className="text-base-content/60">Amount:</span> {paymentDetails.amount} BDT</p>
                                        <p><span className="text-base-content/60">Type:</span> {paymentDetails.type === 'subscription' ? 'Premium Subscription' : 'Priority Boost'}</p>
                                        <p><span className="text-base-content/60">Status:</span> <span className="badge badge-success badge-sm">Completed</span></p>
                                    </div>
                                </div>
                            )}

                            <div className="card-actions justify-center mt-6">
                                <Link to={getRedirectPath()} className="btn btn-primary">
                                    Go to Dashboard
                                </Link>
                                <Link to="/" className="btn btn-ghost">
                                    Back to Home
                                </Link>
                            </div>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <FaExclamationTriangle className="text-6xl text-error mx-auto" />
                            <h2 className="card-title justify-center mt-4 text-error">Payment Verification Failed</h2>
                            <p className="text-base-content/70">{message}</p>

                            <div className="card-actions justify-center mt-6">
                                <Link to="/dashboard/citizen" className="btn btn-primary">
                                    Go to Dashboard
                                </Link>
                                <Link to="/" className="btn btn-ghost">
                                    Back to Home
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
