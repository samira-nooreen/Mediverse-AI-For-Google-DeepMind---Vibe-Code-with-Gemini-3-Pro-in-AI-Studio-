import React, { useState } from 'react';
import { FileUploader, LoadingResult, ExportButton, urlToFile } from './Shared';
import { analyzeNavigation } from '../services/geminiService';
import { NavResponse } from '../types';
import { MapPin, Navigation, Clock, AlertCircle, Loader2 } from 'lucide-react';

const HospitalNav: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [destination, setDestination] = useState('');
  const [result, setResult] = useState<NavResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSample = async () => {
    setLoading(true);
    setError(null);
    try {
      // Reliable Hospital Corridor Image
      const sampleFile = await urlToFile(
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?fm=jpg&fit=crop&w=400&q=60',
        'hospital_hallway.jpg',
        'image/jpeg'
      );
      setFile(sampleFile);
      setDestination('Radiology Department');
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Failed to load sample. Please check your connection or upload an image.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !destination) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await analyzeNavigation(file, destination);
      if (!data || !data.location) {
         throw new Error("AI could not identify the location. Please try a clearer image.");
      }
      setResult(data);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Failed to call the Gemini API. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Navigation className="text-cyan-500" /> Indoor Navigation
        </h2>
        
        <div className="space-y-4">
          <FileUploader 
            onFilesSelected={(files) => setFile(files[0])} 
            files={file ? [file] : []}
            label="Upload Photo of Sign or Map"
            onUseSample={handleSample}
          />
          
          <input
            type="text"
            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cyan-500 outline-none bg-white text-slate-900 placeholder:text-slate-400"
            placeholder="Where do you want to go? (e.g. Radiology, Lab)"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-fade-in">
               <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
               <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading || (!file || !destination)}
            className="w-full bg-cyan-600 text-white py-3 rounded-xl font-semibold hover:bg-cyan-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Finding Route...
              </>
            ) : (
              'Get Directions'
            )}
          </button>
        </div>
      </div>

      {loading && <LoadingResult />}

      {result && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-fade-in">
           <div className="flex justify-between items-start mb-4">
             <div className="flex items-center gap-2 text-cyan-700 font-semibold bg-cyan-50 p-3 rounded-lg">
               <MapPin className="w-5 h-5" />
               You are at: {result.location}
             </div>
             <ExportButton data={result} filename="navigation-route.json" />
           </div>

           <div className="space-y-6">
             <div>
               <h3 className="font-bold text-slate-900 mb-2">Suggested Route</h3>
               <p className="text-lg text-slate-700 font-medium leading-relaxed">{result.route}</p>
             </div>
             
             <div className="flex gap-4">
                <div className="flex-1 bg-slate-50 p-4 rounded-xl">
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Distance / Time</div>
                  <div className="font-bold text-slate-800 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> {result.distanceTime}
                  </div>
                </div>
                <div className="flex-1 bg-slate-50 p-4 rounded-xl">
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Delays</div>
                  <div className="font-bold text-orange-600 text-sm">
                    {result.delays || "None reported"}
                  </div>
                </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default HospitalNav;