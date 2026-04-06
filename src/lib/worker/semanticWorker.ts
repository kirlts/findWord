import { pipeline, env } from '@xenova/transformers';
import type { PipelineType } from '@xenova/transformers';

env.allowLocalModels = false;
env.useBrowserCache = true;
// @ts-ignore
env.backends.onnx.wasm.numThreads = 1;

class PipelineSingleton {
    static task: PipelineType = 'feature-extraction';
    static model = 'Xenova/multilingual-e5-small';
    static instance: any = null;

    static async getInstance(progress_callback?: Function) {
        if (this.instance === null) {
            this.instance = await pipeline(this.task, this.model, {
                quantized: true,
                progress_callback: progress_callback
            });
        }
        return this.instance;
    }
}

self.addEventListener('message', async (event) => {
    try {
        const { id, type, text, text2 } = event.data;

        if (type === 'load') {
            await PipelineSingleton.getInstance((x: any) => {
                self.postMessage({ type: 'progress', data: x });
            });
            self.postMessage({ id, type: 'ready' });
            return;
        }

        if (type === 'extract') {
            const startTime = performance.now();
            const extractor = await PipelineSingleton.getInstance();
            const output = await extractor(text, { pooling: 'mean', normalize: true });
            const endTime = performance.now();

            self.postMessage({
                id,
                type: 'result',
                data: Array.from(output.data),
                time: endTime - startTime
            });
            return;
        }

        if (type === 'compare') {
             const startTime = performance.now();
             const extractor = await PipelineSingleton.getInstance();

             const out1 = await extractor(text, { pooling: 'mean', normalize: true });
             const out2 = await extractor(text2, { pooling: 'mean', normalize: true });

             let dotProduct = 0;
             let norm1 = 0;
             let norm2 = 0;
             for (let i = 0; i < out1.data.length; i++) {
                 dotProduct += out1.data[i] * out2.data[i];
                 norm1 += out1.data[i] * out1.data[i];
                 norm2 += out2.data[i] * out2.data[i];
             }
             const similarity = dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));

             const endTime = performance.now();
             self.postMessage({
                 id,
                 type: 'compare_result',
                 similarity: similarity,
                 time: endTime - startTime
             });
        }
    } catch (error: any) {
        self.postMessage({ type: 'error', error: error.message || String(error) });
    }
});