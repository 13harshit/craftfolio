import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Briefcase, FileText, Plus, Trash2, Edit, Loader, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';

import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const navigate = useNavigate();
  // Using navigate(-1) for back button logic or explicit path
  const onBack = () => navigate('/dashboard');
  const [activeTab, setActiveTab] = useState<'users' | 'jobs' | 'messages'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    salary: '',
    description: '',
    requirements: '',
    company_logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&q=80&w=200'
  });

  // Stats state
  const [stats, setStats] = useState({
    users: 0,
    jobs: 0,
    portfolios: 0,
    applications: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch Users (Profiles)
      const { data: profiles, error: usersError } = await supabase
        .from('profiles')
        .select('*');

      if (usersError) throw usersError;
      setUsers(profiles || []);

      // Fetch Jobs
      const { data: jobList, error: jobsError } = await supabase
        .from('jobs')
        .select('*');

      if (jobsError) throw jobsError;
      setJobs(jobList || []);

      // Fetch Messages
      const { data: msgList, error: msgError } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (msgError) console.error('Error fetching messages:', msgError); // Don't block whole loading
      setMessages(msgList || []);

      // Fetch Counts
      const { count: portfoliosCount } = await supabase
        .from('portfolios')
        .select('*', { count: 'exact', head: true });

      const { count: applicationsCount } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true });

      setStats({
        users: profiles?.length || 0,
        jobs: jobList?.length || 0,
        portfolios: portfoliosCount || 0,
        applications: applicationsCount || 0
      });

    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This will remove their profile and portfolio.')) {
      try {
        // In a real app we'd need admin API to delete Authentication User.
        // For now, we just delete the Profile row, which cascades to Portfolio/Applications depending on DB config.
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId);

        if (error) throw error;
        setUsers(users.filter(u => u.id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (confirm('Are you sure you want to delete this job?')) {
      try {
        const { error } = await supabase
          .from('jobs')
          .delete()
          .eq('id', jobId);

        if (error) throw error;
        setJobs(jobs.filter(j => j.id !== jobId));
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('Failed to delete job');
      }
    }
  };

  const handleSaveJob = async () => {
    if (!jobForm.title || !jobForm.company) {
      alert('Please fill in all required fields');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return; // Should allow admin to post? For now assume admin can post.

    try {
      if (editingJob) {
        // Update
        const { error } = await supabase
          .from('jobs')
          .update(jobForm)
          .eq('id', editingJob.id);

        if (error) throw error;
        loadData(); // Reload to be safe
      } else {
        // Create
        // Admins can post jobs too, but "hirer_id" needs to be set. 
        // We'll set it to current admin user ID.
        const { error } = await supabase
          .from('jobs')
          .insert([{
            ...jobForm,
            hirer_id: user.id,
            is_active: true
          }]);

        if (error) throw error;
        loadData();
      }

      setShowJobForm(false);
      setEditingJob(null);
      resetJobForm();
    } catch (error) {
      console.error('Error saving job:', error);
      alert('Failed to save job');
    }
  };

  const resetJobForm = () => {
    setJobForm({
      title: '',
      company: '',
      location: '',
      type: 'Full-time',
      salary: '',
      description: '',
      requirements: '',
      company_logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&q=80&w=200'
    });
  };

  const handleEditJob = (job: any) => {
    setEditingJob(job);
    setJobForm({
      title: job.title || '',
      company: job.company_name || job.company || '', // Handle potentially different column names if mapped
      location: job.location || '',
      type: job.type || 'Full-time',
      salary: job.salary_min && job.salary_max ? `${job.salary_min}-${job.salary_max}` : job.salary || '',
      description: job.description || '',
      requirements: job.requirements || '',
      company_logo: job.company_logo || ''
    });
    setShowJobForm(true);
  };

  // Stats (calculated from loaded data + placeholders for optimization)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="size-5" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage users and job listings</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg shadow-md">
                <Users className="size-6 text-white" />
              </div>
              <div className="text-3xl text-gray-900">{stats.users}</div>
            </div>
            <div className="text-gray-600">Total Users</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg shadow-md">
                <FileText className="size-6 text-white" />
              </div>
              <div className="text-3xl text-gray-900">{stats.portfolios}</div>
            </div>
            <div className="text-gray-600">Portfolios Created</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-md">
                <Briefcase className="size-6 text-white" />
              </div>
              <div className="text-3xl text-gray-900">{stats.jobs}</div>
            </div>
            <div className="text-gray-600">Active Jobs</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg shadow-md">
                <FileText className="size-6 text-white" />
              </div>
              <div className="text-3xl text-gray-900">{stats.applications}</div>
            </div>
            <div className="text-gray-600">Total Applications</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-4 border-b-2 transition-colors ${activeTab === 'users'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="size-5" />
                  Users
                </div>
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={`px-6 py-4 border-b-2 transition-colors ${activeTab === 'jobs'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="size-5" />
                  Jobs
                </div>
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`px-6 py-4 border-b-2 transition-colors ${activeTab === 'messages'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="size-5" />
                  Messages
                </div>
              </button>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader className="size-8 animate-spin text-indigo-600" />
              </div>
            ) : activeTab === 'users' ? (
              <div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-gray-700">Name</th>
                        <th className="text-left py-3 px-4 text-gray-700">Role</th>
                        <th className="text-left py-3 px-4 text-gray-700">Joined</th>
                        <th className="text-left py-3 px-4 text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-gray-900">{user.full_name || 'N/A'}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-sm ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                              }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="py-3 px-4">
                            {user.role !== 'admin' && (
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : activeTab === 'messages' ? (
              <div>
                <h3 className="text-lg text-gray-900 mb-6">Contact Messages</h3>
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <p className="text-gray-500">No messages found.</p>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.id} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">{msg.name}</h4>
                            <a href={`mailto:${msg.email}`} className="text-indigo-600 hover:text-indigo-800 text-sm">{msg.email}</a>
                            {msg.phone && <p className="text-gray-500 text-sm mt-1">{msg.phone}</p>}
                          </div>
                          <span className="text-xs text-gray-400">
                            {new Date(msg.created_at).toLocaleString()}
                          </span>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-wrap">
                          {msg.message}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg text-gray-900">Manage Job Listings</h3>
                  <button
                    onClick={() => {
                      resetJobForm();
                      setShowJobForm(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="size-4" />
                    Add Job
                  </button>
                </div>

                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-lg text-gray-900 mb-1">{job.title}</h4>
                          <p className="text-gray-600 mb-2">{job.company_name}</p>
                          <div className="flex gap-4 text-sm text-gray-500">
                            <span>{job.location}</span>
                            <span>{job.type}</span>
                            {/* Salary logic handling potentially different fields or raw text */}
                            <span>
                              {job.salary_min ? `${job.salary_min}-${job.salary_max}` : job.salary}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditJob(job)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit className="size-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Job Form Modal */}
      {showJobForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl text-gray-900 mb-6">
              {editingJob ? 'Edit Job' : 'Add New Job'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Job Title *</label>
                <input
                  type="text"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Senior Frontend Developer"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Company *</label>
                <input
                  type="text"
                  value={jobForm.company}
                  onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Company Name"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="City, Country or Remote"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Job Type</label>
                  <select
                    value={jobForm.type}
                    onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Salary</label>
                <input
                  type="text"
                  value={jobForm.salary}
                  onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., $100k-$120k"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                  placeholder="Job description..."
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Requirements</label>
                <textarea
                  value={jobForm.requirements}
                  onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                  placeholder="Requirements..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowJobForm(false);
                  setEditingJob(null);
                  resetJobForm();
                }}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveJob}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-md"
              >
                {editingJob ? 'Update Job' : 'Add Job'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
