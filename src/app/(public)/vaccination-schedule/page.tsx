"use client";

import {useQuery} from "@tanstack/react-query";
import {AlertCircle, Calendar, Loader2, Shield, Syringe} from "lucide-react";
import {QUERY_STALE_TIME} from "@/config/app-constant";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";
import babyService from "@/Service/babay.service";
import { VaccinePageSkeleton } from "@/components/skeleton/VaccinePageSkeleton";

interface Vaccine {
    id: number;
    visit_number: number;
    age_label: string;
    vaccines: string[];
    injection_site: string;
    diseases_covered: string[];
}

interface VaccineResponse {
    status: boolean;
    data: Vaccine[];
    message: string;
}

export default function VaccinePage() {
    const {data, isLoading, error, refetch} = useQuery<Vaccine[], Error>({
        queryKey: ["vaccines"],
        queryFn: async () => {
            const res: VaccineResponse = await babyService.getAllVaccines();
            if (!res.status) throw new Error(res.message || "Failed to fetch vaccines");
            return res.data;
        },
        staleTime: QUERY_STALE_TIME,
        retry: 2,
    });

    if (isLoading) {
        return <VaccinePageSkeleton />
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
                <div className="max-w-md w-full text-center space-y-6">
                    <div
                        className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-destructive/10 mb-4">
                        <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-destructive"/>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                        Failed to Load Vaccines
                    </h1>
                    <p className="text-sm sm:text-base text-muted-foreground">
                        {error.message || "Unable to retrieve vaccine information"}
                    </p>
                    <Button size="lg" onClick={() => refetch()} className="w-full sm:w-auto">
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
                <div className="max-w-md w-full text-center space-y-6">
                    <div
                        className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-muted mb-4">
                        <Syringe className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground"/>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                        No Vaccines Available
                    </h1>
                    <p className="text-sm sm:text-base text-muted-foreground">
                        No vaccine information found in the system
                    </p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 max-w-7xl">
                <div className="mb-8 sm:mb-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 sm:p-3 bg-primary/10 rounded-lg">
                            <Syringe className="w-6 h-6 sm:w-8 sm:h-8 text-primary"/>
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                                Baby Vaccination Schedule
                            </h1>
                            <p className="text-sm sm:text-base text-muted-foreground mt-1">
                                Complete immunization timeline for your child
                            </p>
                        </div>
                    </div>
                    <Separator className="mt-4"/>
                </div>

                <div
                    className="mt-8 sm:mt-10 p-4 sm:p-6 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800 my-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"/>
                        <div className="space-y-1">
                            <p className="text-sm sm:text-base font-semibold text-blue-900 dark:text-blue-100">
                                Important Information
                            </p>
                            <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
                                Always consult with your healthcare provider before administering any vaccine. Keep a
                                record of all vaccinations and maintain the recommended schedule for optimal protection.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {data.map((vaccine, index) => (
                        <Card
                            key={vaccine.id}
                            className="hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/50"
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <Badge variant="secondary" className="text-xs font-semibold">
                                        Visit {vaccine.visit_number}
                                    </Badge>
                                    <div className="p-1.5 bg-primary/10 rounded-full">
                                        <Calendar className="w-4 h-4 text-primary"/>
                                    </div>
                                </div>
                                <CardTitle className="text-lg sm:text-xl font-bold text-foreground">
                                    {vaccine.age_label}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                        <Syringe className="w-4 h-4 text-primary"/>
                                        <span>Vaccines</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {vaccine.vaccines.map((vac, idx) => (
                                            <Badge
                                                key={idx}
                                                variant="outline"
                                                className="text-xs font-medium"
                                            >
                                                {vac}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <Separator/>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                        <Syringe className="w-4 h-4 text-primary"/>
                                        <span>Injection Site</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground pl-6">
                                        {vaccine.injection_site}
                                    </p>
                                </div>

                                <Separator/>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                        <Shield className="w-4 h-4 text-primary"/>
                                        <span>Protection Against</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {vaccine.diseases_covered.map((disease, idx) => (
                                            <Badge
                                                key={idx}
                                                variant="secondary"
                                                className="text-xs bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                                            >
                                                {disease}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>


            </div>
        </main>
    );
}