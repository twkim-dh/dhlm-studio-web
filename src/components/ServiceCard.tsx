import Link from "next/link";

interface ServiceCardProps {
  emoji: string;
  title: string;
  description: string;
  features: string[];
  color: string;
  status: "live" | "coming-soon";
  link?: string;
}

export default function ServiceCard({
  emoji,
  title,
  description,
  features,
  color,
  status,
  link,
}: ServiceCardProps) {
  return (
    <div className="group relative flex flex-col rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Top color accent */}
      <div className="h-1.5" style={{ backgroundColor: color }} />

      <div className="flex flex-col flex-1 p-6 sm:p-8">
        {/* Emoji */}
        <span className="text-5xl mb-4">{emoji}</span>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-5">
          {description}
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {features.map((feature) => (
            <span
              key={feature}
              className="inline-block rounded-full px-3 py-1 text-xs font-medium"
              style={{
                backgroundColor: `${color}15`,
                color: color,
              }}
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* CTA */}
        {status === "live" && link ? (
          <Link
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105"
            style={{ backgroundColor: color }}
          >
            지금 체험하기
          </Link>
        ) : (
          <span className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-400 bg-gray-100 cursor-default">
            Coming Soon
          </span>
        )}
      </div>
    </div>
  );
}
