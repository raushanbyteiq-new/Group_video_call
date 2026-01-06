import { useState, useEffect, useRef } from 'react';
import { useRoomContext } from '@livekit/components-react';
import { RoomEvent } from 'livekit-client';

interface Props {
  translator: any;
  isReady: boolean;
}

export const Captions = ({ translator, isReady }: Props) => {
  const room = useRoomContext();
  const [caption, setCaption] = useState<{ text: string, sender: string } | null>(null);
  
  // Keep live reference to translator to avoid stale closures
  const translatorRef = useRef(translator);

  useEffect(() => {
    translatorRef.current = translator;
  }, [translator]);

  useEffect(() => {
    const handleData = async (payload: Uint8Array, participant: any) => {
      try {
        const data = JSON.parse(new TextDecoder().decode(payload));
        let textToShow = data.text;
        
        // --- DEBUG LOGS (Check your Console) ---
        console.group("🎤 Caption Received");
        console.log("Original Text:", data.text);
        console.log("Translator Ready Prop:", isReady);
        console.log("Translator Object Ref:", !!translatorRef.current);
        
        const currentTranslator = translatorRef.current;

        if (isReady && currentTranslator) {
          try {
            console.log("🔄 Attempting translation...");
            // Try the standard translate method
            const result = await currentTranslator.translate(data.text);
            console.log("✅ Translation Result:", result);
            textToShow = result;
          } catch (err) {
            console.error("❌ Translation API Error:", err);
            // Fallback: If 'translate' doesn't exist, log the object keys
            console.log("Translator keys:", Object.keys(currentTranslator));
          }
        } else {
          console.warn("⚠️ Skipping translation: Translator not ready or null.");
        }
        console.groupEnd();

        setCaption({ text: textToShow, sender: participant?.identity || "Unknown" });
        
        setTimeout(() => setCaption(null), 6000);
      } catch (e) {
        console.error("Error parsing caption data:", e);
      }
    };

    room.on(RoomEvent.DataReceived, handleData);
    return () => { room.off(RoomEvent.DataReceived, handleData); };
  }, [room, isReady]);

  if (!caption) return null;

  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl text-center z-40 pointer-events-none">
      <div className="bg-neutral-900/90 backdrop-blur-md text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-4">
        <p className="text-blue-400 text-xs font-bold mb-1 uppercase tracking-wider">{caption.sender}</p>
        <p className="text-xl md:text-2xl font-medium leading-relaxed">{caption.text}</p>
      </div>
    </div>
  );
};