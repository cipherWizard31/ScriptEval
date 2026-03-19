'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { uploadScript } from '@/app/actions/upload-script';
import toast from 'react-hot-toast';

export default function UploadPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleFormAction(formData: FormData) {
    setLoading(true);
    const toastId = toast.loading('Uploading and encrypting...');

    try {
      const result = await uploadScript(formData);

      if (result.success) {
        toast.success('Script secured in vault!', { id: toastId });
        
        // Brief delay so the user sees the success message before moving
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        toast.error(result.error || 'Upload failed', { id: toastId });
        setLoading(false);
      }
    } catch (err) {
      toast.error('A critical error occurred', { id: toastId });
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Add New Script</h1>
          <p className="text-slate-500 text-sm">Upload a PDF to the secure ScriptEval vault.</p>
        </div>

        <form action={handleFormAction} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Play Title</label>
            <input 
              name="title" 
              type="text" 
              required 
              placeholder="e.g. Hamlet"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Author</label>
            <input 
              name="author" 
              type="text" 
              required 
              placeholder="e.g. William Shakespeare"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black"
            />
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-dashed border-slate-300">
            <label className="block text-sm font-semibold text-slate-700 mb-2">PDF Script File</label>
            <input 
              name="scriptFile" 
              type="file" 
              accept=".pdf" 
              required 
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-white transition-all shadow-lg ${
              loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
            }`}
          >
            {loading ? 'Processing...' : 'Upload to Vault'}
          </button>
        </form>
      </div>
    </div>
  );
}