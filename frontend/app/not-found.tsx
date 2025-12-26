import Link from 'next/link';
import Badge from "@/components/Badge";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-nier-cream flex flex-col items-center justify-center relative overflow-hidden text-nier-dark font-mono px-4">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 pointer-events-none" />

      <div className="relative z-10 text-center">
        <Badge variant="error" className="mb-6 mx-auto animate-pulse">
          SYSTEM FAILURE
        </Badge>

        <h1 className="text-9xl font-bold mb-2 glitch cursor-default select-none" data-text="404">
          404
        </h1>

        <div className="h-px w-32 bg-nier-dark mx-auto mb-6 opacity-50"></div>

        <h2 className="text-2xl uppercase tracking-[0.2em] mb-6">
          Data Stream Not Found
        </h2>

        <p className="max-w-md text-center mb-12 text-nier-muted/80 leading-relaxed text-sm">
          The requested coordinates provided logical null response.
          The resource may have been purged from the memory bank or never existed in this timeline.
        </p>

        <Link
          href="/"
          className="inline-block px-8 py-4 bg-nier-dark text-nier-cream uppercase tracking-[0.2em] text-sm hover:bg-nier-accent transition-all hover:scale-105 active:scale-95 shadow-lg"
        >
          Return to Base
        </Link>

        <div className="mt-16 text-[10px] text-nier-muted uppercase tracking-widest opacity-50">
          Telueve System V.2.0 // Error Logging Active
        </div>
      </div>
    </div>
  )
}
