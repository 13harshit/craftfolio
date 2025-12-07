import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Eye, Plus, Trash2, Palette } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface PortfolioBuilderProps {
  user: any;
}


const templates = [
  { id: 'modern', name: 'Modern', color: 'from-indigo-500 to-purple-500' },
  { id: 'minimal', name: 'Minimal', color: 'from-slate-600 to-gray-700' },
  { id: 'creative', name: 'Creative', color: 'from-fuchsia-500 to-pink-500' },
  { id: 'professional', name: 'Professional', color: 'from-blue-600 to-cyan-600' }
];

export default function PortfolioBuilder({ user }: PortfolioBuilderProps) {
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState<any>({
    bio: '',
    title: '',
    location: '',
    email: user.email,
    phone: '',
    website: '',
    linkedin: '',
    github: '',
    skills: [],
    projects: [],
    experience: [],
    education: [],
    template: 'modern'
  });

  const [skillInput, setSkillInput] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPortfolio();
  }, [user.id]);

  const fetchPortfolio = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows found"
        throw error;
      }

      if (data) {
        setPortfolio({
          ...portfolio,
          ...data,
          skills: data.skills || [],
          projects: data.projects || [],
          experience: data.experience || [],
          education: data.education || []
        });
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('portfolios')
        .upsert({
          user_id: user.id,
          ...portfolio,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) throw error;

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error: any) {
      console.error('Error saving portfolio:', error);
      alert(`Failed to save portfolio: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setPortfolio({
        ...portfolio,
        skills: [...portfolio.skills, skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    setPortfolio({
      ...portfolio,
      skills: portfolio.skills.filter((_: any, i: number) => i !== index)
    });
  };

  const addProject = () => {
    setPortfolio({
      ...portfolio,
      projects: [
        ...portfolio.projects,
        { title: '', description: '', technologies: '', link: '', id: Date.now() }
      ]
    });
  };

  const updateProject = (index: number, field: string, value: string) => {
    const updatedProjects = [...portfolio.projects];
    updatedProjects[index][field] = value;
    setPortfolio({ ...portfolio, projects: updatedProjects });
  };

  const removeProject = (index: number) => {
    setPortfolio({
      ...portfolio,
      projects: portfolio.projects.filter((_: any, i: number) => i !== index)
    });
  };

  const addExperience = () => {
    setPortfolio({
      ...portfolio,
      experience: [
        ...portfolio.experience,
        { company: '', position: '', duration: '', description: '', id: Date.now() }
      ]
    });
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const updatedExperience = [...portfolio.experience];
    updatedExperience[index][field] = value;
    setPortfolio({ ...portfolio, experience: updatedExperience });
  };

  const removeExperience = (index: number) => {
    setPortfolio({
      ...portfolio,
      experience: portfolio.experience.filter((_: any, i: number) => i !== index)
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/portfolio')}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="size-5" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Palette className="size-4" />
              Template
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md disabled:opacity-50"
            >
              <Save className="size-4" />
              {loading ? 'Saving...' : saved ? 'Saved!' : 'Save'}
            </button>
            <button
              onClick={() => {
                handleSave();
                navigate(`/p/${user.id}`);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
            >
              <Eye className="size-4" />
              Preview
            </button>
          </div>
        </div>

        {/* Template Selection */}
        {showTemplates && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="text-lg text-gray-900 mb-4">Choose Template</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    setPortfolio({ ...portfolio, template: template.id });
                    setShowTemplates(false);
                  }}
                  className={`p-4 border-2 rounded-lg transition-all ${portfolio.template === template.id
                    ? 'border-indigo-500 bg-indigo-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                >
                  <div className={`h-20 bg-gradient-to-br ${template.color} rounded mb-2 shadow-sm`}></div>
                  <span className="text-sm text-gray-900">{template.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl text-gray-900 mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Professional Title</label>
              <input
                type="text"
                value={portfolio.title}
                onChange={(e) => setPortfolio({ ...portfolio, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Full Stack Developer, UX Designer"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Bio</label>
              <textarea
                value={portfolio.bio}
                onChange={(e) => setPortfolio({ ...portfolio, bio: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                placeholder="Tell us about yourself..."
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={portfolio.location}
                  onChange={(e) => setPortfolio({ ...portfolio, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="City, Country"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={portfolio.phone}
                  onChange={(e) => setPortfolio({ ...portfolio, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl text-gray-900 mb-4">Links</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Website</label>
              <input
                type="url"
                value={portfolio.website}
                onChange={(e) => setPortfolio({ ...portfolio, website: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://yourwebsite.com"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">LinkedIn</label>
                <input
                  type="url"
                  value={portfolio.linkedin}
                  onChange={(e) => setPortfolio({ ...portfolio, linkedin: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">GitHub</label>
                <input
                  type="url"
                  value={portfolio.github}
                  onChange={(e) => setPortfolio({ ...portfolio, github: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://github.com/yourusername"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl text-gray-900 mb-4">Skills</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Add a skill (e.g., React, Python)"
            />
            <button
              onClick={addSkill}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
            >
              <Plus className="size-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {portfolio.skills.map((skill: string, index: number) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full shadow-sm"
              >
                <span>{skill}</span>
                <button onClick={() => removeSkill(index)} className="hover:text-indigo-900">
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-gray-900">Projects</h2>
            <button
              onClick={addProject}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="size-4" />
              Add Project
            </button>
          </div>
          <div className="space-y-4">
            {portfolio.projects.map((project: any, index: number) => (
              <div key={project.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm text-gray-600">Project {index + 1}</span>
                  <button
                    onClick={() => removeProject(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={project.title}
                    onChange={(e) => updateProject(index, 'title', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Project Title"
                  />
                  <textarea
                    value={project.description}
                    onChange={(e) => updateProject(index, 'description', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
                    placeholder="Project Description"
                  />
                  <input
                    type="text"
                    value={project.technologies}
                    onChange={(e) => updateProject(index, 'technologies', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Technologies Used (e.g., React, Node.js)"
                  />
                  <input
                    type="url"
                    value={project.link}
                    onChange={(e) => updateProject(index, 'link', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Project Link (optional)"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-gray-900">Work Experience</h2>
            <button
              onClick={addExperience}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="size-4" />
              Add Experience
            </button>
          </div>
          <div className="space-y-4">
            {portfolio.experience.map((exp: any, index: number) => (
              <div key={exp.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm text-gray-600">Experience {index + 1}</span>
                  <button
                    onClick={() => removeExperience(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Company Name"
                  />
                  <input
                    type="text"
                    value={exp.position}
                    onChange={(e) => updateExperience(index, 'position', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Position"
                  />
                  <input
                    type="text"
                    value={exp.duration}
                    onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Duration (e.g., Jan 2020 - Present)"
                  />
                  <textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(index, 'description', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
                    placeholder="Description of your role and achievements"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button at Bottom */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md"
          >
            Save Portfolio
          </button>
          <button
            onClick={() => {
              handleSave();
              navigate(`/p/${user.id}`);
            }}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
          >
            Preview Public View
          </button>
        </div>
      </div>
    </div>
  );
}