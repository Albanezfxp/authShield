import type { ReactNode } from "react";

// ✅ PascalCase + readonly
interface FeatureCardProps {
  readonly feature: {
    readonly id: string;
    readonly icon: ReactNode;
    readonly title: string;
    readonly description: string;
  };
}

export default function FeatureCard({ feature }: Readonly<FeatureCardProps>) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{feature.icon}</div>
      <h3 className="feature-title">{feature.title}</h3>
      <p className="feature-description">{feature.description}</p>
    </div>
  );
}
