"use client";

import { Button } from "@/components/ui/button";
import TextInputField from "@/components/field/TextInputField";
import PasswordInputField from "@/components/field/PasswordInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCallback } from "react";
import { authService } from "@/Service/auth.service";
import { toast } from "sonner";

const vendorRegisterSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
  store_name: z.string().min(2, { message: "Store name is required" }),
  store_description: z.string().min(10, { message: "Store description must be at least 10 characters" }),
  location: z.string().min(2, { message: "Location is required" }),
  country: z.string().min(2, { message: "Country is required" }),
  state: z.string().min(2, { message: "State is required" }),
  district: z.string().min(2, { message: "District is required" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type VendorRegisterFormData = z.infer<typeof vendorRegisterSchema>;

export default function VendorRegisterPage() {

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<VendorRegisterFormData>({
    resolver: zodResolver(vendorRegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      store_name: "",
      store_description: "",
      location: "",
      country: "",
      state: "",
      district: "",
    },
  });

  const onSubmit = useCallback(
    async (data: VendorRegisterFormData) => {
      try {
        const { ...vendorData } = data;
        
        const response = await authService.vendorRegister(vendorData);
        toast.success(response.message || "Registration successful!");
        reset();
      } catch (error: any) {
        toast.error(error?.message || "Registration failed");
      }
    },
    [reset]
  );

  return (
    <div className="min-h-screen grid lg:grid-cols-2 items-stretch container mx-auto">
      <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 xl:p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-cyan-400 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/20 backdrop-blur-sm flex items-center justify-center mb-8 mx-auto border border-blue-400/30">
            <div className="w-8 h-8 rounded-lg bg-blue-500/40"></div>
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold mb-6 text-balance">
            Become a BabyCare Vendor
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            Join our marketplace and reach thousands of parents looking for quality baby products and services.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-4 sm:p-8 md:p-12 bg-slate-50">
        <div className="w-full max-w-4xl space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">Vendor Registration</h2>
            <p className="text-sm text-slate-600 mt-2">
              Create your vendor account to start selling
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-700 uppercase">Personal Information</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <TextInputField
                  placeholder="John Doe"
                  label="Full Name"
                  error={errors.name?.message}
                  {...register("name")}
                />

                <TextInputField
                  placeholder="your@email.com"
                  label="Email Address"
                  error={errors.email?.message}
                  {...register("email")}
                />

                <TextInputField
                  placeholder="+1234567890"
                  label="Phone Number"
                  error={errors.phone?.message}
                  {...register("phone")}
                />

                <div></div>

                <PasswordInputField
                  label="Password"
                  placeholder="••••••••"
                  error={errors.password?.message}
                  {...register("password")}
                />

                <PasswordInputField
                  label="Confirm Password"
                  placeholder="••••••••"
                  error={errors.confirmPassword?.message}
                  {...register("confirmPassword")}
                />
              </div>
            </div>

            {/* Store Information */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700 uppercase">Store Information</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <TextInputField
                  placeholder="My Baby Store"
                  label="Store Name"
                  error={errors.store_name?.message}
                  {...register("store_name")}
                />

                <div></div>

                <div className="md:col-span-2">
                  <TextInputField
                    textarea
                    placeholder="Describe your store and what you offer..."
                    label="Store Description"
                    error={errors.store_description?.message}
                    {...register("store_description")}
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700 uppercase">Location</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <TextInputField
                  placeholder="123 Main Street"
                  label="Location"
                  error={errors.location?.message}
                  {...register("location")}
                />

                <TextInputField
                  placeholder="United States"
                  label="Country"
                  error={errors.country?.message}
                  {...register("country")}
                />

                <TextInputField
                  placeholder="California"
                  label="State"
                  error={errors.state?.message}
                  {...register("state")}
                />

                <TextInputField
                  placeholder="Los Angeles"
                  label="District"
                  error={errors.district?.message}
                  {...register("district")}
                />
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full h-11">
              {isSubmitting ? "Creating Account..." : "Register as Vendor"}
            </Button>
          </form>

          {/* <p className="text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-blue-600">
              Sign in
            </Link>
          </p> */}
        </div>
      </div>
    </div>
  );
}