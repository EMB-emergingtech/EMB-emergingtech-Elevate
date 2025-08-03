import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { hasPermission } from "./supabaseClient";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function enforcePermission(role, action) {
  if (!hasPermission(role, action)) {
    const error = new Error("Forbidden");
    error.status = 403;
    throw error;
  }
}
