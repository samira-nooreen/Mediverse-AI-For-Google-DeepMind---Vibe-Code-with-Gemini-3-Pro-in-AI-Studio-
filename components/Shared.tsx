import React, { useRef, useState } from 'react';
import { Upload, X, Mic, Square, Loader2, Download, Sparkles, File as FileIcon } from 'lucide-react';

export const urlToFile = async (url: string, filename: string, mimeType: string): Promise<File> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch sample image (Status: ${response.status}). Please try uploading your own.`);
  }
  const blob = await response.blob();
  // Use the actual blob type if available, otherwise fallback to the provided mimeType
  const actualType = blob.type || mimeType;
  return new File([blob], filename, { type: actualType });
};

export const FileUploader: React.FC<{
  onFilesSelected: (files: File[]) => void;
  files: File[];
  label: string;
  accept?: string;
  multiple?: boolean;
  onUseSample?: () => void;
}> = ({ onFilesSelected, files, label, accept = "image/*", multiple = false, onUseSample }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      onFilesSelected(newFiles);
    }
  };

  return (
    <div className="space-y-3">
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-electric-blue hover:bg-slate-50 transition-all group"
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept={accept} 
          multiple={multiple} 
          onChange={handleFileChange} 
        />
        <div className="bg-slate-100 p-3 rounded-full mb-3 group-hover:bg-blue-100 transition-colors">
          <Upload className="w-6 h-6 text-slate-500 group-hover:text-electric-blue" />
        </div>
        <p className="text-sm font-semibold text-slate-600 group-hover:text-slate-800">{label}</p>
        <p className="text-xs text-slate-400 mt-1">Click to browse</p>
      </div>

      {onUseSample && (
        <button
          onClick={onUseSample}
          className="text-xs font-semibold text-electric-blue hover:text-electric-cyan transition-colors flex items-center gap-1 mx-auto"
        >
          <Sparkles className="w-3 h-3" /> Use Sample Data
        </button>
      )}

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700">
               <FileIcon className="w-3 h-3" />
               <span className="truncate max-w-[150px]">{f.name}</span>
               <button onClick={(e) => {
                 e.stopPropagation();
                 onFilesSelected(files.filter((_, idx) => idx !== i));
               }} className="text-slate-400 hover:text-red-500">
                 <X className="w-3 h-3" />
               </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const AudioRecorder: React.FC<{ onAudioReady: (file: File) => void }> = ({ onAudioReady }) => {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const file = new File([blob], "voice_note.webm", { type: 'audio/webm' });
        onAudioReady(file);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access denied or not available.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <button
      onClick={recording ? stopRecording : startRecording}
      className={`p-3 rounded-full transition-all ${
        recording 
          ? 'bg-red-100 text-red-600 animate-pulse' 
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }`}
    >
      {recording ? <Square className="w-5 h-5 fill-current" /> : <Mic className="w-5 h-5" />}
    </button>
  );
};

export const LoadingResult = () => (
  <div className="flex flex-col items-center justify-center py-12 text-slate-400 animate-pulse">
    <Loader2 className="w-8 h-8 animate-spin mb-3 text-electric-blue" />
    <p className="text-sm font-medium">Processing with Gemini Pro...</p>
  </div>
);

export const ExportButton: React.FC<{ data: any, filename: string }> = ({ data, filename }) => {
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={handleExport} className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-electric-blue transition-colors">
      <Download className="w-3 h-3" /> Export JSON
    </button>
  );
};