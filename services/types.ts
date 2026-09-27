/** Separating the types used by the front-end and back-end to avoid running back-end files on the front-end */
export enum Mood {
  EXCITED = "EXCITED",
  RELAXED = "RELAXED",
  FOCUSED = "FOCUSED",
  ADVENTUROUS = "ADVENTUROUS",
  COMPETITIVE = "COMPETITIVE",
  CURIOUS = "CURIOUS",
  NOSTALGIC = "NOSTALGIC",
  SOCIAL = "SOCIAL",
  ANGRY = "ANGRY",
  STRATEGIC = "STRATEGIC",
  PLAYFUL = "PLAYFUL",
}

interface NamedEntity {
  id: number;
  name: string;
}

/** Game returned by `/api/game`. */
export interface SuggestedGame {
  id: number;
  name: string;
  /** Raw HTML from RAWG; sanitize before rendering. */
  description: string;
  metacriticRating: number;
  imageUrl: string;
  releasedDate: string;
  tags: NamedEntity[];
  genres: NamedEntity[];
  platforms: NamedEntity[];
  screenshots: { id: number; image: string }[];
}
