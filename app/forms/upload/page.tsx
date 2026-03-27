// app/forms/upload/page.tsx
'use client'

import { useState } from 'react';
import { uploadScript } from '@/app/actions/public-upload';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function PublicUpload() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleAction(formData: FormData) {
    setLoading(true);
    const toastId = toast.loading('Uploading to secure vault...');
    
    try {
      const res = await uploadScript(formData);
      if (res.success) {
        toast.success("Submission successful.", { id: toastId });
        setTimeout(() => router.push('/'), 2000);
      } else {
        toast.error(res.error || "Submission failed.", { id: toastId });
        setLoading(false);
      }
    } catch (err) {
      toast.error("A system error occurred.", { id: toastId });
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white  py-12 px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <form action={handleAction}>
          <div className="space-y-12">
            
            {/* SECTION 1: SCRIPT DETAILS */}
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base/7 font-semibold text-gray-900 ">Script Profile</h2>
              <p className="mt-1 text-sm/6 text-gray-600 ">
                This information will be visible to evaluators. Please do not include your name in the title or script file.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="title" className="block text-sm/6 font-medium text-gray-900 ">
                    Play Title
                  </label>
                  <div className="mt-2">
                    <input
                      id="title"
                      name="title"
                      type="text"
                      required
                      placeholder="e.g., The Midnight Sonata"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 "
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <label htmlFor="file-upload" className="block text-sm/6 font-medium text-gray-900 ">
                    Script Document
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="mx-auto size-12 text-gray-300">
                        <path d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" fillRule="evenodd" />
                      </svg>
                      <div className="mt-4 flex text-sm/6 text-gray-600">
                        <label htmlFor="scriptFile" className="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-600 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600 hover:text-indigo-500">
                          <span>Upload a PDF file</span>
                          <input id="scriptFile" name="scriptFile" type="file" accept=".pdf" required className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs/5 text-gray-600 ">PDF scripts up to 10MB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: BLIND REVIEW INFO */}
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base/7 font-semibold text-gray-900 ">Writer Information</h2>
              <p className="mt-1 text-sm/6 text-gray-600">
                This information is for the Records Office only and will be stripped before evaluation.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="author" className="block text-sm/6 font-medium text-gray-900 ">
                    Full name
                  </label>
                  <div className="mt-2">
                    <input
                      id="author"
                      type="text"
                      name="author"
                      autoComplete="name"
                      required
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="contact" className="block text-sm/6 font-medium text-gray-900 ">
                    Contact Details
                  </label>
                  <div className="mt-2">
                    <input
                      id="contact"
                      type="text"
                      name="contact"
                      required
                      placeholder="Email or Phone Number"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button 
              type="button" 
              onClick={() => router.push('/')}
              className="text-sm/6 font-semibold text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "
            >
              {loading ? 'Submitting...' : 'Save Submission'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}