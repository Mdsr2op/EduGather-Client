// src/components/pages/AiQuizGeneration.tsx
import React, { useState } from "react";

const AiQuizGeneration: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setGeneratedQuiz(null); // Reset previous quiz
    }
  };

  const handleGenerateQuiz = async () => {
    if (!selectedFile) {
      alert("Please select a file to generate a quiz.");
      return;
    }

    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedQuiz(`Generated quiz based on ${selectedFile.name}`);
    }, 2000);
  };

  return (
    <div className="flex-1 p-6 overflow-auto bg-dark-2">
      <h2 className="text-xl font-semibold text-light-1 mb-4">AI Quiz Generation</h2>
      <div className="flex flex-col items-start space-y-4">
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
          className="text-light-3"
        />
        {selectedFile && (
          <p className="text-light-4">Selected File: {selectedFile.name}</p>
        )}
        <button
          onClick={handleGenerateQuiz}
          disabled={isGenerating}
          className={`px-4 py-2 bg-primary-500 text-light-1 rounded hover:bg-primary-600 ${
            isGenerating ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isGenerating ? "Generating..." : "Generate Quiz"}
        </button>
        {generatedQuiz && (
          <div className="mt-4 p-4 bg-dark-3 rounded w-full">
            <h3 className="text-lg font-semibold text-light-1 mb-2">Generated Quiz</h3>
            <p className="text-light-3">{generatedQuiz}</p>
            {/* In a real scenario, you might display the quiz questions here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default AiQuizGeneration;
