type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  tone?: "light" | "dark";
};

export function SectionHeader({ eyebrow, title, description, tone = "light" }: Props) {
  const isDark = tone === "dark";

  return (
    <div className="section-header mb-8 max-w-3xl md:mb-10">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2
        className={`mt-4 text-3xl font-black leading-tight tracking-tight md:text-4xl ${
          isDark ? "text-white" : "text-brand-deep"
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`mt-4 text-base leading-7 md:leading-8 ${
            isDark ? "text-brand-muted" : "text-brand-body"
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
