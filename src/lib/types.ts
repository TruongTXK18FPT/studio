export type MediaKind = "photo" | "document" | "video";
export type DocType = "event" | "poem" | "letter" | "speech" | "photo" | "document";

export interface MediaItem {
  url: string;
  kind: MediaKind;
  caption?: string;
}

export interface SourceLink {
  label: string;
  url: string;
}

export interface TimelineItem {
  id: string;
  year: number;
  date?: string; // YYYY-MM-DD
  title: string;
  summary: string;
  content?: string; // Full content for letters/documents
  location?: string;
  type: DocType;
  media?: MediaItem[];
  sources?: SourceLink[];
  tags?: string[];
}

export interface Post {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  status: "pending" | "approved";
  createdAt: string; // ISO Date
  author?: string;
  cover?: string;
}
