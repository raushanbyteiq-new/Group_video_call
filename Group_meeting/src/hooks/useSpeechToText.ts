import { useEffect, useRef } from 'react';
import type { Room, LocalParticipant } from 'livekit-client';
import { Track } from 'livekit-client';

// ⚠️ REPLACE THIS WITH YOUR REAL KEY (The one that worked in the HTML file)
const DEEPGRAM_API_KEY = "19b2a3f9d9be5a9092dff1810650198119a5d76b"; 

export const useSpeechToText = (
  room: Room | undefined,
  localParticipant: LocalParticipant | undefined,
  shouldListen: boolean, // Controlled by your button
  langCode: string       // 'en-US' or 'ja-JP'
) => {
  const isListeningRef = useRef(shouldListen);

  // Sync ref with state to prevent stale closures inside callbacks
  useEffect(() => {
    isListeningRef.current = shouldListen;
  }, [shouldListen]);

  useEffect(() => {
    // 1. Safety Checks
    if (!shouldListen) return;
    if (!localParticipant) {
      console.log("⚠️ STT: Waiting for LocalParticipant...");
      return;
    }

    console.log(`🚀 STT: Starting for language: ${langCode}`);

    let socket: WebSocket | null = null;
    let recorder: MediaRecorder | null = null;

    const startStreaming = async () => {
      try {
        // 2. Get the Microphone Track from LiveKit
        const microphonePub = localParticipant.getTrackPublication(Track.Source.Microphone);
        const audioTrack = microphonePub?.track?.mediaStreamTrack;

        if (!audioTrack) {
          console.error("❌ STT: No Microphone Track found. Please unmute or check permissions.");
          return;
        }

        // 3. Construct the Deepgram URL (Exactly like your working HTML file)
        const baseUrl = 'wss://api.deepgram.com/v1/listen';
        const params = new URLSearchParams({
          model: 'nova-2',
          language: langCode.startsWith('ja') ? 'ja' : 'en',
          smart_format: 'true',
          interim_results: 'true',
        });

        const url = `${baseUrl}?${params.toString()}`;

        // 4. Connect using Native WebSocket
        // We use the ['token', KEY] subprotocol which worked in your test
        socket = new WebSocket(url, ['token', DEEPGRAM_API_KEY]);

        socket.onopen = () => {
          console.log("✅ STT: WebSocket Connected!");
          
          // Start Recording only AFTER socket is open
          const stream = new MediaStream([audioTrack]);
          recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

          recorder.addEventListener('dataavailable', (event) => {
            if (event.data.size > 0 && socket?.readyState === 1) {
              socket.send(event.data);
            }
          });

          // Send chunks every 250ms (Low latency)
          recorder.start(250);
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            const transcript = data.channel?.alternatives?.[0]?.transcript;
            const isFinal = data.is_final;

            // Only log if there is actual text
            if (transcript) {
              // console.log(`🎤 Heard: ${transcript}`); 
              
              // Publish to LiveKit only if it's a FINAL result
              if (isFinal && isListeningRef.current) {
                console.log(`📤 STT Final: "${transcript}"`);
                
                const payload = new TextEncoder().encode(JSON.stringify({
                  text: transcript,
                  srcLang: langCode.startsWith('ja') ? 'ja' : 'en'
                }));
                
                localParticipant.publishData(payload, { reliable: true });
              }
            }
          } catch (err) {
            console.error("Error parsing socket message", err);
          }
        };

        socket.onclose = (event) => {
          if (event.code !== 1000) {
            console.warn(`🔌 STT: Connection closed unexpectedly (Code: ${event.code})`);
          } else {
            console.log("🔌 STT: Connection closed normally");
          }
        };

        socket.onerror = (error) => {
          console.error("❌ STT: Socket Error", error);
        };

      } catch (error) {
        console.error("❌ STT Setup Exception:", error);
      }
    };

    startStreaming();

    // 5. Cleanup Function
    // This runs automatically when you toggle the button OFF or leave the page
    return () => {
      console.log("🛑 STT: Cleaning up...");
      if (recorder && recorder.state !== 'inactive') {
        recorder.stop();
      }
      if (socket) {
        // Force close immediately
        socket.close();
      }
    };
  }, [shouldListen, langCode, localParticipant]);
};