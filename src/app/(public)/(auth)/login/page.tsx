'use client'

import Link from "next/link"
import {Button} from "@/components/ui/button"
import TextInputField from "@/components/field/TextInputField"
import PasswordInputField from "@/components/field/PasswordInput"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import {useCallback} from "react"
import {authService} from "@/Service/auth.service"
import {toast} from "sonner"
import {Chrome} from "lucide-react"
import {useRouter} from "next/navigation";

const loginSchema = z.object({
    email: z.email({message: "Please enter a valid email address"}),
    password: z.string().min(8, {message: "Password must be at least 8 characters"}),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
    const router = useRouter()
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = useCallback(async (data: LoginFormData) => {
        await authService.login(data)
            .then((response) => {
                console.log('response', response?.data?.token)
                localStorage.setItem("_baby", response?.data?.token)
                sessionStorage.setItem("_baby", response?.data?.token)
                toast.success(response.message || "Login successful")
                router.refresh()
                router.push("/products")
            })
            .catch((error) => {
                toast.error(error?.message || "Login failed")
            })
    }, [router])

    const handleGoogleLogin = () => {
        window.location.href =
            "http://192.168.100.23:8008/api/v1/auth/google/redirect"
    }



    return (
        <div className="h-fit grid lg:grid-cols-2 items-stretch container mx-auto my-12">
            <div
                className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 xl:p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 right-20 w-64 h-64 bg-blue-400 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 left-20 w-80 h-80 bg-cyan-400 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 text-center max-w-md">
                    <div
                        className="w-16 h-16 rounded-2xl bg-blue-500/20 backdrop-blur-sm flex items-center justify-center mb-8 mx-auto border border-blue-400/30">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/40"></div>
                    </div>

                    <h1 className="text-4xl xl:text-5xl font-bold mb-6 text-balance">Welcome Back to BabyCare</h1>
                    <p className="text-lg text-slate-300 leading-relaxed">
                        Your trusted partner in parenting. Sign in to access your dashboard and manage your baby&#39;s
                        wellness.
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-center p-4 sm:p-8 md:p-12 bg-slate-50">
                <div className="w-full max-w-sm space-y-8">
                    <div className="text-center lg:hidden">
                        <div
                            className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mx-auto mb-4">
                            <div className="w-7 h-7 rounded bg-blue-600/40"></div>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900">Sign In</h2>
                        <p className="text-sm text-slate-600 mt-2">Enter your credentials to access your account</p>
                    </div>

                    <div className="hidden lg:block">
                        <h2 className="text-3xl font-bold text-slate-900">Sign In</h2>
                        <p className="text-sm text-slate-600 mt-2">Enter your credentials to access your account</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <TextInputField
                                placeholder="your@email.com"
                                label="Email Address"
                                error={errors.email?.message}
                                {...register("email")}
                            />
                        </div>

                        <div>
                            <PasswordInputField
                                label="Password"
                                placeholder="••••••••"
                                error={errors.password?.message}
                                {...register("password")}
                            />
                            <div className="flex justify-end mt-2">
                                <Link
                                    href="/forgot-password"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-11 text-base font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                        >
                            {isSubmitting ? "Signing In..." : "Sign In"}
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200"/>
                        </div>
                        <div className="relative flex justify-center">
              <span className="bg-slate-50 px-3 text-xs font-medium text-slate-600 uppercase tracking-wide">
                Or continue with
              </span>
                        </div>
                    </div>

                    <Button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full h-11 rounded-lg border border-slate-300 bg-white text-slate-900 font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-3"
                    >
                        <Chrome size={18} className="text-blue-600"/>
                        Continue with Google
                    </Button>

                    <p className="text-center text-sm text-slate-600">
                        Don&#39;t have an account?{" "}
                        <Link href="/register"
                              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
