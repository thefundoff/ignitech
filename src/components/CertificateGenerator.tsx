import { useState } from 'react';
import { Loader, Award, FileImage, FileText, Files } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { downloadAsPDF, downloadAsPNG, downloadBoth } from '../lib/generateCertificate';
import CertificatePreview from './CertificatePreview';
import type { CertificateFormData } from '../types/certificate';

const EMPTY: CertificateFormData = {
  awardee_name: '',
  tutor_name: '',
  tutor_title: '',
  course_name: '',
  from_date: '',
  to_date: '',
};

async function nextCertId(): Promise<string> {
  const year = new Date().getFullYear();
  const { count } = await supabase
    .from('certificates')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', `${year}-01-01T00:00:00Z`);
  const n = ((count ?? 0) + 1).toString().padStart(4, '0');
  return `IGN-${year}-${n}`;
}

type Format = 'pdf' | 'png' | 'both';

export default function CertificateGenerator() {
  const [form, setForm]       = useState<CertificateFormData>(EMPTY);
  const [busy, setBusy]       = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError]     = useState('');

  const previewCertId = `IGN-${new Date().getFullYear()}-XXXX`;

  const set = (k: keyof CertificateFormData, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    setSuccess('');
    setError('');
  };

  const validate = () => {
    const { awardee_name, tutor_name, tutor_title, course_name, from_date, to_date } = form;
    return awardee_name && tutor_name && tutor_title && course_name && from_date && to_date;
  };

  const handleGenerate = async (format: Format) => {
    if (!validate()) { setError('Please fill in all fields.'); return; }
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      const cert_id = await nextCertId();
      const certData = { ...form, cert_id };

      if (format === 'pdf')  await downloadAsPDF(certData);
      if (format === 'png')  await downloadAsPNG(certData);
      if (format === 'both') await downloadBoth(certData);

      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('certificates').insert({
        cert_id,
        awardee_name:  form.awardee_name,
        tutor_name:    form.tutor_name,
        tutor_title:   form.tutor_title,
        course_name:   form.course_name,
        from_date:     form.from_date,
        to_date:       form.to_date,
        created_by:    user?.id ?? null,
      });

      const label = format === 'both' ? 'PDF + PNG' : format.toUpperCase();
      setSuccess(`${cert_id} generated and downloaded as ${label}.`);
      setForm(EMPTY);
    } catch (err) {
      console.error(err);
      setError('Failed to generate certificate. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section id="certificate-generator" className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Award className="w-4 h-4" />
            Admin — Certificate Generator
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Generate Certificate</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto" />
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* ── Form ── */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Certificate Details</h3>
            <div className="space-y-5">
              <Field label="Awardee Name" value={form.awardee_name} onChange={(v) => set('awardee_name', v)} placeholder="Full name of the recipient" />
              <Field label="Course / Training Name" value={form.course_name} onChange={(v) => set('course_name', v)} placeholder="e.g. Social Media Marketing" />
              <div className="grid grid-cols-2 gap-4">
                <Field label="From Date" type="date" value={form.from_date} onChange={(v) => set('from_date', v)} />
                <Field label="To Date"   type="date" value={form.to_date}   onChange={(v) => set('to_date',   v)} />
              </div>
              <Field label="Tutor / Trainer Name"  value={form.tutor_name}  onChange={(v) => set('tutor_name',  v)} placeholder="e.g. Peter Benedict Chinenye" />
              <Field label="Tutor Title / Role"    value={form.tutor_title} onChange={(v) => set('tutor_title', v)} placeholder="e.g. SMM Trainer & Project Lead IGSL" />

              {error   && <p className="text-red-600   text-sm bg-red-50   px-4 py-3 rounded-lg">{error}</p>}
              {success && <p className="text-green-700 text-sm bg-green-50 px-4 py-3 rounded-lg">{success}</p>}

              {/* Download buttons */}
              <div className="grid grid-cols-3 gap-3 pt-1">
                <DownloadBtn
                  label="PDF"
                  icon={<FileText className="w-4 h-4" />}
                  busy={busy}
                  onClick={() => handleGenerate('pdf')}
                  className="bg-blue-600 hover:bg-blue-700"
                />
                <DownloadBtn
                  label="PNG"
                  icon={<FileImage className="w-4 h-4" />}
                  busy={busy}
                  onClick={() => handleGenerate('png')}
                  className="bg-emerald-600 hover:bg-emerald-700"
                />
                <DownloadBtn
                  label="Both"
                  icon={<Files className="w-4 h-4" />}
                  busy={busy}
                  onClick={() => handleGenerate('both')}
                  className="bg-orange-600 hover:bg-orange-700"
                />
              </div>
              <p className="text-xs text-gray-400 text-center -mt-1">
                All formats render at 3× resolution (288 dpi — print quality)
              </p>
            </div>
          </div>

          {/* ── Live Preview ── */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Live Preview</h3>
            <div
              className="rounded-xl shadow-xl border border-gray-200 overflow-hidden"
              style={{ width: '617px', height: '437px' }}
            >
              <div style={{ transform: 'scale(0.55)', transformOrigin: 'top left', width: '1122px', height: '794px' }}>
                <CertificatePreview
                  awardee_name={form.awardee_name}
                  tutor_name={form.tutor_name}
                  tutor_title={form.tutor_title}
                  course_name={form.course_name}
                  from_date={form.from_date}
                  to_date={form.to_date}
                  cert_id={previewCertId}
                />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Preview scaled to fit — downloads will be full A4 size at 288 dpi.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Small helpers ──────────────────────────────────────────────────────────

function Field({
  label, value, onChange, placeholder = '', type = 'text',
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      />
    </div>
  );
}

function DownloadBtn({
  label, icon, busy, onClick, className,
}: {
  label: string; icon: React.ReactNode; busy: boolean;
  onClick: () => void; className: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={busy}
      className={`${className} text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow`}
    >
      {busy ? <Loader className="w-4 h-4 animate-spin" /> : icon}
      {busy ? '…' : label}
    </button>
  );
}
