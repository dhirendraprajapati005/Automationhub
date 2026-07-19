import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

export const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>();

  const onSubmit = async (values: RegisterForm) => {
    setServerError(null);
    try {
      const { userId } = await registerUser(values.name, values.email, values.password);
      navigate("/verify-otp", { state: { userId } });
    } catch (err: any) {
      setServerError(err?.response?.data?.message || "Something went wrong. Try again.");
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-20">
      <h1 className="font-display text-2xl font-bold">Create your free account</h1>
      <p className="mt-1 text-sm text-ink-400">Join engineers learning PLC, HMI, and SCADA the practical way.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4" noValidate>
        {serverError && (
          <p className="rounded-[var(--radius-panel)] border border-red-800 bg-red-950/40 px-3 py-2 text-sm text-red-300">
            {serverError}
          </p>
        )}

        <div>
          <label htmlFor="name" className="text-sm font-medium text-ink-200">
            Full name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            className="mt-1 w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-900 px-3 py-2.5 text-sm focus:border-signal-500 focus:outline-none"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium text-ink-200">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="mt-1 w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-900 px-3 py-2.5 text-sm focus:border-signal-500 focus:outline-none"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="text-sm font-medium text-ink-200">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            className="mt-1 w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-900 px-3 py-2.5 text-sm focus:border-signal-500 focus:outline-none"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "At least 8 characters" },
            })}
          />
          {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-400">
        Already have an account?{" "}
        <Link to="/login" className="text-signal-500 hover:text-signal-400">
          Log in
        </Link>
      </p>
    </div>
  );
};
