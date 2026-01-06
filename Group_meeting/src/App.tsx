import { useState, useEffect } from 'react'; 
import '@livekit/components-styles';
import { 
  LiveKitRoom, 
  ControlBar, 
  RoomAudioRenderer,
  useLocalParticipant,
  useRoomContext 
} from '@livekit/components-react';
import { Stage } from './components/Stage';
import { Captions } from './components/Captions';
import { JoinScreen } from './pages/JoinScreen';
import { TranslationControls } from './components/TranslationControls';
import { useSpeechToText } from './hooks/useSpeechToText';
import { useChromeTranslator } from './hooks/useChromeTranslator';

const LIVEKIT_URL = "wss://real-time-translation-0uoocd93.livekit.cloud";

function ActiveRoom({ onLeave }: { onLeave: () => void }) {
  const room = useRoomContext(); 
  const { localParticipant } = useLocalParticipant();
  
  // 1. Language States
  const [myLang, setMyLang] = useState(''); 
  const [targetLang, setTargetLang] = useState('ja');

  // 2. STT Active State
  const [isSttOn, setIsSttOn] = useState(false);
  
  // 3. Get resetTranslator from hook
  const { translator, initTranslator, status, resetTranslator } = useChromeTranslator();

  // 4. FIXED: Only reset when targetLang actually changes
  // We removed 'resetTranslator' from the dependency array to prevent the "Death Loop"
  useEffect(() => {
    if (status === 'ready') {
      resetTranslator();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetLang]); 

  useSpeechToText(
    room, 
    localParticipant, 
    isSttOn, 
    myLang
  );

  const handleInit = () => {
    // Logic: If target is JA, source is EN. If target is EN, source is JA.
    const source = targetLang === 'ja' ? 'en' : 'ja';
    const target = targetLang;
    initTranslator(source, target);
  };

  return (
    <div className="h-screen w-screen bg-black flex flex-col relative overflow-hidden">
      <TranslationControls 
        myLang={myLang} 
        setMyLang={setMyLang}
        targetLang={targetLang}
        setTargetLang={setTargetLang}
        onInit={handleInit}
        status={status}
        isSttOn={isSttOn}
        toggleStt={() => setIsSttOn(!isSttOn)}
      />

      <div className="flex-1 relative overflow-hidden flex flex-col">
        <Stage />
        {/* Pass the status directly so Captions knows when to translate */}
        <Captions translator={translator} isReady={status === 'ready'} />
      </div>
      
      <div className="h-16 bg-neutral-900 border-t border-neutral-800 flex justify-center items-center px-4 z-50">
        <ControlBar 
          variation="minimal" 
          controls={{ microphone: true, camera: true, screenShare: true, leave: true }} 
          // @ts-ignore
          onLeave={onLeave}
        />
      </div>
      <RoomAudioRenderer />
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState("");

  if (!token) return <JoinScreen onJoin={setToken} />;

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={LIVEKIT_URL}
      data-lk-theme="default"
      onDisconnected={() => setToken("")}
    >
      <ActiveRoom onLeave={() => setToken("")} />
    </LiveKitRoom>
  );
}