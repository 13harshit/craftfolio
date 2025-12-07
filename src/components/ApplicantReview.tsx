import { useState, useEffect } from 'react';
import { ArrowLeft, User, FileText, CheckCircle, XCircle, ExternalLink, Calendar, Mail, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate, useParams } from 'react-router-dom';

interface ApplicantReviewProps {
    applicationId?: string; // Optional if passed directly, otherwise params
    onBack?: () => void;
}

export default function ApplicantReview({ applicationId: propAppId, onBack: propOnBack }: ApplicantReviewProps) {
    const { appId } = useParams();
    const navigate = useNavigate();
    const applicationId = propAppId || appId;
    const onBack = propOnBack || (() => navigate('/hirer'));
    const [application, setApplication] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (applicationId) {
            fetchApplication();
        }
    }, [applicationId]);

    const fetchApplication = async () => {
        try {
            const { data, error } = await supabase
                .from('applications')
                .select(`
          *,
          jobs (title, company_name),
          profiles:seeker_id (full_name, email, avatar_url),
          portfolios:seeker_id (id)
        `)
                .eq('id', applicationId)
                .single();

            if (error) throw error;
            setApplication(data);

            // Mark as reviewed if pending
            if (data.status === 'pending') {
                updateStatus('reviewed');
            }
        } catch (error) {
            console.error('Error fetching application:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (status: string) => {
        setUpdating(true);
        try {
            const { error } = await supabase
                .from('applications')
                .update({ status })
                .eq('id', applicationId);

            if (error) throw error;

            setApplication((prev: any) => ({ ...prev, status }));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!application) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="text-center">
                    <AlertCircle className="size-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl text-gray-900">Application not found</h2>
                    <button onClick={onBack} className="mt-4 text-indigo-600 hover:text-indigo-700">Go Back</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft className="size-5" />
                        Back to Dashboard
                    </button>

                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl text-gray-900 mb-2">Review Application</h1>
                            <p className="text-gray-600">For {application.jobs?.title} at {application.jobs?.company_name}</p>
                        </div>

                        <div className={`px-4 py-2 rounded-full text-sm font-medium capitalize flex items-center gap-2
              ${application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                application.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                                    application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                        'bg-red-100 text-red-800'}`}>
                            <span className={`w-2 h-2 rounded-full 
                ${application.status === 'pending' ? 'bg-yellow-500' :
                                    application.status === 'reviewed' ? 'bg-blue-500' :
                                        application.status === 'accepted' ? 'bg-green-500' :
                                            'bg-red-500'}`}></span>
                            {application.status}
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Cover Letter */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                                <FileText className="size-5 text-gray-400" />
                                Cover Letter
                            </h3>
                            <div className="prose prose-sm max-w-none text-gray-600">
                                {application.cover_letter || 'No cover letter provided.'}
                            </div>
                        </div>

                        {/* Applicant Profile Preview */}
                        {/* Note: In a real app we might fetch more detailed profile info here or link to public profile */}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Applicant Details */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-indigo-100 p-3 rounded-full">
                                    {application.profiles?.avatar_url ? (
                                        <img src={application.profiles.avatar_url} alt="Avatar" className="w-12 h-12 rounded-full" />
                                    ) : (
                                        <User className="size-6 text-indigo-600" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">{application.profiles?.full_name || 'Unknown Applicant'}</h3>
                                    <p className="text-sm text-gray-500">Applicant</p>
                                </div>
                            </div>

                            <div className="space-y-4 text-sm">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Mail className="size-4" />
                                    <a href={`mailto:${application.profiles?.email}`} className="hover:text-indigo-600">
                                        {application.profiles?.email}
                                    </a>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Calendar className="size-4" />
                                    Applied {new Date(application.created_at).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t">
                                {application.portfolios?.[0]?.id ? (
                                    <button
                                        onClick={() => navigate(`/p/${application.portfolios?.[0]?.id}`)}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                                    >
                                        <ExternalLink className="size-4" />
                                        View Portfolio
                                    </button>
                                ) : (
                                    <p className="text-sm text-gray-500 text-center">No portfolio linked</p>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="font-medium text-gray-900 mb-4">Actions</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => updateStatus('accepted')}
                                    disabled={updating || application.status === 'accepted'}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                >
                                    <CheckCircle className="size-4" />
                                    Accept Application
                                </button>
                                <button
                                    onClick={() => updateStatus('rejected')}
                                    disabled={updating || application.status === 'rejected'}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                                >
                                    <XCircle className="size-4" />
                                    Reject Application
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
