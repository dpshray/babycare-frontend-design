"use client"

import {useCallback, useEffect, useRef, useState} from "react"
import Link from "next/link"
import Image from "next/image"
import {usePathname, useRouter} from "next/navigation"
import {Baby, Heart, LogOut, Mail, MapPin, Menu, Phone, Search, ShoppingCart, Smartphone, User, X} from "lucide-react"
import {toast} from "sonner"
import {Button} from "@/components/ui/button"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Input} from "@/components/ui/input"
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card"
import {
    BABY_CARE_ADDRESS,
    BABY_CARE_APP_STORE_URL,
    BABY_CARE_EMAIL,
    BABY_CARE_PHONE,
    BABY_CARE_PLAY_STORE_URL
} from "@/config/app-constant"
import {cn} from "@/lib/utils"
import {useAuth} from "@/hooks/useAuth"
import {authService} from "@/Service/auth.service"

const navigationLinks = [
    {href: "/products", label: "Shop"},
    {href: "/health-center", label: "Health Center"},
    {href: "/vaccination-schedule", label: "Vaccination Schedule"},
    {href: "/healthy-tips", label: "Tips"},
] as const

export default function NavigationBar({className}: { className?: string }) {
    const {user, isLoading} = useAuth()
    const pathname = usePathname()
    const router = useRouter()
    const searchInputRef = useRef<HTMLInputElement>(null)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const cartCount = user?.cart_item_count ?? 0
    const favoritesCount = user?.favourate_item_count ?? 0

    const toggleMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(prev => !prev)
        setIsSearchOpen(false)
    }, [])

    const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), [])

    const toggleSearch = useCallback(() => {
        setIsSearchOpen(prev => !prev)
        setIsMobileMenuOpen(false)
    }, [])

    const closeSearch = useCallback(() => {
        setIsSearchOpen(false)
        setSearchQuery("")
    }, [])

    const handleSearch = useCallback((e: React.FormEvent) => {
        e.preventDefault()
        const trimmedQuery = searchQuery.trim()
        if (trimmedQuery) {
            router.push(`/products?q=${encodeURIComponent(trimmedQuery)}`)
            closeSearch()
            closeMobileMenu()
        }
    }, [searchQuery, router, closeSearch, closeMobileMenu])

    const handleLogout = useCallback(async () => {
        const toastId = toast.loading("Logging out...")
        try {
            await authService.logout()
            localStorage.removeItem("_baby")
            toast.success("Logout successful", {id: toastId})
            router.push("/")
        } catch (error: any) {
            toast.error(error?.message || "Logout failed", {id: toastId})
        }
    }, [router])

    const handleProfile = useCallback(() => router.push("/profile"), [router])

    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus()
        }
    }, [isSearchOpen])

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                if (isSearchOpen) closeSearch()
                if (isMobileMenuOpen) closeMobileMenu()
            }
        }
        document.addEventListener("keydown", handleEscape)
        return () => document.removeEventListener("keydown", handleEscape)
    }, [isSearchOpen, isMobileMenuOpen, closeSearch, closeMobileMenu])

    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? "hidden" : ""
        return () => {
            document.body.style.overflow = ""
        }
    }, [isMobileMenuOpen])

    const renderBadge = useCallback((count: number, color: "orange" | "red") => {
        if (count === 0) return null
        return (
            <span className={cn(
                "absolute -top-1 -right-1 text-white text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1",
                color === "orange" ? "bg-orange-500" : "bg-red-500"
            )}>
                {count > 99 ? "99+" : count}
            </span>
        )
    }, [])

    const renderUserAvatar = useCallback(() => {
        if (!user) return null
        return (
            <HoverCard openDelay={200}>
                <HoverCardTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={user.media || "/placeholder.svg"} alt={user.name}/>
                            <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-56" align="end">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={user.media || "/placeholder.svg"} alt={user.name}/>
                                <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate">{user.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 pt-2 border-t">
                            <Button variant="outline" size="sm" onClick={handleProfile}
                                    className="justify-start gap-2 bg-transparent">
                                <User className="h-4 w-4"/> View Profile
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => router.push("/baby")}
                                    className="justify-start gap-2">
                                <Baby className="h-4 w-4"/> Baby
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => router.push("/cart")}
                                    className="justify-start gap-2">
                                <ShoppingCart className="h-4 w-4"/> My Cart ({cartCount})
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => router.push("/favorites")}
                                    className="justify-start gap-2">
                                <Heart className="h-4 w-4"/> Favorites ({favoritesCount})
                            </Button>
                            <Button variant="destructive" size="sm" onClick={handleLogout}
                                    className="justify-start gap-2">
                                <LogOut className="h-4 w-4"/> Logout
                            </Button>

                        </div>
                    </div>
                </HoverCardContent>
            </HoverCard>
        )
    }, [user, cartCount, favoritesCount, handleProfile, handleLogout, router])

    const isActiveLink = useCallback((href: string) => {
        return pathname === href || pathname?.startsWith(`${href}/`)
    }, [pathname])

    return (
        <header className={cn("sticky top-0 z-50 bg-background shadow-sm", className)}>
            <div className="bg-primary text-primary-foreground">
                <div className="container mx-auto px-4 py-2 hidden md:flex justify-between text-xs">
                    <div className="flex gap-4 lg:gap-6">
                        <a href={`tel:${BABY_CARE_PHONE}`}
                           className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                            <Phone className="h-3.5 w-3.5"/>
                            <span className="hidden lg:inline">{BABY_CARE_PHONE}</span>
                        </a>
                        <a href={`mailto:${BABY_CARE_EMAIL}`}
                           className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                            <Mail className="h-3.5 w-3.5"/>
                            <span className="hidden lg:inline">{BABY_CARE_EMAIL}</span>
                        </a>
                        <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5"/>
                            <span className="hidden xl:inline">{BABY_CARE_ADDRESS}</span>
                        </span>
                    </div>
                    <div className="flex gap-4">
                        <a href={BABY_CARE_PLAY_STORE_URL} target="_blank" rel="noopener noreferrer"
                           className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                            <Smartphone className="h-3.5 w-3.5"/> Play Store
                        </a>
                        <a href={BABY_CARE_APP_STORE_URL} target="_blank" rel="noopener noreferrer"
                           className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                            <Smartphone className="h-3.5 w-3.5"/> App Store
                        </a>
                    </div>
                </div>
            </div>

            <nav className="border-b">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
                    <Link href="/"
                          className="flex items-center gap-2 hover:opacity-90 transition-opacity flex-shrink-0">
                        <Image
                            src="/logo.png"
                            alt="BabyCare Logo"
                            className="w-auto h-12 md:h-14 lg:h-16"
                            width={100}
                            height={100}
                            priority
                        />
                    </Link>

                    <div className="hidden lg:flex flex-1 max-w-3xl mx-4">
                        {isSearchOpen ? (
                            <form onSubmit={handleSearch} className="relative w-full flex gap-2">
                                <div className="relative flex-1">
                                    <Search
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
                                        aria-hidden="true"
                                    />
                                    <Input
                                        ref={searchInputRef}
                                        type="search"
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        placeholder="Search for baby products..."
                                        className="pl-10 pr-4 h-10 w-full"
                                        aria-label="Search products"
                                        autoComplete="off"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    size="sm"
                                    className="h-10 px-6 flex-shrink-0"
                                    disabled={!searchQuery.trim()}
                                >
                                    Search
                                </Button>
                            </form>
                        ) : (
                            <div className="flex gap-4 xl:gap-6 items-center justify-center w-full">
                                {navigationLinks.map(link => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={cn(
                                            "text-sm font-medium transition-all whitespace-nowrap px-3 py-1.5 rounded-md",
                                            isActiveLink(link.href)
                                                ? "bg-primary text-primary-foreground"
                                                : "text-muted-foreground hover:text-primary hover:bg-muted"
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleSearch}
                            aria-label={isSearchOpen ? "Close search" : "Open search"}
                        >
                            {isSearchOpen ? <X className="h-5 w-5"/> : <Search className="h-5 w-5"/>}
                        </Button>

                        {user ? (
                            <>
                                <Link href="/cart" className="relative hidden sm:block">
                                    <Button variant="ghost" size="icon" aria-label="Shopping cart">
                                        <ShoppingCart className="h-5 w-5"/>
                                    </Button>
                                    {renderBadge(cartCount, "orange")}
                                </Link>
                                <Link href="/favorites" className="relative hidden sm:block">
                                    <Button variant="ghost" size="icon" aria-label="Favorites">
                                        <Heart className="h-5 w-5"/>
                                    </Button>
                                    {renderBadge(favoritesCount, "red")}
                                </Link>
                                <div className="hidden sm:block">
                                    {renderUserAvatar()}
                                </div>
                            </>
                        ) : isLoading ? (
                            <div className="h-9 w-9 rounded-full bg-muted animate-pulse hidden sm:block"/>
                        ) : (
                            <Button asChild className="hidden sm:flex">
                                <Link href="/login">Login</Link>
                            </Button>
                        )}

                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={toggleMobileMenu}
                            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                        >
                            {isMobileMenuOpen ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}
                        </Button>
                    </div>
                </div>

                {isMobileMenuOpen && (
                    <div className="lg:hidden border-t bg-background">
                        <div className="flex flex-col p-4 gap-2">
                            {isSearchOpen && (
                                <form onSubmit={handleSearch} className="mb-4">
                                    <div className="relative">
                                        <Search
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
                                            aria-hidden="true"
                                        />
                                        <Input
                                            ref={searchInputRef}
                                            type="search"
                                            value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                            placeholder="Search for baby products..."
                                            className="pl-10 pr-4 h-10 w-full"
                                            aria-label="Search products"
                                            autoComplete="off"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full mt-2"
                                        size="sm"
                                        disabled={!searchQuery.trim()}
                                    >
                                        Search
                                    </Button>
                                </form>
                            )}
                            {navigationLinks.map(link => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={closeMobileMenu}
                                    className={cn(
                                        "py-2.5 px-3 text-sm rounded-md transition-all font-medium",
                                        isActiveLink(link.href)
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:text-primary hover:bg-muted"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            {user ? (
                                <div className="sm:hidden border-t pt-2 mt-2 space-y-1">
                                    <Link href="/cart" onClick={closeMobileMenu}
                                          className="py-2.5 px-3 text-sm text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-colors flex items-center justify-between">
                                        <span className="flex items-center gap-2 font-medium">
                                            <ShoppingCart className="h-4 w-4"/> My Cart
                                        </span>
                                        {cartCount > 0 && (
                                            <span className="bg-orange-500 text-white text-xs font-semibold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                                                {cartCount > 99 ? "99+" : cartCount}
                                            </span>
                                        )}
                                    </Link>
                                    <Link href="/favorites" onClick={closeMobileMenu}
                                          className="py-2.5 px-3 text-sm text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-colors flex items-center justify-between">
                                        <span className="flex items-center gap-2 font-medium">
                                            <Heart className="h-4 w-4"/> Favorites
                                        </span>
                                        {favoritesCount > 0 && (
                                            <span className="bg-red-500 text-white text-xs font-semibold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                                                {favoritesCount > 99 ? "99+" : favoritesCount}
                                            </span>
                                        )}
                                    </Link>
                                    <Link href="/profile" onClick={closeMobileMenu}
                                          className="py-2.5 px-3 text-sm text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-colors flex items-center gap-2 font-medium">
                                        <User className="h-4 w-4"/> Profile
                                    </Link>
                                    <button onClick={() => {
                                        handleLogout();
                                        closeMobileMenu()
                                    }}
                                            className="w-full py-2.5 px-3 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors flex items-center gap-2 text-left font-medium">
                                        <LogOut className="h-4 w-4"/> Logout
                                    </button>
                                </div>
                            ) : (
                                <Button asChild className="sm:hidden mt-2">
                                    <Link href="/login">Login</Link>
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    )
}