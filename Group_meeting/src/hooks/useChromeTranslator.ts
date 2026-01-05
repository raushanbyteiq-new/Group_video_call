import { useState, useCallback } from 'react';

export const useChromeTranslator = () => {
  const [translator, setTranslator] = useState<any>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');

  // 1. Initialize function
  const initTranslator = useCallback(async (source: string, target: string) => {
    // @ts-ignore
    if (!window.translation && !window.Translator) {
      alert("Chrome AI APIs not found. Enable flags in chrome://flags");
      return;
    }

    setStatus('loading');
    try {
      // @ts-ignore
      const createTranslator = window.translation?.createTranslator || window.Translator?.create;
      
      console.log("Initializing translator:", { source, target });
      const newTranslator = await createTranslator({
        sourceLanguage: source,
        targetLanguage: target,
      });
      
      setTranslator(newTranslator);
      setStatus('ready');
    } catch (e) {
      console.error(e);
      setStatus('error');
    }
  }, []);

  // 2. NEW: Reset function to kill the previous instance
  const resetTranslator = useCallback(() => {
    if (translator && typeof translator.destroy === 'function') {
      try { translator.destroy(); } catch(e) { console.warn(e); }
    }
    setTranslator(null);
    setStatus('idle');
  }, [translator]);

  return { translator, initTranslator, status, resetTranslator };
};