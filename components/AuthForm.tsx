import React, { useState, useEffect } from 'react';
import { UserInfo } from '../types';
import { sendOTPEmail } from '../services/emailService';

interface AuthFormProps {
  onAuthenticated: (info: UserInfo) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuthenticated }) => {
  const [step, setStep] = useState<'info' | 'otp'>('info');
  const [info, setInfo] = useState<UserInfo>({ companyName: '', email: '', designation: '' });
  const [otpInput, setOtpInput] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const MASTER_BYPASS_CODE = "123456";

  const generateNewOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    return code;
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isProcessing) return;

    setIsProcessing(true);
    setError(null);
    
    const code = generateNewOtp();
    
    // Safety Timeout: If the email call takes more than 4 seconds, 
    // we move to the OTP step anyway and show the bypass code.
    const safetyTimeout = setTimeout(() => {
      if (step === 'info') {
        setStep('otp');
        setError("Email service taking longer than expected. Access enabled via test code: 123456");
        setIsProcessing(false);
      }
    }, 4000);

    try {
      await sendOTPEmail(info.email, code, info.companyName);
      clearTimeout(safetyTimeout);
      setStep('otp');
    } catch (err) {
      clearTimeout(safetyTimeout);
      console.warn('Email Send Failed. Enabling bypass.');
      setStep('otp');
      setError("Email service unavailable. Access enabled via test code: 123456");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpInput];
    newOtp[index] = value.substring(value.length - 1);
    setOtpInput(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = otpInput.join('');
    
    // Check against generated code OR the hardcoded bypass code
    if (enteredCode === generatedOtp || enteredCode === MASTER_BYPASS_CODE) {
      onAuthenticated({ ...info });
    } else {
      setError("Verification failed. Please use the code 123456 to bypass.");
      setOtpInput(['', '', '', '', '', '']);
      document.getElementById('otp-0')?.focus();
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-[2.5rem] shadow-xl border p-10 animate-slide-up relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#4285F4]/5 rounded-bl-[100px] -z-0"></div>

      {error && (
        <div className="mb-6 bg-blue-50 border border-blue-100 p-4 rounded-2xl text-[#4285F4] text-[10px] font-black uppercase tracking-widest text-center shadow-sm relative z-10">
          {error}
        </div>
      )}

      {step === 'info' ? (
        <form onSubmit={handleSendOtp} className="space-y-6 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Access Engine</h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">Authorized Personnel Only</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Legal Entity Name</label>
              <input required type="text" placeholder="e.g. Acme Manufacturing Ltd." className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#4285F4] transition-all" value={info.companyName} onChange={e => setInfo({...info, companyName: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Official Email Address</label>
              <input required type="email" placeholder="name@company.com" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#4285F4] transition-all" value={info.email} onChange={e => setInfo({...info, email: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Professional Role</label>
              <input required type="text" placeholder="e.g. Plant Head / VP Operations" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#4285F4] transition-all" value={info.designation} onChange={e => setInfo({...info, designation: e.target.value})} />
            </div>
          </div>
          <button type="submit" disabled={isProcessing} className="w-full py-5 bg-[#4285F4] hover:bg-[#1A73E8] text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-[#4285F4]/20 active:scale-[0.98] mt-4">
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting...
              </span>
            ) : 'Enter Assessment Environment'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-8 text-center relative z-10">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Verification</h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">Validation code requested for {info.email}</p>
          </div>
          <div className="flex justify-between gap-2 max-w-sm mx-auto">
            {otpInput.map((d, i) => (
              <input key={i} id={`otp-${i}`} maxLength={1} value={d} onChange={e => handleOtpChange(e.target.value, i)} className="w-full p-4 border border-gray-100 rounded-2xl text-center text-2xl font-black text-[#4285F4] bg-gray-50 outline-none focus:ring-2 focus:ring-[#4285F4] transition-all shadow-sm" />
            ))}
          </div>
          <div className="space-y-4">
            <button type="submit" className="w-full py-5 bg-[#4285F4] hover:bg-[#1A73E8] text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-[#4285F4]/20 active:scale-[0.98]">
              Confirm Identity
            </button>
            <div className="flex flex-col gap-3">
               <button type="button" onClick={() => handleSendOtp()} disabled={isProcessing} className="text-[10px] font-black text-[#4285F4] uppercase tracking-widest hover:underline transition-all">
                {isProcessing ? 'Resending...' : 'Request New Code'}
              </button>
              <button type="button" onClick={() => setStep('info')} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors">
                Back to Information Step
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default AuthForm;