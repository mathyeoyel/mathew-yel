import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col justify-center px-5 py-20 text-center">
      <p className="eyebrow">Not found</p>
      <h1 className="mt-4 text-4xl font-black tracking-tight text-brand-deep">
        This page does not exist.
      </h1>
      <p className="mt-4 text-brand-body">
        The page may have moved, or the content may not have been published yet.
      </p>
      <div className="mt-8">
        <Link href="/" className="btn-primary">
          Go home
        </Link>
      </div>
    </main>
  );
}
