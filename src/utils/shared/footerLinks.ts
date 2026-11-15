import type { FooterLinkItem } from "@/types/shared/footerLink";

export const FOOTER_LINKS: FooterLinkItem[] = [
  {
    label: "Official Website",
    to: "https://asphaltlegendsunite.com/",
    external: true,
    ariaLabel: "Open the official Asphalt Legends website (opens in a new tab)",
  },
  { label: "Feedback", to: "/feedback" },
  { label: "About", to: "/about" },
  { label: "Submit Car Data", to: "/car-data-submission" },
  { label: "Sources", to: "/sources" },
];

export function getFooterLinkClass({ isActive }: { isActive: boolean }): string {
  return isActive ? "Footer__link Footer__link--active" : "Footer__link";
}