import type { SourcesCatalogItem } from "@/types/sources/source";

export const sourcesCatalog: SourcesCatalogItem[] = [
  {
    key: "mei",
    label: "MEI (reference database)",
    description:
      "Reference database used to cross-check vehicle stats and metadata when available.",
    tags: ["cars"],
    aliases: ["MEI"],
  },
  {
    key: "community_sheet",
    label: "Community spreadsheet",
    description:
      "Publicly shared community spreadsheet(s) used as a starting point for coverage and comparisons.",
    tags: ["cars", "brands"],
    aliases: ["Community spreadsheet"],
  },
  {
    key: "community_posts",
    label: "Community research posts",
    description:
      "Public community discussions and research threads used to identify gaps and confirm edge cases.",
    tags: ["cars", "game-info"],
    aliases: ["Community research posts"],
  },
  {
    key: "discord",
    label: "Discord",
    description:
      "Asphalt Legends Discord community, used for early information on new cars and updates before official notes are published.",
    tags: ["cars", "game-info"],
    aliases: ["Discord"],
  },
  {
    key: "patch_notes",
    label: "Official patch notes",
    description:
      "Official Asphalt Legends patch notes and event calendars, used to confirm update contents, event dates and car availability.",
    url: "https://asphaltlegends.com/news",
    tags: ["cars", "game-info"],
    aliases: ["Official patch notes"],
  },
  {
    key: "gameloft_newsroom",
    label: "Gameloft newsroom",
    description:
      "Official press releases and announcements published by Gameloft, used to confirm partnerships, esports events and dates.",
    url: "https://www.gameloft.com/newsroom",
    tags: ["cars", "game-info"],
    aliases: ["Gameloft newsroom"],
  },
  {
    key: "patch_notes_video",
    label: "Patch Notes video",
    description:
      "Patch notes walkthrough videos from official Asphalt Legends content creators, used to confirm update contents and car availability.",
    tags: ["cars", "game-info"],
    aliases: ["Patch Notes video"],
  },
  {
    key: "youtube_nox_fury",
    label: "Nox Fury (YouTube)",
    description:
      "YouTube videos by Nox Fury, an official Asphalt Legends content creator, used to confirm update contents, car availability and event details.",
    tags: ["cars", "game-info"],
    prefixes: ["Nox Fury"],
  },
  {
    key: "youtube_gamingwithawesome",
    label: "GamingWithAwesome (YouTube)",
    description:
      "YouTube videos by GamingWithAwesome, an official Asphalt Legends content creator, used to confirm update contents, car availability and event details.",
    tags: ["cars", "game-info"],
    prefixes: ["GamingWithAwesome"],
  },
  {
    key: "youtube_tune_race_repeat",
    label: "Tune, Race, Repeat! (YouTube)",
    description:
      "YouTube videos by Tune, Race, Repeat!, an official Asphalt Legends content creator, used to confirm update contents, car availability and event details.",
    tags: ["cars", "game-info"],
    prefixes: ["Tune, Race, Repeat!"],
  },
  {
    key: "in_game_testing",
    label: "My own in-game research",
    description:
      "Direct in-game observation and screenshots used to confirm stats, requirements, and unlocks.",
    tags: ["cars", "brands", "game-info"],
    aliases: ["My own in-game research"],
  },
  {
    key: "asphalt_wiki",
    label: "Asphalt Fandom Wiki",
    description:
      "Community-maintained wiki used for general game information, car listings, and historical context. Values may be incomplete or outdated, so entries are cross-checked when possible.",
    url: "https://asphalt.fandom.com/wiki/Asphalt_9:_Legends",
    tags: ["cars", "brands", "game-info"],
    aliases: ["Asphalt Fandom Wiki"],
  },
  {
    key: "asphalt9_info",
    label: "asphalt9.info",
    description:
      "Third-party Asphalt 9 reference site used to cross-check car stats and unlock information.",
    url: "https://asphalt9.info",
    tags: ["cars"],
    aliases: ["asphalt9.info"],
  },
];