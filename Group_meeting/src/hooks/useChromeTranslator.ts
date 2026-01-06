import { useState, useCallback, useEffect } from 'react';

export const useChromeTranslator = () => {
  const [translator, setTranslator] = useState<any>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error' | 'unsupported'>('idle');

  // 1. EXACT LOGIC FROM YOUR WORKING PEERJS CODE
  const getTranslatorAPI = useCallback(() => {
    // @ts-ignore
    if (window.translation) return window.translation; 
    // @ts-ignore
    if (window.ai && window.ai.translator) return window.ai.translator; // <--- The one you were missing!
    // @ts-ignore
    if (window.Translator) return window.Translator; 
    return null;
  }, []);

  const initTranslator = useCallback(async (source: string, target: string) => {
    // Cleanup previous instance
    if (translator && typeof translator.destroy === 'function') {
      try { translator.destroy(); } catch(e) {}
    }
    console.log("Initializing translator with source:", source, "target:", target);
    const api = getTranslatorAPI();

    if (!api) {
      console.error("Chrome AI APIs not found. Enable chrome://flags/#translation-api");
      setStatus('unsupported');
      return;
    }

    setStatus('loading');
    try {
      console.log(`Initializing translator: ${source} -> ${target}`);
      
      const createFn = api.create || api.createTranslator;
      const newTranslator = await createFn.call(api, {
        sourceLanguage: source,
        targetLanguage: target,
      });

      // 2. WAIT FOR READY (Crucial for download handling)
      // @ts-ignore
      if (newTranslator.ready) await newTranslator.ready;

      setTranslator(newTranslator);
      setStatus('ready');
      console.log("Translator Ready!");
    } catch (e) {
      console.error("Translation init failed:", e);
      setStatus('error');
    }
  }, [getTranslatorAPI, translator]); 

  const resetTranslator = useCallback(() => {
    if (translator && typeof translator.destroy === 'function') {
      try { translator.destroy(); } catch(e) { console.warn(e); }
    }
    setTranslator(null);
    setStatus('idle');
  }, [translator]);

  return { translator, initTranslator, status, resetTranslator };
};