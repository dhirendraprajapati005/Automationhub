import { useEffect, useState } from "react";
import { fetchAdForPlacement, recordAdClick, type Ad, type AdPlacement } from "@/lib/ad-api";

export const AdSlot = ({ placement, className }: { placement: AdPlacement; className?: string }) => {
  const [ad, setAd] = useState<Ad | null>(null);

  useEffect(() => {
    fetchAdForPlacement(placement)
      .then(setAd)
      .catch(() => setAd(null));
  }, [placement]);

  if (!ad) return null;

  return (
    <div className={className}>
      <a
        href={ad.linkUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={() => recordAdClick(ad._id)}
        className="block overflow-hidden rounded-[var(--radius-panel)] border border-panel-700"
      >
        <img src={ad.imageUrl} alt={ad.altText || ad.title} className="w-full" loading="lazy" />
      </a>
      {ad.sponsorName && <p className="mt-1 text-center text-xs text-ink-400">Sponsored by {ad.sponsorName}</p>}
    </div>
  );
};
