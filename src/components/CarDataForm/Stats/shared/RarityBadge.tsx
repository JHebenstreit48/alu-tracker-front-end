import type { ImportRarity } from '@/types/CarDataSubmission/tabs/imports';
import { RARITY_COLORS, RARITY_BG } from '@/types/CarDataSubmission/tabs/imports';

type Props = {
  rarity: ImportRarity;
  count?: number;
};

export default function RarityBadge({ rarity, count }: Props) {
  return (
    <span
      className="RarityBadge"
      style={{
        color: RARITY_COLORS[rarity],
        background: RARITY_BG[rarity],
        border: `1px solid ${RARITY_COLORS[rarity]}44`,
      }}
    >
      ⬡ {count !== undefined ? `${count}×` : ''} {rarity}
    </span>
  );
}