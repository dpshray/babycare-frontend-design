'use client'
import Link from "next/link"
import { Facebook, Instagram, Youtube, Send } from "lucide-react"
import Image from "next/image"
import { BABY_CARE_FACEBOOK_URL, BABY_CARE_INSTAGRAM_URL } from "@/config/app-constant"
import {cn} from "@/lib/utils";
import {useState} from "react";
import {toast} from "sonner";

export function Footer() {
    const socialMediaLinks = [
        { label: "Facebook", href: BABY_CARE_FACEBOOK_URL, icon: <Facebook size={20} /> },
        { label: "Instagram", href: BABY_CARE_INSTAGRAM_URL, icon: <Instagram size={20} /> },
        { label: "Youtube", href: "#", icon: <Youtube size={20} /> },
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
        <footer className="bg-black text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Logo + Description + Social */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2">
                            <Image src="/logo.png" alt="Logo" width={100} height={100} className="w-full h-20" />
                        </Link>
                        <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
                            A complete baby care platform offering genuine products, smart health tools, vaccination tracking, and trusted guidance for modern parents.
                        </p>
                        <div className="flex gap-4">
                            {socialMediaLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-blue-500 transition-colors"
                                    aria-label={link.label}
                                >
                                    {link.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="font-bold mb-6 text-sm uppercase tracking-wider">Services</h4>
                        <ul className="space-y-3 text-xs text-gray-400">
                            {serviceLinks.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="hover:underline">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="font-bold mb-6 text-sm uppercase tracking-wider">Shop Categories</h4>
                        <ul className="space-y-3 text-xs text-gray-400">
                            {categoryLinks.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="hover:underline">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-bold mb-6 text-sm uppercase tracking-wider">Sign up for our Newsletter</h4>
                        <p className="text-xs text-gray-400 mb-4">
                            Receive 10% off your first order, exclusive updates, inspiration and more.
                        </p>
                        <form onSubmit={handleSubmit} className="relative w-full max-w-xs">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={cn(
                                    "w-full bg-transparent border-b border-gray-700 py-2 pr-10 text-xs focus:outline-none focus:border-white",
                                    ""
                                )}
                            />
                            <button
                                type="submit"
                                className="absolute right-0 bottom-2 text-gray-400 hover:text-white"
                                aria-label="Subscribe"
                            >
                                <Send size={16} />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-500">
                    <p>© 2026 Babycare Studios. All rights reserved.</p>
                    <div className="flex gap-6 uppercase tracking-widest">
                        <Link href="#" className="hover:text-white">
                            Privacy Policy
                        </Link>
                        <Link href="#" className="hover:text-white">
                            Terms & Conditions
                        </Link>
                        <Link href="#" className="hover:text-white">
                            Orders & Returns
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
