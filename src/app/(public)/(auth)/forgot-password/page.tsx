'use client'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import Link from 'next/link'
import Image from 'next/image'
import {useCallback, useState} from 'react'
import {authService} from '@/Service/auth.service'
import {useRouter} from "next/navigation";
import {toast} from "sonner";

export default function ForgotPasswordPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleEmailSubmit = useCallback(async () => {
        setError('')
        setLoading(true)
        if (!email) {
            setError('Email is required')
            setLoading(false)
            return
        }
        try {
            await authService.forgotPassword({email}).then((res) => {
                toast.success(res?.message || 'OTP sent successfully')
                return res
            })
            setStep(2)
        } catch (error: any) {
            toast.error(error?.message || 'Failed to send OTP. Please try again.')
            setError(error?.message || 'Failed to send OTP. Please try again.')
        } finally {
            setLoading(false)
        }
    }, [email])

    const handleOtpSubmit = useCallback(async () => {
        setError('')
        setLoading(true)
        if (!otp || otp.length !== 5) {
            setError('OTP must be 5 characters')
            setLoading(false)
            return
        }
        try {
            await authService.verifyOtp({token: otp}).then((res) => {
                toast.success(res?.message || 'OTP verified successfully')
                return res
            })
            setStep(3)
        } catch (error: any) {
            setError(error?.message || 'Invalid OTP. Please try again.')
        } finally {
            setLoading(false)
        }
    }, [otp])

    const handlePasswordSubmit = useCallback(async () => {
        setError('')
        setLoading(true)
        if (!password || password.length < 8) {
            setError('Password must be at least 8 characters')
            setLoading(false)
            return
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            setLoading(false)
            return
        }
        try {
            await authService.resetPassword({
                token: otp,
                email,
                password,
                password_confirmation: confirmPassword,
            }).then((res) => {
                toast.success(res?.message || 'Password reset successfully')
                return res
            })
            router.push('/login')
        } catch (error: any) {
            toast.error(error?.message || 'Failed to reset password. Please try again.')
            setError(error?.message || 'Failed to reset password. Please try again.')
        } finally {
            setLoading(false)
        }
    }, [password, confirmPassword, otp, email, router])

    const handleOtpChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setOtp(e.target.value.trim().slice(0, 6))
    }, [])

    const handleBackToEmail = useCallback(() => {
        setStep(1)
        setError('')
    }, [])

    return (
        <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
            <div
                className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5">
                <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
                    <div>
                        <Link href="/" aria-label="go home">
                            <Image src="/logo.png" alt="Logo" width={100} height={100} priority/>
                        </Link>
                        <h1 className="mb-1 mt-4 text-xl font-semibold">
                            {step === 1 && 'Recover Password'}
                            {step === 2 && 'Verify OTP'}
                            {step === 3 && 'Reset Password'}
                        </h1>
                        <p className="text-sm">
                            {step === 1 && 'Enter your email to receive an OTP'}
                            {step === 2 && 'Enter the 6-character code sent to your email'}
                            {step === 3 && 'Create your new password'}
                        </p>
                    </div>

                    {step === 1 && (
                        <div className="mt-6 space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    disabled={loading}
                                />
                            </div>
                            {error && <p className="text-sm text-red-500">{error}</p>}
                            <Button onClick={handleEmailSubmit} className="w-full" disabled={loading}>
                                {loading ? 'Sending...' : 'Send OTP'}
                            </Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="mt-6 space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="otp">OTP Code</Label>
                                <Input
                                    type="text"
                                    id="otp"
                                    value={otp}
                                    onChange={handleOtpChange}
                                    placeholder="e.g. ysed3e"
                                    maxLength={6}
                                    autoCapitalize="none"
                                    autoCorrect="off"
                                    disabled={loading}
                                />
                            </div>
                            {error && <p className="text-sm text-red-500">{error}</p>}
                            <Button onClick={handleOtpSubmit} className="w-full" disabled={loading}>
                                {loading ? 'Verifying...' : 'Verify OTP'}
                            </Button>
                            <Button variant="outline" className="w-full" onClick={handleBackToEmail} disabled={loading}>
                                Back to Email
                            </Button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="mt-6 space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <Input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    disabled={loading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    disabled={loading}
                                />
                            </div>
                            {error && <p className="text-sm text-red-500">{error}</p>}
                            <Button onClick={handlePasswordSubmit} className="w-full" disabled={loading}>
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </Button>
                        </div>
                    )}

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        {step === 1 && "We'll send you a code to reset your password."}
                        {step === 2 && 'Check your email for the verification code.'}
                        {step === 3 && 'Choose a strong password for your account.'}
                    </div>
                </div>

                <div className="p-3 text-center text-sm">
                    Remembered your password?
                    <Button asChild variant="link" className="px-2">
                        <Link href="/preview/login/two">Log in</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
