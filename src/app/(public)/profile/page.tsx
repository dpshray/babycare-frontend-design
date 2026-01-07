'use client'

import {useAuth} from "@/hooks/useAuth"
import {Mail, MapPin, Phone, Shield, User} from "lucide-react"


export default function ProfilePage() {
    const {user} = useAuth()

    if (!user) {
        return (
            <div
                className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
                <div className="text-center">
                    <div
                        className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-400">Loading profile...</p>
                </div>
            </div>
        )
    }

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="relative h-32 sm:h-48 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600">
                        <div className="absolute inset-0 bg-black opacity-10"></div>
                    </div>

                    <div className="relative px-4 sm:px-8 pb-8">
                        <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-20 mb-6">
                            <div className="relative">
                                <div
                                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-500">
                                    {user.media ? (
                                        <img
                                            src={user.media}
                                            alt={user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div
                                            className="w-full h-full flex items-center justify-center text-white text-4xl sm:text-5xl font-bold">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div
                                    className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-slate-800"></div>
                            </div>

                            <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left flex-1">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
                                    {user.name}
                                </h1>
                                <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                                    <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400"/>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        ID: {user.uuid}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                                    Contact Information
                                </h2>

                                <div
                                    className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow duration-300">
                                    <div className="flex items-start gap-4">
                                        <div
                                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                            <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400"/>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                                Email Address
                                            </p>
                                            <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white break-all">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow duration-300">
                                    <div className="flex items-start gap-4">
                                        <div
                                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                                            <Phone
                                                className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400"/>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                                Phone Number
                                            </p>
                                            <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                                                {user.phone}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                                    Additional Details
                                </h2>

                                <div
                                    className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow duration-300">
                                    <div className="flex items-start gap-4">
                                        <div
                                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                                            <MapPin
                                                className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400"/>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                                Address
                                            </p>
                                            <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                                                {user.address}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow duration-300">
                                    <div className="flex items-start gap-4">
                                        <div
                                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                                            <User className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400"/>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                                User ID
                                            </p>
                                            <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                                                #{user.id}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*<div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">*/}
                        {/*    <button*/}
                        {/*        disabled*/}
                        {/*        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-300 shadow-lg hover:shadow-xl">*/}
                        {/*        Edit Profile*/}
                        {/*    </button>*/}
                        {/*    <button*/}
                        {/*        className="flex-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-300">*/}
                        {/*        Settings*/}
                        {/*    </button>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>
        </div>
    )
}