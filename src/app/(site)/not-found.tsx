import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col justify-center px-5 py-20 text-center">
      <p className="text-sm font-black uppercase tracking-[0.22em] text-amber-700">
        Not found
      </p>
      <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950">
        This page does not exist.
      </h1>
      <p className="mt-4 text-slate-600">
        The page may have moved, or the content may not have been published yet.
      </p>
      <div className="mt-8">
        <Link href="/" className="rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white hover:bg-amber-600">
          Go home
        </Link>
      </div>
    </main>
  );
}
