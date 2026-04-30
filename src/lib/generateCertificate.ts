import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';

// 3× scale → 288 dpi on A4 (print-quality)
const SCALE = 3;
const W = 1122;
const H = 794;

const BEIGE = '#faf6ee';
const NAVY  = '#1a2744';
const ORANGE = '#e85d04';

export interface CertData {
  awardee_name: string;
  tutor_name: string;
  tutor_title: string;
  course_name: string;
  from_date: string;
  to_date: string;
  cert_id: string;
}

function fmtDate(d: string): string {
  if (!d) return '';
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function star(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, color: string) {
  const inner = r * 0.4;
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    const rr = i % 2 === 0 ? r : inner;
    if (i === 0) ctx.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
    else ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function arcText(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  radius: number,
  isTop: boolean,
  color: string,
  fontSize: number
) {
  ctx.save();
  ctx.font = `600 ${fontSize}px "Poppins", Arial, sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const chars = text.split('');
  const spacing = 1.8;
  const charWidths = chars.map((c) => ctx.measureText(c).width + spacing);
  const totalAngle = charWidths.reduce((s, cw) => s + cw / radius, 0);

  if (isTop) {
    let a = -Math.PI / 2 - totalAngle / 2;
    chars.forEach((ch, i) => {
      const da = charWidths[i] / radius;
      const mid = a + da / 2;
      ctx.save();
      ctx.translate(cx + radius * Math.cos(mid), cy + radius * Math.sin(mid));
      ctx.rotate(mid + Math.PI / 2);
      ctx.fillText(ch, 0, 0);
      ctx.restore();
      a += da;
    });
  } else {
    let a = Math.PI / 2 + totalAngle / 2;
    chars.forEach((ch, i) => {
      const da = charWidths[i] / radius;
      const mid = a - da / 2;
      ctx.save();
      ctx.translate(cx + radius * Math.cos(mid), cy + radius * Math.sin(mid));
      ctx.rotate(mid - Math.PI / 2);
      ctx.fillText(ch, 0, 0);
      ctx.restore();
      a -= da;
    });
  }
  ctx.restore();
}

// ─────────────────────────────────────────────────────────────────────────────
// Core canvas renderer – all coordinates are in base 1122×794 space;
// ctx.scale(SCALE, SCALE) makes everything SCALE× sharper on the canvas.
// ─────────────────────────────────────────────────────────────────────────────
export async function buildCertificateCanvas(data: CertData): Promise<HTMLCanvasElement> {
  await document.fonts.ready;
  const logoImg      = await loadImg('/ignitech-logo.svg');
  const logoLightImg = await loadImg('/ignitech-logo-light.svg');

  const canvas = document.createElement('canvas');
  canvas.width  = W * SCALE;
  canvas.height = H * SCALE;
  const ctx = canvas.getContext('2d')!;

  // Scale up – all drawing code uses original 1122×794 coordinates
  ctx.scale(SCALE, SCALE);

  // ── BACKGROUND ───────────────────────────────────────────────────────
  ctx.fillStyle = BEIGE;
  ctx.fillRect(0, 0, W, H);

  // ── LEFT SIDE: Ignitech logo, vertically half-sliced ────────────────
  // Scale logo to full certificate height; centre it on the left edge so
  // only the right half is visible – that produces the orange+navy design.
  const logoNatW = (83.75 / 181.88) * H; // preserve logo aspect ratio → ≈366px
  ctx.drawImage(logoImg, -(logoNatW / 2), 0, logoNatW, H);

  // ── TOP-RIGHT IGNITECH LOGO BOX ──────────────────────────────────────
  ctx.save();
  ctx.fillStyle = NAVY;
  roundRect(ctx, 904, 22, 196, 57, 7);
  ctx.fill();
  // Light variant (orange + cream) reads clearly on navy background
  ctx.drawImage(logoLightImg, 913, 28, 19, 41);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 21px "Poppins", Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('Ignitech', 939, 52);
  ctx.restore();

  // ── TITLE ─────────────────────────────────────────────────────────────
  ctx.save();
  ctx.fillStyle = NAVY;
  ctx.font = '900 70px "Poppins", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('CERTIFICATE', 561, 210);
  ctx.fillText('OF COMPLETION', 561, 285);
  ctx.restore();

  // ── "This is to certify that" ─────────────────────────────────────────
  ctx.save();
  ctx.fillStyle = '#666666';
  ctx.font = 'italic 15px "Poppins", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('This is to certify that', 561, 320);
  ctx.restore();

  // ── AWARDEE NAME + UNDERLINE ──────────────────────────────────────────
  ctx.save();
  ctx.strokeStyle = NAVY;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(210, 368);
  ctx.lineTo(950, 368);
  ctx.stroke();
  if (data.awardee_name) {
    ctx.fillStyle = NAVY;
    ctx.font = 'bold 23px "Poppins", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(data.awardee_name, 561, 360);
  }
  ctx.restore();

  // ── BODY TEXT (centred) ───────────────────────────────────────────────
  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  const cx = 561; // same centre as the title

  // Line 1: measure full width first so we can centre it
  const l1y = 400;
  ctx.font = '14px "Poppins", Arial, sans-serif';
  const hasPrefix  = 'has successfully completed the  ';
  const courseStr  = data.course_name || '______________________________';
  const hasPrefixW = ctx.measureText(hasPrefix).width;
  const courseStrW = ctx.measureText(courseStr).width;
  const l1X = cx - (hasPrefixW + courseStrW) / 2;
  ctx.fillStyle = '#333333';
  ctx.fillText(hasPrefix, l1X, l1y);
  ctx.fillText(courseStr, l1X + hasPrefixW, l1y);
  ctx.strokeStyle = '#555555';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(l1X + hasPrefixW, l1y + 3);
  ctx.lineTo(l1X + hasPrefixW + courseStrW, l1y + 3);
  ctx.stroke();

  // Line 2: regular + bold segments, centred together
  const l2y = l1y + 25;
  const trainPrefix = 'training under the ';
  const boldText    = 'IgniTech Talent Development Program.';
  ctx.font = '14px "Poppins", Arial, sans-serif';
  const trainPrefixW = ctx.measureText(trainPrefix).width;
  ctx.font = 'bold 14px "Poppins", Arial, sans-serif';
  const boldTextW = ctx.measureText(boldText).width;
  const l2X = cx - (trainPrefixW + boldTextW) / 2;
  ctx.font = '14px "Poppins", Arial, sans-serif';
  ctx.fillStyle = '#333333';
  ctx.fillText(trainPrefix, l2X, l2y);
  ctx.font = 'bold 14px "Poppins", Arial, sans-serif';
  ctx.fillStyle = NAVY;
  ctx.fillText(boldText, l2X + trainPrefixW, l2y);
  ctx.restore();

  // ── FROM / TO ─────────────────────────────────────────────────────────
  ctx.save();
  ctx.fillStyle = '#444444';
  ctx.font = '13px "Poppins", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  const fromStr = fmtDate(data.from_date) || '___________';
  const toStr   = fmtDate(data.to_date)   || '___________';
  ctx.fillText(`From:   ${fromStr}     to     ${toStr}`, 561, 452);
  ctx.restore();

  // ── CERT ID ───────────────────────────────────────────────────────────
  ctx.save();
  ctx.textBaseline = 'alphabetic';
  const cidLabel = 'Certificate ID: ';
  ctx.font = '13px "Poppins", Arial, sans-serif';
  ctx.fillStyle = '#444444';
  const cidLabelW = ctx.measureText(cidLabel).width;
  ctx.font = 'bold 13px "Poppins", Arial, sans-serif';
  ctx.fillStyle = NAVY;
  const cidValueW = ctx.measureText(data.cert_id).width;
  const cidX = 561 - (cidLabelW + cidValueW) / 2;
  ctx.font = '13px "Poppins", Arial, sans-serif';
  ctx.fillStyle = '#444444';
  ctx.textAlign = 'left';
  ctx.fillText(cidLabel, cidX, 474);
  ctx.font = 'bold 13px "Poppins", Arial, sans-serif';
  ctx.fillStyle = NAVY;
  ctx.fillText(data.cert_id, cidX + cidLabelW, 474);
  ctx.restore();

  // ── CIRCULAR STAMP ────────────────────────────────────────────────────
  const sCX = 470, sCY = 652, sR = 52;
  ctx.save();
  // Dark navy fill
  ctx.fillStyle = NAVY;
  ctx.beginPath();
  ctx.arc(sCX, sCY, sR, 0, Math.PI * 2);
  ctx.fill();
  // White outer ring
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(sCX, sCY, sR, 0, Math.PI * 2);
  ctx.stroke();
  // White inner ring
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(sCX, sCY, sR - 12, 0, Math.PI * 2);
  ctx.stroke();
  // White arc text
  arcText(ctx, 'Ignitech Global Services', sCX, sCY, sR - 5, true,  '#ffffff', 7.5);
  arcText(ctx, 'Ignitech Global Services', sCX, sCY, sR - 5, false, '#ffffff', 7.5);
  // Ignitech logo centred (light variant: orange+cream reads on dark bg)
  // ratio 83.75×181.88 ≈ 0.46 → height 30 → width 14
  ctx.drawImage(logoLightImg, sCX - 7, sCY - 15, 14, 30);
  ctx.restore();

  // ── QR CODE ───────────────────────────────────────────────────────────
  const verifyUrl = `https://ignitech.vercel.app/#verify?id=${data.cert_id}`;
  // Generate at SCALE× size so it stays sharp when drawn at base coords
  const qrPx = 90 * SCALE;
  try {
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      width: qrPx,
      margin: 1,
      errorCorrectionLevel: 'H',
      color: { dark: NAVY, light: BEIGE },
    });
    await new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Draw at base-coord size; ctx.scale handles the upscaling
        ctx.drawImage(img, sCX + sR + 18, sCY - 45, 90, 90);
        resolve();
      };
      img.src = qrDataUrl;
    });
  } catch (e) {
    console.error('QR generation failed', e);
  }

  // ── CEO SIGNATURE (left) ──────────────────────────────────────────────
  const sigY = 700;
  ctx.save();
  ctx.strokeStyle = NAVY;
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(205, sigY); ctx.lineTo(400, sigY); ctx.stroke();
  ctx.font = 'bold 13px "Poppins", Arial, sans-serif';
  ctx.fillStyle = NAVY;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('Ama David Obisiemike', 302, sigY + 8);
  ctx.font = '11px "Poppins", Arial, sans-serif';
  ctx.fillStyle = '#666666';
  ctx.fillText('CEO. IgniTech Global Services Ltd', 302, sigY + 25);
  ctx.restore();

  // ── TUTOR SIGNATURE (right) ───────────────────────────────────────────
  ctx.save();
  ctx.strokeStyle = NAVY;
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(828, sigY); ctx.lineTo(1048, sigY); ctx.stroke();
  ctx.font = 'bold 13px "Poppins", Arial, sans-serif';
  ctx.fillStyle = NAVY;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(data.tutor_name || 'Tutor Name', 938, sigY + 8);
  ctx.font = '11px "Poppins", Arial, sans-serif';
  ctx.fillStyle = '#666666';
  ctx.fillText(data.tutor_title || 'Tutor Title', 938, sigY + 25);
  ctx.restore();

  // ── BOTTOM-RIGHT LOGO MARKS ────────────────────────────────────────────
  ctx.drawImage(logoImg, 1073, 731, 13, 28);
  ctx.drawImage(logoImg, 1076, 759, 10, 22);

  return canvas;
}

