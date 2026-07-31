export function TierCard({
  name,
  description,
  features,
  price,
}: {
  name: string;
  description: string;
  features: string[];
  price: string | null;
}) {
  return (
    <div className="rounded-3xl border border-primary/10 bg-card p-6">
      <h3 className="text-2xl font-bold text-foreground">{name}</h3>
      <p className="mt-2 text-foreground/70">{description}</p>
      <ul className="mt-4 space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
            <span className="text-primary">✓</span> {f}
          </li>
        ))}
      </ul>
      <div className="mt-6">
        {price ? (
          <span className="text-xl font-bold text-primary">{price}</span>
        ) : (
          <span className="text-sm text-gold">Precio a confirmar</span>
        )}
      </div>
    </div>
  );
}
