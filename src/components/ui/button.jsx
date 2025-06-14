import * as React from "react"

export function Button({ className = "", variant = "default", size = "default", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md border border-input bg-primary px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
