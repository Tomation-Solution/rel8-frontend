import apiTenant from "../baseApi";

/**
 * A member's credential — their certificate or membership ID card.
 *
 * There is no "issued credential" record on the backend, by design: a credential is a
 * **published template plus this member's values**, resolved on request
 * (`GET /api/credentials/my`). The template carries `variable` elements that the model
 * describes as "substituted with real data when a credential is generated".
 *
 * The upshot is that a member always holds the current design — an association can
 * re-brand its certificate and every member's copy follows, with no reissue step.
 */

export type CredentialCategory = "id-card" | "certificate";

/** One item on the design canvas, positioned absolutely against `canvasWidth/Height`. */
export interface CredentialElement {
  elementId: string;
  type: "text" | "image" | "shape" | "qrCode" | "variable";
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  zIndex?: number;

  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  fontStyle?: "normal" | "italic";
  textAlign?: "left" | "center" | "right";
  color?: string;

  src?: string;
  objectFit?: "cover" | "contain" | "fill";

  shapeType?: "rectangle" | "ellipse" | "line";
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  borderRadius?: string;

  qrValue?: string;

  variableKey?: string;
  variableLabel?: string;
}

export interface CredentialTemplate {
  _id: string;
  category: CredentialCategory;
  name: string;
  backgroundImageUrl: string;
  canvasWidth: number;
  canvasHeight: number;
  elements: CredentialElement[];
  status: "draft" | "published";
  publishedAt?: string;
}

/**
 * The three keys the admin's builder offers.
 *
 * Indexed, because elements look values up by `variableKey` — a runtime string. The index
 * signature makes that a typed lookup instead of a cast, and tolerates a key the builder
 * adds later without breaking the render.
 */
export interface CredentialVariables {
  memberName: string;
  memberId: string;
  dateIssued: string;
  [key: string]: string;
}

export interface MyCredential {
  template: CredentialTemplate;
  variables: CredentialVariables;
  organization: { name: string; shortName: string; logo?: string } | null;
}

/**
 * Fetch the member's credential.
 *
 * A 404 is a normal state, not a failure: it means the association has not published a
 * design of that kind. Callers should say so rather than showing an error.
 */
export const fetchMyCredential = async (category: CredentialCategory): Promise<MyCredential> => {
  const response = await apiTenant.get(`/api/credentials/my`, { params: { category } });
  return response.data.data;
};

/** Substitute `{variableKey}` tokens, and resolve a `variable` element to its value. */
export const resolveText = (raw: string | undefined, variables: CredentialVariables): string => {
  if (!raw) return "";
  return raw.replace(/\{(\w+)\}/g, (match, key: string) => variables[key] ?? match);
};
