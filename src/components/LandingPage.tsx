import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Users, Briefcase, Palette, Share2, Zap } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FileText className="size-8 text-indigo-600" />
              <span className="text-2xl text-gray-900">CraftFolio</span>
            </div>
            <Link
              to="/auth"
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl text-gray-900 mb-6">
              Build Your Professional Portfolio in Minutes
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Create stunning portfolios, showcase your work, and apply for jobs all in one place.
              Perfect for freelancers, designers, developers, and job seekers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth"
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                Create Your Portfolio
              </Link>
              <button
                onClick={() => navigate('/templates/preview/modern')}
                className="px-8 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors shadow-md"
              >
                View Demo Portfolio
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl text-gray-900 mb-4">Why Choose CraftFolio?</h2>
            <p className="text-xl text-gray-600">
              Everything you need to showcase your skills and land your dream job
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl hover:shadow-lg transition-shadow">
              <Palette className="size-12 text-indigo-600 mb-4" />
              <h3 className="text-xl text-gray-900 mb-2">Beautiful Templates</h3>
              <p className="text-gray-700">
                Choose from professionally designed templates that make your work stand out
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-lg transition-shadow">
              <Zap className="size-12 text-purple-600 mb-4" />
              <h3 className="text-xl text-gray-900 mb-2">Easy to Use</h3>
              <p className="text-gray-700">
                Build and publish your portfolio in minutes with our intuitive editor
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl hover:shadow-lg transition-shadow">
              <Share2 className="size-12 text-pink-600 mb-4" />
              <h3 className="text-xl text-gray-900 mb-2">Shareable Links</h3>
              <p className="text-gray-700">
                Get a custom link to share your portfolio with clients and recruiters
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl hover:shadow-lg transition-shadow">
              <Briefcase className="size-12 text-emerald-600 mb-4" />
              <h3 className="text-xl text-gray-900 mb-2">Job Board</h3>
              <p className="text-gray-700">
                Browse and apply for jobs directly with your portfolio
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl hover:shadow-lg transition-shadow">
              <Users className="size-12 text-amber-600 mb-4" />
              <h3 className="text-xl text-gray-900 mb-2">For Everyone</h3>
              <p className="text-gray-700">
                Perfect for designers, developers, writers, marketers, and more
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl hover:shadow-lg transition-shadow">
              <FileText className="size-12 text-rose-600 mb-4" />
              <h3 className="text-xl text-gray-900 mb-2">Track Applications</h3>
              <p className="text-gray-700">
                Keep track of all your job applications in one organized dashboard
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl text-white mb-6">
            Ready to Build Your Professional Presence?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of professionals who trust CraftFolio to showcase their work
          </p>
          <Link
            to="/auth"
            className="px-8 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors shadow-xl hover:shadow-2xl"
          >
            Get Started for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="size-6 text-indigo-400" />
                <span className="text-xl text-white">CraftFolio</span>
              </div>
              <p className="text-gray-400">
                Build professional portfolios and find your next opportunity
              </p>
            </div>
            <div>
              <h4 className="text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link to="/templates" className="text-gray-400 hover:text-indigo-400 transition-colors">Templates</Link></li>
                <li><Link to="/features" className="text-gray-400 hover:text-indigo-400 transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="text-gray-400 hover:text-indigo-400 transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-indigo-400 transition-colors">About</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-indigo-400 transition-colors">Contact</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-indigo-400 transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; 2025 CraftFolio. Developed by Sudeep Ganesh Ravidas. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
