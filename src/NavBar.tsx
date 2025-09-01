"use client"

import { useState } from "react"
import { Menu, X, Apple, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { GooglePlayLogo, StoreButton } from "@/StoreButton"

const NAV_LINKS = [
    { href: "#home", label: "Home" },
    { href: "#services", label: "Services" },
    { href: "#faq", label: "FAQ" },
]

export default function NavBar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const pathName = usePathname()

    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault()
        const el = document.querySelector(targetId)
        if (el) {
            el.scrollIntoView({ behavior: "smooth" })
            setMobileMenuOpen(false)
        }
    }

    return (
        <nav className="w-full">
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <Link href="/" className="flex items-center" aria-label="Homepage">
                            <Image
                                src="/Logo.png"
                                alt="BabyCare logo"
                                width={120}
                                height={40}
                                className="w-auto h-24 sm:h-28 saturate-200"
                                priority
                            />
                        </Link>

                        <div className="hidden md:flex items-center space-x-8">
                            {pathName === "/" &&
                                NAV_LINKS.map(({ href, label }) => (
                                    <a
                                        key={href}
                                        href={href}
                                        onClick={(e) => handleScroll(e, href)}
                                        className="text-gray-600 hover:text-pink-500 font-medium text-sm transition-colors px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    >
                                        {label}
                                    </a>
                                ))}
                        </div>

                        <div className="hidden lg:flex items-center gap-2">
                            {/* <StoreButton
                                href={`${process.env.NEXT_PUBLIC_APP_STORE_LINK}`}
                                logo={<AppleLogo />}
                                label="Download on the"
                                storeName="App Store"
                            /> */}
                            <StoreButton
                                href={`${process.env.NEXT_PUBLIC_PLAY_STORE_LINK}`}
                                logo={<GooglePlayLogo />}
                                label="Download on the"
                                storeName="Google Play Store"
                            />
                        </div>

                        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                                </Button>
                            </SheetTrigger>

                            <SheetContent side="top" className="md:hidden w-full border-b">
                                <div className="pt-6 space-y-6">
                                    <nav className="flex flex-col gap-4">
                                        {NAV_LINKS.map(({ href, label }) => (
                                            <a
                                                key={href}
                                                href={href}
                                                onClick={(e) => handleScroll(e, href)}
                                                className="text-gray-800 hover:text-pink-500 text-base font-medium px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                            >
                                                {label}
                                            </a>
                                        ))}
                                    </nav>

                                    <div className="border-t border-gray-200 pt-4 flex flex-col gap-3">
                                        <Button asChild variant="outline">
                                            <a
                                                href={process.env.NEXT_PUBLIC_APP_STORE_URL || "#"}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 justify-center"
                                            >
                                                <Apple className="w-5 h-5" />
                                                App Store
                                            </a>
                                        </Button>
                                        <Button asChild>
                                            <a
                                                href={process.env.NEXT_PUBLIC_PLAY_STORE_URL || "#"}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 justify-center"
                                            >
                                                <Play className="w-5 h-5" />
                                                Play Store
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>
        </nav>
    )
}
