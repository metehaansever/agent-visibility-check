import { Link } from "react-router-dom";
import { ArrowRight, Target, Users, Map } from "lucide-react";
import FeatureCard from "../components/FeatureCard";
import TrustedBy from "../components/TrustedBy";

const Index = () => {
  return (
    <div className="min-h-screen bg-white text-black font-inter">
  {/* Hero Section */}
  <section className="container mx-auto px-6 py-20 text-center">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-6xl font-bold mb-6 leading-tight">
        Shadowing Agents
      </h1>
      <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
        Test your visibility in LLM answers. Simulate. Improve.
      </p>
      
      <div className="relative">
        <img 
          src="/src/images/image1.png" 
          alt="AI Agents Navigation" 
          className="w-full max-w-3xl mx-auto mb-16"
        />
        <div className="absolute bottom-0 left-0 right-0 flex gap-4 justify-center p-8">
          <Link 
            to="/dashboard"
            className="bg-black text-white px-8 py-4 border-2 border-black hover:bg-white hover:text-black transition-all duration-200 font-medium"
          >
            Try the Demo <ArrowRight className="inline ml-2" size={16} />
          </Link>
          <button className="bg-white text-black px-8 py-4 border-2 border-black hover:bg-black hover:text-white transition-all duration-200 font-medium">
            Learn More
          </button>
        </div>
      </div>
    </div>
  </section>

      {/* Features Section */}
      <section className="border-t-2 border-black py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FeatureCard
              icon={<Target size={32} />}
              title="Prompt Visibility Checker"
              description="Discover how often your brand appears in AI-generated responses across different prompts and contexts."
            />
            <FeatureCard
              icon={<Users size={32} />}
              title="Competitor Simulation"
              description="See how competitors rank in AI answers and identify gaps in your content strategy."
            />
            <FeatureCard
              icon={<Map size={32} />}
              title="Content Improvement Map"
              description="Get actionable insights on how to optimize your content for better AI visibility."
            />
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="border-t-2 border-black py-16">
        <div className="container mx-auto px-6">
          <TrustedBy />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-black py-8">
        <div className="container mx-auto px-6">
          <div className="flex justify-center gap-8 text-gray-600">
            <a href="#" className="hover:text-black transition-colors">About</a>
            <a href="#" className="hover:text-black transition-colors">GitHub</a>
            <a href="#" className="hover:text-black transition-colors">Made at Hackathon</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
