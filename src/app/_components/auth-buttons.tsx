"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";

interface AuthButtonProps {
  className?: string;
}

export function SignInButton({ className }: AuthButtonProps) {
  return (
    <Link
      href="/auth/signin"
      className={
        className ??
        "inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      }
    >
      Sign In
    </Link>
  );
}

export function SignOutButton({ className }: AuthButtonProps) {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <button
      onClick={handleSignOut}
      className={
        className ||
        "inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
      }
    >
      Sign Out
    </button>
  );
}
