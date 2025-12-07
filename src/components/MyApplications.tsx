import { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Calendar, Building, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface MyApplicationsProps {
  user: any;
}

export default function MyApplications({ user }: MyApplicationsProps) {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchApplications();

    const subscription = supabase
      .channel('my-applications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications',
          filter: `seeker_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setApplications(prev => prev.map(app =>
              app.id === payload.new.id ? { ...app, status: payload.new.status } : app
            ));
          } else if (payload.eventType === 'DELETE') {
            setApplications(prev => prev.filter(app => app.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user.id]);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          jobs (
            title,
            company_name
          )
        `)
        .eq('seeker_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match component structure
      const formattedApps = data?.map(app => ({
        id: app.id,
        jobId: app.job_id,
        jobTitle: app.jobs?.title,
        company: app.jobs?.company_name,
        appliedDate: app.created_at,
        status: app.status,
        message: app.cover_letter,
        portfolioLink: `craftfolio.com/${user.id}` // Placeholder
      })) || [];

      setApplications(formattedApps);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'reviewed':
        return 'bg-blue-100 text-blue-700';
      case 'accepted':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const deleteApplication = async (appId: string) => {
    if (confirm('Are you sure you want to delete this application?')) {
      try {
        const { error } = await supabase
          .from('applications')
          .delete()
          .eq('id', appId);

        if (error) throw error;

        setApplications(applications.filter(app => app.id !== appId));
      } catch (error) {
        console.error('Error deleting application:', error);
        alert('Failed to delete application');
      }
    }
  };

  const filteredApplications = applications.filter(app =>
    filter === 'all' || app.status.toLowerCase() === filter.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="size-5" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl text-gray-900 mb-2">My Applications</h1>
          <p className="text-gray-600">Track your job applications</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              All ({applications.length})
            </button>
            <button
              onClick={() => setFilter('Pending')}
              className={`px-4 py-2 rounded-lg transition-colors ${filter === 'Pending' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Pending ({applications.filter(a => a.status.toLowerCase() === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('Reviewed')}
              className={`px-4 py-2 rounded-lg transition-colors ${filter === 'Reviewed' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Reviewed ({applications.filter(a => a.status.toLowerCase() === 'reviewed').length})
            </button>
            <button
              onClick={() => setFilter('Accepted')}
              className={`px-4 py-2 rounded-lg transition-colors ${filter === 'Accepted' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Accepted ({applications.filter(a => a.status.toLowerCase() === 'accepted').length})
            </button>
            <button
              onClick={() => setFilter('Rejected')}
              className={`px-4 py-2 rounded-lg transition-colors ${filter === 'Rejected' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Rejected ({applications.filter(a => a.status.toLowerCase() === 'rejected').length})
            </button>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length > 0 ? (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <div key={application.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl text-gray-900 mb-1">{application.jobTitle}</h3>
                        <div className="flex items-center gap-2 text-gray-600 mb-3">
                          <Building className="size-4" />
                          <span>{application.company}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="size-4" />
                        Applied: {new Date(application.appliedDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="size-4" />
                        Portfolio: {application.portfolioLink}
                      </div>
                    </div>

                    {application.message && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{application.message}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex md:flex-col items-start gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                    <button
                      onClick={() => deleteApplication(application.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete application"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>

                {application.status === 'Accepted' && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800">
                      Congratulations! Your application has been accepted. The employer will contact you soon.
                    </p>
                  </div>
                )}

                {application.status === 'Rejected' && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800">
                      Unfortunately, your application was not successful this time. Keep applying!
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FileText className="size-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl text-gray-900 mb-2">
              {filter === 'all' ? 'No applications yet' : `No ${filter.toLowerCase()} applications`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all'
                ? 'Start applying for jobs to see them here'
                : `You don't have any ${filter.toLowerCase()} applications`}
            </p>
            {filter === 'all' && (
              <button
                onClick={() => navigate('/jobs')}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-md"
              >
                Browse Jobs
              </button>
            )}
          </div>
        )}

        {/* Stats Summary */}
        {applications.length > 0 && (
          <div className="mt-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-6 border border-indigo-100">
            <h3 className="text-lg text-gray-900 mb-4">Application Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">{applications.length}</div>
                <div className="text-sm text-gray-600">Total Applied</div>
              </div>
              <div className="text-center">
                <div className="text-3xl bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-1">
                  {applications.filter(a => a.status.toLowerCase() === 'pending').length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-3xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1">
                  {applications.filter(a => a.status.toLowerCase() === 'accepted').length}
                </div>
                <div className="text-sm text-gray-600">Accepted</div>
              </div>
              <div className="text-center">
                <div className="text-3xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                  {applications.filter(a => a.status.toLowerCase() === 'reviewed').length}
                </div>
                <div className="text-sm text-gray-600">Reviewed</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
