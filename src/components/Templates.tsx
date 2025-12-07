import { Link } from 'react-router-dom';
import { ArrowLeft, Layout, CheckCircle, ArrowRight } from 'lucide-react';

export default function Templates() {
    const templates = [
        {
            id: 'modern',
            name: 'Modern Gradient',
            description: 'A vibrant and professional design with gradient headers. Perfect for creative professionals and tech-forward portfolios.',
            features: ['Gradient Header', 'Clean Typography', 'Project Cards'],
            color: 'from-indigo-600 via-purple-600 to-pink-600'
        },
        {
            id: 'minimal',
            name: 'Clean Minimalist',
            description: 'Stripped back and sophisticated. Focus purely on your content with this elegant, high-contrast monochrome theme.',
            features: ['Dark Mode Header', 'Minimalist Layout', 'Content First'],
            color: 'from-slate-700 to-gray-800'
        },
        {
            id: 'creative',
            name: 'Creative Studio',
            description: 'Bold and expressive. Uses a unique color palette to stand out. Ideal for artists, designers, and creative agencies.',
            features: ['Bold Colors', 'Artistic Flair', 'Distinctive Badges'],
            color: 'from-fuchsia-600 via-purple-600 to-pink-600'
        },
        {
            id: 'professional',
            name: 'Corporate Pro',
            description: 'Trustworthy and established. A calm blue theme that exudes reliability. Great for consultants, executives, and developers.',
            features: ['Professional Blue', 'Traditional Layout', 'Clear Hierarchy'],
            color: 'from-blue-700 via-indigo-700 to-cyan-700'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <Layout className="size-8 text-indigo-600" />
                            <span className="text-2xl font-bold text-gray-900">Templates</span>
                        </Link>
                        <Link to="/" className="text-gray-600 hover:text-indigo-600 flex items-center gap-1">
                            <ArrowLeft className="size-4" /> Back to Home
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Perfect Style</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Select a template to get started. All templates are fully responsive, SEO-optimized, and free to use.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {templates.map((template) => (
                        <div key={template.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col">
                            {/* Preview Header */}
                            <div className={`h-48 bg-gradient-to-br ${template.color} flex items-center justify-center p-8`}>
                                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 text-center w-full max-w-sm">
                                    <div className="h-4 w-24 bg-white/40 rounded mb-4 mx-auto"></div>
                                    <div className="h-3 w-32 bg-white/30 rounded mx-auto"></div>
                                </div>
                            </div>

                            <div className="p-8 flex-grow flex flex-col">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{template.name}</h3>
                                    <p className="text-gray-600">{template.description}</p>
                                </div>

                                <div className="space-y-3 mb-8 flex-grow">
                                    {template.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-2 text-gray-700">
                                            <CheckCircle className="size-5 text-green-500" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-4 mt-auto">
                                    <Link
                                        to={`/templates/preview/${template.id}`}
                                        className="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        Preview Demo
                                    </Link>
                                    <Link
                                        to="/auth?mode=signup"
                                        className="flex-1 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        Use Template <ArrowRight className="size-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
