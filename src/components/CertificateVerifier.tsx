import { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Loader, Printer } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Certificate } from '../types/certificate';

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function CertificateVerifier() {
  const [certId, setCertId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Certificate | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Auto-lookup when navigated to via QR code (#verify?id=...)
  useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/[?&]id=([^&]+)/);
    if (match) {
      const id = decodeURIComponent(match[1]);
      setCertId(id);
      lookup(id);
    }
  }, []);

  const lookup = async (id: string) => {
    const query = id.trim().toUpperCase();
    if (!query) return;
    setLoading(true);
    setResult(null);
    setNotFound(false);

    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('cert_id', query)
      .single();

    if (error || !data) {
      setNotFound(true);
    } else {
      setResult(data as Certificate);
    }
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    lookup(certId);
  };

  return (
    <section id="verify" className="py-20 px-6 bg-white">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Verify Certificate</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-600">Enter a Certificate ID to verify its authenticity.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
          <input
            type="text"
            value={certId}
            onChange={(e) => { setCertId(e.target.value); setResult(null); setNotFound(false); }}
            className="flex-1 px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm transition-all"
            placeholder="e.g. IGN-2026-0001"
          />
          <button
            type="submit"
            disabled={loading || !certId.trim()}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Verify
          </button>
        </form>

        {result && (
          <>
            <style>{`
              @media print {
                body * { visibility: hidden; }
                #ignitech-verify-card, #ignitech-verify-card * { visibility: visible; }
                #ignitech-verify-card { position: absolute; left: 0; top: 0; width: 100%; padding: 40px; box-shadow: none; border: none; }
              }
            `}</style>

            <div id="ignitech-verify-card" className="bg-green-50 border border-green-200 rounded-2xl p-8 shadow-md">
              {/* ── Branding header ── */}
              <div className="flex items-start justify-between mb-6 pb-5 border-b border-green-200">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-green-800">Certificate Verified</h3>
                    <p className="text-green-600 text-sm">This is an authentic IgniTech certificate.</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0 ml-4">
                  <img src="/ignitech-logo.svg" alt="IgniTech" style={{ height: '44px', width: 'auto' }} />
                  <span className="text-xs text-gray-500 font-medium">IgniTech Global Services Ltd</span>
                </div>
              </div>

              {/* ── Certificate details ── */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 font-semibold mb-1">Certificate ID</p>
                  <p className="text-gray-900 font-mono font-bold">{result.cert_id}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-semibold mb-1">Awardee</p>
                  <p className="text-gray-900 font-semibold">{result.awardee_name}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-semibold mb-1">Course</p>
                  <p className="text-gray-900">{result.course_name}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-semibold mb-1">Tutor</p>
                  <p className="text-gray-900">{result.tutor_name}</p>
                  <p className="text-gray-500 text-xs">{result.tutor_title}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-semibold mb-1">Training Period</p>
                  <p className="text-gray-900">{formatDate(result.from_date)} — {formatDate(result.to_date)}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-semibold mb-1">Issued</p>
                  <p className="text-gray-900">{formatDate(result.created_at.split('T')[0])}</p>
                </div>
              </div>

              {/* ── Print button (hidden when printing) ── */}
              <div className="mt-6 flex justify-end print:hidden">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-700 transition-all"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
              </div>
            </div>
          </>
        )}

        {notFound && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 shadow-md flex items-start gap-4">
            <XCircle className="w-8 h-8 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-bold text-red-700 mb-1">Certificate Not Found</h3>
              <p className="text-red-600 text-sm">
                No certificate was found with the ID <strong>{certId.trim().toUpperCase()}</strong>. Please check the ID and try again.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
