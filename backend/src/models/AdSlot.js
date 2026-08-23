import mongoose from "mongoose";

export const AD_PLACEMENTS = ["homepage-banner", "sidebar", "in-content", "footer"];

const adSlotSchema = new mongoose.Schema(
  {
    placement: {
      type: String,
      required: true,
      enum: AD_PLACEMENTS,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    linkUrl: {
      type: String,
      required: true,
    },
    altText: {
      type: String,
      default: "",
    },
    sponsorName: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Optional scheduling — an ad outside this window doesn't render even
    // if isActive is true, so a campaign can be queued up in advance.
    startsAt: { type: Date, default: null },
    endsAt: { type: Date, default: null },
    impressionCount: { type: Number, default: 0 },
    clickCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

adSlotSchema.index({ placement: 1, isActive: 1 });

const AdSlot = mongoose.model("AdSlot", adSlotSchema);
export default AdSlot;
