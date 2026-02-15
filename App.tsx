import React, { useState } from 'react';
import { UserInputs, AnalysisResult } from './types';
import AssessmentForm from './components/AssessmentForm';
import ResultDashboard from './components/ResultDashboard';
import { analyzeOperationalLeakage } from './services/geminiService';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAssessmentSubmit = async (data: UserInputs) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await analyzeOperationalLeakage(data);
      
      if (!analysisResult || !analysisResult.leakage_report) {
        throw new Error("Invalid report format received from AI.");
      }
      
      setResult(analysisResult);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Analysis Engine Fault: Please check your network connection.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const resetAssessment = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] selection:bg-[#4285F4]/20 selection:text-[#4285F4] flex flex-col">
      <header className="bg-white/90 backdrop-blur-xl sticky top-0 z-[100] border-b border-gray-200 py-3 md:py-4 transition-all shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 md:gap-3 group cursor-pointer" onClick={resetAssessment}>
            <div className="flex gap-0.5 p-0.5 md:p-1 scale-75 md:scale-100">
              <div className="w-2 h-5 md:w-2.5 md:h-6 bg-[#4285F4] rounded-sm"></div>
              <div className="w-2 h-7 md:w-2.5 md:h-8 bg-[#EA4335] rounded-sm -mt-1"></div>
              <div className="w-2 h-5 md:w-2.5 md:h-6 bg-[#FBBC05] rounded-sm"></div>
              <div className="w-2 h-4 md:w-2.5 md:h-5 bg-[#34A853] rounded-sm mt-1"></div>
            </div>
            <div>
              <h1 className="text-base md:text-xl font-bold text-gray-800 tracking-tight flex">
                <span className="text-[#4285F4]">Leakage</span>
                <span className="text-[#EA4335]">Calculator</span>
              </h1>
              <p className="text-[7px] md:text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">Execution Insights v2.5</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] font-black text-[#4285F4] uppercase tracking-widest leading-none mb-0.5">Gemini Flash 3.0</span>
              <span className="text-[8px] font-bold text-gray-400 uppercase">AI Analytics</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8 md:py-12 flex-grow">
        {error && (
          <div className="max-w-4xl mx-auto mb-8 md:mb-10 bg-white border-l-4 border-[#EA4335] p-4 md:p-6 rounded-xl md:rounded-2xl text-[#EA4335] flex items-center gap-3 md:gap-4 shadow-xl shadow-red-50 animate-in fade-in slide-in-from-top-4">
            <div className="bg-[#EA4335] text-white p-1.5 md:p-2 rounded-full flex-shrink-0">
              <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <p className="font-bold text-xs md:text-sm">{error}</p>
          </div>
        )}

        {!result ? (
          <div className="space-y-6 md:space-y-12 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="text-center">
              <h2 className="text-2xl sm:text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-[1.1]">
                Quantify the <span className="text-[#4285F4]">Invisible Tax</span>
              </h2>
              <p className="mt-3 text-gray-400 font-medium text-sm md:text-base max-w-xl mx-auto px-4">Identify hidden operational leakage using the Traits4XL execution framework.</p>
            </div>
            <div className="relative px-2">
               <div className="absolute top-0 left-1/4 w-48 md:w-96 h-48 md:h-96 bg-[#4285F4]/5 rounded-full blur-[80px] md:blur-[120px] -z-10"></div>
               <AssessmentForm onSubmit={handleAssessmentSubmit} isLoading={loading} />
            </div>
          </div>
        ) : (
          <ResultDashboard result={result} onReset={resetAssessment} />
        )}
      </main>

      <footer className="py-8 md:py-12 border-t border-gray-200 text-center bg-white mt-auto">
        <div className="container mx-auto px-4 sm:px-6">
          <p className="text-gray-400 text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em]">Execution Readiness Framework</p>
          <p className="text-gray-900 font-black text-lg md:text-xl mt-3 tracking-tighter">Traits4XL™ Intelligence</p>
        </div>
      </footer>
    </div>
  );
};

export default App;