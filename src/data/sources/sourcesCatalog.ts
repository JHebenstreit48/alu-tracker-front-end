export type SourceKey =
  | "mei"
  | "community_sheet"
  | "community_posts"
  | "patch_notes"
  | "in_game_testing"
  | "asphalt_wiki";

export type SourcesCatalogItem = {
  key: SourceKey;
  label: string;
  description: string;
  url?: string;
  tags?: string[]; // optional ("cars", "brands", "game-info")
  aliases?: string[]; // strings you expect in car.sources[]
};

export const sourcesCatalog: SourcesCatalogItem[] = [
  {
    key: "mei",
    label: "MEI (reference database)",
    description:
      "Reference database used to cross-check vehicle stats and metadata when available.",
    tags: ["cars"],
    aliases: ["MEI", "Mei", "mei"],
  },
  {
    key: "community_sheet",
    label: "Community spreadsheet",
    description:
      "Publicly shared community spreadsheet(s) used as a starting point for coverage and comparisons.",
    tags: ["cars", "brands"],
    aliases: [
      "Reddit users Google Sheets document.",
      "Google Sheets",
      "Community spreadsheet",
      "Community sheet",
    ],
  },
  {
    key: "community_posts",
    label: "Community research posts",
    description:
      "Public community discussions and research threads used to identify gaps and confirm edge cases.",
    tags: ["cars", "game-info"],
    aliases: ["Reddit posts", "Discord discussions", "Community posts", "Community research"],
  },

  // {
  //   key: "patch_notes",
  //   label: "Patch notes / update announcements (future addition)",
  //   description:
  //     "Potential future feature: structured links to update announcements for availability changes, garage level expansions, and historical release context.",
  //   tags: ["game-info"],
  //   aliases: ["Patch notes", "Update notes", "Patchnote", "Update announcement"],
  // },

  {
    key: "in_game_testing",
    label: "In-game verification (screenshots & testing)",
    description:
      "Direct in-game observation and screenshots used to confirm stats, requirements, and unlocks.",
    tags: ["cars", "brands", "game-info"],
    aliases: ["My own research", "My own reseach", "In-game testing", "Screenshots"],
  },
  {
    key: "asphalt_wiki",
    label: "Asphalt Wiki (community reference)",
    description:
      "Community-maintained wiki used for general game information, car listings, and historical context. Values may be incomplete or outdated, so entries are cross-checked when possible.",
    url: "https://asphalt.fandom.com/wiki/Asphalt_9:_Legends",
    tags: ["cars", "brands", "game-info"],
    aliases: [
      "Asphalt Wiki",
      "Asphalt fandom",
      "Asphalt Fandom",
      "Fandom wiki",
      "asphalt.fandom.com",
      "Asphalt 9 Wiki",
      "Asphalt Legends Wiki",
      "Asphalt Legends Unite Wiki",
    ],
  },
];