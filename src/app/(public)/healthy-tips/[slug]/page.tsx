'use client'

import {useParams, useRouter} from "next/navigation"
import {useQuery} from "@tanstack/react-query"
import {ArrowLeft, Calendar, Loader2, User} from "lucide-react"
import {useMemo} from "react"
import DOMPurify from "dompurify"
import Image from "next/image"
import {Button} from "@/components/ui/button"
import {QUERY_STALE_TIME} from "@/config/app-constant"
import babyService from "@/Service/babay.service"

export interface BlogPost {
    title: string
    description: string
    author: string
    image: string
    created_at?: string
}

export default function HealthyPage() {
    const router = useRouter()
    const {slug} = useParams()

    const {data, isLoading, error} = useQuery({
        queryKey: ['healthy-tips', slug],
        queryFn: async () => {
            const res = await babyService.getHealthyTipsDetails(slug as string)
            return res?.data as BlogPost
        },
        staleTime: QUERY_STALE_TIME,
        retry: 2,
        enabled: !!slug
    })

    const sanitizedDescription = useMemo(() => {
        if (!data?.description) return ""
        return DOMPurify.sanitize(data.description, {
            ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'blockquote'],
            ALLOWED_ATTR: ['href', 'target', 'rel']
        })
    }, [data?.description])

    if (isLoading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center space-y-4">
                    <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-primary mx-auto"
                             aria-hidden="true"/>
                    <p className="text-base sm:text-lg text-muted-foreground">Loading article...</p>
                </div>
            </main>
        )
    }

    if (error || !data) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-background px-4">
                <div className="max-w-md w-full text-center space-y-6">
                    <div
                        className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-destructive/10 mb-4">
                        <ArrowLeft className="w-8 h-8 sm:w-10 sm:h-10 text-destructive" aria-hidden="true"/>
                    </div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                        Article Not Found
                    </h1>
                    <p className="text-sm sm:text-base text-muted-foreground">
                        The article you&#39;re looking for doesn&#39;t exist or has been removed.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button onClick={() => router.back()} variant="default" size="lg">
                            Go Back
                        </Button>
                        <Button onClick={() => router.push("/healthy-tips")} variant="outline" size="lg">
                            View All Articles
                        </Button>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-background">
            <article className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:py-12">
                <Button
                    onClick={() => router.back()}
                    variant="ghost"
                    className="mb-6 gap-2"
                    size="sm"
                >
                    <ArrowLeft className="w-4 h-4" aria-hidden="true"/>
                    Back
                </Button>

                {data.image && (
                    <div
                        className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-lg overflow-hidden mb-6 sm:mb-8">
                        <Image
                            src={data.image}
                            alt={data.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                <header className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
                        {data.title}
                    </h1>

                    <div
                        className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm sm:text-base text-muted-foreground">
                        {data.author && (
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true"/>
                                <span>{data.author}</span>
                            </div>
                        )}
                        {data.created_at && (
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true"/>
                                <time dateTime={data.created_at}>
                                    {new Date(data.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </time>
                            </div>
                        )}
                    </div>
                </header>

                <div
                    className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none
                    prose-headings:font-bold prose-headings:text-foreground
                    prose-p:text-muted-foreground prose-p:leading-relaxed
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-foreground prose-strong:font-semibold
                    prose-ul:list-disc prose-ol:list-decimal
                    prose-li:text-muted-foreground prose-li:marker:text-primary
                    prose-blockquote:border-l-primary prose-blockquote:bg-muted prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r"
                    dangerouslySetInnerHTML={{__html: sanitizedDescription}}
                />
            </article>
        </main>
    )
}