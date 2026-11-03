import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '10mb' }));

  // Helper to initialize GoogleGenAI client
  const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // API Endpoint: Generate Voice via Gemini 3.8 Flash Lite TTS
  app.post('/api/generate-voice', async (req, res) => {
    try {
      const { text, lang = 'ar', voiceName, style } = req.body;

      if (!text || typeof text !== 'string') {
        res.status(400).json({ error: 'Text prompt is required' });
        return;
      }

      const ai = getGenAI();
      if (!ai) {
        res.status(503).json({
          error: 'GEMINI_API_KEY_MISSING',
          message: 'Gemini API key is not configured in environment',
          fallbackAvailable: true,
        });
        return;
      }

      // Voice selection: Kore, Fenrir, Puck, Zephyr, Charon
      const selectedVoice = voiceName || (lang === 'fr' ? 'Kore' : 'Zephyr');
      const voiceStyle =
        style ||
        (lang === 'fr'
          ? 'Clear, warm, respectful greeting voice for charity organization'
          : 'نبرة ترحيبية دافئة وقورة ومطمئنة لجمعية خيرية جزائرية');

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: text.trim(),
                speechMetadata: {
                  style: voiceStyle,
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: selectedVoice },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

      if (!base64Audio) {
        res.status(502).json({
          error: 'AUDIO_GENERATION_FAILED',
          message: 'The AI model did not return audio data',
        });
        return;
      }

      res.json({
        success: true,
        audioDataUrl: `data:audio/wav;base64,${base64Audio}`,
        mimeType: 'audio/wav',
        model: 'gemini-3.8-flash-lite-tts',
        voiceName: selectedVoice,
      });
    } catch (err: unknown) {
      console.error('Error generating voice with Gemini TTS:', err);
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({
        error: 'TTS_GENERATION_ERROR',
        message,
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      timestamp: new Date().toISOString(),
    });
  });

  // In production, serve dist folder. In development, mount Vite middlewares.
  if (isProd) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
