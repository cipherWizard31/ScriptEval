// app/forms/upload/page.tsx
'use client'

import { useState, useRef } from 'react';
import { uploadScript } from '@/app/actions/public-upload';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function PublicUpload() {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
    <div className="min-h-screen bg-white py-12 px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <form action={handleAction}>
          <div className="space-y-12">

            {/* SECTION 1: SCRIPT DETAILS */}
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base/7 font-semibold text-gray-900">Script Profile</h2>
              <p className="mt-1 text-sm/6 text-gray-600">
                This information will be visible to evaluators. Please do not include your name in the title or script file.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="title" className="block text-sm/6 font-medium text-gray-900">
                    Play Title
                  </label>
                  <div className="mt-2">
                    <input
                      id="title"
                      name="title"
                      type="text"
                      required
                      placeholder="e.g., The Midnight Sonata"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Script Document
                  </label>
                  <div className="mt-2">

                    {/*
                      Single file input — always mounted in the DOM so FormData
                      always picks it up. The visual layer swaps around it.
                    */}
                    <input
                      ref={fileInputRef}
                      id="scriptFile"
                      name="scriptFile"
                      type="file"
                      accept=".pdf"
                      required
                      className="sr-only"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                    />

                    {selectedFile ? (
                      /* ── File selected state ── */
                      <div className="flex items-center justify-between rounded-lg border border-gray-900/25 bg-gray-50 px-6 py-4">
                        <div className="flex items-center gap-3">
                          <svg
                            className="size-8 shrink-0 text-red-500"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875Zm7.5 9.75a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0v-4.5Zm1.5 2.25a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5H15a.75.75 0 0 1-.75-.75Zm-4.5-2.25a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0v-1.5h.375a2.25 2.25 0 0 0 0-4.5H9.75Zm0 1.5h.375a.75.75 0 0 1 0 1.5H9.75v-1.5Z"
                            />
                            <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                            <p className="text-xs text-gray-500">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      /* ── Empty/prompt state ── */
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 hover:border-indigo-400 transition-colors"
                      >
                        <div className="text-center pointer-events-none">
                          <svg
                            className="mx-auto size-12 text-gray-300"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875Zm7.5 9.75a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0v-4.5Zm1.5 2.25a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5H15a.75.75 0 0 1-.75-.75Zm-4.5-2.25a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0v-1.5h.375a2.25 2.25 0 0 0 0-4.5H9.75Zm0 1.5h.375a.75.75 0 0 1 0 1.5H9.75v-1.5Z"
                            />
                            <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                          </svg>
                          <p className="mt-4 text-sm/6 text-gray-600">
                            <span className="font-semibold text-indigo-600">Upload a PDF file</span>
                            {' '}or drag and drop
                          </p>
                          <p className="text-xs/5 text-gray-500 mt-1">PDF scripts up to 10MB</p>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: BLIND REVIEW INFO */}
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base/7 font-semibold text-gray-900">Writer Information</h2>
              <p className="mt-1 text-sm/6 text-gray-600">
                This information is for the Records Office only and will be stripped before evaluation.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="author" className="block text-sm/6 font-medium text-gray-900">
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
                  <label htmlFor="contact" className="block text-sm/6 font-medium text-gray-900">
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
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Save Submission'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}