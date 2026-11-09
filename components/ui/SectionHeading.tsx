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
  const muted = tone === 'dark' ? 'text-bone/65' : 'text-ink/70';
  const body = tone === 'dark' ? 'text-bone/70' : 'text-ink/70';

  return (
    <div className={className}>
      <div className={`section-kicker ${muted}`}>
        <span>{eyebrow}</span>
        {index && <span className={`numeric ml-1 ${tone === 'dark' ? 'text-lime/65' : 'text-ink/70'}`}>/ {index}</span>}
      </div>
      <h2 className={`editorial-title mt-7 max-w-[17ch] ${tone === 'dark' ? 'text-bone' : 'text-ink'}`}>{title}</h2>
      {intro && <div className={`mt-6 max-w-[48ch] text-[14px] leading-[1.8] sm:text-[15px] ${body}`}>{intro}</div>}
    </div>
  );
}
