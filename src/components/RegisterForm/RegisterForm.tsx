import { useForm } from "react-hook-form";
import Field from "../Reusable/Field";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRegister } from "@/hooks/authHooks/authHooks";

const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterValues = z.infer<typeof registerSchema>;

function RegisterForm({ onSuccess }: { onSuccess?: () => void }) {
  const { mutate, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterValues) => {
    mutate(
      {
        name: data.name,
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          reset();
          onSuccess?.(); 
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4"
    >
    
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Create an account
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Fill in your details to get started.
        </p>
      </div>

      <Field
        label="Full Name"
        id="reg-name"
        placeholder="Jane Doe"
        error={errors.name?.message}
        registration={register("name")}
      />

      <Field
        label="Email"
        id="reg-email"
        type="email"
        placeholder="jane@example.com"
        error={errors.email?.message}
        registration={register("email")}
      />

      <Field
        label="Password"
        id="reg-password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        registration={register("password")}
      />

      <Field
        label="Confirm Password"
        id="reg-confirm"
        type="password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        registration={register("confirmPassword")}
      />

      <button
        type="submit"
        disabled={isPending}
        className="mt-1 w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-60"
      >
        {isPending ? "Creating account…" : "Create Account"}
      </button>
    </form>
  );
}

export default RegisterForm;