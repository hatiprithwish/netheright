import Image from "next/image";

export interface FeatureRowProps {
  badgeText: string;
  badgeClassName?: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  imageLeft: boolean;
  glowBackground?: string;
  priority?: boolean;
}

export default function FeatureRow({
  badgeText,
  badgeClassName = "border-primary/20 bg-primary/10 text-primary",
  title,
  description,
  imageSrc,
  imageAlt,
  imageLeft,
  glowBackground = "radial-gradient(circle, hsl(var(--primary)/0.4), transparent)",
  priority = false,
}: FeatureRowProps) {
  const textContent = (
    <div className="flex flex-col justify-center gap-4">
      <div
        className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest ${badgeClassName}`}
      >
        {badgeText}
      </div>
      <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h3>
      <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
        {description}
      </p>
    </div>
  );

  const imageContent = (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl border border-border shadow-2xl">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={640}
          height={420}
          className="w-full object-cover"
          priority={priority}
        />
      </div>
      {/* Decorative glow behind image */}
      <div
        className="absolute -inset-4 -z-10 rounded-3xl opacity-30 blur-2xl"
        style={{
          background: glowBackground,
        }}
      />
    </div>
  );

  return (
    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <div className={imageLeft ? "lg:order-last" : ""}>{textContent}</div>
      <div className={imageLeft ? "lg:order-first" : ""}>{imageContent}</div>
    </div>
  );
}
