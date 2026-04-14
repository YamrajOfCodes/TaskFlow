import { useState } from "react";
import RegisterForm from "@/components/RegisterForm/RegisterForm";
import LoginForm from "@/components/LoginForm/LoginForm";



// ─── Toast ───────────────────────────────────────────────────────────────────

function Toast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-green-500 px-5 py-2 text-sm font-medium text-white shadow-lg">
      {message}
    </div>
  );
}


// ─── Main Auth Page ──────────────────────────────────────────────────────────

type View = "login" | "register";

export default function AuthPage() {
  const [view, setView] = useState<View>("login");
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleRegisterSuccess = () => {
    setView("login");
    showToast("Account created! Please sign in.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        {view === "register" ? (
          <RegisterForm onSuccess={handleRegisterSuccess} />
        ) : (
          <LoginForm onToast={showToast} />
        )}

        <div className="mt-6 border-t pt-4 text-center text-sm text-gray-500">
          {view === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setView("register")}
                className="font-medium text-indigo-600 hover:underline cursor-pointer"
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
                className="font-medium text-indigo-600 hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>

      <Toast message={toast} />
    </div>
  );
}