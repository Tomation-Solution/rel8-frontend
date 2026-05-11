import {} from "react";
import { useQuery } from "react-query";
import { fetchUserDues } from "../../../api/account/account-api";
import { useAppContext } from "../../../context/authContext";
import { getTenantInfo } from "../../../utils/constants";
import CircleLoader from "../../../components/loaders/CircleLoader";
import { getInitials } from "../../../utils/strings";

// ── helpers ────────────────────────────────────────────────────────────────

const isCurrentYear = (isoDate?: string): boolean => {
  if (!isoDate) return true;
  return new Date(isoDate).getFullYear() === new Date().getFullYear();
};

const currentYear = new Date().getFullYear();

const fmtDate = (d: Date): string => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

// Read actual hex values from org theme — avoids CSS-variable issues in html2canvas
const getCardColors = (organization: any): { primary: string; secondary: string } => ({
  primary: organization?.colorTheme?.primary ?? "#1a56db",
  secondary: organization?.colorTheme?.secondary ?? "#0e3d91",
});

// ── card dimensions (px) ───────────────────────────────────────────────────
const CARD_W = 340;
const CARD_H = 214;

// ── PDF download ─────────────────────────────────────────────────────────────
//
// Draws both card faces directly onto a Canvas 2D context (no html2canvas /
// DOM cloning) then embeds the result into an A4 PDF page via jsPDF.
// This eliminates every text-clipping and layout-drift problem caused by
// html2canvas trying to re-render live DOM nodes.

const A4_W_MM = 210;
const A4_H_MM = 297;
const MM_TO_PX = 96 / 25.4; // 1 mm in CSS px at 96 dpi
const SCALE = 3; // retina-quality canvas

// helpers
const mm2px = (mm: number) => mm * MM_TO_PX * SCALE;
const A4_W = mm2px(A4_W_MM);
const A4_H = mm2px(A4_H_MM);

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

function drawCircleDecor(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.10)";
  ctx.fill();
  ctx.restore();
}

