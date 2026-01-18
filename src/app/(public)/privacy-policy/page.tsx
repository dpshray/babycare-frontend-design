import React from 'react';
import { AlertTriangle, Calendar, CheckCircle, Eye, FileText, Lock, Mail, Shield, Users, Building2, Baby, MapPin, Bell, ExternalLink } from "lucide-react";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            {/* Header Section */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                <div className="max-w-6xl mx-auto px-6 py-16">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400"/>
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Privacy Policy</h1>
                        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                            We value your trust and are committed to protecting the privacy and security of your personal information.
                        </p>
                        <div className="flex justify-center items-center gap-4 mt-6">
                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                <Calendar className="h-4 w-4 text-slate-600 dark:text-slate-400"/>
                                <span className="text-sm font-medium text-slate-900 dark:text-white">Effective: 1st January 2026</span>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-4 max-w-2xl mx-auto">
                            By using our website or services, you agree to the practices described in this Privacy Policy.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Table of Contents */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Contents</h3>
                            <div className="space-y-2">
                                {[
                                    { id: "information-collect", label: "Information We Collect" },
                                    { id: "how-we-use", label: "How We Use Information" },
                                    { id: "vaccination-disclaimer", label: "Vaccination Disclaimer" },
                                    { id: "sharing", label: "Sharing of Information" },
                                    { id: "security", label: "Data Security" },
                                    { id: "retention", label: "Data Retention" },
                                    { id: "rights", label: "Your Rights" },
                                    { id: "children", label: "Children's Privacy" },
                                    { id: "vendors", label: "Vendor Responsibilities" },
                                    { id: "third-party", label: "Third-Party Links" },
                                    { id: "changes", label: "Policy Changes" },
                                    { id: "contact", label: "Contact Us" },
                                ].map((item) => (
                                    <a
                                        key={item.id}
                                        href={`#${item.id}`}
                                        className="block text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                        {item.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Introduction */}
                        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                            <p className="text-slate-700 dark:text-slate-300">
                                Welcome to <strong>thebabycareapp.com</strong> (&quot;The Baby Care App&quot;, &quot;we&quot;, &quot;our&quot;, &quot;us&quot;). This Privacy Policy explains how we collect, use, store, and protect your data when you use our platform.
                            </p>
                        </div>

                        {/* Information Collection */}
                        <div id="information-collect" className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                    <FileText className="h-6 w-6 text-blue-600"/>
                                    1. Information We Collect
                                </h2>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">a. Information You Provide</h3>
                                    
                                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400"/>
                                                <h4 className="font-semibold text-slate-900 dark:text-white">Parent/Guardian</h4>
                                            </div>
                                            <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                                                <li>• Name</li>
                                                <li>• Email address</li>
                                                <li>• Phone number</li>
                                                <li>• Location (city/district)</li>
                                            </ul>
                                        </div>

                                        <div className="p-4 bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-lg">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Baby className="h-5 w-5 text-pink-600 dark:text-pink-400"/>
                                                <h4 className="font-semibold text-slate-900 dark:text-white">Baby Information</h4>
                                            </div>
                                            <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                                                <li>• Baby&apos;s name</li>
                                                <li>• Gender</li>
                                                <li>• Date of birth</li>
                                            </ul>
                                        </div>

                                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400"/>
                                                <h4 className="font-semibold text-slate-900 dark:text-white">Vendor Information</h4>
                                            </div>
                                            <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                                                <li>• Business name</li>
                                                <li>• Contact details</li>
                                                <li>• Product listings</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">b. Automatically Collected Information</h3>
                                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                        <ul className="text-slate-700 dark:text-slate-300 space-y-1">
                                            <li>• IP address</li>
                                            <li>• Browser type and device information</li>
                                            <li>• Pages visited and usage data</li>
                                        </ul>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
                                            This data helps us improve performance and user experience.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* How We Use Information */}
                        <div id="how-we-use" className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                    <CheckCircle className="h-6 w-6 text-green-600"/>
                                    2. How We Use Your Information
                                </h2>
                            </div>
                            <div className="p-6">
                                <p className="text-slate-700 dark:text-slate-300 mb-4">We use the collected information to:</p>
                                <div className="grid md:grid-cols-2 gap-3">
                                    {[
                                        "Create and manage user accounts",
                                        "Display vaccination schedules based on Government of Nepal guidelines",
                                        "Help parents locate nearby health centers",
                                        "Enable vendors to list and sell baby care products",
                                        "Improve platform features and user experience",
                                        "Communicate important updates and service notifications"
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0"/>
                                            <span className="text-sm text-slate-700 dark:text-slate-300">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                                    <div className="flex items-start gap-2">
                                        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5"/>
                                        <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                                            We do not use baby data for advertising purposes.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Vaccination Disclaimer */}
                        <div id="vaccination-disclaimer" className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                    <AlertTriangle className="h-6 w-6 text-orange-600"/>
                                    3. Vaccination Information Disclaimer
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 rounded">
                                    <p className="text-slate-700 dark:text-slate-300">
                                        Vaccination schedules displayed on the platform are based on publicly available <strong>Government of Nepal</strong> guidelines. This information is provided for educational and reminder purposes only and should not replace professional medical advice. Parents are advised to consult certified healthcare professionals for medical decisions.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Sharing Information */}
                        <div id="sharing" className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                    <Users className="h-6 w-6 text-purple-600"/>
                                    4. Sharing of Information
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                    <p className="font-semibold text-red-900 dark:text-red-100">
                                        We do not sell or rent personal data.
                                    </p>
                                </div>
                                <p className="text-slate-700 dark:text-slate-300">We may share information only in the following cases:</p>
                                <ul className="space-y-2">
                                    {[
                                        "With trusted service providers (hosting, analytics, payment processing) strictly for platform operation",
                                        "With vendors only as necessary to complete transactions",
                                        "If required by law or government authorities in Nepal"
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                                            <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                                    All third parties are required to maintain confidentiality and data protection standards.
                                </p>
                            </div>
                        </div>

                        {/* Data Security & Retention */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div id="security" className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                        <Lock className="h-5 w-5 text-red-600"/>
                                        5. Data Security
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <p className="text-slate-700 dark:text-slate-300 mb-3">
                                        We take reasonable measures to protect your data:
                                    </p>
                                    <ul className="space-y-2 mb-3">
                                        <li className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                            <Shield className="h-4 w-4 text-green-600"/>
                                            Secure servers
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                            <Lock className="h-4 w-4 text-green-600"/>
                                            Encrypted communication (HTTPS)
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                            <Eye className="h-4 w-4 text-green-600"/>
                                            Limited access to sensitive data
                                        </li>
                                    </ul>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                                        No system is 100% secure. We encourage users to protect their login credentials.
                                    </p>
                                </div>
                            </div>

                            <div id="retention" className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-orange-600"/>
                                        6. Data Retention
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <p className="text-slate-700 dark:text-slate-300 mb-3">
                                        We retain your personal information only as long as necessary to:
                                    </p>
                                    <ul className="space-y-1 mb-3">
                                        {["Provide services", "Comply with legal obligations", "Resolve disputes"].map((item, idx) => (
                                            <li key={idx} className="text-sm text-slate-700 dark:text-slate-300">• {item}</li>
                                        ))}
                                    </ul>
                                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                        You may request deletion of your account and associated data at any time.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Your Rights */}
                        <div id="rights" className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                    <Shield className="h-6 w-6 text-emerald-600"/>
                                    7. Your Rights
                                </h2>
                            </div>
                            <div className="p-6">
                                <p className="text-slate-700 dark:text-slate-300 mb-4">As a user, you have the right to:</p>
                                <div className="grid md:grid-cols-2 gap-3">
                                    {[
                                        "Access your personal data",
                                        "Update or correct inaccurate information",
                                        "Request deletion of your data",
                                        "Withdraw consent where applicable"
                                    ].map((right, idx) => (
                                        <div key={idx} className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                                            <p className="text-sm text-slate-700 dark:text-slate-300">{right}</p>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
                                    To exercise these rights, contact us using the details below.
                                </p>
                            </div>
                        </div>

                        {/* Children's Privacy & Vendors */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div id="children" className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                        <Baby className="h-5 w-5 text-pink-600"/>
                                        8. Children&apos;s Privacy
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <p className="text-slate-700 dark:text-slate-300">
                                        The platform collects baby information only from parents or legal guardians. We do not knowingly collect data directly from children.
                                    </p>
                                </div>
                            </div>

                            <div id="vendors" className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                        <Building2 className="h-5 w-5 text-indigo-600"/>
                                        9. Vendor Responsibilities
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <p className="text-slate-700 dark:text-slate-300 mb-2">Vendors are responsible for:</p>
                                    <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1 mb-3">
                                        <li>• Accuracy of product information</li>
                                        <li>• Compliance with laws and regulations</li>
                                        <li>• Protecting customer data</li>
                                    </ul>
                                    <p className="text-xs text-slate-500 dark:text-slate-500 italic">
                                        The Baby Care App is not responsible for vendor misuse of data outside the platform.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Third-Party & Changes */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div id="third-party" className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                        <ExternalLink className="h-5 w-5 text-cyan-600"/>
                                        10. Third-Party Links
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <p className="text-slate-700 dark:text-slate-300">
                                        Our platform may contain links to external websites or services (e.g., maps). We are not responsible for the privacy practices of those third parties.
                                    </p>
                                </div>
                            </div>

                            <div id="changes" className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                        <Bell className="h-5 w-5 text-yellow-600"/>
                                        11. Changes to This Policy
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <p className="text-slate-700 dark:text-slate-300">
                                        We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. We encourage users to review this policy periodically.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contact */}
                        <div id="contact" className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <div className="p-6 border-b border-blue-200 dark:border-blue-700">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                    <Mail className="h-6 w-6 text-blue-600"/>
                                    12. Contact Us
                                </h2>
                            </div>
                            <div className="p-6">
                                <p className="text-slate-700 dark:text-slate-300 mb-4">
                                    If you have questions, concerns, or requests regarding this Privacy Policy, please contact us:
                                </p>
                                <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-blue-200 dark:border-blue-700">
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                        <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400"/>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-white mb-1">Visit our website</p>
                                        <a
                                            href="https://thebabycareapp.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center gap-1"
                                        >
                                            https://thebabycareapp.com
                                            <ExternalLink className="h-4 w-4"/>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                            <div className="text-center">
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    © 2026 The Baby Care App. All rights reserved.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}