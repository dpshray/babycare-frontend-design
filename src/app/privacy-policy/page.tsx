import type {Metadata} from "next"
import {AlertTriangle, Calendar, Eye, FileText, Lock, Mail, Shield, Users} from "lucide-react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Separator} from "@/components/ui/separator"

export const metadata: Metadata = {
    title: "Privacy Policy - Baby Care App",
    description:
        "Read the privacy policy for the Baby Care App created by Dwork. Learn about data collection, retention, third-party services, and user rights.",
    openGraph: {
        title: "Privacy Policy - Baby Care App",
        description:
            "Read the privacy policy for the Baby Care App created by Dwork. Learn about data collection, retention, third-party services, and user rights.",
        url: "https://yourdomain.com/privacy-policy",
        siteName: "Baby Care App",
        type: "website",
        images: [
            {
                url: "/baby.png",
                width: 1200,
                height: 630,
                alt: "Baby Care App Logo",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Privacy Policy - Baby Care App",
        description:
            "Read the privacy policy for the Baby Care App created by Dwork. Learn about data collection, retention, third-party services, and user rights.",
        images: ["/baby.png"],
    },
}

export default function PrivacyPolicyPage() {
    return (
        <div
            className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
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
                            Your privacy is important to us. This policy explains how we collect, use, and protect your
                            information
                            when you use our Baby Care app.
                        </p>
                        <div className="flex justify-center items-center gap-4 mt-6">
                            <Badge variant="secondary" className="flex items-center gap-2">
                                <Calendar className="h-4 w-4"/>
                                Effective: May 28, 2025
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-2">
                                <FileText className="h-4 w-4"/>
                                Version 1.0
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Table of Contents */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-6">
                            <CardHeader>
                                <CardTitle className="text-lg">Contents</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <a
                                    href="#overview"
                                    className="block text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    Overview
                                </a>
                                <a
                                    href="#information-collection"
                                    className="block text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    Information Collection
                                </a>
                                <a
                                    href="#third-party"
                                    className="block text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    Third Party Access
                                </a>
                                <a
                                    href="#your-rights"
                                    className="block text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    Your Rights
                                </a>
                                <a
                                    href="#data-retention"
                                    className="block text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    Data Retention
                                </a>
                                <a
                                    href="#security"
                                    className="block text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    Security
                                </a>
                                <a
                                    href="#contact"
                                    className="block text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    Contact Us
                                </a>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Overview */}
                        <Card id="overview">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <Eye className="h-5 w-5 text-blue-600"/>
                                    Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
                                <p>
                                    This privacy policy applies to the Baby Care app (hereby referred to as
                                    &#34;Application&#34;) for mobile
                                    devices that was created by Dwork (hereby referred to as    &#34;Service Providee&#34;) as a
                                    Free service. This
                                    service is intended for use    &#34;AS IS&#34;.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Information Collection */}
                        <Card id="information-collection">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <FileText className="h-5 w-5 text-green-600"/>
                                    Information Collection and Use
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="prose prose-slate dark:prose-invert max-w-none">
                                    <p>
                                        The Application collects information when you download and use it. This
                                        information may include:
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                        <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Device
                                            Information</h4>
                                        <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                                            <li>• IP address</li>
                                            <li>• Operating system</li>
                                            <li>• Device type</li>
                                        </ul>
                                    </div>
                                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                        <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Usage
                                            Data</h4>
                                        <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                                            <li>• Pages visited</li>
                                            <li>• Time and date of visits</li>
                                            <li>• Time spent in app</li>
                                        </ul>
                                    </div>
                                </div>

                                <div
                                    className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5"/>
                                        <div>
                                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Location
                                                Privacy</h4>
                                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                                The Application does not gather precise information about the location
                                                of your mobile device.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="prose prose-slate dark:prose-invert max-w-none">
                                    <p>
                                        For a better experience, the Application may request certain personally
                                        identifiable information,
                                        such as email, name, address, and phone number. This information is retained and
                                        used as described
                                        in this policy.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Third Party Access */}
                        <Card id="third-party">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <Users className="h-5 w-5 text-purple-600"/>
                                    Third Party Access
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="prose prose-slate dark:prose-invert max-w-none">
                                    <p>
                                        Aggregated, anonymized data may be transmitted to external services to help
                                        improve the Application
                                        and its services.
                                    </p>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Third-party
                                        Services</h4>
                                    <div
                                        className="flex items-center gap-3 p-3 bg-white dark:bg-slate-700 rounded border">
                                        <div
                                            className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center">
                                            <span
                                                className="text-xs font-bold text-blue-600 dark:text-blue-400">G</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-slate-900 dark:text-white">Google Play
                                                Services</p>
                                            <a
                                                href="https://www.google.com/policies/privacy/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                View Privacy Policy →
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5"/>
                                        <div>
                                            <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">Information
                                                Disclosure</h4>
                                            <p className="text-sm text-amber-800 dark:text-amber-200 mb-2">Information
                                                may be disclosed:</p>
                                            <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
                                                <li>• As required by law</li>
                                                <li>• To protect rights and safety</li>
                                                <li>• To service providers working on behalf of the Service Provider
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Your Rights */}
                        <Card id="your-rights">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <Shield className="h-5 w-5 text-emerald-600"/>
                                    Your Rights
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div
                                        className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                                        <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">Opt-Out
                                            Rights</h4>
                                        <p className="text-sm text-emerald-800 dark:text-emerald-200">
                                            You can stop information collection by uninstalling the Application.
                                        </p>
                                    </div>
                                    <div
                                        className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Your
                                            Consent</h4>
                                        <p className="text-sm text-blue-800 dark:text-blue-200">
                                            By using the Application, you consent to the data practices described in
                                            this policy.
                                        </p>
                                    </div>
                                </div>

                                <div
                                    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <Users className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5"/>
                                        <div>
                                            <h4 className="font-semibold text-red-900 dark:text-red-100 mb-1">Children&#39;s
                                                Privacy</h4>
                                            <p className="text-sm text-red-800 dark:text-red-200">
                                                The Application is not intended for children under 13. If personal
                                                information is collected from
                                                a child under 13, it will be deleted immediately. Parents can contact
                                                the Service Provider for
                                                such issues.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Data Retention & Security */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card id="data-retention">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-orange-600"/>
                                        Data Retention
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="prose prose-slate dark:prose-invert max-w-none">
                                    <p>
                                        The Service Provider retains user-provided data while the app is in use and for
                                        a reasonable time
                                        afterward. Contact{" "}
                                        <a
                                            href="mailto:dwork.babycare@gmail.com"
                                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            {process.env.NEXT_PUBLIC_EMAIL_URL}
                                        </a>{" "}
                                        to request data deletion.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card id="security">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3">
                                        <Lock className="h-5 w-5 text-red-600"/>
                                        Security
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="prose prose-slate dark:prose-invert max-w-none">
                                    <p>The Service Provider takes security seriously and uses safeguards to protect your
                                        data.</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Updates */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <FileText className="h-5 w-5 text-indigo-600"/>
                                    Policy Updates
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
                                <p>This policy may be updated. Users are advised to check this page periodically for
                                    changes.</p>
                            </CardContent>
                        </Card>

                        {/* Contact */}
                        <Card
                            id="contact"
                            className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800"
                        >
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-blue-600"/>
                                    Contact Us
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div
                                    className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                        <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400"/>
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-white">Have questions about
                                            privacy?</p>
                                        <a
                                            href={`mailto:${process.env.NEXT_PUBLIC_EMAIL_URL}`}
                                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                        >
                                            {process.env.NEXT_PUBLIC_EMAIL_URL}
                                        </a>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Separator/>

                        {/* Footer */}
                        <div className="text-center py-6">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                This privacy policy page was generated by the{" "}
                                <a
                                    href="https://app-privacy-policy-generator.nisrulz.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline hover:text-blue-600 dark:hover:text-blue-400"
                                >
                                    App Privacy Policy Generator
                                </a>
                                .
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "PrivacyPolicy",
                        name: "Privacy Policy",
                        url: "https://yourdomain.com/privacy-policy",
                        datePublished: "2025-05-28",
                        publisher: {
                            "@type": "Organization",
                            name: "Dwork",
                            url: "https://yourdomain.com",
                            contactPoint: {
                                "@type": "ContactPoint",
                                email: "dwork.babycare@gmail.com",
                                contactType: "customer support",
                            },
                        },
                    }),
                }}
            />
        </div>
    )
}
