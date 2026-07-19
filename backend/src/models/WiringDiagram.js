import mongoose from "mongoose";

const terminalSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
  },
  { _id: false }
);

const connectionSchema = new mongoose.Schema(
  {
    deviceTerminalId: { type: String, required: true },
    controllerTerminalId: { type: String, required: true },
    note: { type: String, default: "" },
  },
  { _id: false }
);

const wiringDiagramSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    description: { type: String, required: true, maxlength: 300 },

    deviceLabel: { type: String, required: true }, // e.g. "Inductive Proximity Sensor (NPN)"
    deviceTerminals: [terminalSchema],
    controllerLabel: { type: String, required: true }, // e.g. "Delta DVP-14SS2 Input Card"
    controllerTerminals: [terminalSchema],
    connections: [connectionSchema],

    notes: { type: String, required: true }, // markdown
    commonMistakes: [{ type: String }],
    tags: [{ type: String, trim: true }],
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const WiringDiagram = mongoose.model("WiringDiagram", wiringDiagramSchema);
export default WiringDiagram;
