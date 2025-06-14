export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "space-y-1", "space-y-2", "space-y-4",
    "p-2", "p-4", "pl-4", "pt-4",
    "gap-2", "text-sm", "text-left",
    "w-full", "w-1/4", "w-3/4",
    "rounded", "rounded-md", "rounded-lg",
    "border", "border-input",
    "overflow-y-auto", "max-h-screen", "h-screen",
    "bg-white", "bg-muted", "hover:bg-muted/50"
  ],
  theme: {
	  extend: {
		colors: {
			primary: "#000000",
			foreground: "#ffffff"
		}
	}
  },
  plugins: [],
}