// ─────────────────────────────────────────────────────────────────────────────
// Export helpers
// ─────────────────────────────────────────────────────────────────────────────

function fileBase(data: CertData): string {
  return `${data.cert_id}_${(data.awardee_name || 'certificate').replace(/\s+/g, '_')}`;
}

export async function downloadAsPDF(data: CertData): Promise<void> {
  const canvas = await buildCertificateCanvas(data);
  // Use JPEG at 98 % quality – smaller file than PNG while still visually lossless
  const imgData = canvas.toDataURL('image/jpeg', 0.98);
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210);
  pdf.save(`${fileBase(data)}.pdf`);
}

export async function downloadAsPNG(data: CertData): Promise<void> {
  const canvas = await buildCertificateCanvas(data);
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileBase(data)}.png`;
  a.click();
}

export async function downloadBoth(data: CertData): Promise<void> {
  // Build once, download twice — avoids rendering the canvas twice
  const canvas = await buildCertificateCanvas(data);
  const base = fileBase(data);

  // PNG
  const pngUrl = canvas.toDataURL('image/png');
  const pngLink = document.createElement('a');
  pngLink.href = pngUrl;
  pngLink.download = `${base}.png`;
  pngLink.click();

  // PDF (slight delay so browsers don't block the second download)
  await new Promise((r) => setTimeout(r, 400));
  const jpgData = canvas.toDataURL('image/jpeg', 0.98);
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  pdf.addImage(jpgData, 'JPEG', 0, 0, 297, 210);
  pdf.save(`${base}.pdf`);
}
