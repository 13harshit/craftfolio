import { Link } from 'react-router-dom';
import { Check, ArrowLeft, Crown } from 'lucide-react';

export default function Pricing() {
    const plans = [
        {
            name: "Seeker",
            price: "$0",
            description: "Perfect for students and job seekers starting their career.",
            features: [
                "1 Public Portfolio",
                "Basic Templates",
                "Export to PDF",
                "Standard Support"
            ],
            cta: "Start for Free",
            popular: false
        },
        {
            name: "Professional",
            price: "$12",
            period: "/month",
            description: "For designers and developers who want to stand out.",
            features: [
                "Everything in Seeker",
                "Unlimited Projects",
                "Premium Templates",
                "Custom Domain",
                "Advanced Analytics",
                "Priority Support"
            ],
            cta: "Go Professional",
            popular: true
        },
        {
            name: "Hirer",
            price: "$49",
            period: "/month",
            description: "For recruiters and agencies managing multiple talents.",
            features: [
                "Everything in Professional",
                "Talent Search",
                "Multiple User Accounts",
                "White-label Portfolios",
                "API Access",
                "Dedicated Manager"
            ],
            cta: "Contact Sales",
            popular: false
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <Crown className="size-8 text-indigo-600" />
                            <span className="text-2xl font-bold text-gray-900">Pricing</span>
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
                        <h1 className="text-4xl font-bold text-gray-900 mb-6">Simple, Transparent Pricing</h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Start for free, upgrade when you need to. No credit card required for the free plan.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {plans.map((plan, index) => (
                            <div key={index} className={`relative bg-white rounded-2xl shadow-lg border p-8 flex flex-col ${plan.popular ? 'border-indigo-600 ring-2 ring-indigo-600 ring-opacity-20 scale-105 shadow-2xl z-10' : 'border-gray-200'}`}>
                                {plan.popular && (
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                                        Most Popular
                                    </div>
                                )}
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                <p className="text-gray-500 mb-6 text-sm">{plan.description}</p>

                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                                    {plan.period && <span className="text-gray-500">{plan.period}</span>}
                                </div>

                                <ul className="space-y-4 mb-8 flex-grow">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 text-gray-700 text-sm">
                                            <Check className="size-5 text-green-500 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    to="/auth?mode=signup"
                                    className={`w-full py-3 rounded-lg font-medium text-center transition-colors ${plan.popular
                                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                        }`}
                                >
                                    {plan.cta}
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* FAQ Section */}
                    <div className="mt-24 max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Can I switch plans later?</h3>
                                <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time from your account settings.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Is there a free trial?</h3>
                                <p className="text-gray-600">The Seeker plan is forever free. You can try out the platform features without any time limit.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Do you offer refunds?</h3>
                                <p className="text-gray-600">We offer a 14-day money-back guarantee for all paid plans if you're not satisfied.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
