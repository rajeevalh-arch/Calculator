import React, { useState } from 'react';
import { UserInputs } from '../types';
import { INDUSTRIES, EXPEDITING_FREQS, DECISION_LATENCY_OPTS, DATA_DISCIPLINE_OPTS } from '../constants';

interface AssessmentFormProps {
  onSubmit: (data: Omit<UserInputs, 'companyName' | 'email' | 'designation'>) => void;
  isLoading: boolean;
}

const Tooltip: React.FC<{ text: string }> = ({ text }) => (
  <div className="mt-1.5 text-[10px] text-[#4285F4] font-medium italic opacity-90 leading-tight bg-blue-50/50 p-2 rounded-lg border border-blue-100/50">
    {text}
  </div>
);

const AssessmentForm: React.FC<AssessmentFormProps> = ({ onSubmit, isLoading }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  
  const [formData, setFormData] = useState<Omit<UserInputs, 'companyName' | 'email' | 'designation'>>({
    industry: INDUSTRIES[0],
    mov: 10000000,
    shifts: 2,
    scrap_percent: 3.5,
    rework_percent: 5.2,
    downtime_hr_wk: 12,
    otd_percent: 88,
    expediting_freq: 'Weekly',
    decision_latency: '2-3 days',
    data_discipline: 'Mostly Excel'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (['mov', 'shifts', 'scrap_percent', 'rework_percent', 'downtime_hr_wk', 'otd_percent'].includes(name))
        ? Number(value)
        : value
    }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === totalSteps) {
      onSubmit(formData);
    } else {
      nextStep();
    }
  };

  const steps = [
    { title: "Plant Scale", icon: "🏭", desc: "Setting the financial baseline" },
    { title: "Quality & Loss", icon: "📉", desc: "Immediate cash-flow drains" },
    { title: "Flow Efficiency", icon: "⏳", desc: "The 'Chaos Tax' on planning" },
    { title: "Data Discipline", icon: "🛡️", desc: "Information Entropy multipliers" }
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl md:rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100 animate-slide-up">
      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-gray-100 flex">
        {steps.map((_, i) => (
          <div 
            key={i} 
            className={`h-full transition-all duration-500 ease-out ${i < step ? 'bg-[#4285F4] flex-1' : 'w-0'}`}
          />
        ))}
      </div>

      <div className="p-6 sm:p-10 md:p-14">
        <div className="flex justify-between items-center mb-8 md:mb-12">
          <div>
            <p className="text-[9px] md:text-[10px] font-bold text-[#4285F4] uppercase tracking-[0.4em] mb-1">Phase {step} of 4</p>
            <h2 className="text-xl md:text-3xl font-bold text-gray-900 tracking-tight">{steps[step-1].title}</h2>
            <p className="text-[10px] md:text-xs text-gray-400 font-medium mt-1">{steps[step-1].desc}</p>
          </div>
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-[#4285F4]/5 flex items-center justify-center text-xl md:text-3xl shadow-inner border border-[#4285F4]/10">
            {steps[step-1].icon}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 min-h-[300px]">
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 animate-slide-up">
              <div className="col-span-full">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Industry Vertical</label>
                <select name="industry" value={formData.industry} onChange={handleChange} className="w-full mt-2 p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#4285F4] font-bold text-gray-700 text-sm md:text-base">
                  {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
                <Tooltip text="Mission: Define sector-specific rework factors. Aerospace rework costs 1.8x more than General Fab." />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Monthly Output (₹ MOV)</label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">₹</span>
                  <input type="number" name="mov" value={formData.mov} onChange={handleChange} className="w-full pl-8 pr-4 py-3 md:py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#4285F4] font-bold text-gray-700 text-sm md:text-base" />
                </div>
                <Tooltip text="Mission: Baseline revenue. All 'Tax' percentages are calculated against this value." />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Shifts</label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {[1, 2, 3].map(s => (
                    <button 
                      key={s} 
                      type="button" 
                      onClick={() => setFormData(prev => ({ ...prev, shifts: s as any }))}
                      className={`py-3 md:py-4 rounded-xl border-2 font-black transition-all text-sm md:text-base ${formData.shifts === s ? 'border-[#4285F4] bg-[#4285F4]/5 text-[#4285F4]' : 'border-gray-100 text-gray-300'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <Tooltip text="Mission: Calculate 'H' (Monthly Capacity Hours)." />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 animate-slide-up">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Scrap Rate (%)</label>
                <input type="number" step="0.1" name="scrap_percent" value={formData.scrap_percent} onChange={handleChange} className="w-full mt-2 p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#4285F4] font-bold text-gray-700 text-sm md:text-base" />
                <Tooltip text="The Raw Material Tax: Monthly revenue permanently lost to the bin." />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rework Rate (%)</label>
                <input type="number" step="0.1" name="rework_percent" value={formData.rework_percent} onChange={handleChange} className="w-full mt-2 p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#4285F4] font-bold text-gray-700 text-sm md:text-base" />
                <Tooltip text="The Secondary Loop Tax: Rework consumes fresh capacity." />
              </div>
              <div className="col-span-full">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Machine Downtime (Hrs/Wk)</label>
                <input type="number" name="downtime_hr_wk" value={formData.downtime_hr_wk} onChange={handleChange} className="w-full mt-2 p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#4285F4] font-bold text-gray-700 text-sm md:text-base" />
                <Tooltip text="The Reliability Tax: Calculates the 'Unearned Revenue' during machine stalls." />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 animate-slide-up">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">On-Time Delivery (OTD %)</label>
                <input type="number" name="otd_percent" value={formData.otd_percent} onChange={handleChange} className="w-full mt-2 p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#4285F4] font-bold text-gray-700 text-sm md:text-base" />
                <Tooltip text="The Delivery Penalty: Missing 95% triggers a 0.4x margin impact." />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Expediting Frequency</label>
                <select name="expediting_freq" value={formData.expediting_freq} onChange={handleChange} className="w-full mt-2 p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#4285F4] font-bold text-gray-700 text-sm md:text-base">
                  {EXPEDITING_FREQS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                <Tooltip text="The Firefighting Tax: Hidden management overhead and urgent freight." />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 animate-slide-up">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Decision Latency</label>
                <select name="decision_latency" value={formData.decision_latency} onChange={handleChange} className="w-full mt-2 p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#4285F4] font-bold text-gray-700 text-sm md:text-base">
                  {DECISION_LATENCY_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <Tooltip text="The Latency Multiplier: Slow approvals increase total leakage by up to 20%." />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Data Discipline</label>
                <select name="data_discipline" value={formData.data_discipline} onChange={handleChange} className="w-full mt-2 p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#4285F4] font-bold text-gray-700 text-sm md:text-base">
                  {DATA_DISCIPLINE_OPTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <Tooltip text="The Information Tax: Lack of visibility leads to hidden losses." />
              </div>
            </div>
          )}

          <div className="pt-6 md:pt-10 flex flex-col-reverse md:flex-row gap-4">
            {step > 1 && (
              <button 
                type="button" 
                onClick={prevStep}
                className="w-full md:w-auto px-8 py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest text-[9px] md:text-[10px]"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-4 md:py-5 bg-[#4285F4] hover:bg-[#1A73E8] disabled:bg-gray-300 text-white rounded-xl md:rounded-2xl font-bold uppercase tracking-[0.2em] text-[9px] md:text-[10px] shadow-lg shadow-[#4285F4]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Analyzing...
                </>
              ) : (
                <>{step === totalSteps ? 'Generate Roadmap' : 'Next Step'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssessmentForm;