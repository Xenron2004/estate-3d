interface Props {
  index?: string;
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  tone?: 'light' | 'dark';
  className?: string;
}

export default function SectionHeading({
  index,
  eyebrow,
  title,
  intro,
  tone = 'light',
  className = '',
}: Props) {
  const muted = tone === 'dark' ? 'text-bone/55' : 'text-ink/50';
  const body = tone === 'dark' ? 'text-bone/70' : 'text-ink/70';

  return (
    <div className={className}>
      <div className="flex items-center gap-4">
        {index && <span className="eyebrow numeric text-bronze">{index}</span>}
        <span className={`eyebrow ${muted}`}>{eyebrow}</span>
        <span className={`h-px flex-1 ${tone === 'dark' ? 'bg-bone/15' : 'bg-ink/12'}`} />
      </div>
      <h2 className="mt-6 text-[clamp(2rem,4.6vw,3.6rem)] leading-[1.02] max-w-[18ch]">{title}</h2>
      {intro && <p className={`mt-5 max-w-[52ch] text-[15px] leading-relaxed ${body}`}>{intro}</p>}
    </div>
  );
}
