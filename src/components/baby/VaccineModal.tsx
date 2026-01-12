import React, { useMemo } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertCircle, Calendar, Loader2, Shield, Syringe } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import babyService from "@/Service/baby.service";
import { format } from "date-fns";
import {formatDate} from "@/lib/utils";

interface Vaccine {
    id: number;
    age: string;
    vaccines: string;
    diseases_covered: string[];
    actual_date: string;
    reminder: string;
    status?: "COMPLETED" | "INCOMPLETE";
}

interface VaccineModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    babyName?: string;
    babyId: number;
}

const VaccineFormModal: React.FC<VaccineModalProps> = ({
                                                           open,
                                                           onOpenChange,
                                                           babyName,
                                                           babyId,
                                                       }) => {
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["baby-vaccines", babyId],
        queryFn: () => babyService.getVaccines(babyId),
        enabled: open,
    });
    console.log('getVaccines',data)

    const vaccines: Vaccine[] = useMemo(() => data?.data ?? [], [data]);

    const updateVaccineStatus = useMutation({
        mutationFn: async (id: number) => {
            console.log('Vaccine Id',id)
            await babyService.updateBabyVaccineDate(babyId, id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["baby-vaccines", babyId] });
        },
    });



    const getStatusColor = (status?: string): string =>
        status === "COMPLETED"
            ? "bg-green-100 text-green-800 border-green-200"
            : "bg-gray-100 text-gray-800 border-gray-200";

    const handleStatusToggle = (vaccineId: number) => {
        updateVaccineStatus.mutate(vaccineId);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                        <Syringe className="h-6 w-6 text-blue-600" />
                        Vaccination Schedule
                    </DialogTitle>
                    <DialogDescription>
                        {babyName
                            ? `${babyName}'s vaccination records and status`
                            : "Vaccination records and status"}
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-6 space-y-3">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                        </div>
                    ) : vaccines.length === 0 ? (
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                No vaccination records found for this baby.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        vaccines.map((vaccine) => (
                            <VaccineItem
                                key={vaccine.id}
                                vaccine={vaccine}
                                onStatusToggle={handleStatusToggle}
                                isUpdating={updateVaccineStatus.isPending}
                                formatDateDisplay={formatDate}
                                getStatusColor={getStatusColor}
                            />
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

interface VaccineItemProps {
    vaccine: Vaccine;
    onStatusToggle: (id: number) => void;
    isUpdating: boolean;
    formatDateDisplay: (date: string) => string;
    getStatusColor: (status?: string) => string;
}

const VaccineItem: React.FC<VaccineItemProps> = ({
                                                     vaccine,
                                                     onStatusToggle,
                                                     isUpdating,
                                                     formatDateDisplay,
                                                     getStatusColor,
                                                 }) => {
    const isCompleted = vaccine.status === "COMPLETED";

    return (
        <div className="border-2 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4">
                <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-2 text-gray-900">
                            {vaccine.vaccines}
                        </h4>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-3.5 w-3.5" />
                                <span className="font-medium">Age: {vaccine.age}</span>
                            </div>
                            {vaccine.actual_date && (
                                <div className="flex items-center gap-2 text-green-600">
                                    <Calendar className="h-3.5 w-3.5" />
                                    <span>
                    Given: {formatDateDisplay(vaccine.actual_date)}
                  </span>
                                </div>
                            )}
                            {vaccine.diseases_covered.length > 0 && (
                                <div className="flex items-start gap-2 text-gray-700 mt-2">
                                    <Shield className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                                    <div className="flex flex-wrap gap-1">
                                        {vaccine.diseases_covered.map((disease, index) => (
                                            <span
                                                key={index}
                                                className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded"
                                            >
                        {disease}
                      </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {vaccine.reminder && (
                                <div className="text-xs text-amber-600 mt-2 font-medium">
                                    Reminder: {vaccine.reminder}
                                </div>
                            )}
                        </div>
                    </div>
                    <Badge className={getStatusColor(vaccine.status)}>
                        {vaccine.status ?? "INCOMPLETE"}
                    </Badge>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <Label
                        htmlFor={`vaccine-${vaccine.id}`}
                        className="text-sm font-medium text-gray-700 cursor-pointer"
                    >
                        Mark as {isCompleted ? "Incomplete" : "Complete"}
                    </Label>
                    <Switch
                        id={`vaccine-${vaccine.id}`}
                        checked={isCompleted}
                        onCheckedChange={() => onStatusToggle(vaccine.id)}
                        disabled={isUpdating}
                    />
                </div>
            </div>
        </div>
    );
};

export default VaccineFormModal;
