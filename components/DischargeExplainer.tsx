import React, { useState } from 'react';
import { FileUploader, LoadingResult, ExportButton, urlToFile } from './Shared';
import { analyzeDischarge } from '../services/geminiService';
import { DischargeResponse } from '../types';
import { FileText, CheckSquare, AlertCircle } from 'lucide-react';

const DischargeExplainer: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<DischargeResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSample = async () => {
    setLoading(true);
    try {
      // Reliable document image
      const sampleFile = await urlToFile(
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?fm=jpg&fit=crop&w=400&q=60',
        'discharge_document.jpg',
        'image/jpeg'
      );
      setFiles([sampleFile]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (files.length === 0) return;
    setLoading(true);
    try {
      const data = await analyzeDischarge(files);
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
          <FileText className="text-indigo-500" /> Discharge Summary Explainer
        </h2>
        <FileUploader 
          onFilesSelected={setFiles} 
          files={files}
          multiple
          accept="image/*,application/pdf"
          label="Upload Discharge Documents (Image/PDF)"
          onUseSample={handleSample}
        />

        <button
          onClick={handleAnalyze}
          disabled={files.length === 0 || loading}
          className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Simplifying...' : 'Simplify Report'}
        </button>
      </div>

      {loading && <LoadingResult />}

      {result && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <ExportButton data={result} filename="simplified-discharge-summary.json" />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-900 mb-2">Simplified Summary</h3>
            <p className="text-slate-600 leading-relaxed">{result.summary}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <h4 className="font-semibold mb-3 flex items-center gap-2">
                 <CheckSquare className="w-4 h-4 text-green-500" /> Reminders
               </h4>
               <ul className="space-y-2 text-sm text-slate-700">
                 {result.reminders.map((r, i) => <li key={i}>• {r}</li>)}
               </ul>
             </div>

             <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
               <h4 className="font-semibold mb-3 flex items-center gap-2 text-red-800">
                 <AlertCircle className="w-4 h-4" /> Danger Signs
               </h4>
               <ul className="space-y-2 text-sm text-red-700">
                 {result.dangerSigns.map((d, i) => <li key={i}>• {d}</li>)}
               </ul>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DischargeExplainer;