import React, { useState, useEffect } from 'react';
import { AppModule } from '../types';
import ERTriage from './ERTriage';
import QueuePredictor from './QueuePredictor';
import MedicineChecker from './MedicineChecker';
import SymptomDiary from './SymptomDiary';
import DischargeExplainer from './DischargeExplainer';
import SurgicalRisk from './SurgicalRisk';
import HospitalNav from './HospitalNav';
import { Activity, Users, Pill, BookOpen, FileText, HeartPulse, Navigation, Menu, X, Home } from 'lucide-react';

interface DashboardProps {
  initialTab: AppModule;
  onGoHome: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ initialTab, onGoHome }) => {
  const [activeTab, setActiveTab] = useState<AppModule>(initialTab);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const tabs = [
    { id: AppModule.TRIAGE, label: 'ER Triage', icon: Activity, color: 'text-alert' },
    { id: AppModule.QUEUE, label: 'Queue Predictor', icon: Users, color: 'text-electric-cyan' },
    { id: AppModule.MEDICINE, label: 'Medicine Checker', icon: Pill, color: 'text-purple' },
    { id: AppModule.DIARY, label: 'Symptom Diary', icon: BookOpen, color: 'text-neon-green' },
    { id: AppModule.DISCHARGE, label: 'Discharge Summary', icon: FileText, color: 'text-electric-blue' },
    { id: AppModule.SURGERY, label: 'Surgical Risk', icon: HeartPulse, color: 'text-alert' },
    { id: AppModule.NAV, label: 'Navigation', icon: Navigation, color: 'text-warning' },
  ];

  return (
    <div className="min-h-screen bg-navy-900 flex text-slate-200">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation - Deep Navy */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-navy-900 border-r border-white/10 transform transition-transform duration-200 ease-in-out flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-electric-blue to-electric-cyan bg-clip-text text-transparent">
            Mediverse AI
          </h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <button
            onClick={onGoHome}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium text-slate-400 hover:bg-white/5 hover:text-white mb-6"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
          
          <div className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Modules</div>

          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium ${
                  isActive 
                    ? 'bg-gradient-to-r from-electric-blue/20 to-electric-cyan/10 text-electric-cyan border border-electric-blue/30 shadow-[0_0_15px_rgba(0,207,255,0.1)]' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-electric-cyan' : tab.color} ${isActive ? 'drop-shadow-[0_0_5px_rgba(0,207,255,0.8)]' : ''}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Guest Status in Sidebar */}
        <div className="p-4 border-t border-white/10 bg-navy-800/50">
             <div className="bg-white/5 p-4 rounded-xl text-xs text-slate-400 border border-white/5">
               <p className="font-bold text-white mb-1">Medical Guest</p>
               <p>Open Access Mode.</p>
             </div>
        </div>
      </aside>

      {/* Main Content Area - Deep Navy background with Light Cards */}
      <main className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-electric-blue/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-4 lg:hidden sticky top-0 z-30 bg-navy-900/80 backdrop-blur-md">
          <h1 className="font-bold text-electric-cyan">Mediverse AI</h1>
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-300">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-6xl mx-auto w-full relative z-10">
           <div className="mb-8 animate-fade-in-up">
             <div className="flex items-center justify-between">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
                  {tabs.find(t => t.id === activeTab)?.label}
                </h2>
             </div>
             <p className="text-slate-400 mt-1 text-lg">
               {activeTab === AppModule.TRIAGE && "Real-time AI assessment for injuries and emergencies."}
               {activeTab === AppModule.QUEUE && "Estimate hospital wait times using crowd analysis."}
               {activeTab === AppModule.MEDICINE && "Check pill interactions and safety schedules instantly."}
               {activeTab === AppModule.DIARY && "Track your recovery with daily multimodal updates."}
               {activeTab === AppModule.DISCHARGE && "Simplify complex hospital documents into plain language."}
               {activeTab === AppModule.SURGERY && "Analyze surgical risks and get preparation checklists."}
               {activeTab === AppModule.NAV && "Navigate hospital corridors with ease."}
             </p>
           </div>

           {/* 
              Module Container:
              Ensuring readability by resetting text color to dark for the inner components 
              since the components (ERTriage, etc.) rely on bg-white and standard text colors.
            */}
           <div className="animate-fade-in-up-delay-1 text-slate-900">
             {activeTab === AppModule.TRIAGE && <ERTriage />}
             {activeTab === AppModule.QUEUE && <QueuePredictor />}
             {activeTab === AppModule.MEDICINE && <MedicineChecker />}
             {activeTab === AppModule.DIARY && <SymptomDiary />}
             {activeTab === AppModule.DISCHARGE && <DischargeExplainer />}
             {activeTab === AppModule.SURGERY && <SurgicalRisk />}
             {activeTab === AppModule.NAV && <HospitalNav />}
           </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;