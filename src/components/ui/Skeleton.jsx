// src/components/ui/Skeleton.jsx

import React from 'react';

// Base skeleton component
export const Skeleton = ({ className = '' }) => (
    <div className={`animate-pulse bg-base-300 rounded ${className}`}></div>
);

// Card skeleton for issue cards
export const CardSkeleton = () => (
    <div className="card bg-base-100 shadow-lg">
        <figure className="h-48">
            <Skeleton className="w-full h-full" />
        </figure>
        <div className="card-body">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="card-actions justify-end mt-4">
                <Skeleton className="h-10 w-28 rounded-lg" />
            </div>
        </div>
    </div>
);

// Grid of card skeletons
export const CardGridSkeleton = ({ count = 6 }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(count)].map((_, i) => (
            <CardSkeleton key={i} />
        ))}
    </div>
);

// Table row skeleton
export const TableRowSkeleton = ({ columns = 5 }) => (
    <tr>
        {[...Array(columns)].map((_, i) => (
            <td key={i} className="py-4">
                <Skeleton className="h-4 w-full" />
            </td>
        ))}
    </tr>
);

// Table skeleton
export const TableSkeleton = ({ rows = 5, columns = 5 }) => (
    <div className="overflow-x-auto">
        <table className="table">
            <thead>
                <tr>
                    {[...Array(columns)].map((_, i) => (
                        <th key={i}><Skeleton className="h-4 w-20" /></th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {[...Array(rows)].map((_, i) => (
                    <TableRowSkeleton key={i} columns={columns} />
                ))}
            </tbody>
        </table>
    </div>
);

// Stats card skeleton
export const StatCardSkeleton = () => (
    <div className="stat bg-base-100 rounded-xl shadow">
        <div className="stat-figure">
            <Skeleton className="w-12 h-12 rounded-full" />
        </div>
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-8 w-16 mb-1" />
        <Skeleton className="h-3 w-24" />
    </div>
);

// Stats grid skeleton
export const StatsGridSkeleton = ({ count = 4 }) => (
    <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
        {[...Array(count)].map((_, i) => (
            <StatCardSkeleton key={i} />
        ))}
    </div>
);

// Profile skeleton
export const ProfileSkeleton = () => (
    <div className="flex flex-col items-center gap-4">
        <Skeleton className="w-24 h-24 rounded-full" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
        <div className="w-full max-w-md space-y-3 mt-4">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
        </div>
    </div>
);

// Page loading skeleton
export const PageSkeleton = () => (
    <div className="min-h-screen p-6">
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="grid gap-6">
            <Skeleton className="h-40 w-full rounded-xl" />
            <div className="grid md:grid-cols-3 gap-4">
                <Skeleton className="h-32 rounded-xl" />
                <Skeleton className="h-32 rounded-xl" />
                <Skeleton className="h-32 rounded-xl" />
            </div>
        </div>
    </div>
);

export default Skeleton;
