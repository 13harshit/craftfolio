import { useState, useEffect } from 'react';
import { User, Mail, Save, Github, Globe, Linkedin, Shield, AlertCircle, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface SettingsProps {
    user: any;
}

export default function Settings({ user }: SettingsProps) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [activeTab, setActiveTab] = useState<'profile' | 'account'>('profile');

    // Profile State
    const [formData, setFormData] = useState({
        full_name: user?.full_name || '',
        title: user?.title || '',
        bio: user?.bio || '',
        avatar_url: user?.avatar_url || '',
        website_url: user?.website_url || '',
        github_url: user?.github_url || '',
        linkedin_url: user?.linkedin_url || ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || '',
                title: user.title || '',
                bio: user.bio || '',
                avatar_url: user.avatar_url || '',
                website_url: user.website_url || '',
                github_url: user.github_url || '',
                linkedin_url: user.linkedin_url || ''
            });
        }
    }, [user]);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage('');

        try {
            const { error } = await supabase
                .from('profiles')
                .update(formData)
                .eq('id', user.id);

            if (error) throw error;

            // Update local storage user data broadly to reflect changes immediately
            const updatedUser = { ...user, ...formData };
            localStorage.setItem('craftfolio_user', JSON.stringify(updatedUser));

            setSuccessMessage('Profile updated successfully! Refresh to see changes globally.');

            // Optional: Force reload or rely on App.tsx to re-fetch if we cleared cache? 
            // Current architecture in App.tsx relies on cache or re-fetch on mount.
            // Ideally we should have a generic "updateUser" prop or context, but for now this works.

        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete your account? This action is irreversible.");
        if (!confirmDelete) return;

        // Logic would go here. For now just alert.
        alert("Account deletion is not fully implemented in this demo.");
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${activeTab === 'profile'
                                    ? 'border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50/50'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            <User className="size-5" />
                            Profile
                        </button>
                        <button
                            onClick={() => setActiveTab('account')}
                            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${activeTab === 'account'
                                    ? 'border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50/50'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            <Shield className="size-5" />
                            Account
                        </button>
                    </div>

                    <div className="p-8">
                        {successMessage && (
                            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 animate-fade-in">
                                <Save className="size-5" />
                                {successMessage}
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <form onSubmit={handleSaveProfile} className="space-y-6">

                                {/* Basic Info */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={formData.full_name}
                                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="e.g. Senior Frontend Developer"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Tell us about yourself..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Avatar URL</label>
                                    <div className="flex gap-4">
                                        <img
                                            src={formData.avatar_url || `https://ui-avatars.com/api/?name=${user.full_name}`}
                                            alt="Avatar Preview"
                                            className="size-12 rounded-full object-cover border border-gray-200"
                                        />
                                        <input
                                            type="text"
                                            value={formData.avatar_url}
                                            onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                                            placeholder="https://..."
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Provide a direct link to your profile image.</p>
                                </div>

                                <div className="border-t border-gray-200 pt-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Social Links</h3>
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                                <Globe className="size-4" /> Website
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.website_url}
                                                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                                                placeholder="https://your-site.com"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                                <Github className="size-4" /> GitHub
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.github_url}
                                                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                                                placeholder="https://github.com/..."
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                                <Linkedin className="size-4" /> LinkedIn
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.linkedin_url}
                                                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                                                placeholder="https://linkedin.com/in/..."
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-md"
                                    >
                                        {loading ? <Loader className="size-5 animate-spin" /> : <Save className="size-5" />}
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        )}

                        {activeTab === 'account' && (
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                                    <div className="grid gap-4 max-w-lg">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Email Address</label>
                                            <div className="mt-1 flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-700">
                                                <Mail className="size-4 text-gray-400" />
                                                {user.email}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">Email cannot be changed directly.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-8">
                                    <h3 className="text-lg font-medium text-red-600 mb-4 flex items-center gap-2">
                                        <AlertCircle className="size-5" />
                                        Danger Zone
                                    </h3>
                                    <div className="bg-red-50 border border-red-100 rounded-lg p-6 flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-red-900">Delete Account</p>
                                            <p className="text-sm text-red-700 mt-1">Permanently delete your account and all associated data.</p>
                                        </div>
                                        <button
                                            onClick={handleDeleteAccount}
                                            className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium transition-colors"
                                        >
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
