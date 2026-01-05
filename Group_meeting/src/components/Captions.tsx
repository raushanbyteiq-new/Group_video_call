import { useState, useEffect } from 'react';
import { useRoomContext } from '@livekit/components-react';
import { RoomEvent } from 'livekit-client';

interface Props {
  translator: any; // The Chrome AI translator object
  isReady: boolean;
}

export const Captions = ({ translator, isReady }: Props) => {
  const room = useRoomContext();
  const [caption, setCaption] = useState<{ text: string, sender: string } | null>(null);

  useEffect(() => {
    const handleData = async (payload: Uint8Array, participant: any) => {
      try {
        const data = JSON.parse(new TextDecoder().decode(payload));
        let textToShow = data.text;

        // --- RECEIVER SIDE TRANSLATION ---
        // If translator is ready, we translate the incoming text
        if (isReady && translator && typeof translator.translate === 'function') {
          try {
            textToShow = await translator.translate(data.text);
          } catch (err) {
            console.warn("Translation failed, showing original:", err);
          }
        }

        setCaption({ text: textToShow, sender: participant?.identity || "Unknown" });
        
        // Hide after 6 seconds
        setTimeout(() => setCaption(null), 6000);
      } catch (e) {
        console.error("Error parsing caption data:", e);
      }
    };

    room.on(RoomEvent.DataReceived, handleData);
    return () => { room.off(RoomEvent.DataReceived, handleData); };
  }, [room, translator, isReady]);

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