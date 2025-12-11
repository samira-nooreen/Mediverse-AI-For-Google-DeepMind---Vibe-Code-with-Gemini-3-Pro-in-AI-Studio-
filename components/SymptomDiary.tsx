import React, { useState } from 'react';
import { FileUploader, AudioRecorder, LoadingResult, ExportButton, urlToFile } from './Shared';
import { analyzeSymptomDiary } from '../services/geminiService';
import { DiaryResponse } from '../types';
import { BookOpen, TrendingUp, History } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface DiaryEntry {
  date: string;
  score: number;
  report: string;
}

const SymptomDiary: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<DiaryEntry[]>([
    { date: 'Mon', score: 4, report: 'Initial severe pain.' },
    { date: 'Tue', score: 5, report: 'Slight improvement.' },
    { date: 'Wed', score: 6, report: 'Less pain in morning.' },
  ]);
  const [latestReport, setLatestReport] = useState<DiaryResponse | null>(null);

  const handleSample = async () => {
    setLoading(true);
    try {
      // Reliable patient image
      const sampleFile = await urlToFile(
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?fm=jpg&fit=crop&w=400&q=60',
        'patient_checkup.jpg',
        'image/jpeg'
      );
      setFiles([sampleFile]);
      setNotes('Pain level has decreased significantly today. The redness around the area is fading, and I can move my arm more freely.');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!notes && files.length === 0) return;
    setLoading(true);
    
    // Simulate context from previous entries
    const context = history.map(h => `${h.date}: Score ${h.score}`).join('; ');
    
    try {
      const data = await analyzeSymptomDiary(files, notes, context);
      setLatestReport(data);
      
      const newEntry: DiaryEntry = {
        date: 'Today',
        score: data.score,
        report: data.report
      };
      setHistory(prev => [...prev, newEntry]);
      setFiles([]);
      setNotes('');
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
          <BookOpen className="text-teal-500" /> Daily Symptom Diary
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <textarea
             className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none resize-none h-32 bg-white text-slate-900 placeholder:text-slate-400"
             placeholder="How do you feel today?"
             value={notes}
             onChange={(e) => setNotes(e.target.value)}
          />
           <div className="flex flex-col gap-2">
            <FileUploader 
              onFilesSelected={setFiles} 
              files={files}
              label="Upload Photo (Selfie/Area)" 
              onUseSample={handleSample} 
            />
            <div className="flex justify-center bg-slate-50 p-2 rounded-xl border border-slate-200">
               <AudioRecorder onAudioReady={(f) => setFiles(prev => [...prev, f])} />
            </div>
           </div>
        </div>

        <button
          onClick={handleUpdate}
          disabled={loading || (!notes && files.length === 0)}
          className="w-full bg-teal-600 text-white py-3 rounded-xl font-semibold hover:bg-teal-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Updating...' : 'Log Update'}
        </button>
      </div>

      {loading && <LoadingResult />}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold flex items-center gap-2">
            <TrendingUp className="text-blue-500" /> Recovery Timeline
          </h3>
          <ExportButton data={{ history, latestReport }} filename="symptom-diary.json" />
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <YAxis domain={[0, 10]} hide />
              <Tooltip 
                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#0d9488" 
                strokeWidth={3} 
                dot={{fill: '#0d9488', strokeWidth: 2, r: 4}} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {latestReport && (
        <div className="bg-teal-50 p-6 rounded-2xl border border-teal-100 animate-fade-in">
           <div className="flex items-center justify-between mb-2">
             <h3 className="font-bold text-teal-900">Today's Doctor Report</h3>
             <span className="text-2xl font-bold text-teal-600">{latestReport.score}/10</span>
           </div>
           <p className="text-teal-800 text-sm mb-2 font-medium">Probable: {latestReport.diagnosis}</p>
           <p className="text-teal-700 text-sm">{latestReport.report}</p>
        </div>
      )}
    </div>
  );
};

export default SymptomDiary;