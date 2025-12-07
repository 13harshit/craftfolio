import React from 'react';
import { ArrowLeft, FileText, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
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

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">About CraftFolio</h1>

                <div className="prose prose-lg text-gray-600">
                    <p className="lead text-xl mb-8 text-gray-700">
                        CraftFolio is dedicated to empowering professionals to showcase their best work and connect with opportunities. We believe everyone deserves a stunning portfolio without the hassle of coding one from scratch.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-4">Our Mission</h2>
                    <p>
                        Our mission is to democratize professional branding. Whether you are a designer, developer, writer, or marketer, your portfolio is your visual resume. CraftFolio makes it easy to build, share, and manage your professional presence online.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-4">Why We Started</h2>
                    <p>
                        We noticed that many talented individuals struggled to present their work effectively. Existing tools were either too complex or too generic. CraftFolio was born out of the need for a balanced solution—powerful enough to be unique, yet simple enough to be used by anyone.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-4">What Sets Us Apart</h2>
                    <ul className="space-y-4 my-6">
                        <li className="flex items-start gap-3">
                            <CheckCircle className="size-6 text-green-500 shrink-0 mt-0.5" />
                            <span><strong>AI-Powered Assistance:</strong> We help you write better bios and descriptions.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle className="size-6 text-green-500 shrink-0 mt-0.5" />
                            <span><strong>Real-Time Updates:</strong> Your portfolio updates instantly as you edit.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle className="size-6 text-green-500 shrink-0 mt-0.5" />
                            <span><strong>Integrated Job Board:</strong> seamlessly apply to jobs using your CraftFolio profile.</span>
                        </li>
                    </ul>

                    <div className="mt-12 p-6 bg-indigo-50 rounded-xl border border-indigo-100">
                        <h3 className="text-xl font-semibold text-indigo-900 mb-2">Join Our Journey</h3>
                        <p className="text-indigo-700 mb-4">
                            We are constantly evolving and adding new features. Be part of our growing community of professionals.
                        </p>
                        <Link to="/auth" className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                            Get Started Today
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
