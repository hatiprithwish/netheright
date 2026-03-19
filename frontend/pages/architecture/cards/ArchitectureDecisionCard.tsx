export function ArchitectureDecisionCard({
  icon,
  title,
  description,
  highlight,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight: string;
}) {
  return (
    <div className="group rounded-xl border border-gray-100 bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-brand-primary/30 hover:shadow-lg dark:border-gray-800 dark:bg-slate-900/50">
      <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-brand-primary/10 p-3 text-brand-primary transition-colors group-hover:bg-brand-primary/20">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-bold text-text-main">{title}</h3>
      <p className="mb-4 text-sm leading-relaxed text-text-muted">
        {description}
      </p>
      <div className="inline-block rounded-full bg-gray-50 px-3 py-1 text-xs font-semibold text-text-main border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
        {highlight}
      </div>
    </div>
  );
}
