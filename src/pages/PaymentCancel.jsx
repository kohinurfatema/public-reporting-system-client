// src/pages/PaymentCancel.jsx

import React from 'react';
import { useSearchParams, Link } from 'react-router';
import { FaTimesCircle, FaArrowLeft, FaHome } from 'react-icons/fa';

const PaymentCancel = () => {
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type');

    const getMessage = () => {
        if (type === 'subscription') {
            return 'Your premium subscription payment was cancelled. You can try again anytime from your profile page.';
        }
        return 'Your boost payment was cancelled. You can try again from the issue details page.';
    };

    const getBackPath = () => {
        if (type === 'subscription') {
            return '/dashboard/citizen/profile';
        }
        return '/dashboard/citizen/my-issues';
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
            <div className="card bg-base-100 shadow-xl max-w-md w-full">
                <div className="card-body text-center">
                    <FaTimesCircle className="text-6xl text-warning mx-auto" />
                    <h2 className="card-title justify-center mt-4">Payment Cancelled</h2>
                    <p className="text-base-content/70">{getMessage()}</p>

                    <div className="bg-base-200 rounded-lg p-4 mt-4">
                        <p className="text-sm text-base-content/60">
                            No charges were made to your account. If you experienced any issues during checkout, please try again or contact support.
                        </p>
                    </div>

                    <div className="card-actions justify-center mt-6">
                        <Link to={getBackPath()} className="btn btn-primary gap-2">
                            <FaArrowLeft /> Try Again
                        </Link>
                        <Link to="/" className="btn btn-ghost gap-2">
                            <FaHome /> Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentCancel;
