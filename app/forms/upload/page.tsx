// app/forms/upload/page.tsx
'use client'

import { useState, useRef } from 'react';
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

  // ── Form field state ──────────────────────────────────────────────────────
  const [fields, setFields] = useState({
    author: '', address: '', phone: '', email: '',
    title: '', description: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFields(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // ── Step navigation with slide animation ─────────────────────────────────
  function goTo(next: number) {
    if (animating) return;
    setDirection(next > step ? 'forward' : 'back');
    setAnimating(true);
    setTimeout(() => {
      setStep(next);
      setAnimating(false);
    }, 320);
  }

  // ── Validate current step before advancing ────────────────────────────────
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

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep1()) return;

    setLoading(true);
    const toastId = toast.loading('Uploading to secure vault...');

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

  // ── Slide animation classes ───────────────────────────────────────────────
  const slideOut = direction === 'forward' ? '-translate-x-8 opacity-0' : 'translate-x-8 opacity-0';
  const panelCls = `transition-all duration-300 ease-in-out ${animating ? slideOut : 'translate-x-0 opacity-100'}`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Inter', sans-serif;
          background: #0f0f14;
          min-height: 100vh;
        }

        .upload-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,.18) 0%, transparent 70%),
                      #0f0f14;
        }

        .card {
          width: 100%;
          max-width: 560px;
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.10);
          border-radius: 20px;
          padding: 2.5rem 2.5rem 2rem;
          backdrop-filter: blur(20px);
          box-shadow: 0 24px 80px rgba(0,0,0,.55);
        }

        /* ── Header ── */
        .card-header { margin-bottom: 2rem; }
        .card-header h1 {
          font-size: 1.6rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -.5px;
        }
        .card-header p { font-size: .875rem; color: rgba(255,255,255,.45); margin-top: .25rem; }

        /* ── Step indicator ── */
        .step-bar {
          display: flex;
          align-items: center;
          gap: .5rem;
          margin-bottom: 2rem;
        }
        .step-pip {
          display: flex;
          align-items: center;
          gap: .5rem;
          font-size: .75rem;
          font-weight: 600;
          color: rgba(255,255,255,.35);
          transition: color .3s;
        }
        .step-pip.active  { color: #818cf8; }
        .step-pip.done    { color: #4ade80; }
        .step-pip .dot {
          width: 22px; height: 22px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: .7rem; font-weight: 700;
          border: 2px solid rgba(255,255,255,.15);
          background: transparent;
          transition: all .3s;
          flex-shrink: 0;
        }
        .step-pip.active .dot  { border-color: #818cf8; background: rgba(129,140,248,.15); color: #818cf8; }
        .step-pip.done   .dot  { border-color: #4ade80; background: rgba(74,222,128,.12); color: #4ade80; }
        .step-connector {
          flex: 1; height: 1px;
          background: rgba(255,255,255,.08);
          position: relative; overflow: hidden;
        }
        .step-connector::after {
          content: '';
          position: absolute; inset: 0;
          background: #818cf8;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform .4s ease;
        }
        .step-connector.filled::after { transform: scaleX(1); }

        /* ── Fields ── */
        .fields { display: flex; flex-direction: column; gap: 1.1rem; }

        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        @media (max-width: 480px) { .field-row { grid-template-columns: 1fr; } }

        .field label {
          display: block;
          font-size: .78rem; font-weight: 600;
          color: rgba(255,255,255,.55);
          margin-bottom: .4rem;
          letter-spacing: .03em;
          text-transform: uppercase;
        }

        .field input, .field textarea {
          width: 100%;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 10px;
          padding: .7rem 1rem;
          font-size: .9rem;
          color: #fff;
          font-family: inherit;
          outline: none;
          transition: border-color .2s, background .2s;
        }
        .field input::placeholder, .field textarea::placeholder { color: rgba(255,255,255,.22); }
        .field input:focus, .field textarea:focus {
          border-color: #818cf8;
          background: rgba(129,140,248,.08);
        }
        .field textarea { resize: vertical; min-height: 90px; }

        /* ── File upload ── */
        .file-zone {
          border: 1.5px dashed rgba(255,255,255,.18);
          border-radius: 12px;
          padding: 1.8rem 1rem;
          text-align: center;
          cursor: pointer;
          transition: border-color .2s, background .2s;
          background: rgba(255,255,255,.03);
        }
        .file-zone:hover { border-color: #818cf8; background: rgba(129,140,248,.06); }
        .file-zone svg   { color: rgba(255,255,255,.2); margin-bottom: .6rem; }
        .file-zone p     { font-size: .85rem; color: rgba(255,255,255,.45); }
        .file-zone .link { color: #818cf8; font-weight: 600; }

        .file-selected {
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(74,222,128,.06);
          border: 1px solid rgba(74,222,128,.2);
          border-radius: 12px;
          padding: .9rem 1.2rem;
        }
        .file-selected .info   { display: flex; align-items: center; gap: .75rem; }
        .file-selected .icon   { color: #f87171; flex-shrink: 0; }
        .file-selected .name   { font-size: .85rem; font-weight: 600; color: #fff; }
        .file-selected .size   { font-size: .75rem; color: rgba(255,255,255,.4); }
        .file-selected button  {
          font-size: .8rem; font-weight: 600; color: #818cf8;
          background: none; border: none; cursor: pointer;
        }
        .file-selected button:hover { color: #a5b4fc; }

        /* ── Footer buttons ── */
        .footer {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255,255,255,.07);
        }

        .btn-ghost {
          background: none; border: none; cursor: pointer;
          font-size: .875rem; font-weight: 600;
          color: rgba(255,255,255,.4);
          padding: .5rem;
          transition: color .2s;
        }
        .btn-ghost:hover { color: rgba(255,255,255,.7); }

        .btn-primary {
          display: inline-flex; align-items: center; gap: .4rem;
          background: #4f46e5;
          color: #fff;
          font-family: inherit;
          font-size: .875rem; font-weight: 700;
          padding: .65rem 1.6rem;
          border: none; border-radius: 10px; cursor: pointer;
          transition: background .2s, transform .1s;
        }
        .btn-primary:hover:not(:disabled)  { background: #4338ca; transform: translateY(-1px); }
        .btn-primary:active:not(:disabled) { transform: translateY(0); }
        .btn-primary:disabled { opacity: .5; cursor: not-allowed; }

        .btn-next {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
        }
        .btn-next:hover:not(:disabled) { background: linear-gradient(135deg, #4338ca, #6d28d9); }
      `}</style>

      <div className="upload-page">
        <div className="card">

          {/* ── Header ── */}
          <div className="card-header">
            <h1>Script Submission</h1>
            <p>Complete both steps to register your script for evaluation.</p>
          </div>

          {/* ── Step indicator ── */}
          <div className="step-bar">
            {STEPS.map((label, i) => (
              <>
                <div
                  key={label}
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
                  <div key={`conn-${i}`} className={`step-connector${step > i ? ' filled' : ''}`} />
                )}
              </>
            ))}
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit}>

            {/* ── Panel with slide animation ── */}
            <div className={panelCls}>

              {/* STEP 0 — Writer Information */}
              {step === 0 && (
                <div className="fields">
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

                  <p style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.3)', marginTop: '.25rem' }}>
                    This information is for the Records Office only and will be stripped before evaluation.
                  </p>
                </div>
              )}

              {/* STEP 1 — Script Profile */}
              {step === 1 && (
                <div className="fields">
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
                        <p style={{ fontSize: '.75rem', marginTop: '.25rem', color: 'rgba(255,255,255,.25)' }}>PDF scripts up to 10 MB</p>
                      </div>
                    )}
                  </div>

                  <p style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.3)', marginTop: '.25rem' }}>
                    Do not include your name in the script title or file — evaluators review scripts anonymously.
                  </p>
                </div>
              )}
            </div>

            {/* ── Footer ── */}
            <div className="footer">
              {/* Left: Cancel / Back */}
              {step === 0 ? (
                <button type="button" className="btn-ghost" onClick={() => router.push('/')}>
                  Cancel
                </button>
              ) : (
                <button type="button" className="btn-ghost" onClick={() => goTo(step - 1)}>
                  ← Back
                </button>
              )}

              {/* Right: Next / Submit */}
              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  className="btn-primary btn-next"
                  onClick={() => { if (validateStep0()) goTo(step + 1); }}
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Submitting…' : 'Submit Script'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}