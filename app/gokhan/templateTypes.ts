import type { ImageItem } from "@/lib/images";

export type Format = "board" | "card";

export type TemplateMedia =
  | { kind: "lottie"; id: string; name: string; filePath: string }
  | {
      kind: "image";
      id: string;
      name: string | null;
      image: Pick<ImageItem, "id" | "name" | "file_path" | "source_type" | "remote_url">;
    };

export interface AdminTemplate {
  id: string;
  shortId: string;
  title: string;
  occasion: string;
  occasionLabel: string;
  format: Format;
  order: number | null;
  hidden: boolean;
  titleFont: string | null;
  titleColor: string | null;
  envelopeColor: string | null;
  pageColor: string | null;
  effectId: string | null;
  media: TemplateMedia | null;
  recipient: string;
  messageCount: number;
  uses: number;
  createdAt: string;
}

export interface LottieOption {
  id: string;
  name: string;
  occasion_type: string | null;
  file_path: string;
}

export type ImageOption = Pick<ImageItem, "id" | "name" | "occasion_type" | "file_path" | "source_type" | "remote_url">;

export interface TemplatesData {
  templates: AdminTemplate[];
  occasions: { value: string; label: string }[];
  lotties: LottieOption[];
  images: ImageOption[];
  effects: { id: string; name: string }[];
}

export const viewPath = (t: { format: Format; shortId: string }) =>
  `/${t.format === "card" ? "cards" : "boards"}/${t.shortId}/view`;
