import mongoose from "mongoose";

// Singleton pattern: only one document ever exists (enforced by always
// querying/upserting with the same fixed _id), since these are site-wide
// settings, not a collection of many records.
const SETTINGS_ID = "site-settings";

const siteSettingsSchema = new mongoose.Schema(
  {
    _id: { type: String, default: SETTINGS_ID },
    siteName: { type: String, default: "DP Automation" },
    defaultMetaDescription: {
      type: String,
      default:
        "Free learning platform for PLC programming, industrial automation, HMI, SCADA, VFD, servo systems, sensors, pneumatics, robotics, and industrial networking.",
      maxlength: 300,
    },
    defaultOgImageUrl: { type: String, default: "" },
    twitterHandle: { type: String, default: "" },
    googleSiteVerification: { type: String, default: "" },
    // When false, injects a robots "noindex" meta tag site-wide — useful for
    // a staging deployment you don't want search engines crawling yet.
    allowSearchIndexing: { type: Boolean, default: true },
  },
  { timestamps: true }
);

siteSettingsSchema.statics.getSettings = async function () {
  let settings = await this.findById(SETTINGS_ID);
  if (!settings) {
    settings = await this.create({ _id: SETTINGS_ID });
  }
  return settings;
};

const SiteSettings = mongoose.model("SiteSettings", siteSettingsSchema);
export default SiteSettings;
