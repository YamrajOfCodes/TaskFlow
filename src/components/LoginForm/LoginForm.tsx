import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Field from "../Reusable/Field";
import { useLogin } from "../../hooks/authHooks/authHooks"; // ✅ import your hook

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

function LoginForm({ onToast }: { onToast?: (msg: string) => void }) {
  const { mutate, isPending } = useLogin(); // ✅ use React Query

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  // ✅ REAL LOGIN FLOW
  const onSubmit = (data: LoginValues) => {
    mutate(data, {
      onSuccess: () => {
        onToast?.("Logged in successfully!"); // optional toast
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Sign in to your account to continue.
        </p>
      </div>

      {/* Email */}
      <Field
        label="Email"
        id="login-email"
        type="email"
        placeholder="jane@example.com"
        error={errors.email?.message}
        registration={register("email")}
      />

      {/* Password */}
      <Field
        label="Password"
        id="login-password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        registration={register("password")}
      />

      {/* Button */}
      <button
        type="submit"
        disabled={isPending}
        className="mt-1 w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-60"
      >
        {isPending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}

export default LoginForm;