import { Link } from 'react-router-dom';
import { Palette, Share2, Shield, Zap, Search, Layout, ArrowLeft, Check } from 'lucide-react';

export default function Features() {
    const features = [
        {
            icon: <Palette className="size-6 text-indigo-600" />,
            title: "Beautiful Templates",
            description: "Choose from a gallery of professionally designed themes. Switch layouts instantly without losing your content."
        },
        {
            icon: <Zap className="size-6 text-purple-600" />,
            title: "Instant Setup",
            description: "Create your portfolio in minutes, not days. Our intuitive builder guides you through every step."
        },
        {
            icon: <Share2 className="size-6 text-pink-600" />,
            title: "Custom Domain",
            description: "Get a professional URL (craftfolio.com/yourname) or connect your own custom domain for a unique brand identity."
        },
        {
            icon: <Shield className="size-6 text-green-600" />,
            title: "SEO Optimized",
            description: "Built-in SEO best practices ensure your portfolio gets discovered by recruiters and potential clients on Google."
        },
        {
            icon: <Layout className="size-6 text-blue-600" />,
            title: "Responsive Design",
            description: "Your portfolio looks perfect on every device, from desktop monitors to mobile phones."
        },
        {
            icon: <Search className="size-6 text-orange-600" />,
            title: "Analytics",
            description: "Track who's viewing your work. Get insights into your audience and optimize your portfolio for better reach."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <Zap className="size-8 text-purple-600" />
                            <span className="text-2xl font-bold text-gray-900">Features</span>
                        </Link>
                        <Link to="/" className="text-gray-600 hover:text-indigo-600 flex items-center gap-1">
                            <ArrowLeft className="size-4" /> Back to Home
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-grow py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold text-gray-900 mb-6">Everything You Need to Succeed</h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            CraftFolio gives you the tools to build a stunning portfolio, showcase your work, and advance your career.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="mb-4 bg-gray-50 w-12 h-12 rounded-lg flex items-center justify-center">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Feature Highlight Section */}
                    <div className="bg-indigo-900 rounded-3xl p-8 md:p-16 text-white text-center">
                        <h2 className="text-3xl font-bold mb-6">Ready to Build Your Portfolio?</h2>
                        <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
                            Join thousands of professionals who have accelerated their careers with CraftFolio.
                        </p>
                        <Link to="/auth?mode=signup" className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-900 font-bold rounded-lg hover:bg-indigo-50 transition-colors">
                            Get Started Required
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
