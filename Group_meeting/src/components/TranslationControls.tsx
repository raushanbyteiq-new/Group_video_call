import { useState } from 'react';
import { Languages, Download, CheckCircle, Loader2, Minimize2, Mic, MicOff, ArrowRightLeft } from 'lucide-react';

interface Props {
  myLang: string;
  setMyLang: (l: string) => void;
  targetLang: string;
  setTargetLang: (l: string) => void;
  onInit: () => void;
  status: string;
  
  // New STT Controls
  isSttOn: boolean;
  toggleStt: () => void;
}

export const TranslationControls = ({ 
  myLang, 
  setMyLang, 
  targetLang, 
  setTargetLang, 
  onInit, 
  status,
  isSttOn,
  toggleStt
}: Props) => {
  const [isMinimized, setIsMinimized] = useState(false);

  if (isMinimized) {
    return (
      <button 
        onClick={() => setIsMinimized(false)}
        className="fixed top-20 left-4 z-50 bg-neutral-800 text-white p-3 rounded-full shadow-lg border border-neutral-700 hover:bg-neutral-700 transition-all"
      >
        <Languages size={20} />
      </button>
    );
  }

  return (
    <div className="fixed top-20 left-4 z-50 w-80 bg-neutral-950/95 border border-neutral-800 p-5 rounded-xl shadow-2xl backdrop-blur-md max-h-[80vh] overflow-y-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-neutral-800 pb-2">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Languages size={16} className="text-blue-500" />
          <span>AI Settings</span>
        </div>
        <button onClick={() => setIsMinimized(true)} className="text-neutral-500 hover:text-white">
          <Minimize2 size={16} />
        </button>
      </div>

      <div className="space-y-6">
        
        {/* 1. SOURCE LANGUAGE SELECTOR */}
        <div>
          <label className="text-[11px] text-neutral-400 uppercase font-bold tracking-wider mb-2 block">
            1. My Speaking Language
          </label>
          <div className="relative">
            <select 
              value={myLang} 
              onChange={(e) => setMyLang(e.target.value)}
              className="w-full appearance-none bg-neutral-900 text-white text-sm p-3 rounded-lg border border-neutral-800 focus:border-blue-500 outline-none transition-all cursor-pointer hover:bg-neutral-800"
            >
              <option value="" disabled>-- Select Language --</option>
              <option value="en-US">English (US)</option>
              <option value="ja-JP">Japanese (日本語)</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
              <ArrowRightLeft size={14} className="rotate-90" />
            </div>
          </div>
        </div>

        {/* 2. STT TOGGLE BUTTON */}
        <div>
           <label className="text-[11px] text-neutral-400 uppercase font-bold tracking-wider mb-2 block">
            2. Speech Recognition
          </label>
          <button
            onClick={toggleStt}
            disabled={!myLang} // Disable if no language selected
            className={`w-full py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all border
              ${!myLang 
                ? 'bg-neutral-900 text-neutral-600 border-neutral-800 cursor-not-allowed'
                : isSttOn 
                  ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/50 hover:bg-yellow-500/20' 
                  : 'bg-neutral-800 text-white border-neutral-700 hover:bg-neutral-700'
              }`}
          >
            {isSttOn ? <><MicOff size={16} /> Stop Listening</> : <><Mic size={16} /> Start Listening</>}
          </button>
        </div>

        <hr className="border-neutral-800" />

        {/* 3. TRANSLATION & TARGET LANG (For Receiver) */}
        <div>
          <label className="text-[11px] text-neutral-400 uppercase font-bold tracking-wider mb-2 block">
            3. Translation Target
          </label>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
             <button
              onClick={() => setTargetLang('ja')}
              className={`p-2 rounded border text-xs font-medium transition-all ${targetLang === 'ja' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400'}`}
            >
              To Japanese
            </button>
            <button
              onClick={() => setTargetLang('en')}
              className={`p-2 rounded border text-xs font-medium transition-all ${targetLang === 'en' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400'}`}
            >
              To English
            </button>
          </div>

          <button 
            onClick={onInit}
            disabled={status === 'ready' || status === 'loading'}
            className={`w-full py-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all border
              ${status === 'ready' 
                ? 'bg-green-500/10 text-green-400 border-green-500/20 cursor-default' 
                : status === 'loading'
                ? 'bg-neutral-800 text-neutral-400 border-neutral-700'
                : 'bg-blue-600 hover:bg-blue-500 text-white border-transparent'
              }`}
          >
            {status === 'loading' && <Loader2 size={14} className="animate-spin" />}
            {status === 'ready' && <><CheckCircle size={14} /> AI Ready</>}
            {(status === 'idle' || status === 'error') && <><Download size={14} /> Initialize AI</>}
          </button>
        </div>

      </div>
    </div>
  );
};