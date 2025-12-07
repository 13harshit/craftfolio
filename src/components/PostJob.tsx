import { useState } from 'react';
import { ArrowLeft, Save, Briefcase, MapPin, DollarSign, Clock, List } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface PostJobProps {
    user: any;
    onComplete?: () => void; // Optional if you still want to support it, but better remove
}

export default function PostJob({ user }: PostJobProps) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        company_name: user?.user_metadata?.company_name || user?.full_name || '', // Default to user's name if not set
        location: '',
        job_type: 'Full-time',
        salary_range: '',
        description: '',
        requirements: ['']
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRequirementChange = (index: number, value: string) => {
        const newRequirements = [...formData.requirements];
        newRequirements[index] = value;
        setFormData({ ...formData, requirements: newRequirements });
    };

    const addRequirement = () => {
        setFormData({ ...formData, requirements: [...formData.requirements, ''] });
    };

    const removeRequirement = (index: number) => {
        const newRequirements = formData.requirements.filter((_, i) => i !== index);
        setFormData({ ...formData, requirements: newRequirements });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Filter out empty requirements
            const cleanedRequirements = formData.requirements.filter(req => req.trim() !== '');

            const { error } = await supabase
                .from('jobs')
                .insert({
                    hirer_id: user.id,
                    title: formData.title,
                    company_name: formData.company_name,
                    location: formData.location,
                    job_type: formData.job_type,
                    salary_range: formData.salary_range,
                    description: formData.description,
                    requirements: cleanedRequirements,
                    is_active: true
                });

            if (error) throw error;


            alert('Job posted successfully!');
            navigate('/hirer');
        } catch (error: any) {
            console.error('Error posting job:', error);
            alert(error.message || 'Failed to post job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/hirer')}
                        className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft className="size-5" />
                        Back to Dashboard
                    </button>
                    <h1 className="text-3xl text-gray-900 mb-2">Post a New Job</h1>
                    <p className="text-gray-600">Create a job listing to find the best talent</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Job Title</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="e.g. Senior Frontend Developer"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Company Name</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="company_name"
                                        required
                                        value={formData.company_name}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Your Company Name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="location"
                                        required
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="e.g. Remote, New York, NY"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Job Type</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                                    <select
                                        name="job_type"
                                        value={formData.job_type}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                    >
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Freelance">Freelance</option>
                                        <option value="Internship">Internship</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Salary Range</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="salary_range"
                                        required
                                        value={formData.salary_range}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="e.g. $80k - $120k"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Description</label>
                            <textarea
                                name="description"
                                required
                                value={formData.description}
                                onChange={handleChange}
                                rows={6}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Describe the role, responsibilities, and ideal candidate..."
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Requirements</label>
                            <div className="space-y-3">
                                {formData.requirements.map((req, index) => (
                                    <div key={index} className="flex gap-2">
                                        <div className="relative flex-1">
                                            <List className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={req}
                                                onChange={(e) => handleRequirementChange(index, e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                placeholder="e.g. 3+ years of experience with React"
                                            />
                                        </div>
                                        {formData.requirements.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeRequirement(index)}
                                                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addRequirement}
                                    className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                                >
                                    + Add Requirement
                                </button>
                            </div>
                        </div>

                        <div className="pt-4 flex gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/hirer')}
                                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-md font-medium disabled:opacity-50 flex justify-center items-center gap-2"
                            >
                                <Save className="size-5" />
                                {loading ? 'Posting...' : 'Post Job'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
