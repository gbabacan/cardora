export type MediaKind = "lottie" | "image";

export interface MediaItem {
  kind: MediaKind;
  id: string;
  name: string;
  occasion: string;
  occasionLabel: string;
  url: string;
  uploaded: boolean;
  helperColor: string | null;
  active: boolean;
  createdAt: string;
  templates: { id: string; title: string; format: "board" | "card"; shortId: string; hidden: boolean }[];
  userBoards: number;
}

export interface MediaData {
  media: MediaItem[];
  occasions: { value: string; label: string }[];
}

export const fileTypeOf = (url: string) => url.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
