import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Zap, FileText, Target, TrendingUp } from "lucide-react";
import PromptChecker from "../components/PromptChecker";
import ShadowingSimulator from "../components/ShadowingSimulator";
import ContentMapper from "../components/ContentMapper";
import AdDuelAnalyzer from "../components/AdDuelAnalyzer";
import TrendAnalyzer from "../components/TrendAnalyzer";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-white text-black font-inter">
      {/* Header */}
      <header className="border-b-2 border-black py-6">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center gap-2 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Home
            </Link>
            <h1 className="text-2xl font-bold">Shadowing Agent Dashboard</h1>
            <div></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-16">
          
          {/* Section 1: Prompt Visibility Checker */}
          <section className="border-2 border-black p-8">
            <div className="flex items-center gap-3 mb-6">
              <Search size={24} />
              <h2 className="text-2xl font-bold">Prompt Visibility Checker</h2>
            </div>
            <PromptChecker />
          </section>

          {/* Section 2: Shadowing Simulation */}
          <section className="border-2 border-black p-8">
            <div className="flex items-center gap-3 mb-6">
              <Zap size={24} />
              <h2 className="text-2xl font-bold">Shadowing Simulation</h2>
            </div>
            <ShadowingSimulator />
          </section>

          {/* Section 3: Content Improvement Map */}
          <section className="border-2 border-black p-8">
            <div className="flex items-center gap-3 mb-6">
              <FileText size={24} />
              <h2 className="text-2xl font-bold">Content Improvement Map</h2>
            </div>
            <ContentMapper />
          </section>

          {/* Section 4: Ad Duel Analyzer */}
          <section className="border-2 border-black p-8">
            <div className="flex items-center gap-3 mb-6">
              <Target size={24} />
              <h2 className="text-2xl font-bold">Ad Duel Analyzer</h2>
            </div>
            <AdDuelAnalyzer />
          </section>

          {/* Section 5: Trend Analyzer */}
          <section className="border-2 border-black p-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp size={24} />
              <h2 className="text-2xl font-bold">Trend Analyzer</h2>
            </div>
            <TrendAnalyzer />
          </section>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
