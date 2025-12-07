import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockUserProfile } from '../data/mockData';
import PublicPortfolio from './PublicPortfolio';
import { ArrowLeft, Sparkles } from 'lucide-react';

// Wrapper component to inject mock data into PublicPortfolio
export default function TemplateDemo() {
    const { templateId } = useParams();
    const [demoPortfolio, setDemoPortfolio] = useState<any>(null);

    useEffect(() => {
        // Generate mock portfolio data based on the requested template
        const mockPortfolio = {
            title: 'Senior Product Designer',
            bio: mockUserProfile.bio,
            location: 'San Francisco, CA',
            email: mockUserProfile.email,
            phone: '+1 (555) 000-0000',
            website: mockUserProfile.social_links.website,
            linkedin: mockUserProfile.social_links.linkedin,
            github: mockUserProfile.social_links.github,
            skills: mockUserProfile.skills,
            projects: mockUserProfile.projects,
            experience: mockUserProfile.experience,
            template: templateId || 'modern'
        };

        setDemoPortfolio(mockPortfolio);
    }, [templateId]);

    if (!demoPortfolio) return null;

    return (
        <div>
            {/* Demo Banner */}
            <div className="bg-indigo-900 text-white px-4 py-3 sticky top-0 z-50 shadow-lg flex flex-col md:flex-row items-center justify-center gap-4 text-sm md:text-base">
                <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-yellow-300" />
                    <span className="font-medium">Previewing <strong>{templateId?.charAt(0).toUpperCase() + templateId!.slice(1)}</strong> Template</span>
                </div>
                <div className="flex gap-3">
                    <Link to="/templates" className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-xs md:text-sm flex items-center gap-1">
                        <ArrowLeft className="size-3" /> All Templates
                    </Link>
                    <Link to="/auth?mode=signup" className="px-4 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold transition-colors text-xs md:text-sm shadow-md">
                        Use This Template
                    </Link>
                </div>
            </div>

            {/* Render PublicPortfolio with overridden data */}
            {/* We need to modify PublicPortfolio to accept props, OR we hijack the fetch logic. 
          For a cleaner approach without modifying PublicPortfolio heavily, 
          we can act as a wrapper that mocks the implementation if we could export the pure component.
          
          However, since PublicPortfolio manages its own state, we have a few options:
          1. Edit PublicPortfolio to accept `initialData` prop.
          2. Use a Context.
          
          Let's go with Option 1: Edit PublicPortfolio to accept props.
      */}
            <PublicPortfolioFromProps user={mockUserProfile} portfolio={demoPortfolio} />
        </div>
    );
}

// Clone of PublicPortfolio logic but accepting props directly
// In a real refactor, we would extract the UI of PublicPortfolio into a 'PortfolioView' component.
// For now, I will inline the UI logic to ensure it matches exactly or I must modify PublicPortfolio.
// Decision: MODIFY PublicPortfolio to accept props is better for maintenance.

import { Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink } from 'lucide-react';

