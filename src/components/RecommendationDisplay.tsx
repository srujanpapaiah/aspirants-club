import React from 'react';
import { CheckCircle, AlertCircle } from "lucide-react";

interface RecommendationDisplayProps {
  recommendations: string[] | string | null;
}

export const RecommendationDisplay: React.FC<RecommendationDisplayProps> = ({ recommendations }) => {
  const renderRecommendations = () => {
    if (!recommendations) {
      return <p className="text-yellow-400">No recommendations available.</p>;
    }

    if (typeof recommendations === 'string') {
      return <p className="text-gray-300">{recommendations}</p>;
    }

    if (Array.isArray(recommendations)) {
      return (
        <ul className="list-disc list-inside text-gray-300">
          {recommendations.map((rec, index) => (
            <li key={index} className="mb-2">{rec}</li>
          ))}
        </ul>
      );
    }

    return <p className="text-red-400">Unable to display recommendations. Unexpected data format.</p>;
  };

  return (
    <div className="bg-[#121717] text-white p-6 rounded-lg max-w-2xl mx-auto shadow-lg mt-8">
      <div className="flex items-center justify-center mb-6">
        {recommendations ? (
          <CheckCircle className="text-[#1AA38C] mr-2" size={32} />
        ) : (
          <AlertCircle className="text-yellow-400 mr-2" size={32} />
        )}
        <h2 className="text-3xl font-bold">Recommendations</h2>
      </div>
      <div className="bg-[#1E2A2F] p-4 rounded-md">
        <h3 className="text-xl font-semibold mb-4 text-[#1AA38C]">Based on your PDF:</h3>
        {renderRecommendations()}
      </div>
    </div>
  );
};