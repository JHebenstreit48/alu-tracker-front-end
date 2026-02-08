export type SourceKey =
  | "mei"
  | "community_sheet"
  | "community_posts"
  | "patch_notes"
  | "in_game_testing"
  | "official_site";

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
    aliases: ["Reddit users Google Sheets document.", "Google Sheets", "Community spreadsheet"],
  },
  {
    key: "community_posts",
    label: "Community research posts",
    description:
      "Public community discussions and research threads used to identify gaps and confirm edge cases.",
    tags: ["cars", "game-info"],
    aliases: ["Reddit posts", "Discord discussions", "Community posts"],
  },
  {
    key: "patch_notes",
    label: "Patch notes / update announcements",
    description:
      "Used for availability changes, garage level expansions, and historical release context.",
    tags: ["game-info"],
    aliases: ["Patch notes", "Update notes"],
  },
  {
    key: "in_game_testing",
    label: "In-game verification (screenshots & testing)",
    description:
      "Direct in-game observation and screenshots used to confirm stats, requirements, and unlocks.",
    tags: ["cars", "brands", "game-info"],
    aliases: ["My own research", "My own reseach", "In-game testing", "Screenshots"],
  },
  {
    key: "official_site",
    label: "Official Asphalt Legends site",
    description:
      "Official marketing and platform availability reference.",
    url: "https://asphaltlegendsunite.com/",
    tags: ["game-info"],
    aliases: ["Official site", "Gameloft site"],
  },
];
