import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";

import { resolveText, type CredentialElement, type CredentialTemplate, type CredentialVariables } from "../../api/credentials/credentials-api";

/**
 * Renders a credential: the template's background with its elements positioned on top and
 * `{variable}` tokens replaced by this member's data.
 *
 * The template stores absolute pixel coordinates against a fixed `canvasWidth/Height`, so
 * this draws at exactly those dimensions and scales the whole thing with a CSS transform.
 * Scaling the container rather than recomputing each element keeps the layout identical to
 * what the admin designed at any display size — and keeps the export pixel-accurate.
 */

interface Props {
  template: CredentialTemplate;
  variables: CredentialVariables;
  /** Width available to render into; the canvas scales to fit. */
  maxWidth?: number;
  /** The node to hand to html2canvas — always the unscaled canvas. */
  exportRef?: React.RefObject<HTMLDivElement>;
}

/**
 * QR codes are generated for real, not drawn as a pattern.
 *
 * The admin's builder shows a placeholder — fine in an editor. On a credential a member can
 * print, a QR that does not scan is a defect, so this encodes the element's `qrValue`
 * (with variables resolved) properly.
 */
const useQrDataUrl = (value: string, size: number) => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!value) {
      setDataUrl(null);
      return;
    }
    QRCode.toDataURL(value, { margin: 0, width: Math.max(64, Math.round(size)), errorCorrectionLevel: "M" })
      .then(url => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setDataUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [value, size]);

  return dataUrl;
};

const QrElement = ({ element, variables }: { element: CredentialElement; variables: CredentialVariables }) => {
  const value = resolveText(element.qrValue, variables);
  const size = element.width ?? element.height ?? 96;
  const dataUrl = useQrDataUrl(value, size);

  if (!dataUrl) return null;
  return <img src={dataUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />;
};

const ElementView = ({ element, variables }: { element: CredentialElement; variables: CredentialVariables }) => {
  const base: React.CSSProperties = {
    position: "absolute",
    left: element.x,
    top: element.y,
    width: element.width,
    height: element.height,
    transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
    zIndex: element.zIndex ?? 0,
  };

  switch (element.type) {
    case "text":
    case "variable": {
      // A `variable` element renders its value; a `text` element may still embed tokens.
      const content = element.type === "variable" ? (variables[element.variableKey ?? ""] ?? "") : resolveText(element.text, variables);

      return (
        <div
          style={{
            ...base,
            color: element.color,
            fontFamily: element.fontFamily,
            fontSize: element.fontSize,
            fontWeight: element.fontWeight as React.CSSProperties["fontWeight"],
            fontStyle: element.fontStyle,
            textAlign: element.textAlign,
            lineHeight: 1.2,
            whiteSpace: "pre-wrap",
            display: "flex",
            alignItems: "center",
            justifyContent: element.textAlign === "center" ? "center" : element.textAlign === "right" ? "flex-end" : "flex-start",
          }}
        >
          {content}
        </div>
      );
    }

    case "image":
      return element.src ? <img src={element.src} alt="" crossOrigin="anonymous" style={{ ...base, objectFit: element.objectFit ?? "contain" }} /> : null;

    case "shape":
      return (
        <div
          style={{
            ...base,
            background: element.shapeType === "line" ? undefined : element.fill,
            borderColor: element.stroke,
            borderWidth: element.strokeWidth,
            borderStyle: element.stroke ? "solid" : undefined,
            borderRadius: element.shapeType === "ellipse" ? "50%" : element.borderRadius,
            height: element.shapeType === "line" ? element.strokeWidth || 1 : element.height,
          }}
        />
      );

    case "qrCode":
      return (
        <div style={base}>
          <QrElement element={element} variables={variables} />
        </div>
      );

    default:
      return null;
  }
};

const CredentialCanvas = ({ template, variables, maxWidth, exportRef }: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState(maxWidth ?? template.canvasWidth);

  useEffect(() => {
    if (maxWidth) {
      setAvailable(maxWidth);
      return;
    }
    const measure = () => setAvailable(wrapperRef.current?.clientWidth ?? template.canvasWidth);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [maxWidth, template.canvasWidth]);

  // Never upscale — a 1200px design on a 1600px screen should stay 1200px, not blur.
  const scale = useMemo(() => Math.min(1, available / template.canvasWidth), [available, template.canvasWidth]);

  const sorted = useMemo(() => [...(template.elements ?? [])].sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0)), [template.elements]);

  return (
    <div ref={wrapperRef} className="w-full overflow-hidden" style={{ height: template.canvasHeight * scale }}>
      <div
        ref={exportRef}
        style={{
          width: template.canvasWidth,
          height: template.canvasHeight,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          position: "relative",
          backgroundImage: template.backgroundImageUrl ? `url(${template.backgroundImageUrl})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#ffffff",
        }}
      >
        {sorted.map(element => (
          <ElementView key={element.elementId} element={element} variables={variables} />
        ))}
      </div>
    </div>
  );
};

export default CredentialCanvas;
