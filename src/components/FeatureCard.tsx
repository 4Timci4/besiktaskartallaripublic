import type { FC } from 'react';

interface FeatureCardProps {
  icon: FC<{ className?: string }>;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      <div className="w-12 h-12 bg-besiktas-red/10 rounded-lg flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-besiktas-red" />
      </div>
      <h3 className="text-h2 font-semibold mb-3">{title}</h3>
      <p className="text-base text-black">{description}</p>
    </div>
  );
};

export default FeatureCard;