'use client'

import { useState } from 'react';
import { uploadScript } from '@/app/actions/upload-script';

export default function UploadPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(formData: FormData) {
    setStatus('loading');
    const result = await uploadScript(formData);
    
    if (result?.success) {
      setStatus('success');
      (document.getElementById('upload-form') as HTMLFormElement).reset();
    } else {
      setStatus('error');
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Theater Script Vault</h1>
        
        <form id="upload-form" action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Play Title</label>
            <input 
              name="title" 
              required 
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="e.g. The Cherry Orchard"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
            <input 
              name="author" 
              required 
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="e.g. Anton Chekhov"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Script (PDF)</label>
            <input 
              type="file" 
              name="scriptFile" 
              accept=".pdf" 
              required 
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <button 
            type="submit" 
            disabled={status === 'loading'}
            className={`w-full py-3 rounded-md font-bold text-white transition-all ${
              status === 'loading' ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {status === 'loading' ? 'Securing File...' : 'Upload to Vault'}
          </button>

          {status === 'success' && (
            <p className="text-green-600 text-sm font-medium text-center">✓ Script secured in vault!</p>
          )}
          {status === 'error' && (
            <p className="text-red-600 text-sm font-medium text-center">× Error uploading script.</p>
          )}
        </form>
      </div>
    </main>
  );
}