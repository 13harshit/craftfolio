import { useState, useEffect } from 'react';
import { ArrowLeft, Briefcase, MapPin, Clock, DollarSign, Search, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface JobListingsProps {
  user: any;
}

export default function JobListings({ user }: JobListingsProps) {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showApplication, setShowApplication] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');

  useEffect(() => {
    fetchJobs();

    const subscription = supabase
      .channel('job-listings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'jobs',
          filter: 'is_active=eq.true'
        },
        () => {
          fetchJobs();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApply = async () => {
    if (!user) return;

    try {
      // Check if user has a portfolio
      const { data: portfolio, error: portfolioError } = await supabase
        .from('portfolios')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (portfolioError || !portfolio) {
        alert('Please create your portfolio before applying for jobs!');
        return;
      }

      // Check if already applied
      const { data: existingApp } = await supabase
        .from('applications')
        .select('id')
        .eq('job_id', selectedJob.id)
        .eq('seeker_id', user.id)
        .single();

      if (existingApp) {
        alert('You have already applied for this job!');
        return;
      }

      // Create application
      const { error: applyError } = await supabase
        .from('applications')
        .insert({
          job_id: selectedJob.id,
          seeker_id: user.id,
          cover_letter: applicationMessage,
          status: 'pending'
        });

      if (applyError) throw applyError;

      alert('Application submitted successfully!');
      setShowApplication(false);
      setSelectedJob(null);
      setApplicationMessage('');
    } catch (error: any) {
      console.error('Error applying:', error);
      alert(error.message || 'Failed to submit application');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="size-5" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl text-gray-900 mb-2">Job Listings</h1>
          <p className="text-gray-600">Find your next opportunity</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by job title, company, or location..."
            />
          </div>
        </div>

        {/* Job Listings */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Job Cards */}
          <div className="lg:col-span-2 space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-all ${selectedJob?.id === job.id ? 'ring-2 ring-blue-500' : ''
                  }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl text-gray-900 mb-1">{job.title}</h3>
                    <p className="text-blue-600">{job.company_name}</p>
                  </div>
                  <Briefcase className="size-6 text-gray-400" />
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="size-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="size-4" />
                    {job.job_type}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="size-4" />
                    {job.salary_range}
                  </div>
                </div>

                <p className="text-gray-700 mb-3 line-clamp-2">{job.description}</p>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Posted {new Date(job.created_at).toLocaleDateString()}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedJob(job);
                      setShowApplication(true);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}

            {filteredJobs.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <Briefcase className="size-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600">Try adjusting your search criteria</p>
              </div>
            )}
          </div>

          {/* Job Details Sidebar */}
          <div className="lg:col-span-1">
            {selectedJob ? (
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h3 className="text-xl text-gray-900 mb-2">{selectedJob.title}</h3>
                <p className="text-blue-600 mb-4">{selectedJob.company_name}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="size-4 text-gray-400" />
                    {selectedJob.location}
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="size-4 text-gray-400" />
                    {selectedJob.job_type}
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <DollarSign className="size-4 text-gray-400" />
                    {selectedJob.salary_range}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600">{selectedJob.description}</p>
                </div>

                <div className="mb-6">
                  <h4 className="text-gray-900 mb-2">Requirements</h4>
                  <ul className="space-y-2">
                    {selectedJob.requirements?.map((req: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-gray-600">
                        <span className="text-blue-600 mt-1">•</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setShowApplication(true)}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
                >
                  Apply for this Job
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center sticky top-24">
                <Filter className="size-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Select a job to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplication && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-8">
            <h2 className="text-2xl text-gray-900 mb-4">Apply for {selectedJob.title}</h2>
            <p className="text-gray-600 mb-6">at {selectedJob.company_name}</p>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Cover Letter / Message</label>
              <textarea
                value={applicationMessage}
                onChange={(e) => setApplicationMessage(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-40"
                placeholder="Tell the employer why you're a great fit for this role..."
              />
            </div>

            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                Your portfolio will be automatically included with this application.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowApplication(false);
                  setApplicationMessage('');
                }}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-md"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
