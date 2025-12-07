import { useState, useEffect } from 'react';
import { Briefcase, Users, Plus, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface HirerDashboardProps {
    user: any;
}

export default function HirerDashboard({ user }: HirerDashboardProps) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        activeJobs: 0,
        totalApplications: 0,
        recentApplications: [] as any[]
    });

    useEffect(() => {
        fetchStats();

        const subscription = supabase
            .channel('hirer-dashboard')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'applications'
                },
                () => {
                    fetchStats();
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [user.id]);

    const fetchStats = async () => {
        try {
            // Fetch active jobs count
            const { count: jobsCount, error: jobsError } = await supabase
                .from('jobs')
                .select('*', { count: 'exact', head: true })
                .eq('hirer_id', user.id)
                .eq('is_active', true);

            if (jobsError) throw jobsError;

            // Fetch active jobs IDs first to get applications
            const { data: jobs } = await supabase
                .from('jobs')
                .select('id')
                .eq('hirer_id', user.id);

            const jobIds = jobs?.map(j => j.id) || [];

            let applicationsCount = 0;
            let recentApps: any[] = [];

            if (jobIds.length > 0) {
                // Fetch total applications for these jobs
                const { count: appsCount, error: appsError } = await supabase
                    .from('applications')
                    .select('*', { count: 'exact', head: true })
                    .in('job_id', jobIds);

                if (appsError) throw appsError;
                applicationsCount = appsCount || 0;

                // Fetch recent applications
                const { data: apps, error: recentError } = await supabase
                    .from('applications')
                    .select('*, jobs(title)')
                    .in('job_id', jobIds)
                    .order('created_at', { ascending: false })
                    .limit(3);

                if (recentError) throw recentError;
                recentApps = apps || [];
            }

            setStats({
                activeJobs: jobsCount || 0,
                totalApplications: applicationsCount,
                recentApplications: recentApps
            });

        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            label: 'Active Job Listings',
            value: stats.activeJobs,
            icon: Briefcase,
            color: 'from-blue-500 to-indigo-500'
        },
        {
            label: 'Total Applications',
            value: stats.totalApplications,
            icon: Users,
            color: 'from-purple-500 to-pink-500'
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl text-gray-900 mb-2">Hirer Dashboard</h1>
                        <p className="text-gray-600">Manage your job postings and applications</p>
                    </div>
                    <button
                        onClick={() => navigate('/post-job')}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                    >
                        <Plus className="size-5" />
                        Post New Job
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl text-gray-900 mb-4">Recent Applications</h2>
                    {stats.recentApplications.length > 0 ? (
                        <div className="space-y-4">
                            {stats.recentApplications.map((app) => (
                                <div
                                    key={app.id}
                                    onClick={() => {
                                        navigate(`/review-application/${app.id}`);
                                    }}
                                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                >
                                    <div>
                                        <h3 className="font-medium text-gray-900">Application for {app.jobs?.title}</h3>
                                        <p className="text-sm text-gray-500">Applied {new Date(app.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm capitalize ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                            app.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                                                'bg-red-100 text-red-800'
                                        }`}>
                                        {app.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No applications yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
