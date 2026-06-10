import AppHeader from "@/components/AppHeader"

interface PageShellProps {
  employeeId: string
  children: React.ReactNode
  wide?: boolean
}

export default function PageShell({
  employeeId,
  children,
  wide = false,
}: PageShellProps) {
  return (
    <div className="min-h-svh bg-background">
      <AppHeader employeeId={employeeId} />
      <main
        className={`${wide ? "max-w-6xl" : "max-w-4xl"} mx-auto px-6 py-10 flex flex-col gap-8`}
      >
        {children}
      </main>
    </div>
  )
}
