
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="border-2 border-black p-6 hover:bg-black hover:text-white transition-all duration-200 group">
      <div className="mb-4 group-hover:text-white">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600 group-hover:text-gray-200">{description}</p>
    </div>
  );
};

export default FeatureCard;
