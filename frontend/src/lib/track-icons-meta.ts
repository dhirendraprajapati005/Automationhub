// Mirrors backend/src/config/tracks.js slugs and labels. Kept minimal and
// separate from the full track metadata (icon, description, lesson count)
// that comes from the content API, since breadcrumbs need a synchronous
// label lookup before that API call may have resolved.
export const TRACKS = [
  { slug: "plc", label: "PLC Programming" },
  { slug: "hmi", label: "HMI Design" },
  { slug: "scada", label: "SCADA Systems" },
  { slug: "vfd", label: "VFD & Drives" },
  { slug: "servo", label: "Servo Systems" },
  { slug: "sensors", label: "Sensors" },
  { slug: "pneumatics", label: "Pneumatics" },
  { slug: "robotics", label: "Robotics" },
  { slug: "networking", label: "Industrial Networking" },
];