async function loadImage(url: string): Promise<HTMLImageElement | null> {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

function drawFrontCard(
  ctx: CanvasRenderingContext2D,
  ox: number,
  oy: number,
  cw: number,
  ch: number,
  opts: {
    primaryColor: string;
    secondaryColor: string;
    orgName: string;
    orgLogoImg: HTMLImageElement | null;
    memberName: string;
    memberImg: HTMLImageElement | null;
    memberId: string;
    groups: string;
    validFrom: string;
    validTo: string;
  },
) {
  const r = 16 * SCALE;
  const { primaryColor, secondaryColor } = opts;

  ctx.save();
  roundRect(ctx, ox, oy, cw, ch, r);
  ctx.clip();

  // background gradient
  const grad = ctx.createLinearGradient(ox, oy, ox + cw, oy + ch);
  grad.addColorStop(0, primaryColor);
  grad.addColorStop(1, secondaryColor);
  ctx.fillStyle = grad;
  ctx.fillRect(ox, oy, cw, ch);

  // decorative corner circles (drawn after clip — bleed naturally into corners)
  ctx.fillStyle = "rgba(255,255,255,0.10)";
  ctx.beginPath();
  ctx.arc(ox + cw - 10 * SCALE, oy - 10 * SCALE, 70 * SCALE, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(ox + 10 * SCALE, oy + ch + 10 * SCALE, 80 * SCALE, 0, Math.PI * 2);
  ctx.fill();

  // ── header row ──────────────────────────────────────────────────────────
  const headerY = oy + 14 * SCALE;
  const logoSize = 28 * SCALE;

  if (opts.orgLogoImg) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(ox + 20 * SCALE + logoSize / 2, headerY + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(opts.orgLogoImg, ox + 20 * SCALE, headerY, logoSize, logoSize);
    ctx.restore();
  } else {
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.beginPath();
    ctx.arc(ox + 20 * SCALE + logoSize / 2, headerY + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = primaryColor;
    ctx.font = `700 ${10 * SCALE}px system-ui`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(getInitials(opts.orgName), ox + 20 * SCALE + logoSize / 2, headerY + logoSize / 2);
  }

  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.font = `600 ${11 * SCALE}px system-ui`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(opts.orgName, ox + (20 + logoSize / SCALE + 8) * SCALE, headerY + logoSize / 2, 160 * SCALE);

  // MEMBER badge
  ctx.fillStyle = "rgba(255,255,255,0.20)";
  const badgeW = 54 * SCALE;
  const badgeH = 18 * SCALE;
  const badgeX = ox + cw - 20 * SCALE - badgeW;
  const badgeY = headerY + (logoSize - badgeH) / 2;
  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 9 * SCALE);
  ctx.fill();
  ctx.fillStyle = "white";
  ctx.font = `900 ${9 * SCALE}px system-ui`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("MEMBER", badgeX + badgeW / 2, badgeY + badgeH / 2);

  // ── avatar + name block ─────────────────────────────────────────────────
  const avatarTop = oy + 56 * SCALE;
  const avatarSize = 60 * SCALE;
  const avatarX = ox + 20 * SCALE;
  const avatarY = avatarTop;
  const avatarR = 12 * SCALE;

  if (opts.memberImg) {
    ctx.save();
    roundRect(ctx, avatarX, avatarY, avatarSize, avatarSize, avatarR);
    ctx.clip();
    ctx.drawImage(opts.memberImg, avatarX, avatarY, avatarSize, avatarSize);
    ctx.restore();
  } else {
    ctx.fillStyle = "rgba(255,255,255,0.20)";
    roundRect(ctx, avatarX, avatarY, avatarSize, avatarSize, avatarR);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.font = `700 ${20 * SCALE}px system-ui`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(getInitials(opts.memberName), avatarX + avatarSize / 2, avatarY + avatarSize / 2);
  }

  ctx.strokeStyle = "rgba(255,255,255,0.40)";
  ctx.lineWidth = 2 * SCALE;
  roundRect(ctx, avatarX, avatarY, avatarSize, avatarSize, avatarR);
  ctx.stroke();

  const textX = avatarX + avatarSize + 16 * SCALE;
  const maxTW = cw - avatarSize - 56 * SCALE;

  ctx.fillStyle = "white";
  ctx.font = `700 ${14 * SCALE}px system-ui`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(opts.memberName, textX, avatarY + 4 * SCALE, maxTW);

  if (opts.groups) {
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.font = `400 ${10 * SCALE}px system-ui`;
    ctx.fillText(opts.groups, textX, avatarY + 22 * SCALE, maxTW);
  }

  ctx.fillStyle = "rgba(255,255,255,0.60)";
  ctx.font = `400 ${10 * SCALE}px monospace`;
  ctx.fillText(`ID ${opts.memberId}`, textX, avatarY + (opts.groups ? 38 : 22) * SCALE, maxTW);

  // ── valid bar ───────────────────────────────────────────────────────────
  const barH = 28 * SCALE;
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.fillRect(ox, oy + ch - barH, cw, barH);
  ctx.fillStyle = "rgba(255,255,255,0.70)";
  ctx.font = `600 ${9 * SCALE}px system-ui`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("VALID", ox + 20 * SCALE, oy + ch - barH / 2);
  ctx.fillStyle = "white";
  ctx.font = `600 ${10 * SCALE}px monospace`;
  ctx.textAlign = "right";
  ctx.fillText(`${opts.validFrom} - ${opts.validTo}`, ox + cw - 20 * SCALE, oy + ch - barH / 2);

  ctx.restore();
}

function drawBackCard(
  ctx: CanvasRenderingContext2D,
  ox: number,
  oy: number,
  cw: number,
  ch: number,
  opts: {
    primaryColor: string;
    secondaryColor: string;
    orgName: string;
    orgLogoImg: HTMLImageElement | null;
    email?: string;
    phone?: string;
    website?: string;
    yearEstablished?: number;
  },
) {
  const r = 16 * SCALE;
  const { primaryColor, secondaryColor } = opts;

  ctx.save();
  roundRect(ctx, ox, oy, cw, ch, r);
  ctx.clip();

  const grad = ctx.createLinearGradient(ox + cw, oy + ch, ox, oy);
  grad.addColorStop(0, secondaryColor);
  grad.addColorStop(1, primaryColor);
  ctx.fillStyle = grad;
  ctx.fillRect(ox, oy, cw, ch);

  // decorative corner circles (mirrored vs front card)
  ctx.fillStyle = "rgba(255,255,255,0.10)";
  ctx.beginPath();
  ctx.arc(ox + 10 * SCALE, oy - 10 * SCALE, 70 * SCALE, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(ox + cw - 10 * SCALE, oy + ch + 10 * SCALE, 80 * SCALE, 0, Math.PI * 2);
  ctx.fill();

  // magnetic stripe
  ctx.fillStyle = "rgba(0,0,0,0.40)";
  ctx.fillRect(ox, oy + 28 * SCALE, cw, 10 * SCALE);

  // ── centre content ──────────────────────────────────────────────────────
  const centerX = ox + cw / 2;
  let curY = oy + 58 * SCALE;

  if (opts.orgLogoImg) {
    const logoH = 38 * SCALE;
    const logoW = Math.min(130 * SCALE, logoH * 4);
    const logoX = centerX - logoW / 2;
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    roundRect(ctx, logoX - 10 * SCALE, curY - 4 * SCALE, logoW + 20 * SCALE, logoH + 8 * SCALE, 8 * SCALE);
    ctx.fill();
    ctx.drawImage(opts.orgLogoImg, logoX, curY, logoW, logoH);
    curY += logoH + 12 * SCALE;
  } else {
    const iSize = 40 * SCALE;
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.beginPath();
    ctx.arc(centerX, curY + iSize / 2, iSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = primaryColor;
    ctx.font = `700 ${15 * SCALE}px system-ui`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(getInitials(opts.orgName), centerX, curY + iSize / 2);
    curY += iSize + 12 * SCALE;
  }

  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.font = `700 ${12 * SCALE}px system-ui`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(opts.orgName, centerX, curY, cw - 40 * SCALE);
  curY += 18 * SCALE;

  if (opts.yearEstablished) {
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = `400 ${9 * SCALE}px system-ui`;
    ctx.fillText(`Est. ${opts.yearEstablished}`, centerX, curY);
    curY += 14 * SCALE;
  }

  curY += 4 * SCALE;
  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.lineWidth = 1 * SCALE;
  const divW = cw * 0.55;
  ctx.beginPath();
  ctx.moveTo(centerX - divW / 2, curY);
  ctx.lineTo(centerX + divW / 2, curY);
  ctx.stroke();
  curY += 10 * SCALE;

  ctx.fillStyle = "rgba(255,255,255,0.78)";
  ctx.font = `400 ${9 * SCALE}px system-ui`;
  for (const line of [opts.email, opts.phone, opts.website].filter(Boolean) as string[]) {
    ctx.fillText(line, centerX, curY, cw - 40 * SCALE);
    curY += 14 * SCALE;
  }

  // footer bar
  const footH = 22 * SCALE;
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.fillRect(ox, oy + ch - footH, cw, footH);
  ctx.fillStyle = "rgba(255,255,255,0.60)";
  ctx.font = `400 ${8 * SCALE}px system-ui`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`This card is the property of ${opts.orgName}. If found, please return.`, centerX, oy + ch - footH / 2, cw - 20 * SCALE);

  ctx.restore();
}

const downloadAsPDF = async (
  colors: CardColors,
  orgName: string,
  orgLogoUrl: string | undefined,
  memberName: string,
  memberImgUrl: string | undefined,
  memberId: string,
  groups: { _id: string; name: string }[],
  validFrom: string,
  validTo: string,
  organization: any,
) => {
  try {
    const { default: jsPDF } = await import("jspdf");

    // load images in parallel
    const [orgLogoImg, memberImg] = await Promise.all([orgLogoUrl ? loadImage(orgLogoUrl) : Promise.resolve(null), memberImgUrl ? loadImage(memberImgUrl) : Promise.resolve(null)]);

    // ── set up canvas (A4 at SCALE×96dpi) ───────────────────────────────
    const canvas = document.createElement("canvas");
    canvas.width = A4_W;
    canvas.height = A4_H;
    const ctx = canvas.getContext("2d")!;

    // white A4 background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, A4_W, A4_H);

    // card dimensions in canvas px
    const cardW = CARD_W * SCALE;
    const cardH = CARD_H * SCALE;

    // centre cards horizontally; distribute vertically with breathing room
    const cardX = (A4_W - cardW) / 2;
    const totalCardsH = cardH * 2 + 60 * SCALE; // two cards + gap between them
    const startY = (A4_H - totalCardsH) / 2;

    // ── section labels ──────────────────────────────────────────────────
    const drawLabel = (text: string, y: number) => {
      ctx.fillStyle = "#9ca3af";
      ctx.font = `700 ${10 * SCALE}px system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, A4_W / 2, y);
    };

    const labelH = 18 * SCALE;
    const frontLabelY = startY + labelH / 2;
    const frontCardY = startY + labelH + 4 * SCALE;
    const backLabelY = frontCardY + cardH + 24 * SCALE;
    const backCardY = backLabelY + labelH / 2 + 4 * SCALE;

    drawLabel("— FRONT —", frontLabelY);
    drawFrontCard(ctx, cardX, frontCardY, cardW, cardH, {
      primaryColor: colors.primary,
      secondaryColor: colors.secondary,
      orgName,
      orgLogoImg,
      memberName,
      memberImg,
      memberId,
      groups: groups.map(g => g.name).join(" · "),
      validFrom,
      validTo,
    });

    drawLabel("— BACK —", backLabelY);
    drawBackCard(ctx, cardX, backCardY, cardW, cardH, {
      primaryColor: colors.primary,
      secondaryColor: colors.secondary,
      orgName,
      orgLogoImg,
      email: organization?.email,
      phone: organization?.phone,
      website: organization?.customUrl,
      yearEstablished: organization?.yearEstablished,
    });

    // ── export to PDF ───────────────────────────────────────────────────
    const dataUrl = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    pdf.addImage(dataUrl, "PNG", 0, 0, A4_W_MM, A4_H_MM);
    pdf.save(`membership-card-${orgName.replace(/\s+/g, "-").toLowerCase()}-${currentYear}.pdf`);
  } catch (err) {
    console.error("PDF generation failed", err);
    window.print();
  }
};

// ── card components (all inline styles — no Tailwind / CSS variables) ──────

interface CardColors {
  primary: string;
  secondary: string;
}

interface CardFrontProps {
  name: string;
  memberId: string;
  imageUrl?: string;
  orgName: string;
  orgLogo?: string;
  validFrom: string;
  validTo: string;
  groups: { _id: string; name: string }[];
  colors: CardColors;
}

const CardFront = ({ name, memberId, imageUrl, orgName, orgLogo, validFrom, validTo, groups, colors }: CardFrontProps) => (
  <div
    style={{
      width: CARD_W,
      height: CARD_H,
      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
      borderRadius: 16,
      boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      overflow: "hidden",
      position: "relative",
      color: "white",
      fontFamily: "system-ui, -apple-system, sans-serif",
      userSelect: "none",
      flexShrink: 0,
    }}
  >
    <div style={{ position: "absolute", top: -32, right: -32, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.10)" }} />
    <div style={{ position: "absolute", bottom: -40, left: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.10)" }} />

    <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {orgLogo ? (
          <img src={orgLogo} alt={orgName} crossOrigin="anonymous" style={{ height: 28, width: 28, borderRadius: "50%", objectFit: "cover", background: "white", padding: 2 }} />
        ) : (
          <div style={{ height: 28, width: 28, borderRadius: "50%", background: "rgba(255,255,255,0.85)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: colors.primary }}>
            {getInitials(orgName)}
          </div>
        )}
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", opacity: 0.92, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{orgName}</span>
      </div>
      <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase", background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: 12 }}>Member</span>
    </div>

    <div style={{ position: "absolute", top: 56, bottom: 40, left: 20, right: 20, display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ flexShrink: 0 }}>
        {imageUrl ? (
          <img src={imageUrl} alt={name} crossOrigin="anonymous" style={{ width: 60, height: 60, borderRadius: 12, objectFit: "cover", border: "2px solid rgba(255,255,255,0.4)", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }} />
        ) : (
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 12,
              border: "2px solid rgba(255,255,255,0.4)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            {getInitials(name)}
          </div>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</p>
        {groups.length > 0 && <p style={{ fontSize: 10, opacity: 0.75, margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{groups.map(g => g.name).join(" \u00B7 ")}</p>}
        <p style={{ fontSize: 10, fontFamily: "monospace", opacity: 0.6, letterSpacing: "0.15em", textTransform: "uppercase", margin: "4px 0 0" }}>ID {memberId}</p>
      </div>
    </div>

    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.22)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 20px" }}>
      <span style={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", opacity: 0.7 }}>Valid</span>
      <span style={{ fontSize: 10, fontFamily: "monospace", fontWeight: 600, letterSpacing: "0.05em" }}>
        {validFrom} - {validTo}
      </span>
    </div>
  </div>
);

interface CardBackProps {
  orgName: string;
  orgLogo?: string;
  email?: string;
  phone?: string;
  website?: string;
  yearEstablished?: number;
  colors: CardColors;
}

const CardBack = ({ orgName, orgLogo, email, phone, website, yearEstablished, colors }: CardBackProps) => (
  <div
    style={{
      width: CARD_W,
      height: CARD_H,
      background: `linear-gradient(315deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
      borderRadius: 16,
      boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      overflow: "hidden",
      position: "relative",
      color: "white",
      fontFamily: "system-ui, -apple-system, sans-serif",
      userSelect: "none",
      flexShrink: 0,
    }}
  >
    <div style={{ position: "absolute", top: -32, left: -32, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.10)" }} />
    <div style={{ position: "absolute", bottom: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.10)" }} />

    {/* magnetic stripe */}
    <div style={{ position: "absolute", top: 28, left: 0, right: 0, height: 10, background: "rgba(0,0,0,0.40)" }} />

    <div style={{ position: "absolute", top: 52, left: 20, right: 20, bottom: 36, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5 }}>
      {orgLogo ? (
        <img src={orgLogo} alt={orgName} crossOrigin="anonymous" style={{ height: 38, maxWidth: 130, objectFit: "contain", background: "rgba(255,255,255,0.92)", borderRadius: 8, padding: "4px 10px" }} />
      ) : (
        <div style={{ height: 40, width: 40, borderRadius: "50%", background: "rgba(255,255,255,0.85)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: colors.primary }}>
          {getInitials(orgName)}
        </div>
      )}
      <p style={{ fontSize: 12, fontWeight: 700, margin: 0, textAlign: "center", letterSpacing: "0.04em", opacity: 0.95 }}>{orgName}</p>
      {yearEstablished ? <p style={{ fontSize: 9, opacity: 0.55, margin: 0 }}>Est. {yearEstablished}</p> : null}
      <div style={{ width: "55%", height: 1, background: "rgba(255,255,255,0.25)", margin: "3px 0" }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
        {email ? <p style={{ fontSize: 9, opacity: 0.78, margin: 0 }}>{email}</p> : null}
        {phone ? <p style={{ fontSize: 9, opacity: 0.78, margin: 0 }}>{phone}</p> : null}
        {website ? <p style={{ fontSize: 9, opacity: 0.78, margin: 0 }}>{website}</p> : null}
      </div>
    </div>

    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.22)", padding: "5px 20px", textAlign: "center" }}>
      <span style={{ fontSize: 8, opacity: 0.6, letterSpacing: "0.04em" }}>This card is the property of {orgName}. If found, please return.</span>
    </div>
  </div>
);

// ── main component ──────────────────────────────────────────────────────────

const MembershipCardTab = () => {
  const { user } = useAppContext();
  const { organization, logo } = getTenantInfo();

  const { data: dues, isLoading } = useQuery("userDues", fetchUserDues);

  if (isLoading) return <CircleLoader />;

  const currentYearDues: any[] = Array.isArray(dues) ? dues.filter((d: any) => isCurrentYear(d.startDate ?? d.createdAt)) : [];

  const allApproved = currentYearDues.length > 0 && currentYearDues.every((d: any) => d.status === "approved" || d.confirmed === true);

  const memberId: string = user?._id?.toString().slice(-8).toUpperCase() ?? user?.id?.toString().slice(-8).toUpperCase() ?? "--------";

  const userGroups: { _id: string; name: string }[] = Array.isArray(user?.groups) ? user.groups : [];

  const earliestDue = currentYearDues.filter((d: any) => d.startDate).sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];

  const validFromDate: Date = earliestDue?.startDate ? new Date(earliestDue.startDate) : new Date(currentYear, 0, 1);

  const validToDate: Date = new Date(validFromDate);
  validToDate.setFullYear(validToDate.getFullYear() + 1);
  validToDate.setDate(validToDate.getDate() - 1);

  const validFrom = fmtDate(validFromDate);
  const validTo = fmtDate(validToDate);
  const colors = getCardColors(organization);

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Membership Card</h2>
        <p className="text-sm text-gray-500 mb-6">Your digital membership card for {currentYear}. Download as a PDF to print both sides at any computer centre.</p>

        {!allApproved ? (
          <div className="flex flex-col items-center gap-3 py-12 border-2 border-dashed border-gray-200 rounded-xl">
            <div className="w-14 h-14 rounded-full bg-yellow-50 flex items-center justify-center">
              <svg className="w-7 h-7 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <p className="text-gray-700 font-medium text-sm text-center">Card not available yet</p>
            <p className="text-gray-400 text-xs text-center max-w-xs">
              Your membership card will appear here once all your {currentYear} dues are approved. Head to <strong>Payments</strong> to check your dues status.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col sm:flex-row gap-8 items-start justify-center">
              <div className="flex flex-col items-center gap-2">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Front</span>
                <div>
                  <CardFront
                    name={user?.name ?? ""}
                    memberId={memberId}
                    imageUrl={user?.imageUrl}
                    orgName={organization?.name ?? "Organisation"}
                    orgLogo={logo ?? undefined}
                    validFrom={validFrom}
                    validTo={validTo}
                    groups={userGroups}
                    colors={colors}
                  />
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Back</span>
                <div>
                  <CardBack
                    orgName={organization?.name ?? "Organisation"}
                    orgLogo={logo ?? undefined}
                    email={organization?.email}
                    phone={organization?.phone}
                    website={organization?.customUrl}
                    yearEstablished={organization?.yearEstablished}
                    colors={colors}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap justify-center">
              <button
                type="button"
                onClick={() => downloadAsPDF(colors, organization?.name ?? "membership", logo ?? undefined, user?.name ?? "", user?.imageUrl, memberId, userGroups, validFrom, validTo, organization)}
                className="flex items-center gap-2 px-5 py-2.5 bg-org-primary text-white text-sm rounded-lg hover:bg-opacity-90 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </button>
              <button type="button" onClick={() => window.print()} className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Print
              </button>
            </div>

            <p className="text-xs text-gray-400 text-center">
              Valid {validFrom} – {validTo}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MembershipCardTab;
