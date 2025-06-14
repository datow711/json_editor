import * as React from "react"

export function Card({ className = "", ...props }) {
  return (
    <div className={`rounded-lg border bg-white text-card-foreground shadow-sm ${className}`} {...props} />
  );
}

export function CardContent({ className = "", ...props }) {
  return (
    <div className={`p-6 pt-0 ${className}`} {...props} />
  );
}
