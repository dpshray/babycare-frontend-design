import React, {useCallback, useState} from "react";
import {Calendar, Clock, Edit2, Syringe, Trash2, User} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import ActionModal from "@/components/ActionModal";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import babyService from "@/Service/baby.service";
import BabyFormModal from "@/components/baby/BabyFormModal";
import VaccineFormModal from "@/components/baby/VaccineModal";

export interface Baby {
    id: number;
    name: string;
    dob: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    image: string | null;
}

interface BabyCardProps {
    baby: Baby;
    onEditAction?: () => void;
    onDeleteAction?: () => void;
}

const BabyCard: React.FC<BabyCardProps> = ({baby, onEditAction, onDeleteAction}) => {
    const queryClient = useQueryClient();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isVaccineModalOpen, setIsVaccineModalOpen] = useState(false);

    const {data: vaccines = []} = useQuery({
        queryKey: ["baby-vaccines", baby.id],
        queryFn: () => babyService.getVaccines(baby.id),
        enabled: isVaccineModalOpen,
    });

    const deleteBabyMutation = useMutation({
        mutationFn: (id: number) => babyService.deleteBaby(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["babies"]});
            setIsDeleteModalOpen(false);
            if (onDeleteAction) onDeleteAction();
        },
    });

    const calculateAge = useCallback((dob: string) => {
        const diff = Date.now() - new Date(dob).getTime();
        const age = new Date(diff);
        const years = age.getUTCFullYear() - 1970;
        const months = age.getUTCMonth();
        const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));

        if (years > 0) {
            return `${years}y ${months}m`;
        } else if (months > 0) {
            return `${months}m ${days}d`;
        } else {
            return `${days}d`;
        }
    }, []);

    const handleDelete = useCallback(() => {
        setIsDeleteModalOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        await deleteBabyMutation.mutateAsync(baby.id);
    }, [baby.id, deleteBabyMutation]);

    const handleEditForm = useCallback(() => {
        setIsEditModalOpen(true);
    }, []);

    const handleEditSuccess = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ["babies"] });
        setIsEditModalOpen(false);
        // if (onEditAction) onEditAction();
    }, [queryClient]);

    const handleVaccines = useCallback(() => {
        setIsVaccineModalOpen(true);
    }, []);

    const formatDateDisplay = useCallback((date: string) => {
        try {
            const d = new Date(date);
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
        } catch {
            return date;
        }
    }, []);

    const getGenderColor = (gender: string) => {
        switch (gender) {
            case "MALE":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "FEMALE":
                return "bg-pink-100 text-pink-800 border-pink-200";
            case "OTHER":
                return "bg-purple-100 text-purple-800 border-purple-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getGradient = (gender: string) => {
        switch (gender) {
            case "MALE":
                return "from-blue-500 to-cyan-500";
            case "FEMALE":
                return "from-pink-500 to-rose-500";
            case "OTHER":
                return "from-purple-500 to-indigo-500";
            default:
                return "from-blue-500 to-purple-500";
        }
    };

    const convertGenderToNumber = (gender: "MALE" | "FEMALE" | "OTHER"): 0 | 1 => {
        return gender === "MALE" ? 0 : 1;
    };

    return (
        <>
            <div
                className="overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-gray-300 bg-white group">
                <div
                    className={`bg-gradient-to-br ${getGradient(
                        baby.gender
                    )} relative h-40 sm:h-48 md:h-56 flex items-center justify-center`}
                >
                    {baby.image ? (
                        <img
                            src={baby.image}
                            alt={baby.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <div
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30">
                            <User className="h-10 w-10 sm:h-12 sm:w-12 text-white"/>
                        </div>
                    )}
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                        <Badge className={`${getGenderColor(baby.gender)} font-semibold text-xs sm:text-sm`}>
                            {baby.gender}
                        </Badge>
                    </div>
                </div>

                <div className="p-4 sm:p-5 md:p-6">
                    <div className="mb-3 sm:mb-4">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 truncate">
                            {baby.name}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0"/>
                            <span className="text-xs sm:text-sm font-medium">
                                {calculateAge(baby.dob)} old
                            </span>
                        </div>
                    </div>

                    <div className="mb-4 sm:mb-6 pt-3 sm:pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0"/>
                            <span className="truncate">Born: {formatDateDisplay(baby.dob)}</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={handleEditForm}
                            variant="outline"
                            size="sm"
                            className="flex-1 group-hover:bg-blue-50 group-hover:border-blue-300 hover:text-blue-700 text-xs sm:text-sm"
                        >
                            <Edit2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2"/>
                            <span className="hidden xs:inline">Edit</span>
                        </Button>
                        <Button
                            onClick={handleDelete}
                            variant="outline"
                            size="sm"
                            className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 text-xs sm:text-sm"
                        >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2"/>
                            <span className="hidden xs:inline">Delete</span>
                        </Button>
                        <Button
                            onClick={handleVaccines}
                            variant="outline"
                            size="sm"
                            className="flex-1 group-hover:bg-green-50 group-hover:border-green-300 hover:text-green-700 text-xs sm:text-sm"
                        >
                            <Syringe className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2"/>
                            <span className="hidden xs:inline">Vaccines</span>
                        </Button>
                    </div>
                </div>
            </div>

            <BabyFormModal
                isOpen={isEditModalOpen}
                mode="edit"
                initialData={{
                    name: baby.name,
                    dob: baby.dob,
                    gender: convertGenderToNumber(baby.gender),
                    image: baby.image as any,
                }}
                babyId={baby.id}
                onCloseAction={() => setIsEditModalOpen(false)}
                onSubmitAction={handleEditSuccess}
            />

            <ActionModal
                open={isDeleteModalOpen}
                setOpen={setIsDeleteModalOpen}
                title="Delete Baby Record"
                description="Are you sure you want to delete this baby record? This action cannot be undone and will remove all associated data."
                confirmLabel="Delete"
                confirmVariant="destructive"
                loading={deleteBabyMutation.isPending}
                onConfirm={handleConfirmDelete}
            />

            <VaccineFormModal
                open={isVaccineModalOpen}
                onOpenChange={setIsVaccineModalOpen}
                babyName={baby.name}
                babyId={baby.id}
            />
        </>
    );
};

export default BabyCard;