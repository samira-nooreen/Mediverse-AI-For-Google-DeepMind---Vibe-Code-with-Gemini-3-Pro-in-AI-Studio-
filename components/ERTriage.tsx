import React, { useState } from 'react';
import { FileUploader, AudioRecorder, LoadingResult, ExportButton, urlToFile } from './Shared';
import { analyzeTriage } from '../services/geminiService';
import { TriageResponse } from '../types';
import { AlertTriangle, CheckCircle, Ambulance, Activity } from 'lucide-react';

const ERTriage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState<TriageResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSample = async () => {
    setLoading(true);
    try {
      // Reliable patient image
      const file = await urlToFile(
        'https://images.unsplash.com/photo-1584518969469-c2d99c7760a0?fm=jpg&fit=crop&w=400&q=60',
        'injured_arm.jpg',
        'image/jpeg'
      );
      setFiles([file]);
      setSymptoms('Severe throbbing pain in right arm after a fall. Swelling is visible and I cannot move my wrist.');
    } catch (e) {
      console.error("Error loading sample", e);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (files.length === 0 && !symptoms) return;
    setLoading(true);
    try {
      const data = await analyzeTriage(files, symptoms);
      setResult(data);
    } catch (e) {
      console.error(e);
      alert("Failed to analyze. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Activity className="text-red-500" /> AI ER Triage
        </h2>
        
        <div className="space-y-4">
          <FileUploader 
            onFilesSelected={setFiles} 
            files={files}
            label="Upload Injury Photo or Video"
            accept="image/*,video/*"
            onUseSample={handleSample}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <textarea
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none h-32 bg-white text-slate-900 placeholder:text-slate-400"
              placeholder="Describe symptoms..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
            />
            <div className="flex flex-col justify-center items-center bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-sm text-slate-500 mb-2">Or speak symptoms</p>
                <AudioRecorder onAudioReady={(file) => setFiles(prev => [...prev, file])} />
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || (files.length === 0 && !symptoms)}
            className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors shadow-lg shadow-red-200"
          >
            {loading ? 'Analyzing...' : 'Assess Priority'}
          </button>
        </div>
      </div>

      {loading && <LoadingResult />}

      {result && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-fade-in">
          <div className="flex justify-between items-start mb-4">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold ${
              result.priority === 'Red' ? 'bg-red-100 text-red-700' :
              result.priority === 'Yellow' ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            }`}>
              <AlertTriangle className="w-4 h-4" />
              Priority: {result.priority}
            </div>
            <ExportButton data={result} filename="triage-report.json" />
          </div>

          <h3 className="text-2xl font-bold text-slate-900 mb-2">{result.condition}</h3>
          <p className="text-slate-600 mb-6">{result.explanation}</p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-4 rounded-xl">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-500" /> First Aid Steps
              </h4>
              <ul className="space-y-2">
                {result.steps.map((step, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-700">
                    <span className="font-bold text-slate-400">{i + 1}.</span> {step}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl flex flex-col justify-center items-center text-center">
              {result.visitNeeded ? (
                <>
                  <Ambulance className="w-12 h-12 text-red-500 mb-2" />
                  <div className="font-bold text-slate-900">Hospital Visit Required</div>
                  <p className="text-xs text-slate-500 mt-1">Please proceed to the nearest ER immediately.</p>
                </>
              ) : (
                <>
                  <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
                  <div className="font-bold text-slate-900">Home Care Sufficient</div>
                  <p className="text-xs text-slate-500 mt-1">Monitor symptoms and rest.</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ERTriage;