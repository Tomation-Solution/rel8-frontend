import jsPDF from "jspdf";
import { PAYMENT_STATUS_LABEL } from "../../../api/paystack-api";

/**
 * Payment receipt as a one-page A4 PDF, drawn on a canvas and embedded as an image.
 *
 * Lifted out of `DuesPage.tsx`, where ~200 lines of canvas drawing sat inside the
 * component body. Behaviour is unchanged except for one thing: the accent colour was
 * hardcoded `#1e3a5f`, a navy from the pre-redesign palette, so every tenant's receipt came
 * out blue regardless of their brand. It now reads `--color-org-primary`, the same variable
 * the rest of the app themes from (REDESIGN.md §1).
 */

/** `--color-org-primary` is stored as "R G B"; canvas needs a colour string. */
const brandColour = (): string => {
  if (typeof window === "undefined") return "#7F02A2";
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--color-org-primary").trim();
  const parts = raw.split(/[\s,]+/).filter(Boolean);
  return parts.length === 3 ? `rgb(${parts.join(", ")})` : "#7F02A2";
};

export const downloadDueReceipt = async (due: any, currencySymbol: string) => {
  const brand = brandColour();
  const SCALE = 2;
  const A4_W = 210;
  const A4_H = 297;
  const PX_W = Math.round(A4_W * SCALE * (96 / 25.4));
  const PX_H = Math.round(A4_H * SCALE * (96 / 25.4));
  const mm = (mm: number) => mm * SCALE * (96 / 25.4);

  const canvas = document.createElement("canvas");
  canvas.width = PX_W;
  canvas.height = PX_H;
  const ctx = canvas.getContext("2d")!;

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, PX_W, PX_H);

  // Get org info from localStorage tenant
  let orgName = "Organisation";
  let orgLogoUrl: string | null = null;
  try {
    const tenant = JSON.parse(localStorage.getItem("tenant-info") ?? "");
    orgName = tenant?.organization?.name ?? orgName;
    orgLogoUrl = tenant?.organization?.logo ?? tenant?.organization?.logoUrl ?? null;
  } catch {
    /* ignore */
  }

  // Try to load logo
  let logoImg: HTMLImageElement | null = null;
  if (orgLogoUrl) {
    try {
      logoImg = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = orgLogoUrl!;
      });
    } catch {
      logoImg = null;
    }
  }

  const pad = mm(15);
  let y = pad;

  // Header bar
  const headerH = mm(28);
  ctx.fillStyle = brand;
  ctx.fillRect(0, 0, PX_W, headerH);

  // Logo
  const logoSize = mm(18);
  if (logoImg) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(pad + logoSize / 2, headerH / 2, logoSize / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(logoImg, pad, (headerH - logoSize) / 2, logoSize, logoSize);
    ctx.restore();
  }

  // Org name in header
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${mm(7)}px sans-serif`;
  ctx.textBaseline = "middle";
  ctx.fillText(orgName, pad + (logoImg ? logoSize + mm(5) : 0), headerH / 2);

  y = headerH + mm(12);

  // Title
  ctx.fillStyle = brand;
  ctx.font = `bold ${mm(10)}px sans-serif`;
  ctx.textBaseline = "alphabetic";
  ctx.fillText("PAYMENT RECEIPT", pad, y);
  y += mm(4);

  // Divider
  ctx.strokeStyle = brand;
  ctx.lineWidth = mm(0.8);
  ctx.beginPath();
  ctx.moveTo(pad, y);
  ctx.lineTo(PX_W - pad, y);
  ctx.stroke();
  y += mm(8);

  // Receipt meta (right-aligned)
  const receiptDate = due.paidAt ? new Date(due.paidAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : new Date(due.startDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const metaLines = [
    ["Receipt No.", `#${String(due._id).slice(-8).toUpperCase()}`],
    ["Date", receiptDate],
  ];
  ctx.font = `${mm(4.5)}px sans-serif`;
  for (const [label, value] of metaLines) {
    ctx.fillStyle = "#666666";
    ctx.fillText(label, pad, y);
    ctx.fillStyle = "#111111";
    const valW = ctx.measureText(value).width;
    ctx.fillText(value, PX_W - pad - valW, y);
    y += mm(7);
  }
  y += mm(4);

  // Bill-to section
  ctx.fillStyle = "#f5f7fa";
  ctx.beginPath();
  ctx.roundRect(pad, y, PX_W - pad * 2, mm(22), mm(3));
  ctx.fill();
  ctx.fillStyle = brand;
  ctx.font = `bold ${mm(4.5)}px sans-serif`;
  ctx.fillText("BILLED TO", pad + mm(5), y + mm(6));
  ctx.fillStyle = "#333333";
  ctx.font = `${mm(4.5)}px sans-serif`;
  ctx.fillText(due.user__email ?? "", pad + mm(5), y + mm(13));
  y += mm(28);

  // Table header
  const colDesc = pad;
  const colQty = PX_W - pad - mm(60);
  const colAmt = PX_W - pad - mm(22);
  ctx.fillStyle = brand;
  ctx.fillRect(pad, y, PX_W - pad * 2, mm(9));
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${mm(4)}px sans-serif`;
  ctx.fillText("Description", colDesc + mm(3), y + mm(5.8));
  ctx.fillText("Status", colQty, y + mm(5.8));
  ctx.fillText("Amount", colAmt, y + mm(5.8));
  y += mm(9);

  // Table row
  ctx.fillStyle = "#f9fafb";
  ctx.fillRect(pad, y, PX_W - pad * 2, mm(11));
  ctx.strokeStyle = "#e5e7eb";
  ctx.lineWidth = mm(0.3);
  ctx.strokeRect(pad, y, PX_W - pad * 2, mm(11));
  ctx.fillStyle = "#111111";
  ctx.font = `${mm(4.5)}px sans-serif`;
  ctx.fillText(due.purpose ?? "Due Payment", colDesc + mm(3), y + mm(7));
  const statusLabel = PAYMENT_STATUS_LABEL[due.status] ?? (due.status ?? "");
  ctx.fillStyle = "#16a34a";
  ctx.fillText(statusLabel, colQty, y + mm(7));
  const amtText = `${currencySymbol}${parseFloat(due.amount).toFixed(2)}`;
  ctx.fillStyle = "#111111";
  const amtW = ctx.measureText(amtText).width;
  ctx.fillText(amtText, colAmt + mm(12) - amtW, y + mm(7));
  y += mm(11);

  // Divider above total
  y += mm(4);
  ctx.strokeStyle = "#d1d5db";
  ctx.lineWidth = mm(0.3);
  ctx.beginPath();
  ctx.moveTo(colQty - mm(5), y);
  ctx.lineTo(PX_W - pad, y);
  ctx.stroke();
  y += mm(7);

  // Total row
  ctx.fillStyle = "#111111";
  ctx.font = `bold ${mm(5)}px sans-serif`;
  ctx.fillText("Total Paid", colQty - mm(5), y);
  ctx.fillStyle = brand;
  ctx.font = `bold ${mm(5.5)}px sans-serif`;
  const totalW = ctx.measureText(amtText).width;
  ctx.fillText(amtText, colAmt + mm(12) - totalW, y);
  y += mm(16);

  // Footer note
  ctx.fillStyle = "#9ca3af";
  ctx.font = `italic ${mm(3.8)}px sans-serif`;
  ctx.fillText("This is a system-generated receipt and requires no signature.", pad, y);

  // Bottom accent bar
  ctx.fillStyle = brand;
  ctx.fillRect(0, PX_H - mm(8), PX_W, mm(8));
  ctx.fillStyle = "#ffffff";
  ctx.font = `${mm(3.5)}px sans-serif`;
  ctx.textBaseline = "middle";
  ctx.fillText(orgName, pad, PX_H - mm(4));

  // Export
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  pdf.addImage(imgData, "PNG", 0, 0, A4_W, A4_H);
  pdf.save(`receipt-${String(due._id).slice(-8).toUpperCase()}.pdf`);

};
