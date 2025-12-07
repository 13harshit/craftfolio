import { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink, Loader, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { supabase } from '../lib/supabase';
import { useNavigate, useParams } from 'react-router-dom';

export default function PublicPortfolio() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const onBack = () => navigate('/'); // Or -1 depending on desired behavior
  const [portfolio, setPortfolio] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchPortfolioData(userId);
    }
  }, [userId]);

  const fetchPortfolioData = async (uid: string) => {
    try {
      if (uid === 'demo') {
        // Keep demo logic for testing if needed, or remove. 
        setLoading(false);
        // ... demo data setup ...
        return;
      }

      // 1. Fetch User Profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single();

      if (profileError) throw profileError;

      // 2. Fetch Portfolio
      const { data: portfolioData, error: portfolioError } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', uid)
        .single();

      if (portfolioError && portfolioError.code !== 'PGRST116') {
        console.error('Error fetching portfolio:', portfolioError);
      }

      setUser(profile);
      setPortfolio(portfolioData || null);

    } catch (error) {
      console.error('Error fetching public portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    const element = document.getElementById('portfolio-content');
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `${user?.full_name || 'portfolio'}-craftfolio.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      // @ts-ignore
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="size-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!portfolio || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-gray-900 mb-4">Portfolio Not Found</h2>
          <p className="text-gray-600 mb-6">The user hasn't published a portfolio yet.</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

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
      {/* Back Button */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="size-5" />
            Back
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
          >
            {downloading ? <Loader className="size-4 animate-spin" /> : <Download className="size-4" />}
            {downloading ? 'Exporting...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* Portfolio Content Wrapper for PDF */}
      <div id="portfolio-content">

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
    </div>
  );
}
