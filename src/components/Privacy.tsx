import React from 'react';
import { ArrowLeft, FileText, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Privacy() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <FileText className="size-8 text-indigo-600" />
                            <span className="text-2xl font-bold text-gray-900">CraftFolio</span>
                        </Link>
                        <Link to="/" className="text-gray-600 hover:text-indigo-600 flex items-center gap-1">
                            <ArrowLeft className="size-4" /> Back to Home
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center gap-3 mb-8">
                    <Shield className="size-10 text-indigo-600" />
                    <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
                </div>

                <div className="prose prose-lg text-gray-600">
                    <p className="text-sm text-gray-400 mb-8">Last Updated: December 2025</p>

                    <p>
                        At CraftFolio, accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by CraftFolio and how we use it.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
                    <p>
                        We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us. This may include:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li>Personal identification information (Name, email address, phone number, etc.)</li>
                        <li>Profile content (Work history, education, projects, photos)</li>
                        <li>Account credentials</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
                    <p>
                        We use the information we collect in various ways, including to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li>Provide, operate, and maintain our website</li>
                        <li>Improve, personalize, and expand our website</li>
                        <li>Understand and analyze how you use our website</li>
                        <li>Develop new products, services, features, and functionality</li>
                        <li>Send you emails (you can unsubscribe at any time)</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Log Files</h2>
                    <p>
                        CraftFolio follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Third Party Privacy Policies</h2>
                    <p>
                        CraftFolio's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Contact Us</h2>
                    <p>
                        If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <strong>harshit142536@gmail.com</strong>.
                    </p>
                </div>
            </main>
        </div>
    );
}
