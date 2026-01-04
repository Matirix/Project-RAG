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
export interface UserPreferences {
  session_id: number | null;
  max_tokens: number;
  temperature: number;
  top_p: number;
  prompt_template: string;
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

export type S3Object = {
  Key: string;
  LastModified: Date;
  ETag: string;
  Size: number;
  StorageClass: string;
};
