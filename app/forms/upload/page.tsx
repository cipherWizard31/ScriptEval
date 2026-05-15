// app/forms/upload/page.tsx
'use client'

import React, { useState, useRef } from 'react';
import { uploadScript } from '@/app/actions/public-upload';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const STEPS = ['Writer Information', 'Script Profile'];

export default function PublicUpload() {
  const [step, setStep]               = useState(0);
  const [direction, setDirection]     = useState<'forward' | 'back'>('forward');
  const [animating, setAnimating]     = useState(false);
  const [loading, setLoading]         = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [fields, setFields] = useState({
    author: '', address: '', phone: '', email: '',
    title: '', description: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFields(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function goTo(next: number) {
    if (animating) return;
    setDirection(next > step ? 'forward' : 'back');
    setAnimating(true);
    setTimeout(() => {
      setStep(next);
      setAnimating(false);
    }, 320);
  }

  function validateStep0() {
    if (!fields.author.trim())   { toast.error('Full name is required.');    return false; }
    if (!fields.address.trim())  { toast.error('Address is required.');      return false; }
    if (!fields.phone.trim())    { toast.error('Phone number is required.'); return false; }
    if (!fields.email.trim())    { toast.error('Email address is required.'); return false; }
    return true;
  }

  function validateStep1() {
    if (!fields.title.trim())       { toast.error('Script name is required.');  return false; }
    if (!fields.description.trim()) { toast.error('Description is required.');   return false; }
    if (!selectedFile)              { toast.error('Please attach a PDF file.'); return false; }
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep1()) return;

    setLoading(true);
    const toastId = toast.loading('Uploading to secure vault…');

    try {
      const fd = new FormData();
      fd.append('author',      fields.author);
      fd.append('address',     fields.address);
      fd.append('phone',       fields.phone);
      fd.append('email',       fields.email);
      fd.append('title',       fields.title);
      fd.append('description', fields.description);
      fd.append('scriptFile',  selectedFile!);

      const res = await uploadScript(fd);
      if (res.success) {
        toast.success('Submission successful.', { id: toastId });
        setTimeout(() => router.push('/'), 2000);
      } else {
        toast.error(res.error || 'Submission failed.', { id: toastId });
        setLoading(false);
      }
    } catch {
      toast.error('A system error occurred.', { id: toastId });
      setLoading(false);
    }
  }

  const slideOut = direction === 'forward' ? '-translate-x-8 opacity-0' : 'translate-x-8 opacity-0';
  const panelCls = `transition-all duration-300 ease-in-out ${animating ? slideOut : 'translate-x-0 opacity-100'}`;

  return (
    <div className="upload-page">
      <div className="upload-card">

        {/* Header */}
        <div className="upload-card-header">
          <h1>Script Submission</h1>
          <p>Complete both steps to register your script for evaluation.</p>
        </div>

        {/* Step indicator */}
        <div className="step-bar">
          {STEPS.map((label, i) => (
            <React.Fragment key={i}>
              <div
                className={`step-pip${i === step ? ' active' : i < step ? ' done' : ''}`}
              >
                <span className="dot">
                  {i < step ? (
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : i + 1}
                </span>
                {label}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`step-connector${step > i ? ' filled' : ''}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className={panelCls}>

            {/* STEP 0 — Writer Information */}
            {step === 0 && (
              <div className="upload-fields">
                <div className="field">
                  <label htmlFor="author">Full Name *</label>
                  <input
                    id="author" name="author" type="text"
                    placeholder="e.g., Maria Santos"
                    autoComplete="name"
                    value={fields.author} onChange={handleChange}
                  />
                </div>

                <div className="field">
                  <label htmlFor="address">Address *</label>
                  <input
                    id="address" name="address" type="text"
                    placeholder="e.g., 123 Rizal St., Manila"
                    autoComplete="street-address"
                    value={fields.address} onChange={handleChange}
                  />
                </div>

                <div className="field-row">
                  <div className="field">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      id="phone" name="phone" type="tel"
                      placeholder="+63 9XX XXX XXXX"
                      autoComplete="tel"
                      value={fields.phone} onChange={handleChange}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="email">Email *</label>
                    <input
                      id="email" name="email" type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      value={fields.email} onChange={handleChange}
                    />
                  </div>
                </div>

                <p style={{ fontSize: '.75rem', color: 'var(--text-faint)', marginTop: '.25rem' }}>
                  This information is for the Records Office only and will be stripped before evaluation.
                </p>
              </div>
            )}

            {/* STEP 1 — Script Profile */}
            {step === 1 && (
              <div className="upload-fields">
                <div className="field">
                  <label htmlFor="title">Script Name *</label>
                  <input
                    id="title" name="title" type="text"
                    placeholder="e.g., The Midnight Sonata"
                    value={fields.title} onChange={handleChange}
                  />
                </div>

                <div className="field">
                  <label htmlFor="description">Description *</label>
                  <textarea
                    id="description" name="description"
                    placeholder="Brief synopsis or description of the script…"
                    value={fields.description} onChange={handleChange}
                  />
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  id="scriptFile" name="scriptFile"
                  type="file" accept=".pdf"
                  className="sr-only"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                />

                <div className="field">
                  <label>Script File (PDF) *</label>
                  {selectedFile ? (
                    <div className="file-selected">
                      <div className="info">
                        <svg className="icon" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                          <path fillRule="evenodd" clipRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875Z" />
                        </svg>
                        <div>
                          <p className="name">{selectedFile.name}</p>
                          <p className="size">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => fileInputRef.current?.click()}>Change</button>
                    </div>
                  ) : (
                    <div className="file-zone" role="button" onClick={() => fileInputRef.current?.click()}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.338-2.327 3.75 3.75 0 0 1 3.068 5.01M12 16.5h.008" />
                      </svg>
                      <p><span className="link">Upload a PDF file</span> or click here</p>
                      <p style={{ fontSize: '.75rem', marginTop: '.25rem', color: 'var(--text-faint)' }}>PDF scripts up to 10 MB</p>
                    </div>
                  )}
                </div>

                <p style={{ fontSize: '.75rem', color: 'var(--text-faint)', marginTop: '.25rem' }}>
                  Do not include your name in the script title or file — evaluators review scripts anonymously.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="upload-footer">
            {step === 0 ? (
              <button type="button" className="btn-ghost-upload" onClick={() => router.push('/')}>
                Cancel
              </button>
            ) : (
              <button type="button" className="btn-ghost-upload" onClick={() => goTo(step - 1)}>
                ← Back
              </button>
            )}

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                className="btn-next"
                onClick={() => { if (validateStep0()) goTo(step + 1); }}
              >
                Next →
              </button>
            ) : (
              <button
                type="submit"
                className="btn-submit"
                disabled={loading}
              >
                {loading ? 'Submitting…' : 'Submit Script'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}