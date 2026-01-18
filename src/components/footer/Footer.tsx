'use client'

import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Youtube, Send } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { BABY_CARE_FACEBOOK_URL, BABY_CARE_INSTAGRAM_URL } from "@/config/app-constant"
import { cn } from "@/lib/utils"

export function Footer() {
    const socialMediaLinks = [
        { label: "Facebook", href: BABY_CARE_FACEBOOK_URL, icon: <Facebook size={20} /> },
        { label: "Instagram", href: BABY_CARE_INSTAGRAM_URL, icon: <Instagram size={20} /> },
    ]

    const serviceLinks = [
        { label: "Vaccination Schedules", href: "#" },
        { label: "Healthcare Centers", href: "#" },
        { label: "Baby Care Tips", href: "#" },
        { label: "Expert Guidance", href: "#" },
    ]

    const categoryLinks = [
        { label: "Nutrition", href: "#" },
        { label: "Baby Care & Bath", href: "#" },
        { label: "Feeding & Nursing", href: "#" },
        { label: "Diapers & Changing", href: "#" },
    ]

    const [email, setEmail] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.trim()) {
            toast.error("Please enter a valid email")
            return
        }
        toast.success(`Subscribed successfully with ${email}`)
        setEmail("")
    }

    return (
        <footer className="bg-black text-white pt-12 pb-6 sm:pt-16 sm:pb-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-12 sm:mb-16">
                    <div className="space-y-4 sm:space-y-6">
                        <Link href="/" className="inline-block">
                            <Image
                                src="/logo.png"
                                alt="Babycare Studios Logo"
                                width={100}
                                height={100}
                                className="w-auto h-16 sm:h-20"
                            />
                        </Link>
                        <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                            A complete baby care platform offering genuine products, smart health tools, vaccination tracking, and trusted guidance for modern parents.
                        </p>
                        <div className="flex gap-4" role="list">
                            {socialMediaLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black rounded"
                                    aria-label={`Visit our ${link.label} page`}
                                    role="listitem"
                                >
                                    {link.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    <nav aria-label="Services">
                        <h4 className="font-semibold mb-4 sm:mb-6 text-sm sm:text-base uppercase tracking-wider">
                            Services
                        </h4>
                        <ul className="space-y-2 sm:space-y-3 text-sm text-gray-400">
                            {serviceLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="hover:text-white hover:underline transition-colors focus:outline-none focus:text-white"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <nav aria-label="Shop Categories">
                        <h4 className="font-semibold mb-4 sm:mb-6 text-sm sm:text-base uppercase tracking-wider">
                            Shop Categories
                        </h4>
                        <ul className="space-y-2 sm:space-y-3 text-sm text-gray-400">
                            {categoryLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="hover:text-white hover:underline transition-colors focus:outline-none focus:text-white"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div>
                        <h4 className="font-semibold mb-4 sm:mb-6 text-sm sm:text-base uppercase tracking-wider">
                            Newsletter
                        </h4>
                        <p className="text-sm text-gray-400 mb-4">
                            Receive 10% off your first order, exclusive updates, inspiration and more.
                        </p>
                        <form onSubmit={handleSubmit} className="relative w-full max-w-sm">
                            <label htmlFor="newsletter-email" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="newsletter-email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                aria-required="true"
                                className={cn(
                                    "w-full bg-transparent border-b border-gray-700 py-2 pr-10 text-sm",
                                    "focus:outline-none focus:border-white transition-colors",
                                    "placeholder:text-gray-600"
                                )}
                            />
                            <button
                                type="submit"
                                className="absolute right-0 bottom-2 text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded p-1"
                                aria-label="Subscribe to newsletter"
                            >
                                <Send size={16} />
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-gray-500">
                    <p className="text-center sm:text-left">
                        © {new Date().getFullYear()} Babycare Studios. All rights reserved.
                    </p>
                    <nav aria-label="Legal" className="flex flex-wrap justify-center gap-4 sm:gap-6 uppercase tracking-wider">
                        <Link href="/privacy-policy" className="hover:text-white transition-colors focus:outline-none focus:text-white">
                            Privacy Policy
                        </Link>
                        <Link href="/terms-conditions" className="hover:text-white transition-colors focus:outline-none focus:text-white">
                            Terms & Conditions
                        </Link>
                        <Link href="#" className="hover:text-white transition-colors focus:outline-none focus:text-white">
                            Orders & Returns
                        </Link>
                    </nav>
                </div>
            </div>
        </footer>
    )
}
