import React, { useEffect, useCallback, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import babyService from "@/Service/baby.service";

interface BabyFormData {
    name: string;
    dob: string;
    gender: 0 | 1;
    image?: File;
}

interface BabyModalProps {
    isOpen: boolean;
    mode: "create" | "edit";
    initialData?: BabyFormData;
    onCloseAction: () => void;
    onSubmitAction?: () => void;
    babyId?: number;
    isLoading?: boolean;
}

const BabyFormModal: React.FC<BabyModalProps> = ({
                                                     isOpen,
                                                     mode,
                                                     initialData,
                                                     onCloseAction,
                                                     onSubmitAction,
                                                     babyId,
                                                     isLoading = false,
                                                 }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<BabyFormData>({
        defaultValues: {
            name: "",
            dob: "",
            gender: 0,
        },
    });

    useEffect(() => {
        if (isOpen) {
            if (mode === "edit" && initialData) {
                reset(initialData);
                if (initialData.image) {
                    setPreviewUrl(initialData.image as any);
                }
            } else {
                reset({ name: "", dob: "", gender: 0 });
                setSelectedFile(null);
                setPreviewUrl("");
            }
        }
    }, [isOpen, mode, initialData, reset]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFormSubmit = useCallback(
        async (data: BabyFormData) => {
            try {
                const formData = new FormData();
                formData.append("name", data.name);
                formData.append("dob", data.dob);
                formData.append("gender", String(data.gender));

                if (selectedFile) {
                    formData.append("image", selectedFile);
                }

                if (mode === "create") {
                    await babyService.addBaby(formData);
                } else {
                    if (!babyId) {
                        throw new Error("Baby ID is required for update");
                    }
                    await babyService.updateBaby(babyId, formData);
                }
                onSubmitAction?.();
                onCloseAction();
            } catch (error) {
                console.error("Failed to submit baby data:", error);
            }
        },
        [mode, babyId, onSubmitAction, onCloseAction, selectedFile]
    );

    const handleClose = useCallback(() => {
        if (!isSubmitting) {
            onCloseAction();
        }
    }, [isSubmitting, onCloseAction]);

    const today = new Date().toISOString().split("T")[0];

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px] max-w-[95vw] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl font-semibold">
                        {mode === "create" ? "Add New Baby" : "Edit Baby"}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 sm:space-y-6 mt-2 sm:mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                            Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            placeholder="Enter baby's name"
                            disabled={isSubmitting || isLoading}
                            aria-invalid={errors.name ? "true" : "false"}
                            aria-describedby={errors.name ? "name-error" : undefined}
                            {...register("name", {
                                required: "Name is required",
                                minLength: { value: 2, message: "Name must be at least 2 characters" },
                                maxLength: { value: 50, message: "Name must not exceed 50 characters" },
                            })}
                        />
                        {errors.name && (
                            <p id="name-error" className="text-sm text-red-500" role="alert">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dob" className="text-sm font-medium">
                            Date of Birth <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="dob"
                            type="date"
                            max={today}
                            disabled={isSubmitting || isLoading}
                            aria-invalid={errors.dob ? "true" : "false"}
                            aria-describedby={errors.dob ? "dob-error" : undefined}
                            {...register("dob", {
                                required: "Date of birth is required",
                                validate: (value) => {
                                    const selectedDate = new Date(value);
                                    const currentDate = new Date();
                                    return selectedDate <= currentDate || "Date cannot be in the future";
                                },
                            })}
                        />
                        {errors.dob && (
                            <p id="dob-error" className="text-sm text-red-500" role="alert">
                                {errors.dob.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-3">
                        <Label className="text-sm font-medium">
                            Gender <span className="text-red-500">*</span>
                        </Label>
                        <Controller
                            name="gender"
                            control={control}
                            rules={{ required: "Gender is required" }}
                            render={({ field }) => (
                                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={field.value === 0}
                                            onChange={() => field.onChange(0)}
                                            disabled={isSubmitting || isLoading}
                                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                                        />
                                        <span className="text-sm font-medium">Male</span>
                                    </label>
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={field.value === 1}
                                            onChange={() => field.onChange(1)}
                                            disabled={isSubmitting || isLoading}
                                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                                        />
                                        <span className="text-sm font-medium">Female</span>
                                    </label>
                                </div>
                            )}
                        />
                        {errors.gender && (
                            <p id="gender-error" className="text-sm text-red-500" role="alert">
                                {errors.gender.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image" className="text-sm font-medium">
                            Image
                        </Label>
                        <Input
                            id="image"
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                            disabled={isSubmitting || isLoading}
                            onChange={handleFileChange}
                            className="cursor-pointer"
                        />
                        {previewUrl && (
                            <div className="mt-3 flex justify-center sm:justify-start">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-md border-2 border-gray-200"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-2 sm:pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isSubmitting || isLoading}
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit(handleFormSubmit)}
                            disabled={isSubmitting || isLoading}
                            className="w-full sm:w-auto"
                        >
                            {isSubmitting || isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {mode === "create" ? "Creating..." : "Updating..."}
                                </>
                            ) : (
                                <>{mode === "create" ? "Create Baby" : "Update Baby"}</>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default BabyFormModal;