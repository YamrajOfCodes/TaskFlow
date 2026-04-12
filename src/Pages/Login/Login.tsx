"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// ─── Schemas ──────────────────────────────────────────────────────────────────
const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type RegisterValues = z.infer<typeof registerSchema>;
type LoginValues = z.infer<typeof loginSchema>;
type View = "login" | "register";

// ─── Register Form ────────────────────────────────────────────────────────────
function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterValues) => {
    await new Promise((r) => setTimeout(r, 600));
    console.log("Register:", data);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <CardHeader>
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>Fill in your details to get started.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="reg-name">Full Name</Label>
          <Input
            id="reg-name"
            placeholder="Jane Doe"
            {...register("name")}
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="reg-email">Email</Label>
          <Input
            id="reg-email"
            type="email"
            placeholder="jane@example.com"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="reg-password">Password</Label>
          <Input
            id="reg-password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            aria-invalid={!!errors.password}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="reg-confirm">Confirm Password</Label>
          <Input
            id="reg-confirm"
            type="password"
            placeholder="••••••••"
            {...register("confirmPassword")}
            aria-invalid={!!errors.confirmPassword}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Create Account"}
        </Button>
      </CardFooter>
    </form>
  );
}

// ─── Login Form ───────────────────────────────────────────────────────────────
function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginValues) => {
    await new Promise((r) => setTimeout(r, 600));
    console.log("Login:", data);
    toast.success("Logged in successfully!");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <CardHeader>
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>Sign in to your account to continue.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            type="email"
            placeholder="jane@example.com"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="login-password">Password</Label>
          <Input
            id="login-password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            aria-invalid={!!errors.password}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign In"}
        </Button>
      </CardFooter>
    </form>
  );
}

// ─── Main Auth Page ───────────────────────────────────────────────────────────
export default function AuthPage() {
  const [view, setView] = useState<View>("login");

  const handleRegisterSuccess = () => {
    setView("login");
    toast.success("Account created! Please sign in.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-xl">
        {view === "register" ? (
          <RegisterForm onSuccess={handleRegisterSuccess} />
        ) : (
          <LoginForm />
        )}
        <p className="text-center text-sm text-muted-foreground pb-6">
          {view === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => setView("register")}
                className="text-primary font-medium underline-offset-4 hover:underline"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setView("login")}
                className="text-primary font-medium underline-offset-4 hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </Card>
    </div>
  );
}