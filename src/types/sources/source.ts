export type SourceKey =
  | "mei"
  | "community_sheet"
  | "community_posts"
  | "discord"
  | "patch_notes"
  | "gameloft_newsroom"
  | "patch_notes_video"
  | "youtube_nox_fury"
  | "youtube_gamingwithawesome"
  | "youtube_tune_race_repeat"
  | "in_game_testing"
  | "asphalt_wiki"
  | "asphalt9_info";

export type SourcesCatalogItem = {
  key: SourceKey;
  label: string;
  description: string;
  url?: string;
  tags?: string[];
  aliases?: string[];
  prefixes?: string[];
};