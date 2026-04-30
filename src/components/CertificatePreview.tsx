import { QRCodeSVG } from 'qrcode.react';

interface Props {
  awardee_name: string;
  tutor_name: string;
  tutor_title: string;
  course_name: string;
  from_date: string;
  to_date: string;
  cert_id: string;
}

const NAVY = '#1a2744';
const ORANGE = '#e85d04';
const BEIGE = '#faf6ee';

function fmtDate(d: string) {
  if (!d) return '';
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function CertificatePreview({
  awardee_name,
  tutor_name,
  tutor_title,
  course_name,
  from_date,
  to_date,
  cert_id,
}: Props) {
  const verifyUrl = `https://ignitech.vercel.app/#verify?id=${cert_id}`;

  return (
    <div
      id="cert-preview"
      style={{
        width: '1122px',
        height: '794px',
        backgroundColor: BEIGE,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Poppins', Arial, sans-serif",
      }}
    >
      {/* ── Left side: Ignitech logo vertically half-sliced ── */}
      {/* Logo is scaled to full height and centred on the left edge so only   */}
      {/* the right half is visible, producing the orange + navy side design.  */}
      <img
        src="/ignitech-logo.svg"
        alt=""
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: 'auto',
          transform: 'translateX(-50%)',
        }}
      />

      {/* ── Top-right Ignitech logo box ── */}
      <div style={{
        position: 'absolute', top: '22px', right: '22px',
        backgroundColor: NAVY, borderRadius: '7px',
        padding: '12px 20px 12px 14px',
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <img src="/ignitech-logo-light.svg" alt="" style={{ height: '36px', width: 'auto' }} />
        <span style={{ color: '#fff', fontWeight: 700, fontSize: '20px', letterSpacing: '0.3px' }}>Ignitech</span>
      </div>

      {/* ── Title ── */}
      <div style={{
        position: 'absolute', top: '130px', left: 0, right: 0,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '70px', fontWeight: 900, color: NAVY, lineHeight: 1.05, letterSpacing: '1px' }}>
          CERTIFICATE
        </div>
        <div style={{ fontSize: '70px', fontWeight: 900, color: NAVY, lineHeight: 1.05, letterSpacing: '1px' }}>
          OF COMPLETION
        </div>
      </div>

      {/* ── "This is to certify that" ── */}
      <div style={{
        position: 'absolute', top: '305px', left: 0, right: 0,
        textAlign: 'center', fontSize: '15px', fontStyle: 'italic', color: '#666',
      }}>
        This is to certify that
      </div>

      {/* ── Awardee name + underline ── */}
      <div style={{
        position: 'absolute', top: '330px', left: '210px', right: '172px',
        textAlign: 'center',
        borderBottom: `1.5px solid ${NAVY}`,
        paddingBottom: '6px',
      }}>
        <span style={{ fontSize: '23px', fontWeight: 700, color: NAVY }}>
          {awardee_name}
        </span>
      </div>

      {/* ── Body text ── */}
      <div style={{
        position: 'absolute', top: '388px', left: '210px', right: '172px',
        fontSize: '14px', color: '#333', lineHeight: '1.7',
        textAlign: 'center',
      }}>
        <div>
          has successfully completed the&nbsp;&nbsp;
          <span style={{ borderBottom: '1px solid #555' }}>
            {course_name || '_______________________________'}
          </span>
        </div>
        <div>
          training under the&nbsp;
          <strong style={{ color: NAVY }}>IgniTech Talent Development Program.</strong>
        </div>
      </div>

      {/* ── Dates ── */}
      <div style={{
        position: 'absolute', top: '450px', left: 0, right: 0,
        textAlign: 'center', fontSize: '13px', color: '#444',
      }}>
        From:&nbsp;&nbsp;{fmtDate(from_date) || '___________'}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;to&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{fmtDate(to_date) || '___________'}
      </div>

      {/* ── Certificate ID ── */}
      <div style={{
        position: 'absolute', top: '472px', left: 0, right: 0,
        textAlign: 'center', fontSize: '13px', color: '#444',
      }}>
        Certificate ID:&nbsp;<strong style={{ color: NAVY }}>{cert_id}</strong>
      </div>

      {/* ── Circular stamp ── */}
      <div style={{
        position: 'absolute', bottom: '78px', left: '418px',
        width: '106px', height: '106px',
      }}>
        <svg width="106" height="106" viewBox="0 0 106 106">
          {/* Dark navy fill */}
          <circle cx="53" cy="53" r="51" fill={NAVY} stroke="white" strokeWidth="2.5" />
          {/* White inner ring */}
          <circle cx="53" cy="53" r="39" stroke="white" strokeWidth="1.5" fill="none" />
          <defs>
            <path id="topArc" d="M 8,53 A 45,45 0 0,1 98,53" />
            <path id="botArc" d="M 8,53 A 45,45 0 0,0 98,53" />
          </defs>
          {/* White arc text */}
          <text fill="white" fontSize="7.5" fontWeight="600" fontFamily="Poppins, Arial, sans-serif" letterSpacing="1.8">
            <textPath href="#topArc" startOffset="50%" textAnchor="middle">Ignitech Global Services</textPath>
          </text>
          <text fill="white" fontSize="7.5" fontWeight="600" fontFamily="Poppins, Arial, sans-serif" letterSpacing="1.8">
            <textPath href="#botArc" startOffset="50%" textAnchor="middle">Ignitech Global Services</textPath>
          </text>
          {/* Ignitech logo centred – light variant (orange+cream) on dark bg */}
          <image href="/ignitech-logo-light.svg" x="45" y="37" width="15" height="32" />
        </svg>
      </div>

      {/* ── QR code (right of stamp) ── */}
      {cert_id && (
        <div style={{
          position: 'absolute', bottom: '80px', left: '544px',
          backgroundColor: BEIGE, padding: '3px', borderRadius: '3px',
        }}>
          <QRCodeSVG value={verifyUrl} size={90} level="M" fgColor={NAVY} bgColor={BEIGE} />
        </div>
      )}

      {/* ── CEO signature (left) ── */}
      <div style={{
        position: 'absolute', bottom: '52px', left: '205px',
        width: '200px', textAlign: 'center',
      }}>
        <div style={{ borderBottom: `1.5px solid ${NAVY}`, marginBottom: '8px' }} />
        <div style={{ fontSize: '13px', fontWeight: 700, color: NAVY }}>Ama David Obisiemike</div>
        <div style={{ fontSize: '11px', color: '#666', marginTop: '3px' }}>CEO. IgniTech Global Services Ltd</div>
      </div>

      {/* ── Tutor signature (right) ── */}
      <div style={{
        position: 'absolute', bottom: '52px', right: '72px',
        width: '224px', textAlign: 'center',
      }}>
        <div style={{ borderBottom: `1.5px solid ${NAVY}`, marginBottom: '8px' }} />
        <div style={{ fontSize: '13px', fontWeight: 700, color: NAVY }}>{tutor_name || 'Tutor Name'}</div>
        <div style={{ fontSize: '11px', color: '#666', marginTop: '3px' }}>{tutor_title || 'Tutor Title'}</div>
      </div>

      {/* ── Bottom-right logo marks ── */}
      <div style={{ position: 'absolute', bottom: '20px', right: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
        <img src="/ignitech-logo.svg" alt="" style={{ height: '28px', width: 'auto' }} />
        <img src="/ignitech-logo.svg" alt="" style={{ height: '22px', width: 'auto' }} />
      </div>
    </div>
  );
}
