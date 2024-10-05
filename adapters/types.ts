/** Separating the types used by the front-end and back-end to avoid running back-end files on the front-end */
export enum Platform {
  PC = "PC",
  PLAYSTATION = "PlayStation",
  XBOX = "Xbox",
  IOS = "iOS",
  ANDROID = "Android",
  APPLE_MACINTOSH = "Apple Macintosh",
  LINUX = "Linux",
  NINTENDO = "Nintendo",
  ATARI = "Atari",
  COMMODORE_AMIGA = "Commodore / Amiga",
  SEGA = "SEGA",
  PANASONIC_3DO = "3DO",
  NEO_GEO = "Neo Geo",
  WEB = "Web",
}

export const MOST_POPULAR_PLATFORMS = [
  Platform.PC,
  Platform.APPLE_MACINTOSH,
  Platform.LINUX,
  Platform.WEB,
  Platform.PLAYSTATION,
  Platform.XBOX,
  Platform.IOS,
  Platform.ANDROID,
];