function PublicPortfolioFromProps({ user, portfolio }: { user: any, portfolio: any }) {

    const getTemplateStyles = () => {
        const common = { heroText: 'text-white' };
        switch (portfolio.template) {
            case 'minimal':
                return {
                    ...common,
                    headerBg: 'bg-gradient-to-br from-slate-700 to-gray-800',
                    badge: 'bg-slate-100 text-slate-700',
                    primaryText: 'text-slate-600',
                    primaryTextHover: 'hover:text-slate-700'
                };
            case 'creative':
                return {
                    ...common,
                    headerBg: 'bg-gradient-to-br from-fuchsia-600 via-purple-600 to-pink-600',
                    badge: 'bg-fuchsia-100 text-fuchsia-700',
                    primaryText: 'text-fuchsia-600',
                    primaryTextHover: 'hover:text-fuchsia-700'
                };
            case 'professional':
                return {
                    ...common,
                    headerBg: 'bg-gradient-to-br from-blue-700 via-indigo-700 to-cyan-700',
                    badge: 'bg-blue-100 text-blue-700',
                    primaryText: 'text-blue-600',
                    primaryTextHover: 'hover:text-blue-700'
                };
            default: // modern
                return {
                    ...common,
                    headerBg: 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600',
                    badge: 'bg-indigo-100 text-indigo-700',
                    primaryText: 'text-indigo-600',
                    primaryTextHover: 'hover:text-indigo-700'
                };
        }
    };

    const styles = getTemplateStyles();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* NOTE: No header/back button here because the banner handles navigation */}

            {/* Hero Section */}
            <div className={`${styles.headerBg} py-20`}>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className={`text-5xl ${styles.heroText} mb-4`}>{user.full_name || user.email}</h1>
                        {portfolio.title && (
                            <p className={`text-2xl ${styles.heroText} mb-6 opacity-90`}>
                                {portfolio.title}
                            </p>
                        )}
                        {portfolio.bio && (
                            <p className={`text-lg ${styles.heroText} max-w-2xl mx-auto opacity-90`}>
                                {portfolio.bio}
                            </p>
                        )}

                        {/* Contact Info */}
                        <div className="flex flex-wrap justify-center gap-6 mt-8">
                            {portfolio.location && (
                                <div className={`flex items-center gap-2 ${styles.heroText} opacity-90`}>
                                    <MapPin className="size-4" />
                                    <span>{portfolio.location}</span>
                                </div>
                            )}
                            {portfolio.email && (
                                <a href={`mailto:${portfolio.email}`} className={`flex items-center gap-2 ${styles.heroText} opacity-90 hover:opacity-100`}>
                                    <Mail className="size-4" />
                                    <span>{portfolio.email}</span>
                                </a>
                            )}
                            {portfolio.phone && (
                                <a href={`tel:${portfolio.phone}`} className={`flex items-center gap-2 ${styles.heroText} opacity-90 hover:opacity-100`}>
                                    <Phone className="size-4" />
                                    <span>{portfolio.phone}</span>
                                </a>
                            )}
                        </div>

                        {/* Social Links */}
                        <div className="flex justify-center gap-4 mt-6">
                            {portfolio.website && (
                                <a
                                    href={portfolio.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`p-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all`}
                                >
                                    <Globe className={`size-5 ${styles.heroText}`} />
                                </a>
                            )}
                            {portfolio.linkedin && (
                                <a
                                    href={portfolio.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`p-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all`}
                                >
                                    <Linkedin className={`size-5 ${styles.heroText}`} />
                                </a>
                            )}
                            {portfolio.github && (
                                <a
                                    href={portfolio.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`p-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all`}
                                >
                                    <Github className={`size-5 ${styles.heroText}`} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Skills */}
                {portfolio.skills && portfolio.skills.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-3xl text-gray-900 mb-6">Skills</h2>
                        <div className="flex flex-wrap gap-3">
                            {portfolio.skills.map((skill: string, index: number) => (
                                <span
                                    key={index}
                                    className={`px-4 py-2 ${styles.badge} rounded-lg`}
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {portfolio.projects && portfolio.projects.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-3xl text-gray-900 mb-6">Projects</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {portfolio.projects.map((project: any, index: number) => (
                                <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                                    <h3 className="text-xl text-gray-900 mb-2">{project.title}</h3>
                                    <p className="text-gray-600 mb-3">{project.description}</p>
                                    {project.technologies && (
                                        <p className="text-sm text-gray-500 mb-3">
                                            <span className={`${styles.primaryText}`}>Technologies:</span> {project.technologies}
                                        </p>
                                    )}
                                    {project.link && (
                                        <a
                                            href={project.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`inline-flex items-center gap-2 ${styles.primaryText} ${styles.primaryTextHover}`}
                                        >
                                            View Project
                                            <ExternalLink className="size-4" />
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Experience */}
                {portfolio.experience && portfolio.experience.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-3xl text-gray-900 mb-6">Work Experience</h2>
                        <div className="space-y-6">
                            {portfolio.experience.map((exp: any, index: number) => (
                                <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                                        <div>
                                            <h3 className="text-xl text-gray-900">{exp.position}</h3>
                                            <p className={`${styles.primaryText}`}>{exp.company}</p>
                                        </div>
                                        <span className="text-gray-500 mt-1 md:mt-0">{exp.duration}</span>
                                    </div>
                                    <p className="text-gray-600">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
