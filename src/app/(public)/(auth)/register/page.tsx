"use client"

import type React from "react"
import {useCallback, useState} from "react"

import Link from "next/link"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import TextInputField from "@/components/field/TextInputField"
import PasswordInputField from "@/components/field/PasswordInput"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import {authService} from "@/Service/auth.service"
import {toast} from "sonner"
import {Chrome} from "lucide-react"

const registerSchema = z
    .object({
        firstName: z.string().min(2, {message: "First name must be at least 2 characters"}),
        lastName: z.string().min(2, {message: "Last name must be at least 2 characters"}),
        email: z.string().email({message: "Invalid email address"}),
        phone: z.string().regex(/^\d{10,15}$/, {message: "Phone number must be 10-15 digits"}),
        address: z.string().min(5, {message: "Address must be at least 5 characters"}),
        password: z.string().min(8, {message: "Password must be at least 8 characters"}),
        password_confirmation: z.string().min(8, {message: "Password confirmation is required"}),
        image: z
            .any()
            .refine((files) => files?.length === 1, {message: "Profile image is required"})
            .refine((files) => files?.[0]?.size <= 5 * 1024 * 1024, {
                message: "Image must be less than 5MB",
            })
            .refine((files) => files?.[0]?.type.startsWith("image/"), {
                message: "Only image files are allowed",
            }),
    })
    .refine((data) => data.password === data.password_confirmation, {
        path: ["password_confirmation"],
        message: "Passwords do not match",
    })

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
    const [previewImage, setPreviewImage] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            address: "",
            password: "",
            password_confirmation: "",
        },
    })

    const onSubmit = useCallback(async (data: RegisterFormData) => {
        try {
            const formData = new FormData()
            formData.append("name", `${data.firstName} ${data.lastName}`)
            formData.append("email", data.email)
            formData.append("phone", data.phone)
            formData.append("address", data.address)
            formData.append("password", data.password)
            formData.append("password_confirmation", data.password_confirmation)
            if (data.image?.[0]) {
                formData.append("image", data.image[0])
            }

            const response = await authService.register(formData)
            toast.success(response.message || "Registration successful")
        } catch (error: any) {
            toast.error(error.message || "Registration failed")
        }
    }, [])

    const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }, [])

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

                    <h1 className="text-4xl xl:text-5xl font-bold mb-6 text-balance">Join BabyCare Today</h1>
                    <p className="text-lg text-slate-300 leading-relaxed">
                        Start managing your baby&#39;s health with personalized tips, reminders, and expert guidance.
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-center p-4 sm:p-8 bg-slate-50 overflow-y-auto">
                <div className="w-full max-w-sm space-y-6 py-8">
                    <div className="text-center lg:hidden">
                        <div
                            className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mx-auto mb-4">
                            <div className="w-7 h-7 rounded bg-blue-600/40"></div>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
                        <p className="text-sm text-slate-600 mt-2">Sign up for free to get started</p>
                    </div>

                    <div className="hidden lg:block">
                        <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
                        <p className="text-sm text-slate-600 mt-2">Sign up for free to get started</p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-2 gap-3">
                            <TextInputField
                                placeholder="John"
                                label="First Name"
                                error={errors.firstName?.message}
                                {...register("firstName")}
                            />
                            <TextInputField
                                placeholder="Doe"
                                label="Last Name"
                                error={errors.lastName?.message}
                                {...register("lastName")}
                            />
                        </div>

                        <TextInputField
                            placeholder="your@email.com"
                            label="Email Address"
                            error={errors.email?.message}
                            {...register("email")}
                        />

                        <TextInputField
                            placeholder="1234567890"
                            label="Phone Number"
                            error={errors.phone?.message}
                            {...register("phone")}
                        />

                        <TextInputField
                            placeholder="123 Main St, City, State"
                            label="Address"
                            error={errors.address?.message}
                            {...register("address")}
                        />

                        <PasswordInputField
                            placeholder="••••••••"
                            label="Password"
                            error={errors.password?.message}
                            {...register("password")}
                        />

                        <PasswordInputField
                            placeholder="••••••••"
                            label="Confirm Password"
                            error={errors.password_confirmation?.message}
                            {...register("password_confirmation")}
                        />

                        <div className="space-y-2">
                            <Label htmlFor="image" className="text-sm font-medium text-slate-700">
                                Profile Image
                            </Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                className="cursor-pointer"
                                {...register("image")}
                                onChange={(e) => {
                                    register("image").onChange(e)
                                    handleImageChange(e)
                                }}
                            />
                            {errors.image?.message &&
                                <p className="text-sm text-red-600">{errors.image.message as string}</p>}
                            {previewImage && (
                                <div className="mt-3">
                                    <img
                                        src={previewImage || "/placeholder.svg"}
                                        alt="Profile preview"
                                        className="w-20 h-20 rounded-lg object-cover border-2 border-blue-200"
                                    />
                                </div>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-11 text-base font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors mt-6"
                        >
                            {isSubmitting ? "Creating Account..." : "Create Account"}
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200"/>
                        </div>
                        <div className="relative flex justify-center">
              <span className="bg-slate-50 px-3 text-xs font-medium text-slate-600 uppercase tracking-wide">
                Or sign up with
              </span>
                        </div>
                    </div>

                    <Button
                        type="button"
                        className="w-full h-11 rounded-lg border border-slate-300 bg-white text-slate-900 font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-3"
                    >
                        <Chrome size={18} className="text-blue-600"/>
                        Continue with Google
                    </Button>

                    <p className="text-center text-sm text-slate-600">
                        Already have an account?{" "}
                        <Link href="/login"
                              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                            Sign in
                        </Link>
                    </p>

                    <p className="text-center text-xs text-slate-500 leading-relaxed px-2">
                        By creating an account, you agree to our{" "}
                        <Link href="/terms" className="underline hover:text-slate-700 transition-colors">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="underline hover:text-slate-700 transition-colors">
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
