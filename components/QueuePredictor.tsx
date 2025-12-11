import React, { useState } from 'react';
import { FileUploader, LoadingResult, ExportButton, urlToFile } from './Shared';
import { analyzeQueue } from '../services/geminiService';
import { QueueResponse } from '../types';
import { Users, Clock, TrendingDown } from 'lucide-react';

const QueuePredictor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<QueueResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSample = async () => {
    setLoading(true);
    try {
      // Reliable waiting room image
      const sampleFile = await urlToFile(
        'https://images.unsplash.com/photo-1516321497487-e288fb19713f?fm=jpg&fit=crop&w=400&q=60',
        'waiting_room.jpg',
        'image/jpeg'
      );
      setFile(sampleFile);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const data = await analyzeQueue(file);
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
          <Users className="text-blue-500" /> Queue Load Predictor
        </h2>
        <FileUploader 
          onFilesSelected={(files) => setFile(files[0])}
          files={file ? [file] : []}
          label="Upload Photo of Waiting Hall"
          onUseSample={handleSample}
        />

        <button
          onClick={handleAnalyze}
          disabled={!file || loading}
          className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Estimating...' : 'Predict Wait Time'}
        </button>
      </div>

      {loading && <LoadingResult />}

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
            <Clock className="w-8 h-8 text-orange-500 mb-2" />
            <div className="text-3xl font-bold text-slate-900">{result.waitTimeMinutes} min</div>
            <div className="text-sm text-slate-500">Est. Wait Time</div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
            <Users className="w-8 h-8 text-blue-500 mb-2" />
            <div className="text-3xl font-bold text-slate-900">{result.patientCount}</div>
            <div className="text-sm text-slate-500">Patients Detected</div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
            <TrendingDown className="w-8 h-8 text-green-500 mb-2" />
            <div className="text-lg font-bold text-slate-900">{result.lowTrafficWindow}</div>
            <div className="text-sm text-slate-500">Best Time to Visit</div>
          </div>

          <div className="md:col-span-3 bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-800 text-sm text-center">
            <strong>Crowd Status:</strong> {result.crowdStatus}
          </div>
          
          <div className="md:col-span-3 flex justify-end">
             <ExportButton data={result} filename="queue-analysis.json" />
          </div>
        </div>
      )}
    </div>
  );
};

export default QueuePredictor;