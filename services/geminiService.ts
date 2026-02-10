
import { GoogleGenAI, Modality } from "@google/genai";

// Standard base64 decode for raw bytes as per API guidelines
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// PCM decoding for raw audio streams from Gemini (24kHz, 1 channel)
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// Singleton for AudioContext to avoid initialization issues across sections
let globalAudioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!globalAudioContext) {
    globalAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  }
  return globalAudioContext;
};

export const playMotivationalSpeech = async (activityTitle: string): Promise<void> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const ctx = getAudioContext();

    // Critical: Resume context on user interaction to bypass autoplay restrictions
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    const prompt = `Say a very short, cheerful, and thankful motivational message to a child who just finished: "${activityTitle}". 
    Start with "Thank you" or "Great job". Keep it under 10 words and very encouraging. Use a warm, high-energy tone.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    // Find the audio part reliably
    const base64Audio = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
    if (!base64Audio) {
      console.warn("No audio data received from Gemini");
      return;
    }

    const audioBuffer = await decodeAudioData(
      decode(base64Audio),
      ctx,
      24000,
      1
    );

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    source.start(0); // Start immediately
  } catch (error) {
    console.error("Speech generation failed:", error);
  }
};

export const editImageWithGemini = async (base64Image: string, prompt: string): Promise<string | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: 'image/png',
            },
          },
          {
            text: `Please edit this image based on the following instruction: ${prompt}. Return ONLY the edited image.`,
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error editing image:", error);
    if (error instanceof Error && error.message.includes("Requested entity was not found")) {
        throw new Error("RE-AUTH-REQUIRED");
    }
    throw error;
  }
};
