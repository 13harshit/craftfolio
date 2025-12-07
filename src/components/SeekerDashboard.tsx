import { useState, useEffect } from 'react';
import { Briefcase, FileText, Eye, Plus, TrendingUp, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface SeekerDashboardProps {
    user: any;
}

export default function SeekerDashboard({ user }: SeekerDashboardProps) {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        portfolioViews: 0,
        applications: 0,
        availableJobs: 0
    });

    useEffect(() => {
        fetchStats();

        // Subscribe to changes
        const appsSubscription = supabase
            .channel('seeker-dashboard-apps')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'applications',
                    filter: `seeker_id=eq.${user.id}`
                },
                () => fetchStats() // Re-fetch all stats for simplicity
            )
            .subscribe();

        const jobsSubscription = supabase
            .channel('seeker-dashboard-jobs')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'jobs',
                    filter: 'is_active=eq.true'
                },
                () => fetchStats()
            )
            .subscribe();

        return () => {
            appsSubscription.unsubscribe();
            jobsSubscription.unsubscribe();
        };
    }, [user.id]);

    const fetchStats = async () => {
        try {
            // Get application count
            const { count: appsCount } = await supabase
                .from('applications')
                .select('*', { count: 'exact', head: true })
                .eq('seeker_id', user.id);

            // Get available jobs count
            const { count: jobsCount } = await supabase
                .from('jobs')
                .select('*', { count: 'exact', head: true })
                .eq('is_active', true);

            // For portfolio views, we could track this in a separate table, 
            // but for now we'll simulate or leave as 0 if not tracked.
            // Or check if a portfolio exists.
            const { data: portfolio } = await supabase
                .from('portfolios')
                .select('id, views')
                .eq('user_id', user.id)
                .single();

            setStats({
                portfolioViews: portfolio?.views || 0,
                applications: appsCount || 0,
                availableJobs: jobsCount || 0
            });

        } catch (error) {
            console.error('Error fetching seeker stats:', error);
        }
    };

    const statCards = [
        {
            label: 'Portfolio Views',
            value: stats.portfolioViews,
            icon: Eye,
            color: 'from-indigo-500 to-purple-500'
        },
        {
            label: 'Applications',
            value: stats.applications,
            icon: FileText,
            color: 'from-emerald-500 to-teal-500'
        },
        {
            label: 'Available Jobs',
            value: stats.availableJobs,
            icon: Briefcase,
            color: 'from-amber-500 to-orange-500'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl text-gray-900 mb-2">Welcome back, {user?.full_name || user?.name || 'User'}!</h1>
                    <p className="text-gray-600">Here's what's happening with your portfolio and applications</p>
                </div>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {statCards.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg shadow-md`}>
                                    <stat.icon className="size-6 text-white" />
                                </div>
                                <TrendingUp className="size-5 text-emerald-500" />
                            </div>
                            <div className="text-3xl text-gray-900 mb-1">{stat.value}</div>
                            <div className="text-gray-600">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <h2 className="text-xl text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <button
                            onClick={() => navigate('/portfolio')}
                            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 transition-all group"
                        >
                            <div className="flex flex-col items-center gap-2">
                                <Plus className="size-8 text-gray-400 group-hover:text-indigo-600" />
                                <span className="text-gray-700 group-hover:text-indigo-600">Edit Portfolio</span>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/jobs')}
                            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-emerald-500 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-teal-50 transition-all group"
                        >
                            <div className="flex flex-col items-center gap-2">
                                <Briefcase className="size-8 text-gray-400 group-hover:text-emerald-600" />
                                <span className="text-gray-700 group-hover:text-emerald-600">Browse Jobs</span>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/applications')}
                            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 transition-all group"
                        >
                            <div className="flex flex-col items-center gap-2">
                                <FileText className="size-8 text-gray-400 group-hover:text-purple-600" />
                                <span className="text-gray-700 group-hover:text-purple-600">My Applications</span>
                            </div>
                        </button>

                        <button
                            onClick={() => {
                                const url = `https://craftfolio-pro.vercel.app/p/${user.id}`;
                                navigator.clipboard.writeText(url);
                                alert('Public link copied to clipboard!');
                            }}
                            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-500 hover:bg-gradient-to-br hover:from-pink-50 hover:to-rose-50 transition-all group"
                        >
                            <div className="flex flex-col items-center gap-2">
                                <Share2 className="size-8 text-gray-400 group-hover:text-pink-600" />
                                <span className="text-gray-700 group-hover:text-pink-600">Share Profile</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
