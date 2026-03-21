import React, { useEffect, useCallback, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import babyService from "@/Service/baby.service";
import TextInputField from "../field/TextInputField";
import Image from "next/image";
import { toast } from "sonner";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";

interface BabyFormData {
    name: string;
    dob: string;
    gender: 0 | 1;
    weight: number;
    height: number;
    head_circumference: number;
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
            weight: undefined,
            height: undefined,
            head_circumference: undefined,
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
                reset({
                    name: "",
                    dob: "",
                    gender: 0,
                    weight: undefined,
                    height: undefined,
                    head_circumference: undefined,
                });
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
            reader.onloadend = () => setPreviewUrl(reader.result as string);
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
                formData.append("weight", String(data.weight));
                formData.append("height", String(data.height));
                formData.append("head_circumference", String(data.head_circumference));
                if (selectedFile) formData.append("image", selectedFile);

                if (mode === "create") {
                    await babyService.addBaby(formData);
                } else {
                    if (!babyId) throw new Error("Baby ID is required for update");
                    await babyService.updateBaby(babyId, formData);
                }
                toast.success("Baby data submitted successfully");
                onSubmitAction?.();
                onCloseAction();
            } catch (error: any) {
                console.error("Failed to submit baby data:", error);
                toast.error(error?.message || "Failed to submit baby data");
            }
        },
        [mode, babyId, onSubmitAction, onCloseAction, selectedFile]
    );

    const handleClose = useCallback(() => {
        if (!isSubmitting) onCloseAction();
    }, [isSubmitting, onCloseAction]);

    const isEditMode = mode === "edit";
    const isDisabled = isSubmitting || isLoading;

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px] max-w-[95vw] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl font-semibold">
                        {mode === "create" ? "Add New Baby" : "Edit Baby"}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 sm:space-y-6 mt-2 sm:mt-4">

                    {/* Name */}
                    <TextInputField
                        label="Name"
                        placeholder="Enter baby's name"
                        required={!isEditMode}
                        disabled={isDisabled}
                        error={errors.name?.message}
                        {...register("name", {
                            required: isEditMode ? false : "Name is required",
                            minLength: { value: 2, message: "Name must be at least 2 characters" },
                            maxLength: { value: 50, message: "Name must not exceed 50 characters" },
                        })}
                    />

                    {/* Date of Birth — Nepali BS Datepicker */}
                    <div className="space-y-1 w-full">
                        <Label className={`text-sm font-medium ${errors.dob ? "text-red-500" : ""}`}>
                            Date of Birth (BS) {!isEditMode && <span className="text-red-500">*</span>}
                        </Label>
                        <Controller
                            name="dob"
                            control={control}
                            rules={{
                                required: isEditMode ? false : "Date of birth is required",
                            }}
                            render={({ field }) => (
                                <NepaliDatePicker
                                    inputClassName={`w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/60 ${
                                        errors.dob
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-input"
                                    } ${isDisabled ? "opacity-50 cursor-not-allowed bg-muted" : "bg-background"}`}
                                    value={field.value}
                                    onChange={(value: string) => field.onChange(value)}
                                    options={{
                                        calenderLocale: "en",  
                                        valueLocale: "en",     
                                    }}
                                />
                            )}
                        />
                        {errors.dob && (
                            <p className="text-sm text-red-500 mt-1" role="alert">
                                {errors.dob.message}
                            </p>
                        )}
                    </div>

                    {/* Gender */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">
                            Gender {!isEditMode && <span className="text-red-500">*</span>}
                        </Label>
                        <Controller
                            name="gender"
                            control={control}
                            rules={{ required: isEditMode ? false : "Gender is required" }}
                            render={({ field }) => (
                                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={field.value === 0}
                                            onChange={() => field.onChange(0)}
                                            disabled={isDisabled}
                                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                                        />
                                        <span className="text-sm font-medium">Male</span>
                                    </label>
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={field.value === 1}
                                            onChange={() => field.onChange(1)}
                                            disabled={isDisabled}
                                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                                        />
                                        <span className="text-sm font-medium">Female</span>
                                    </label>
                                </div>
                            )}
                        />
                        {errors.gender && (
                            <p className="text-sm text-red-500" role="alert">
                                {errors.gender.message}
                            </p>
                        )}
                    </div>

                    {/* Weight, Height, Head Circumference */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <TextInputField
                            label="Weight (kg)"
                            type="number"
                            placeholder="e.g. 3.5"
                            required
                            disabled={isDisabled}
                            error={errors.weight?.message}
                            step="0.01"
                            min="0"
                            {...register("weight", {
                                required: "Weight is required",
                                valueAsNumber: true,
                                min: { value: 0, message: "Weight must be positive" },
                                validate: (v) => !isNaN(v) || "Must be a valid number",
                            })}
                        />

                        <TextInputField
                            label="Height (cm)"
                            type="number"
                            placeholder="e.g. 50"
                            required
                            disabled={isDisabled}
                            error={errors.height?.message}
                            step="0.1"
                            min="0"
                            {...register("height", {
                                required: "Height is required",
                                valueAsNumber: true,
                                min: { value: 0, message: "Height must be positive" },
                                validate: (v) => !isNaN(v) || "Must be a valid number",
                            })}
                        />

                        <TextInputField
                            label="Head Circ. (cm)"
                            type="number"
                            placeholder="e.g. 34"
                            required
                            disabled={isDisabled}
                            error={errors.head_circumference?.message}
                            step="0.1"
                            min="0"
                            {...register("head_circumference", {
                                required: "Head circumference is required",
                                valueAsNumber: true,
                                min: { value: 0, message: "Must be positive" },
                                validate: (v) => !isNaN(v) || "Must be a valid number",
                            })}
                        />
                    </div>

                    {/* Image */}
                    <div className="space-y-2">
                        <TextInputField
                            label="Image"
                            type="file"
                            disabled={isDisabled}
                            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                            onChange={handleFileChange}
                            className="cursor-pointer"
                        />
                        {previewUrl && (
                            <div className="mt-3 flex justify-center sm:justify-start">
                                <Image
                                    src={previewUrl}
                                    alt="Preview"
                                    width={96}
                                    height={96}
                                    className="w-24 h-24 sm:w-32 sm:h-32 object-contain rounded-md"
                                />
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-2 sm:pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isDisabled}
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit(handleFormSubmit)}
                            disabled={isDisabled}
                            className="w-full sm:w-auto"
                        >
                            {isDisabled ? (
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