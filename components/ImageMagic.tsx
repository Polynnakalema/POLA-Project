
import React, { useState, useRef } from 'react';
import { editImageWithGemini } from '../services/geminiService';

const ImageMagic: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!image || !prompt) return;

    setIsProcessing(true);
    setError(null);
    try {
      const base64 = image.split(',')[1];
      const result = await editImageWithGemini(base64, prompt);
      if (result) {
        setImage(result);
        setPrompt('');
      } else {
        setError("Oops! The banana peel slipped. Try a different request!");
      }
    } catch (err: any) {
      if (err.message === "RE-AUTH-REQUIRED") {
        setError("API Key issue. Please ask parent to refresh.");
      } else {
        setError("Magic failed! Let's try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mt-12 bg-indigo-50 p-6 rounded-3xl border-2 border-dashed border-indigo-300">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">🍌</span>
        <h2 className="text-2xl font-bold text-indigo-900">Nano Banana Magic Photo Editor</h2>
      </div>
      <p className="text-indigo-700 mb-6">Capture a memory from today and use magic to change it!</p>

      {!image ? (
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-48 border-4 border-dashed border-indigo-200 rounded-2xl flex flex-col items-center justify-center text-indigo-400 hover:bg-indigo-100 transition-colors"
        >
          <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Pick a Photo</span>
        </button>
      ) : (
        <div className="space-y-4">
          <div className="relative group overflow-hidden rounded-2xl shadow-xl">
            <img src={image} alt="Target" className="w-full max-h-96 object-contain bg-black rounded-2xl" />
            <button 
              onClick={() => setImage(null)}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <input 
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'Add a retro filter' or 'Put a party hat on me'"
              className="p-4 rounded-xl border-2 border-indigo-200 focus:border-indigo-500 outline-none"
              disabled={isProcessing}
            />
            <button 
              onClick={handleEdit}
              disabled={isProcessing || !prompt}
              className={`py-4 rounded-xl font-bold text-white transition-all transform active:scale-95 ${
                isProcessing ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isProcessing ? 'Working Magic... ✨' : 'Apply Magic 🪄'}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
        </div>
      )}
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default ImageMagic;
