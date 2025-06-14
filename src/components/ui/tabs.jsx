import * as React from "react"

export function Tabs({ children }) {
  return <div>{children}</div>
}

export function TabsList({ children }) {
  return <div className="flex space-x-2 border-b">{children}</div>
}

export function TabsTrigger({ children, value, onClick }) {
  return (
    <button
      className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-black"
      onClick={() => onClick(value)}
    >
      {children}
    </button>
  )
}
