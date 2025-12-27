export type MessageRole = "system" | "user" | "assistant";

export interface Message {
  role: MessageRole;
  text: string;
}
export interface RagResponse extends Message {
  citations?: CitationGroups;
  session_id?: string;
}

export interface RagRequest {
  prompt: string;
  conversation: Message[];
}

// Citations
export interface S3Location {
  uri: string;
}

export interface Location {
  s3Location: S3Location;
  type: string;
}

export interface CitationItem {
  text: string;
  location: Location;
  score: number | null;
}

export type Citation = CitationItem[];
export type CitationGroups = Citation[];
