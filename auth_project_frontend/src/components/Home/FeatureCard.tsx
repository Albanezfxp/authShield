import type { JSX } from "react";

interface featureCardProps {
  feature: {
    icon: JSX.Element;
    title: string;
    description: string;
  };
  index: number;
}

export default function FeatureCard(props: featureCardProps) {
  return (
    <>
      <div key={props.index} className="featureCard">
        <div className="featureIcon">{props.feature.icon}</div>
        <h3>{props.feature.title}</h3>
        <p>{props.feature.description}</p>
      </div>
    </>
  );
}
