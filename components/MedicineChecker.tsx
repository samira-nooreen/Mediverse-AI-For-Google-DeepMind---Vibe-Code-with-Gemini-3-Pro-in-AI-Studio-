import React, { useState } from 'react';
import { FileUploader, LoadingResult, ExportButton, urlToFile } from './Shared';
import { analyzeMedicines } from '../services/geminiService';
import { MedicineResponse } from '../types';
import { Pill, ShieldAlert, Calendar, AlertCircle, Loader2 } from 'lucide-react';

const MedicineChecker: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<MedicineResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSample = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      // Reliable pills image
      const sampleFile = await urlToFile(
        'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?fm=jpg&fit=crop&w=400&q=60',
        'medication_pills.jpg',
        'image/jpeg'
      );
      setFiles([sampleFile]);
    } catch (e) {
      console.error(e);
      setError("Failed to load sample image (likely browser network/CORS issue). Please try uploading a local image instead.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (files.length === 0) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const data = await analyzeMedicines(files);
      if (!data || (!data.medicines && !data.interactions)) {
        throw new Error("Invalid response from AI");
      }
      setResult(data);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Analysis failed. Please try again or use a clearer image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Pill className="text-purple" /> Medicine Clash Detector
        </h2>
        <FileUploader 
          onFilesSelected={setFiles} 
          files={files}
          multiple
          label="Upload Pills or Prescriptions"
          onUseSample={handleSample}
        />

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
             <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
             <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={files.length === 0 || loading}
          className="w-full mt-6 bg-purple text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-purple/30 hover:shadow-xl hover:bg-purple/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.99] flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Checking Interactions...
            </>
          ) : (
            'Check Safety'
          )}
        </button>
      </div>

      {loading && <LoadingResult />}

      {result && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex justify-end">
            <ExportButton data={result} filename="medicine-safety-report.json" />
          </div>

          {result.interactions && result.interactions.length > 0 && (
             <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                <h3 className="text-red-800 font-bold flex items-center gap-2 mb-3">
                  <ShieldAlert className="w-5 h-5" /> Warning: Interactions Detected
                </h3>
                <ul className="list-disc list-inside text-red-700 space-y-1">
                  {result.interactions.map((interaction, i) => (
                    <li key={i}>{interaction}</li>
                  ))}
                </ul>
             </div>
          )}

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-slate-900">
              <Pill className="w-5 h-5 text-slate-400" /> Identified Medicines
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.medicines && result.medicines.map((med, i) => (
                <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                  {med}
                </span>
              ))}
              {(!result.medicines || result.medicines.length === 0) && (
                <span className="text-slate-500 italic text-sm">No medicines identified.</span>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-slate-900">
              <Calendar className="w-5 h-5 text-slate-400" /> Dosage Schedule
            </h3>
            <div className="p-4 bg-blue-50 rounded-xl text-blue-900 text-sm whitespace-pre-wrap">
              {result.schedule || "No schedule available."}
            </div>
          </div>
          
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-semibold mb-4 text-orange-600">Side Effect Warnings</h3>
            <ul className="list-disc list-inside text-slate-600 text-sm space-y-2">
              {result.warnings && result.warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
              {(!result.warnings || result.warnings.length === 0) && (
                <li className="text-slate-400 italic">None detected.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineChecker;