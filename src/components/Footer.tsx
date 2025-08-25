import Link from "next/link"
import Image from "next/image"
import {cn} from "@/lib/utils"

type LinkItem = {
    title: string
    href: string
}

type SocialItem = {
    label: string
    href: string
    icon: keyof typeof icons
}

const links: LinkItem[] = [
    {title: "Privacy Policy", href: "/privacy-policy"},
    {title: "Terms of Service", href: "/terms-conditions"},
]

const socials: SocialItem[] = [
    {
        label: "Facebook",
        href: process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://www.facebook.com/thebabycareapp",
        icon: "facebook",
    },
    {
        label: "Instagram",
        href: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/thebabycareapp/",
        icon: "instagram",
    },
    {label: "Mail", href: process.env.NEXT_PUBLIC_EMAIL_URL || "mailto:info@thebabycareapp.com", icon: "mail"},
]

export default function FooterSection() {
    return (
        <footer className="bg-black/80 py-12 text-white">
            <div className="mx-auto max-w-7xl px-6">
                <Link
                    href="/"
                    aria-label="Go to homepage"
                    className="container flex items-center justify-center mx-auto rounded-lg"
                >
                    <Image src="/Logo.png" alt="BabyCare logo" width={150} height={50} className="w-auto h-28"/>
                </Link>

                <nav
                    aria-label="Footer navigation"
                    className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground"
                >
                    {links.map((link) => (
                        <Link
                            key={link.title}
                            href={link.href}
                            className="hover:text-white text-white transition-colors duration-150"
                        >
                            {link.title}
                        </Link>
                    ))}
                </nav>

                <div className="mt-10 flex flex-wrap justify-center gap-4">
                    {socials.map(({label, href, icon}) => (
                        <Link
                            key={label}
                            href={href}
                            aria-label={label}
                            target={href.startsWith("mailto:") ? "_self" : "_blank"}
                            rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                            className="text-muted-foreground hover:text-white transition-colors"
                        >
                            <span className="sr-only">{label}</span>
                            <Icon name={icon} className="h-6 w-6"/>
                        </Link>
                    ))}
                </div>

                <p className="mt-8 text-center text-white text-sm">
                    &copy; {new Date().getFullYear()} BabyCare. All rights reserved.
                </p>
            </div>
        </footer>
    )
}

type IconProps = {
    name: keyof typeof icons
    className?: string
}

function Icon({name, className}: IconProps) {
    return icons[name] ? <span className={cn("inline-block text-white", className)}>{icons[name]}</span> : null
}

const icons = {
    twitter: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path
                d="M10.488 14.651L15.25 21h7l-7.858-10.478L20.93 3h-2.65l-5.117 5.886L8.75 3h-7l7.51 10.015L2.32 21h2.65zM16.25 19L5.75 5h2l10.5 14z"/>
        </svg>
    ),
    linkedin: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path
                d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"/>
        </svg>
    ),
    facebook: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path
                d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95"/>
        </svg>
    ),
    threads: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.25 8.505c-1.577-5.867-7-5.5-7-5.5s-7.5-.5-7.5 8.995s7.5 8.996 7.5 8.996s4.458.296 6.5-3.918c.667-1.858.5-5.573-6-5.573c0 0-3 0-3 2.5c0 .976 1 2 2.5 2s3.171-1.027 3.5-3c1-6-4.5-6.5-6-4"
            />
        </svg>
    ),
    instagram: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path
                d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"/>
        </svg>
    ),
    tiktok: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path
                d="M16.6 5.82s.51.5 0 0A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48"/>
        </svg>
    ),
    mail: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 21.75 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
            />
        </svg>
    ),
}
