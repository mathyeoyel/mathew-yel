type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeader({ eyebrow, title, description }: Props) {
  return (
    <div className="mb-10 max-w-3xl">
      {eyebrow ? (
        <p className="text-sm font-black uppercase tracking-[0.22em] text-amber-700">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-8 text-slate-600">
          {description}
        </p>
      ) : null}
    </div>
  );
}
