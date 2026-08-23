import SiteSettings from "../models/SiteSettings.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// @route  GET /api/settings
// @desc   Public — the frontend needs these values to render meta tags,
//         so this is intentionally not admin-gated (it contains nothing
//         sensitive, just SEO/display settings).
const getSettings = asyncHandler(async (req, res) => {
  const settings = await SiteSettings.getSettings();
  res.json({ settings });
});

// @route  PUT /api/settings
// @desc   Admin-only update
const updateSettings = asyncHandler(async (req, res) => {
  const {
    siteName,
    defaultMetaDescription,
    defaultOgImageUrl,
    twitterHandle,
    googleSiteVerification,
    allowSearchIndexing,
  } = req.body;

  const settings = await SiteSettings.getSettings();

  if (siteName !== undefined) settings.siteName = siteName;
  if (defaultMetaDescription !== undefined) settings.defaultMetaDescription = defaultMetaDescription;
  if (defaultOgImageUrl !== undefined) settings.defaultOgImageUrl = defaultOgImageUrl;
  if (twitterHandle !== undefined) settings.twitterHandle = twitterHandle;
  if (googleSiteVerification !== undefined) settings.googleSiteVerification = googleSiteVerification;
  if (allowSearchIndexing !== undefined) settings.allowSearchIndexing = allowSearchIndexing;

  await settings.save();
  res.json({ settings });
});

export { getSettings, updateSettings };
