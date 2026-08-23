import AdSlot, { AD_PLACEMENTS } from "../models/AdSlot.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const isWithinSchedule = (ad) => {
  const now = new Date();
  if (ad.startsAt && now < ad.startsAt) return false;
  if (ad.endsAt && now > ad.endsAt) return false;
  return true;
};

// @route  GET /api/ads/:placement
// @desc   Public — returns one active, in-schedule ad for a placement (if
//         several are active, picks one at random so they rotate across
//         page loads rather than always showing the same one) and records
//         an impression.
const getAdForPlacement = asyncHandler(async (req, res) => {
  const { placement } = req.params;
  if (!AD_PLACEMENTS.includes(placement)) {
    return res.status(400).json({ message: `placement must be one of: ${AD_PLACEMENTS.join(", ")}` });
  }

  const candidates = await AdSlot.find({ placement, isActive: true });
  const eligible = candidates.filter(isWithinSchedule);

  if (eligible.length === 0) {
    return res.json({ ad: null });
  }

  const ad = eligible[Math.floor(Math.random() * eligible.length)];
  ad.impressionCount += 1;
  await ad.save();

  res.json({
    ad: {
      _id: ad._id,
      title: ad.title,
      imageUrl: ad.imageUrl,
      linkUrl: ad.linkUrl,
      altText: ad.altText,
      sponsorName: ad.sponsorName,
    },
  });
});

// @route  POST /api/ads/:id/click
// @desc   Public — records a click. Fire-and-forget from the frontend when
//         the ad link is clicked.
const recordClick = asyncHandler(async (req, res) => {
  await AdSlot.findByIdAndUpdate(req.params.id, { $inc: { clickCount: 1 } });
  res.status(204).end();
});

// --- Admin -----------------------------------------------------------------

// @route  GET /api/ads/admin/all
const listAllAds = asyncHandler(async (req, res) => {
  const ads = await AdSlot.find().sort({ placement: 1, createdAt: -1 });
  res.json({ ads, placements: AD_PLACEMENTS });
});

// @route  POST /api/ads
const createAd = asyncHandler(async (req, res) => {
  const { placement, title, imageUrl, linkUrl, altText, sponsorName, isActive, startsAt, endsAt } = req.body;

  if (!placement || !title || !imageUrl || !linkUrl) {
    return res.status(400).json({ message: "placement, title, imageUrl, and linkUrl are required" });
  }
  if (!AD_PLACEMENTS.includes(placement)) {
    return res.status(400).json({ message: `placement must be one of: ${AD_PLACEMENTS.join(", ")}` });
  }

  const ad = await AdSlot.create({
    placement,
    title,
    imageUrl,
    linkUrl,
    altText,
    sponsorName,
    isActive: isActive ?? true,
    startsAt: startsAt || null,
    endsAt: endsAt || null,
  });

  res.status(201).json({ ad });
});

// @route  PUT /api/ads/:id
const updateAd = asyncHandler(async (req, res) => {
  const ad = await AdSlot.findById(req.params.id);
  if (!ad) return res.status(404).json({ message: "Ad not found" });

  const fields = ["placement", "title", "imageUrl", "linkUrl", "altText", "sponsorName", "isActive", "startsAt", "endsAt"];
  for (const field of fields) {
    if (req.body[field] !== undefined) ad[field] = req.body[field];
  }

  await ad.save();
  res.json({ ad });
});

// @route  DELETE /api/ads/:id
const deleteAd = asyncHandler(async (req, res) => {
  const ad = await AdSlot.findById(req.params.id);
  if (!ad) return res.status(404).json({ message: "Ad not found" });
  await ad.deleteOne();
  res.json({ message: "Ad deleted" });
});

export { getAdForPlacement, recordClick, listAllAds, createAd, updateAd, deleteAd };
