'use client'

import {useQuery, useQueryClient} from "@tanstack/react-query";
import babyService from "@/Service/baby.service";
import React, {useState} from "react";
import {Baby as BabyIcon, Plus} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import BabyCard from "@/components/baby/BabyCard";
import BabyFormModal from "@/components/baby/BabyFormModal";

export interface Baby {
    id: number;
    name: string;
    dob: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    media: string | null;
}

export default function BabyPage() {
    const queryClient = useQueryClient();
    const [showAddModal, setShowAddModal] = useState(false);

    const {data: babies = [], isLoading} = useQuery({
        queryKey: ["babies"],
        queryFn: async () => {
            const res = await babyService.getAllBaby();
            return res?.data ?? [];
        },
    });

    if (isLoading) {
        return (
            <div
                className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
                <div className="text-center">
                    <div
                        className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading babies...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
                            <BabyIcon className="h-8 w-8 text-blue-600"/>
                            Baby Care Dashboard
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Manage your little ones and their vaccination schedules
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowAddModal(true)}
                        size="lg"
                        className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                    >
                        <Plus className="h-5 w-5 mr-2"/>
                        Add Baby
                    </Button>
                </div>

                {babies.length === 0 ? (
                    <Card className="border-2 border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <BabyIcon className="h-16 w-16 text-gray-400 mb-4"/>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                No babies added yet
                            </h3>
                            <p className="text-gray-500 mb-6 text-center max-w-md">
                                Start by adding your first baby to track their growth and vaccination schedule
                            </p>
                            <Button onClick={() => setShowAddModal(true)}>
                                <Plus className="h-4 w-4 mr-2"/>
                                Add Your First Baby
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {babies.map((baby: Baby) => (
                            <BabyCard key={baby.id} baby={{...baby, image: baby.media}}/>
                        ))}
                    </div>
                )}

                <BabyFormModal
                    isOpen={showAddModal}
                    mode="create"
                    onCloseAction={() => {
                        setShowAddModal(false);
                        queryClient.invalidateQueries({queryKey: ["babies"]});
                    }}
                />
            </div>
        </div>
    );
}
