export enum Genres {
  ACTION = "action",
  INDIE = "indie",
  ADVENTURE = "adventure",
  ROLE_PLAYING_GAMES_RPG = "role-playing-games-rpg",
  STRATEGY = "strategy",
  SHOOTER = "shooter",
  CASUAL = "casual",
  SIMULATION = "simulation",
  PUZZLE = "puzzle",
  ARCADE = "arcade",
  PLATFORMER = "platformer",
  RACING = "racing",
  MASSIVELY_MULTIPLAYER = "massively-multiplayer",
  SPORTS = "sports",
  FIGHTING = "fighting",
  FAMILY = "family",
  BOARD_GAMES = "board-games",
  EDUCATIONAL = "educational",
  CARD = "card",
}

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

async function getGamesByGenres(genres: Genres) {}

export default {};
