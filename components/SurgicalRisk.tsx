import React, { useState } from 'react';
import { FileUploader, LoadingResult, ExportButton, urlToFile } from './Shared';
import { analyzeSurgicalRisk } from '../services/geminiService';
import { RiskResponse } from '../types';
import { Activity, ClipboardCheck, BarChart2, Loader2, Check } from 'lucide-react';

// Helper to split CamelCase if the AI returns it compressed
const formatRiskName = (name: string) => {
  return name.replace(/([A-Z])/g, ' $1').trim().replace(/  +/g, ' ');
};

const SurgicalRisk: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [vitals, setVitals] = useState('');
  const [result, setResult] = useState<RiskResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSample = async () => {
    setLoading(true);
    try {
      // Reliable lab/science image
      const sampleFile = await urlToFile(
        'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?fm=jpg&fit=crop&w=400&q=60',
        'blood_test_results.jpg',
        'image/jpeg'
      );
      setFiles([sampleFile]);
      setVitals('Age: 68, BP: 145/90, HR: 82, History: Type 2 Diabetes, Smoker (10 years). Scheduled for: Hip Replacement.');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (files.length === 0 && !vitals) return;
    setLoading(true);
    try {
      const data = await analyzeSurgicalRisk(files, vitals);
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Activity className="text-alert" /> Surgical Risk Visualizer
        </h2>
        
        <div className="space-y-4">
          <FileUploader 
            onFilesSelected={setFiles} 
            files={files}
            multiple
            accept="image/*,application/pdf"
            label="Upload Lab Reports (Image/PDF)"
            onUseSample={handleSample}
          />

          <textarea
            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-alert outline-none resize-none h-24 bg-white text-slate-900 placeholder:text-slate-400"
            placeholder="Enter key vitals (e.g., BP 120/80, HR 72, Age 65)..."
            value={vitals}
            onChange={(e) => setVitals(e.target.value)}
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || (files.length === 0 && !vitals)}
            className="w-full mt-2 bg-alert text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-alert/30 hover:shadow-xl hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.99] flex items-center justify-center gap-2"
          >
            {loading ? (
               <>
                 <Loader2 className="w-5 h-5 animate-spin" /> Analyzing Risk...
               </>
            ) : (
              'Calculate Risk Profile'
            )}
          </button>
        </div>
      </div>

      {loading && <LoadingResult />}

      {result && (
        <div className="animate-fade-in space-y-6">
          <div className="flex justify-end">
             <ExportButton data={result} filename="surgical-risk-assessment.json" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Score Circle */}
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                   <svg className="transform -rotate-90 w-40 h-40">
                     <circle cx="80" cy="80" r="70" stroke="#f1f5f9" strokeWidth="12" fill="none" />
                     <circle 
                        cx="80" cy="80" r="70" 
                        stroke={result.riskScore < 40 ? '#22c55e' : result.riskScore < 70 ? '#eab308' : '#ef4444'} 
                        strokeWidth="12" 
                        strokeLinecap="round"
                        fill="none" 
                        strokeDasharray={440} 
                        strokeDashoffset={440 - (440 * result.riskScore) / 100}
                        className="transition-all duration-1000 ease-out"
                     />
                   </svg>
                   <div className="absolute flex flex-col items-center">
                     <span className="text-4xl font-extrabold text-slate-800">{result.riskScore}%</span>
                     <span className={`text-xs font-bold uppercase tracking-wider ${
                        result.riskScore < 40 ? 'text-green-600' : result.riskScore < 70 ? 'text-yellow-600' : 'text-red-600'
                     }`}>
                       {result.riskScore < 40 ? 'Low Risk' : result.riskScore < 70 ? 'Moderate' : 'High Risk'}
                     </span>
                   </div>
                </div>
                <div className="font-semibold text-slate-600">Surgical Risk Score</div>
                <p className="text-xs text-slate-400 mt-2 max-w-[200px]">{result.analysis}</p>
             </div>

             {/* Risk Factors List */}
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-slate-800">
                  <BarChart2 className="w-5 h-5 text-alert" /> Risk Factors
                </h3>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {result.riskFactors.map((factor, i) => (
                    <div key={i} className="group">
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium text-slate-700">{formatRiskName(factor.name)}</span>
                        <span className={`font-bold ${factor.value > 7 ? 'text-red-500' : 'text-slate-500'}`}>
                          {factor.value}/10
                        </span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          style={{width: `${factor.value * 10}%`}} 
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${
                            factor.value > 7 ? 'bg-red-500' : factor.value > 4 ? 'bg-orange-400' : 'bg-green-500'
                          }`} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-slate-800">
              <ClipboardCheck className="text-blue-500 w-5 h-5" /> 7-Day Prep Checklist
            </h3>
            <div className="space-y-3">
              {result.checklist.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-transparent hover:border-slate-200">
                  <div className="mt-1 w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center flex-shrink-0 text-transparent hover:border-blue-500 hover:text-blue-500 cursor-pointer transition-all">
                     <Check className="w-3 h-3" />
                  </div>
                  <span className="text-sm text-slate-700 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurgicalRisk;