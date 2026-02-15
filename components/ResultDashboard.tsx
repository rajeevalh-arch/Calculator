import React, { useState } from 'react';
import { AnalysisResult, TRAIT_DEFINITIONS } from '../types';

interface ResultDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
}

const ResultDashboard: React.FC<ResultDashboardProps> = ({ result, onReset }) => {
  // Ordered per request: Financials -> Behavior -> Toolkit (Roadmap)
  const [activeTab, setActiveTab] = useState<'financials' | 'behavior' | 'roadmap'>('financials');
  const [showAssumptions, setShowAssumptions] = useState(false);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const { leakage_report, tools_roadmap, execution_cadence, traits4xl_readiness, behavior_dynamics } = result;

  const getCategoryColor = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('problem') || c.includes('solving')) return '#EA4335';
    if (c.includes('flow') || c.includes('planning')) return '#4285F4';
    if (c.includes('quality')) return '#FBBC05';
    if (c.includes('reliability')) return '#1A73E8';
    if (c.includes('digital')) return '#34A853';
    return '#4285F4';
  };

  return (
    <div className="max-w-6xl mx-auto pb-24 px-4 sm:px-6 animate-slide-up">
      {/* Executive Summary Header */}
      <div className="bg-white rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-gray-100 mb-6 md:mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 md:gap-8">
          <div className="w-full lg:w-auto">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Total Monthly Leakage</span>
              <div className={`px-2 py-0.5 rounded-full text-[8px] md:text-[9px] font-black border ${
                leakage_report.totals.confidence === 'High' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                leakage_report.totals.confidence === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                'bg-red-50 text-red-600 border-red-100'
              }`}>
                {leakage_report.totals.confidence} Confidence
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-gray-900 tracking-tighter break-words">
              {formatCurrency(leakage_report.totals.total_leakage_mid)}
              <span className="text-xs md:text-sm font-bold text-gray-400 ml-2 md:ml-3 uppercase tracking-widest block sm:inline">/ Month</span>
            </h2>
          </div>
          <div className="w-full lg:w-auto bg-[#34A853] p-6 md:p-8 rounded-2xl md:rounded-3xl text-white shadow-xl shadow-[#34A853]/20 min-w-full sm:min-w-[280px]">
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Recoverable (90 Days)</p>
            <p className="text-2xl md:text-4xl font-black">{formatCurrency(leakage_report.recoverable_90_days.total_recoverable)}</p>
            <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[8px] md:text-[9px] font-bold opacity-70 uppercase">Quick Wins</p>
                <p className="text-xs md:text-sm font-bold">{formatCurrency(leakage_report.recoverable_90_days.quick_wins_value)}</p>
              </div>
              <div>
                <p className="text-[8px] md:text-[9px] font-bold opacity-70 uppercase">Medium Term</p>
                <p className="text-xs md:text-sm font-bold">{formatCurrency(leakage_report.recoverable_90_days.sixty_to_ninety_value)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs - Scrollable on mobile */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 mb-6 md:mb-8 bg-gray-200/50 p-1 rounded-2xl w-full sm:w-fit mx-auto md:mx-0">
        <button onClick={() => setActiveTab('financials')} className={`whitespace-nowrap flex-1 sm:flex-none px-4 md:px-8 py-3 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'financials' ? 'bg-white text-[#4285F4] shadow-sm' : 'text-gray-500'}`}>Financial Ledger</button>
        <button onClick={() => setActiveTab('behavior')} className={`whitespace-nowrap flex-1 sm:flex-none px-4 md:px-8 py-3 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'behavior' ? 'bg-white text-[#4285F4] shadow-sm' : 'text-gray-500'}`}>Behaviours to watch</button>
        <button onClick={() => setActiveTab('roadmap')} className={`whitespace-nowrap flex-1 sm:flex-none px-4 md:px-8 py-3 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'roadmap' ? 'bg-white text-[#4285F4] shadow-sm' : 'text-gray-500'}`}>Toolkit</button>
      </div>

      {/* Tab Content: Financials */}
      {activeTab === 'financials' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl md:rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px] md:min-w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 md:px-8 py-4 md:py-6 text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Leakage Driver</th>
                    <th className="px-4 md:px-8 py-4 md:py-6 text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Key Inputs</th>
                    <th className="px-4 md:px-8 py-4 md:py-6 text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Impact (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {leakage_report.components.map((comp, idx) => {
                    const isFriction = comp.label.toLowerCase().includes('friction');
                    return (
                      <tr key={idx} className={`hover:bg-gray-50/50 transition-colors group ${isFriction ? 'bg-indigo-50/30' : ''}`}>
                        <td className="px-4 md:px-8 py-4 md:py-6">
                          <div className="flex items-center gap-2 md:gap-4">
                            <span className="text-xl md:text-2xl">{comp.icon}</span>
                            <span className={`font-bold text-xs md:text-sm ${isFriction ? 'text-indigo-600' : 'text-gray-900'}`}>{comp.label}</span>
                          </div>
                        </td>
                        <td className="px-4 md:px-8 py-4 md:py-6 font-medium text-gray-500 text-[10px] md:text-xs">{comp.inputs}</td>
                        <td className="px-4 md:px-8 py-4 md:py-6 text-right">
                          <span className="text-sm md:text-lg font-black" style={{ color: comp.color }}>{formatCurrency(comp.value)}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-900 text-white">
                  <tr>
                    <td colSpan={2} className="px-4 md:px-8 py-4 md:py-6 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em]">Total Monthly Leakage</td>
                    <td className="px-4 md:px-8 py-4 md:py-6 text-right font-black text-base md:text-2xl">{formatCurrency(leakage_report.totals.total_leakage_mid)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center px-2">
            <button 
              onClick={() => setShowAssumptions(!showAssumptions)}
              className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2 hover:text-[#4285F4] transition-colors"
            >
              {showAssumptions ? 'Hide Assumptions' : 'Show Assumptions & Math'} 
              <svg className={`w-3 h-3 transition-transform ${showAssumptions ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
            </button>
          </div>
          
          {showAssumptions && (
            <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl border border-gray-100 text-[10px] md:text-xs text-gray-500 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 animate-slide-up">
              <div>
                <h5 className="font-black text-gray-900 uppercase tracking-widest mb-4">Calculated Constants</h5>
                <ul className="space-y-2">
                  <li>• Material-to-Conversion: 60% standard ratio applied to yield losses.</li>
                  <li>• Friction: [Decision Latency] × [Data Gap Visibility Tax].</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 md:p-6 rounded-xl md:rounded-2xl">
                <p className="italic leading-relaxed font-medium">"The Execution Friction Tax specifically quantifies the hidden cost of organizational inertia and visibility gaps."</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Behaviors to watch */}
      {activeTab === 'behavior' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Traits4XL Profile */}
            <div className="bg-white rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 border border-gray-100 shadow-sm">
              <h3 className="text-lg md:text-xl font-black text-gray-900 mb-2">Traits4XL™ Profiling</h3>
              <p className="text-[10px] md:text-xs text-gray-400 mb-6 md:mb-8 font-bold uppercase tracking-widest">Leadership Habits Baseline</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {traits4xl_readiness.required_traits.map((traitStr, idx) => {
                  const codeMatch = traitStr.match(/\(([A-Z]+)\)/);
                  const code = codeMatch ? codeMatch[1] : 'TR';
                  const name = traitStr.replace(/\([A-Z]+\)/, '').trim();
                  return (
                    <div key={idx} className="flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-xl md:rounded-2xl bg-gray-50 border border-gray-100 group hover:bg-[#4285F4]/5 transition-colors">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-white border border-gray-200 flex items-center justify-center text-[#4285F4] font-black text-[9px] md:text-[10px] mono group-hover:border-[#4285F4]/30 shadow-sm flex-shrink-0">
                        {code}
                      </div>
                      <div>
                        <p className="text-[11px] md:text-xs font-black text-gray-800 leading-tight">{name}</p>
                        <p className="text-[8px] md:text-[9px] text-gray-400 mt-0.5 font-bold uppercase">Critical Trait</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shop-Floor Chemistry */}
            <div className="bg-[#1A73E8] rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 text-white shadow-xl flex flex-col">
              <h3 className="text-lg md:text-xl font-black mb-2">Shop-Floor Chemistry</h3>
              <p className="text-[10px] md:text-xs opacity-70 mb-6 md:mb-8 font-bold uppercase tracking-widest">Team Dynamics & Habits</p>
              <div className="space-y-6 md:space-y-8 flex-grow">
                <div>
                  <h5 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-4 text-blue-200">Critical Focus Areas</h5>
                  <div className="space-y-2 md:space-y-3">
                    {behavior_dynamics.shop_floor_chemistry.focus_areas.map((area, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white/10 p-3 md:p-4 rounded-xl border border-white/10 backdrop-blur-md">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-300 flex-shrink-0"></div>
                        <span className="text-[11px] md:text-xs font-bold">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-auto">
                  <h5 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-4 text-blue-200">Habits to Measure</h5>
                  <div className="grid grid-cols-1 gap-2">
                    {behavior_dynamics.shop_floor_chemistry.habits_to_track.map((habit, i) => (
                      <div key={i} className="text-[11px] md:text-xs font-bold border-l-2 border-white/20 pl-3 md:pl-4 py-1 flex items-center gap-2">
                        <svg className="w-3 h-3 text-[#34A853] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path></svg>
                        {habit}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* New Call to Action for contact */}
          <div className="bg-white border-2 border-dashed border-[#4285F4]/30 p-8 rounded-[2rem] text-center">
            <h4 className="text-xl font-black text-gray-900 mb-3">Ready to Bridge the Execution Gap?</h4>
            <p className="text-gray-500 text-sm mb-6 max-w-xl mx-auto">Get a full diagnostic and tailored behavioral coaching for your plant leadership team.</p>
            <a 
              href="https://traits4xl.com/#contact" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-4 bg-[#4285F4] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#1A73E8] transition-all shadow-xl shadow-[#4285F4]/20"
            >
              Contact Traits4XL
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </a>
          </div>
        </div>
      )}

      {/* Tab Content: Toolkit */}
      {activeTab === 'roadmap' && (
        <div className="space-y-8 md:space-y-12">
          {/* Cadence Section */}
          <section>
            <h3 className="text-lg md:text-xl font-black text-gray-900 mb-6 md:mb-8 flex items-center gap-3">
              <span className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#4285F4] text-white flex items-center justify-center text-xs md:text-sm italic">E</span>
              Execution Engine (Cadence)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {execution_cadence.map((item, idx) => (
                <div key={idx} className="bg-white p-6 md:p-8 rounded-2xl md:rounded-[2rem] border border-gray-100 shadow-sm relative group">
                  <span className={`px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border ${
                    item.frequency === 'Daily' ? 'bg-red-50 text-red-600 border-red-100' :
                    item.frequency === 'Weekly' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                    'bg-emerald-50 text-emerald-600 border-emerald-100'
                  }`}>
                    {item.frequency}
                  </span>
                  <div className="mt-6 md:mt-8 space-y-3 md:space-y-4">
                    {item.activities.map((act, i) => (
                      <div key={i} className="flex gap-2 md:gap-3 text-[11px] md:text-xs font-bold text-gray-600">
                        <span className="text-[#4285F4]">•</span>
                        {act}
                      </div>
                    ))}
                  </div>
                  <div className="absolute top-4 right-6 md:right-8 text-[#4285F4]/10 group-hover:text-[#4285F4]/20 transition-colors font-black text-3xl md:text-4xl">0{idx+1}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Tools Roadmap */}
          <section>
            <h3 className="text-lg md:text-xl font-black text-gray-900 mb-6 md:mb-8">Intervention Toolkit (A-E Matrix)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {tools_roadmap.map((tool, idx) => (
                <div key={idx} className="bg-white rounded-2xl md:rounded-[2rem] border border-gray-100 p-6 md:p-8 hover:shadow-lg transition-all group border-l-4" style={{ borderLeftColor: getCategoryColor(tool.category) }}>
                  <div className="flex justify-between items-start mb-4 md:mb-6">
                    <span className="px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest text-white" style={{ backgroundColor: getCategoryColor(tool.category) }}>
                      {tool.category}
                    </span>
                    <span className="text-[9px] md:text-[10px] font-black text-gray-300">Tool {idx + 1}</span>
                  </div>
                  <h4 className="text-lg md:text-xl font-black text-gray-900 mb-2">{tool.name}</h4>
                  <div className="space-y-4 mt-4 md:mt-6">
                    <div>
                      <p className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Functional Detail (WHAT)</p>
                      <p className="text-[11px] md:text-xs text-gray-600 leading-relaxed font-medium">{tool.what}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Trigger (WHEN)</p>
                        <p className="text-[11px] md:text-xs font-bold text-gray-700">{tool.when}</p>
                      </div>
                      <div>
                        <p className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Output (DELIVERABLE)</p>
                        <p className="text-[11px] md:text-xs font-bold text-[#34A853]">{tool.output}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Global Action Footer */}
      <div className="mt-12 md:mt-16 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4">
        <button 
          onClick={() => window.print()}
          className="w-full md:w-auto px-6 md:px-8 py-4 md:py-5 bg-white border border-gray-200 text-gray-500 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
          Print Report
        </button>
        <button 
          onClick={onReset}
          className="w-full md:w-auto px-8 md:px-12 py-4 md:py-5 bg-[#4285F4] text-white rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] hover:bg-[#1A73E8] transition-all shadow-xl shadow-[#4285F4]/20 active:scale-95"
        >
          New Assessment
        </button>
      </div>
    </div>
  );
};

export default ResultDashboard;