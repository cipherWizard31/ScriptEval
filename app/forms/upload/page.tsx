// app/forms/upload/page.tsx
'use client'
import { uploadScript } from '@/app/actions/public-upload';
import toast from 'react-hot-toast';

export default function PublicUpload() {
  async function handleAction(formData: FormData) {
    const res = await uploadScript(formData);
    if (res.success) toast.success("Script submitted to Records Office!");
    else toast.error("Submission failed.");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <form action={handleAction} className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full space-y-4">
        <h1 className="text-2xl font-bold">Public Script Submission</h1>
        <input name="title" placeholder="Play Title" required className="w-full p-2 border rounded text-black" />
        <input name="author" placeholder="Your Full Name" required className="w-full p-2 border rounded text-black" />
        <textarea name="contact" placeholder="Contact Info (Email/Phone)" required className="w-full p-2 border rounded text-black" />
        <input type="file" name="scriptFile" accept=".pdf" required className="w-full text-sm" />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded font-bold">Submit Script</button>
      </form>
    </div>
  );
}