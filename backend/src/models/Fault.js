import mongoose from "mongoose";

const causeSchema = new mongoose.Schema(
  {
    cause: { type: String, required: true },
    likelihood: { type: String, enum: ["most likely", "possible", "less common"], default: "possible" },
    checkSteps: [{ type: String, required: true }],
    fix: { type: String, required: true },
  },
  { _id: false }
);

const faultSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    symptom: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    description: { type: String, required: true, maxlength: 300 },
    causes: [causeSchema],
    tags: [{ type: String, trim: true }],
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Fault = mongoose.model("Fault", faultSchema);
export default Fault;
