import { useState, useEffect, useRef, useCallback } from 'react';

type WorkerStatus = 'idle' | 'loading' | 'ready' | 'error';

export function useSemanticEngine() {
  const workerRef = useRef<Worker | null>(null);
  const [status, setStatus] = useState<WorkerStatus>('idle');
  const [progress, setProgress] = useState<any>(null);
  const callbacksRef = useRef<Record<string, Function>>({});

  useEffect(() => {
    workerRef.current = new Worker(new URL('../lib/worker/semanticWorker.ts', import.meta.url), {
      type: 'module'
    });

    workerRef.current.onmessage = (event) => {
      const { id, type, data, similarity, time, error } = event.data;

      if (type === 'progress') {
        setProgress(data);
      } else if (type === 'ready') {
        setStatus('ready');
        if (id && callbacksRef.current[id]) {
          callbacksRef.current[id]();
          delete callbacksRef.current[id];
        }
      } else if (type === 'result' || type === 'compare_result') {
        if (id && callbacksRef.current[id]) {
          callbacksRef.current[id]({ data, similarity, time });
          delete callbacksRef.current[id];
        }
      } else if (type === 'error') {
        setStatus('error');
        console.error('Worker error:', error);
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const initEngine = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      if (status === 'ready') {
        resolve();
        return;
      }

      setStatus('loading');

      const id = crypto.randomUUID();
      callbacksRef.current[id] = resolve;
      workerRef.current?.postMessage({ id, type: 'load' });
    });
  }, [status]);

  const getEmbedding = useCallback((text: string): Promise<{ data: number[], time: number }> => {
    return new Promise((resolve, reject) => {
      if (status !== 'ready') {
        reject(new Error('Engine not ready'));
        return;
      }
      const id = crypto.randomUUID();
      callbacksRef.current[id] = resolve;
      workerRef.current?.postMessage({ id, type: 'extract', text });
    });
  }, [status]);

  const compareWords = useCallback((text1: string, text2: string): Promise<{ similarity: number, time: number }> => {
      return new Promise((resolve, reject) => {
          if (status !== 'ready') {
              reject(new Error('Engine not ready'));
              return;
          }
          const id = crypto.randomUUID();
          callbacksRef.current[id] = resolve;
          workerRef.current?.postMessage({ id, type: 'compare', text: text1, text2 });
      })
  }, [status])

  return { status, progress, initEngine, getEmbedding, compareWords };
}