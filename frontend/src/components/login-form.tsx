/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser } from "@/services/auth/loginUser";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";
import { FieldDescription } from "./ui/field";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginUser, null);
  const [showPassword, setShowPassword] = useState(false);

  console.log(state);

  const getFieldError = (fieldName: string) => {
    if (state && state?.errors) {
      const error = state.errors.find((err: any) => err.field === fieldName);
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
              <h1 className="text-2xl font-bold">Welcome Back</h1>
              <p className="text-sm text-gray-500">Login to your account</p>
            </div>

            <form action={formAction} className="space-y-4">
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
                  className="absolute right-3 top-7 cursor-pointer text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" /> Remember me
                </label>
                <span className="text-blue-600 cursor-pointer">
                  Forgot password?
                </span>
              </div>

              <Button className="w-full rounded-xl">
                {isPending ? "Logging in..." : "Login"}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500">
              Don’t have an account?
              <Link href="/register">Register</Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
