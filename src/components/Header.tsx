import { useMemo } from "react";
import { useLogout } from "@/hooks/authHooks/authHooks";

function Header() {
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const user = useMemo(() => {
    if (typeof window === "undefined") return null;
    try {
      return JSON.parse(localStorage.getItem("user") ?? "null");
    } catch {
      return null;
    }
  }, []);

  const displayName: string =
    user?.name ?? user?.email ?? "Guest";

  const initials = displayName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="flex mb-5 items-center justify-between gap-4 border-b border-neutral-200 bg-white px-6 py-3">

      {/* Brand */}
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-700">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="5" height="5" rx="1.2" fill="white" />
            <rect x="8" y="1" width="5" height="5" rx="1.2" fill="white" fillOpacity=".6" />
            <rect x="1" y="8" width="5" height="5" rx="1.2" fill="white" fillOpacity=".6" />
            <rect x="8" y="8" width="5" height="5" rx="1.2" fill="white" fillOpacity=".3" />
          </svg>
        </div>
        <span className="text-sm font-medium text-neutral-900 tracking-tight">Taskflow</span>
      </div>

      <div className="flex items-center gap-3">

        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 border border-blue-100 text-xs font-medium text-blue-700">
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-neutral-900 leading-none">{displayName}</p>
            {user?.email && user?.name && (
              <p className="mt-0.5 text-[11px] text-neutral-400 leading-none">{user.email}</p>
            )}
          </div>
        </div>

        <div className="h-5 w-px bg-neutral-200" />

        <button
          type="button"
          onClick={() => logout()}
          disabled={isLoggingOut}
          className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white
                     px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors
                     hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900
                     disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
        >
          {isLoggingOut ? (
            <div className="h-3 w-3 animate-spin rounded-full border border-neutral-400 border-t-transparent" />
          ) : (
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M5 2H2.5A1.5 1.5 0 0 0 1 3.5v7A1.5 1.5 0 0 0 2.5 12H5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M9.5 9.5 13 7l-3.5-2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13 7H5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          )}
          {isLoggingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </header>
  );
}

export default Header;