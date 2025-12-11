import React, { useState } from 'react';
import { AppModule } from '../types';
import { 
  Activity, Users, Pill, BookOpen, FileText, HeartPulse, Navigation, 
  ArrowRight, Shield, Clock, Brain, Play, Zap,
  ChevronDown, HelpCircle, Bell, Calendar, BarChart3, User as UserIcon, Building2
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (module: AppModule) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const features = [
    { id: AppModule.TRIAGE, label: 'AI ER Triage', desc: 'Instant injury analysis via photo or voice.', icon: Activity, color: 'text-alert' },
    { id: AppModule.QUEUE, label: 'Queue Load Predictor', desc: 'Live crowd estimation & wait times.', icon: Users, color: 'text-electric-cyan' },
    { id: AppModule.MEDICINE, label: 'Medicine Clash Detector', desc: 'Drug interaction safety scanner.', icon: Pill, color: 'text-purple' },
    { id: AppModule.DIARY, label: 'Symptom Diary', desc: 'Daily multimodal recovery tracking.', icon: BookOpen, color: 'text-neon-green' },
    { id: AppModule.DISCHARGE, label: 'Discharge Summary Explainer', desc: 'Translate medical docs to plain text.', icon: FileText, color: 'text-electric-blue' },
    { id: AppModule.SURGERY, label: 'Surgical Risk Visualizer', desc: 'Pre-op risk analysis & checklists.', icon: HeartPulse, color: 'text-alert' },
    { id: AppModule.NAV, label: 'Hospital Indoor Navigation', desc: 'Find your way inside the hospital.', icon: Navigation, color: 'text-warning' },
  ];

  const faqs = [
    {
      q: "How does MediAssist predict patient health trends?",
      a: "Using real-time AI analytics to provide intelligent alerts and predictions for patient care."
    },
    {
      q: "Can I customize alerts and notifications?",
      a: "Yes! Tailor thresholds, notification types, and modules to your workflow."
    },
    {
      q: "Is patient data secure?",
      a: "End-to-end encryption and HIPAA-compliant protocols ensure complete data safety."
    },
    {
      q: "Can I access MediAssist on mobile devices?",
      a: "Fully responsive design allows secure access on phones and tablets."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 text-slate-200 font-sans selection:bg-electric-blue selection:text-white">
      {/* Navigation Bar */}
      <nav className="fixed w-full z-50 bg-navy-900/80 backdrop-blur-lg border-b border-white/10 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-electric-blue to-electric-cyan rounded-xl flex items-center justify-center shadow-neon-blue">
                <Brain className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                Mediverse AI
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('hero')} className="text-slate-300 hover:text-electric-cyan font-medium transition-colors">Home</button>
              <button onClick={() => scrollToSection('features')} className="text-slate-300 hover:text-electric-cyan font-medium transition-colors">Features</button>
              <button onClick={() => scrollToSection('about')} className="text-slate-300 hover:text-electric-cyan font-medium transition-colors">About</button>
              <button onClick={() => scrollToSection('faq')} className="text-slate-300 hover:text-electric-cyan font-medium transition-colors">FAQ</button>
              
              <button 
                onClick={() => onNavigate(AppModule.TRIAGE)}
                className="bg-gradient-to-r from-electric-blue to-electric-cyan text-white px-6 py-2.5 rounded-full font-bold hover:shadow-neon-blue transition-all"
              >
                Launch App
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden pointer-events-none">
           <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-electric-blue/20 rounded-full blur-[120px] animate-float"></div>
           <div className="absolute bottom-[10%] right-[20%] w-[500px] h-[500px] bg-neon-green/10 rounded-full blur-[120px] animate-float" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-electric-cyan rounded-full text-sm font-bold mb-8 animate-fade-in-up backdrop-blur-md">
            <Zap className="w-4 h-4 fill-current" /> Next-Gen Healthcare 2025
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tight animate-fade-in-up-delay-1 leading-tight">
            The Future of <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue via-electric-cyan to-aqua">Hospital Intelligence</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up-delay-2">
            Mediverse AI combines Gemini 3 Pro reasoning with real-time diagnostics to create the world's first fully multimodal medical assistant.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center animate-fade-in-up-delay-2">
            <button 
              onClick={() => onNavigate(AppModule.TRIAGE)}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-electric-blue to-electric-cyan text-white rounded-full font-bold text-lg hover:shadow-neon-blue transition-all flex items-center justify-center gap-2 group transform hover:scale-105"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-colors backdrop-blur-md"
            >
              Explore Modules
            </button>
          </div>
        </div>
      </section>

      {/* Hero Section 3: Real-Time Insights */}
      <section className="py-24 bg-gradient-to-b from-navy-900 to-navy-800 relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-cyan/10 text-electric-cyan text-sm font-bold mb-6 border border-electric-cyan/20">
              <Activity className="w-4 h-4" /> Live Monitoring
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Monitor Patient Health in <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-electric-cyan">Real-Time</span>
            </h2>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              Get live vitals, predictive alerts, and instant insights for smarter care decisions. 
              Our system constantly analyzes data streams to detect anomalies before they become critical.
            </p>
            <button 
              onClick={() => onNavigate(AppModule.TRIAGE)} 
              className="px-8 py-4 bg-gradient-to-r from-electric-blue to-aqua text-white rounded-full font-bold shadow-[0_0_20px_rgba(0,207,255,0.3)] hover:shadow-[0_0_30px_rgba(0,207,255,0.5)] transition-all transform hover:scale-105"
            >
              View Live Dashboard
            </button>
          </div>

          <div className="md:w-1/2 w-full">
            <div className="relative">
              <div className="absolute inset-0 bg-electric-blue/20 blur-[60px] rounded-full"></div>
              <div className="relative bg-navy-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                {/* Mock Header */}
                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                       <UserIcon className="w-6 h-6 text-slate-400" />
                     </div>
                     <div>
                       <div className="h-2 w-24 bg-slate-600 rounded mb-1"></div>
                       <div className="h-2 w-16 bg-slate-700 rounded"></div>
                     </div>
                   </div>
                   <div className="px-3 py-1 bg-neon-green/10 text-neon-green text-xs rounded-full border border-neon-green/20 animate-pulse">
                     Live
                   </div>
                </div>
                
                {/* Mock Chart Area */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                     <div className="text-slate-400 text-xs mb-1 font-semibold uppercase">Heart Rate</div>
                     <div className="text-2xl font-bold text-white flex items-end gap-2">
                       72 <span className="text-sm text-slate-500 mb-1">BPM</span>
                     </div>
                     {/* SVG Wave Animation */}
                     <svg className="w-full h-12 mt-2 stroke-alert fill-none" viewBox="0 0 100 30" preserveAspectRatio="none">
                       <path d="M0,15 Q10,15 15,15 T20,10 T25,20 T30,15 T40,15 T50,15 T60,5 T70,25 T80,15 T100,15" strokeWidth="2" vectorEffect="non-scaling-stroke">
                         <animate attributeName="d" dur="2s" repeatCount="indefinite" values="
                           M0,15 Q10,15 15,15 T20,10 T25,20 T30,15 T40,15 T50,15 T60,5 T70,25 T80,15 T100,15;
                           M0,15 Q10,15 15,15 T20,15 T25,15 T30,15 T40,15 T50,15 T60,15 T70,15 T80,15 T100,15;
                           M0,15 Q10,15 15,15 T20,10 T25,20 T30,15 T40,15 T50,15 T60,5 T70,25 T80,15 T100,15"
                         />
                       </path>
                     </svg>
                  </div>
                  <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                     <div className="text-slate-400 text-xs mb-1 font-semibold uppercase">Oxygen Level</div>
                     <div className="text-2xl font-bold text-white flex items-end gap-2">
                       98 <span className="text-sm text-slate-500 mb-1">%</span>
                     </div>
                     <div className="w-full bg-slate-700 h-1.5 rounded-full mt-6">
                       <div className="bg-electric-cyan h-1.5 rounded-full w-[98%] shadow-[0_0_10px_#00CFFF]"></div>
                     </div>
                  </div>
                </div>
                
                <div className="bg-electric-blue/10 p-4 rounded-xl border border-electric-blue/20 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="p-2 bg-electric-blue/20 rounded-lg">
                       <Zap className="w-5 h-5 text-electric-cyan" />
                     </div>
                     <div>
                       <div className="text-sm font-bold text-white">AI Analysis</div>
                       <div className="text-xs text-slate-400">Stable condition predicted</div>
                     </div>
                   </div>
                   <div className="text-electric-cyan font-bold text-sm">99.8% Conf.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section 4: AI-Powered Assistance */}
      <section className="py-24 bg-navy-900 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/5 to-purple/5 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-electric-cyan">AI-Powered</span> Assistance
            </h2>
            <p className="text-lg text-slate-400">
              Harness the power of Gemini 3 Pro to automate workflows and enhance patient safety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group relative bg-navy-800 rounded-3xl p-8 border border-white/5 hover:border-electric-cyan/30 transition-all duration-300 hover:-translate-y-2">
               <div className="absolute inset-0 bg-gradient-to-b from-electric-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
               <div className="w-14 h-14 bg-navy-900 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-white/5 group-hover:scale-110 transition-transform">
                 <Bell className="w-7 h-7 text-alert" />
               </div>
               <h3 className="text-xl font-bold text-white mb-3 group-hover:text-electric-cyan transition-colors">Predictive Alerts</h3>
               <p className="text-slate-400 leading-relaxed">Prevent complications before they happen with continuous autonomous monitoring.</p>
            </div>

            {/* Card 2 */}
            <div className="group relative bg-navy-800 rounded-3xl p-8 border border-white/5 hover:border-electric-cyan/30 transition-all duration-300 hover:-translate-y-2">
               <div className="absolute inset-0 bg-gradient-to-b from-electric-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
               <div className="w-14 h-14 bg-navy-900 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-white/5 group-hover:scale-110 transition-transform">
                 <Calendar className="w-7 h-7 text-purple" />
               </div>
               <h3 className="text-xl font-bold text-white mb-3 group-hover:text-electric-cyan transition-colors">Intelligent Scheduling</h3>
               <p className="text-slate-400 leading-relaxed">Optimize hospital resources and reduce wait times with smart queue management.</p>
            </div>

            {/* Card 3 */}
            <div className="group relative bg-navy-800 rounded-3xl p-8 border border-white/5 hover:border-electric-cyan/30 transition-all duration-300 hover:-translate-y-2">
               <div className="absolute inset-0 bg-gradient-to-b from-electric-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
               <div className="w-14 h-14 bg-navy-900 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-white/5 group-hover:scale-110 transition-transform">
                 <BarChart3 className="w-7 h-7 text-neon-green" />
               </div>
               <h3 className="text-xl font-bold text-white mb-3 group-hover:text-electric-cyan transition-colors">Data-Driven Insights</h3>
               <p className="text-slate-400 leading-relaxed">Make informed decisions faster than ever with real-time analytics dashboards.</p>
            </div>
          </div>
          
          <div className="mt-16 text-center">
             <button onClick={() => scrollToSection('features')} className="px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full font-bold text-white transition-all hover:scale-105 backdrop-blur-md">
               Discover All Features
             </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Comprehensive Care Suite</h2>
            <p className="text-lg text-slate-400">7 Powerful AI Modules. One Futuristic Interface.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => {
               const Icon = feature.icon;
               return (
                 <div 
                   key={idx}
                   onClick={() => onNavigate(feature.id)}
                   className="group p-8 rounded-3xl glass-card hover:bg-white/10 transition-all cursor-pointer relative overflow-hidden"
                 >
                   <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   
                   <div className={`w-14 h-14 bg-navy-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-white/5 shadow-lg`}>
                     <Icon className={`w-7 h-7 ${feature.color}`} />
                   </div>
                   
                   <h3 className="text-xl font-bold text-white mb-3 group-hover:text-electric-cyan transition-colors">{feature.label}</h3>
                   <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
                 </div>
               )
            })}
          </div>
        </div>
      </section>

      {/* About Section (Live Demo) */}
      <section id="about" className="py-24 bg-navy-800/30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid md:grid-cols-2 gap-16 items-center">
             <div className="relative z-10">
               <div className="inline-block px-4 py-1 bg-neon-green/10 text-neon-green rounded-full text-sm font-bold mb-6 border border-neon-green/20">
                 Why Mediverse?
               </div>
               <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
                 Bridging the Gap Between <br/> 
                 <span className="text-gradient">Patients & Hospitals</span>
               </h2>
               <div className="space-y-8">
                 <div className="flex gap-5">
                   <div className="w-12 h-12 bg-electric-blue/20 rounded-full flex items-center justify-center flex-shrink-0 border border-electric-blue/30">
                     <Shield className="w-6 h-6 text-electric-cyan" />
                   </div>
                   <div>
                     <h4 className="text-xl font-bold text-white mb-2">Safety First</h4>
                     <p className="text-slate-400">Real-time drug interaction checks and surgical risk analysis reduce medical errors by 40%.</p>
                   </div>
                 </div>
                 <div className="flex gap-5">
                   <div className="w-12 h-12 bg-neon-green/20 rounded-full flex items-center justify-center flex-shrink-0 border border-neon-green/30">
                     <Clock className="w-6 h-6 text-neon-green" />
                   </div>
                   <div>
                     <h4 className="text-xl font-bold text-white mb-2">Time Saving</h4>
                     <p className="text-slate-400">Predict queue times and triage injuries instantly before you even leave home.</p>
                   </div>
                 </div>
                 <div className="flex gap-5">
                   <div className="w-12 h-12 bg-purple/20 rounded-full flex items-center justify-center flex-shrink-0 border border-purple/30">
                     <Brain className="w-6 h-6 text-purple" />
                   </div>
                   <div>
                     <h4 className="text-xl font-bold text-white mb-2">Powered by Reasoning</h4>
                     <p className="text-slate-400">Utilizes Gemini 3 Pro to understand complex medical documents and spatial environments.</p>
                   </div>
                 </div>
               </div>
             </div>
             
             <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-electric-blue to-neon-green rounded-3xl transform rotate-3 blur-md opacity-20"></div>
                <div className="relative glass-card p-2 rounded-3xl shadow-2xl">
                  {/* Video Player UI */}
                  <div className="relative bg-navy-900 rounded-2xl overflow-hidden aspect-video group cursor-pointer border border-white/5">
                    <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/40 to-navy-900/90"></div>
                    
                    {/* Simulated Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                      <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-white/20 shadow-glow">
                         <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg pl-1 text-electric-blue">
                           <Play className="w-6 h-6 fill-current" />
                         </div>
                      </div>
                      <p className="font-bold text-xl tracking-wide">Watch Demo</p>
                    </div>

                    {/* Progress Bar Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                      <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                         <div className="h-full w-1/3 bg-electric-cyan rounded-full shadow-[0_0_10px_#00CFFF]"></div>
                      </div>
                      <div className="flex justify-between text-xs text-white mt-2 font-mono opacity-80">
                         <span>0:34</span>
                         <span>2:14</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center pb-2">
                    <p className="text-xs font-bold text-electric-cyan uppercase tracking-[0.2em] animate-pulse">Live Demo Preview</p>
                  </div>
                </div>
             </div>
           </div>
        </div>
      </section>

      {/* New Hero Section: Smart Hospital Ecosystem */}
      <section className="py-24 bg-gradient-to-r from-navy-900 to-navy-800 relative overflow-hidden border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col-reverse md:flex-row items-center gap-16">
           <div className="md:w-1/2 relative">
              <div className="absolute inset-0 bg-electric-cyan/20 blur-[80px] rounded-full pointer-events-none"></div>
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
                 {/* Hospital Image */}
                 <img 
                   src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000" 
                   alt="Futuristic Hospital" 
                   className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                 />
                 
                 {/* Scanning Overlay Animation */}
                 <div className="absolute inset-0 bg-gradient-to-b from-transparent via-electric-cyan/10 to-transparent w-full h-[20%] animate-[scan_3s_ease-in-out_infinite] pointer-events-none border-t border-b border-electric-cyan/30"></div>
                 
                 {/* Tech Overlay Data */}
                 <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
                       <span className="text-white font-mono text-sm">SYSTEM STATUS: ONLINE</span>
                    </div>
                    <span className="text-electric-cyan font-mono text-sm">v4.2.0</span>
                 </div>
              </div>
           </div>

           <div className="md:w-1/2">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple/10 text-purple text-sm font-bold mb-6 border border-purple/20">
                <Building2 className="w-4 h-4" /> Infrastructure AI
             </div>
             <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
               Transforming Healthcare <br/> 
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-purple">Facilities</span>
             </h2>
             <p className="text-lg text-slate-400 mb-8 leading-relaxed">
               Experience the seamless integration of AI into physical hospital environments. From smart waiting rooms to AI-guided surgical theaters, Mediverse powers the physical spaces where care happens.
             </p>
             <button 
                onClick={() => onNavigate(AppModule.NAV)}
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full font-bold transition-all flex items-center gap-2 group backdrop-blur-md"
             >
                Explore Hospital Nav
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </button>
           </div>
        </div>

        {/* Custom scan animation style */}
        <style>{`
          @keyframes scan {
            0% { top: -20%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 120%; opacity: 0; }
          }
        `}</style>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-navy-900 relative border-t border-white/5">
        {/* Background effects */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-electric-blue/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-neon-green/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 text-electric-cyan rounded-full text-sm font-bold mb-6 backdrop-blur-md">
               <HelpCircle className="w-4 h-4" /> Smart Assistance
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-400">Everything you need to know about the Mediverse platform.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className={`glass-card rounded-2xl overflow-hidden border border-white/10 shadow-[0_4px_20px_rgba(0,207,255,0.05)] transition-all duration-300 ${openFaq === idx ? 'shadow-[0_8px_30px_rgba(0,207,255,0.15)] bg-white/[0.07]' : 'hover:bg-white/[0.07]'}`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex justify-between items-center p-6 text-left group"
                >
                  <span className={`font-bold text-lg transition-colors duration-300 ${openFaq === idx ? 'text-neon-green' : 'text-electric-cyan group-hover:text-neon-green'}`}>
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-6 h-6 text-neon-green transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <div 
                  className={`transition-[max-height] duration-500 ease-in-out overflow-hidden ${openFaq === idx ? 'max-h-48' : 'max-h-0'}`}
                >
                   <div className="p-6 pt-0 text-slate-300 leading-relaxed border-t border-white/5 mt-2">
                     {faq.a}
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/20 border-t border-white/5 py-12 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="text-electric-cyan w-6 h-6" />
                <span className="text-xl font-bold text-white">Mediverse AI</span>
              </div>
              <p className="text-slate-400 max-w-sm">
                Empowering patients and hospitals with next-generation multimodal AI. Your health, decoded.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li><button onClick={() => scrollToSection('hero')} className="text-slate-400 hover:text-electric-cyan transition-colors">Home</button></li>
                <li><button onClick={() => scrollToSection('features')} className="text-slate-400 hover:text-electric-cyan transition-colors">Features</button></li>
                <li><button onClick={() => scrollToSection('about')} className="text-slate-400 hover:text-electric-cyan transition-colors">About</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 hover:text-electric-cyan transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-electric-cyan transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-slate-400 hover:text-electric-cyan transition-colors">Medical Disclaimer</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 mt-12 pt-8 text-center text-sm text-slate-500">
            © 2025 Mediverse AI. All rights reserved. This tool provides AI assistance and does not replace professional medical advice.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;