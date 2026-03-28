'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { applyRedactionsAndClear } from '@/app/actions/redact-and-clear';
import toast from 'react-hot-toast';

// Assuming you have your EmbedPDF imports configured here...
// The key is the "On Save" or "On Export" logic.

export default function RedactionViewer({ scriptId, fileUrl }: { scriptId: number, fileUrl: string }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const handleFinalize = async (base64Data: string) => {
    setIsSaving(true);
    const res = await applyRedactionsAndClear({
      scriptId,
      redactedPdfBase64: base64Data
    });

    if (res.success) {
      toast.success("Identity stripped. Script moved to cleared pool.");
      router.push('/records/dashboard');
    } else {
      toast.error(res.error || "Error saving");
      setIsSaving(false);
    }
  };

  return (
    <div className="border rounded-xl overflow-hidden h-[800px] bg-gray-100 relative">
       {/* Insert your EmbedPDF component here. 
         Pass fileUrl to the viewer. 
         In your 'Apply Redactions' button click handler, 
         capture the base64 output and call handleFinalize(output).
       */}
       {isSaving && (
         <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-50">
            <p className="font-bold text-indigo-600">Processing Redactions...</p>
         </div>
       )}
    </div>
  );
}