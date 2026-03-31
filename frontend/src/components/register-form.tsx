/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from "@/services/auth/registerUser";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";
import { FieldDescription } from "./ui/field";

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerUser, null);
  const [showPassword, setShowPassword] = useState(false);

  console.log(state);
  const getFieldError = (filedName: string) => {
    if (state && state?.errors) {
      const error = state.errors.find((err: any) => err.field === filedName);
      console.log("Field error check:", filedName, error);
      return error?.message;
    } else {
      return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-100 to-slate-200 p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="rounded-2xl shadow-xl">
          <CardContent className="p-6 space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold">Create Account</h1>
              <p className="text-sm text-gray-500">
                Join us and start your journey
              </p>
            </div>

            <form action={formAction} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    type="text"
                    name="fullName"
                    placeholder="Enter your name"
                  />
                  {getFieldError("fullName") && (
                    <FieldDescription className="text-red-500">
                      {getFieldError("fullName")}
                    </FieldDescription>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                  />
                  {getFieldError("email") && (
                    <FieldDescription className="text-red-500">
                      {getFieldError("email")}
                    </FieldDescription>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    name="contactNumber"
                    placeholder="Enter phone number"
                  />
                  {getFieldError("contactNumber") && (
                    <FieldDescription className="text-red-500">
                      {getFieldError("contactNumber")}
                    </FieldDescription>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2 relative">
                  <Label>Password</Label>
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                  />
                  {getFieldError("password") && (
                    <FieldDescription className="text-red-500">
                      {getFieldError("password")}
                    </FieldDescription>
                  )}

                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-8 cursor-pointer text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                </div>
              </div>

              {/* Confirm Password - full width */}
              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                />
                {getFieldError("confirmPassword") && (
                  <FieldDescription className="text-red-500">
                    {getFieldError("confirmPassword")}
                  </FieldDescription>
                )}
              </div>

              <Button className="w-full rounded-xl">
                {isPending ? "Registering..." : "Create Account"}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500">
              Already have an account?
              <Link href="/login">
                <span className="text-black font-medium cursor-pointer">
                  {" "}
                  Login
                </span>
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
