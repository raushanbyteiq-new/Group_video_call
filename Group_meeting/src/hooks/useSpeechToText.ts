import { useEffect, useRef, useCallback } from 'react';
import type { Room, LocalParticipant } from 'livekit-client';

export const useSpeechToText = (
  room: Room | undefined, 
  localParticipant: LocalParticipant | undefined,
  shouldListen: boolean, // <--- CHANGED: Controlled by specific button, not mic mute
  langCode: string
) => {
  // 1. The Master Switch: Tracks if we WANT to be listening
  const isSpeechActiveRef = useRef(false);
  const recognitionRef = useRef<any>(null);
  
  // Keep ref to participant to avoid stale closures
  const participantRef = useRef<LocalParticipant | undefined>(localParticipant);

  useEffect(() => {
    participantRef.current = localParticipant;
  }, [localParticipant]);

  // 2. The Robust "Recursive Restart" Loop (From your WebRTCWithBuffer.jsx)
  const startRecognitionLoop = useCallback(() => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    // Helper function that creates a new instance and handles its own restart
    const startInstance = () => {
      // STOP immediately if the master switch is off
      if (!isSpeechActiveRef.current) return;

      const recognition = new SpeechRecognition();
      
      // CRITICAL: Set continuous to FALSE. 
      // This stops the engine after every sentence, preventing the "Japanese freeze" bug.
      recognition.continuous = false; 
      recognition.interimResults = false;
      recognition.lang = langCode || 'en-US'; 

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript.trim() && participantRef.current) {
          // Send the ORIGINAL text. The Receiver will translate it.
          console.log("STT Final Transcript:", finalTranscript);
          const payload = new TextEncoder().encode(JSON.stringify({
            text: finalTranscript,
            srcLang: langCode.split('-')[0] // 'en' or 'ja'
          }));

          try {
            participantRef.current.publishData(payload, { reliable: true });
          } catch (error) {
            console.warn("Failed to publish STT data:", error);
          }
        }
      };

      recognition.onerror = (event: any) => {
        // Ignore normal errors like 'no-speech' (silence) or 'aborted' (manual stop)
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          console.warn("STT Error (restarting):", event.error);
        }
      };

      recognition.onend = () => {
        // The Magic Loop: If we still want to listen, restart immediately
        if (isSpeechActiveRef.current) {
          setTimeout(() => {
             try { startInstance(); } catch (e) { console.error(e); }
          }, 50); // Small buffer 
        }
      };

      recognitionRef.current = recognition;
      try { recognition.start(); } catch(e) {}
    };

    // Kick off the first instance
    startInstance();

  }, [langCode]);

  // 3. Main Effect to Toggle ON/OFF based on the Button
  useEffect(() => {
    if (shouldListen) {
      // Turn ON
      isSpeechActiveRef.current = true;
      startRecognitionLoop();
    } else {
      // Turn OFF
      isSpeechActiveRef.current = false;
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
    }

    // Cleanup on unmount
    return () => {
      isSpeechActiveRef.current = false;
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
    };
  }, [shouldListen, startRecognitionLoop]);
};