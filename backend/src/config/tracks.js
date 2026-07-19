// Track metadata is fixed taxonomy (the 9 learning tracks from the spec),
// not admin-editable content, so it lives in code rather than the database.
// Lesson counts are computed from the DB and merged in at request time.
export const TRACKS = [
  {
    slug: "plc",
    label: "PLC Programming",
    icon: "Cpu",
    description: "Ladder logic, function blocks, counters, and structured text — taught on real machine logic.",
  },
  {
    slug: "hmi",
    label: "HMI Design",
    icon: "Gauge",
    description: "Screen design, alarms, trends, and recipe management for operator interfaces.",
  },
  {
    slug: "scada",
    label: "SCADA Systems",
    icon: "Network",
    description: "Tag databases, historians, and plant-wide supervisory control.",
  },
  {
    slug: "vfd",
    label: "VFD & Drives",
    icon: "Zap",
    description: "Parameter setup, motor tuning, and variable frequency drive troubleshooting.",
  },
  {
    slug: "servo",
    label: "Servo Systems",
    icon: "RotateCw",
    description: "Motion profiles, tuning loops, and servo drive commissioning.",
  },
  {
    slug: "sensors",
    label: "Sensors",
    icon: "Radar",
    description: "Proximity, photoelectric, pressure, and flow sensing — wiring and selection.",
  },
  {
    slug: "pneumatics",
    label: "Pneumatics",
    icon: "Wind",
    description: "Cylinders, valves, and circuit design for automated machines.",
  },
  {
    slug: "robotics",
    label: "Robotics",
    icon: "Bot",
    description: "Industrial robot fundamentals, kinematics, and integration basics.",
  },
  {
    slug: "networking",
    label: "Industrial Networking",
    icon: "Cable",
    description: "Modbus, Profinet, EtherNet/IP, and fieldbus architecture.",
  },
];

export const TRACK_SLUGS = TRACKS.map((t) => t.slug);
