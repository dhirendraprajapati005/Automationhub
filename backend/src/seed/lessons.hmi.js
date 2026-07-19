export const hmiLessons = [
  {
    track: "hmi",
    slug: "hmi-design-principles",
    title: "HMI design principles: what actually helps an operator",
    summary: "Why fewer colors and clearer hierarchy beat a flashy screen every time on the plant floor.",
    difficulty: "beginner",
    estimatedMinutes: 9,
    order: 1,
    tags: ["design", "usability"],
    content: `An HMI screen isn't a dashboard to impress a visitor — it's a tool an operator glances at for two seconds while doing something else. Good HMI design optimizes for that two-second glance.

## Use color as a signal, not decoration

If every button and indicator is a different bright color, nothing stands out when something actually goes wrong. A common, effective convention:
- **Grey/white** — normal, inactive
- **Green** — running, healthy
- **Yellow/amber** — warning, needs attention
- **Red** — fault, stopped

Reserve red exclusively for actual faults. If red also means "off" or "idle," operators stop trusting it, and that's how real alarms get ignored.

## Group by process, not by device type

Don't lay out screens by "here are all my valves, here are all my motors." Lay them out the way the *process* flows — tank, then pump, then filter, then output — so the screen visually matches the physical line. Operators think in process flow, not in I/O lists.

## Keep navigation shallow

If reaching a critical control takes four taps through nested menus, that's a design failure. Frequently used screens and estops should be one tap away from anywhere.

## Design for the worst case, not the demo

A screen that looks great with clean sample data often falls apart under a real fault storm — twelve alarms firing at once, a tag reading garbage during a sensor fault. Test your screens against messy, real conditions, not just the happy path.`,
  },
  {
    track: "hmi",
    slug: "alarms-and-trends",
    title: "Alarms and trends: setting up alerts operators actually trust",
    summary: "Alarm prioritization, deadbands, and why trend graphs catch problems alarms miss.",
    difficulty: "intermediate",
    estimatedMinutes: 11,
    order: 2,
    tags: ["alarms", "trends"],
    content: `A poorly configured alarm system trains operators to ignore alarms — which is far more dangerous than having no alarms at all. This is a well-documented failure mode in process industries, often called "alarm fatigue."

## Prioritize alarms deliberately

Not every abnormal condition deserves the same urgency. A useful three-tier structure:
- **Critical** — immediate safety or major process risk, requires immediate action
- **High** — needs attention soon, but not an emergency
- **Low/informational** — logged, reviewed later, doesn't need an active pop-up

If 90% of your alarms are "critical," none of them are.

## Use a deadband, not a single threshold

If a tank level alarm triggers at exactly 80% and the level hovers at 79.9–80.1%, you'll get an alarm storm of the same event repeating. Set the alarm to trigger at 80% but clear at 78% — a deadband gap prevents chattering.

## Trends catch what alarms miss

An alarm tells you a value crossed a fixed line. A **trend graph** tells you a value is drifting *toward* that line over the last hour — which is often the more useful information. A motor current that's been slowly climbing for a week is a maintenance story an alarm alone won't tell you.

## Practical setup

Log the tags that matter to a historian at a reasonable interval (seconds, not milliseconds, for most process values), and put the 4–6 most operationally important trends on their own dedicated screen, not buried three menus deep.`,
  },
  {
    track: "hmi",
    slug: "recipe-management",
    title: "Recipe management for multi-product lines",
    summary: "Structuring recipe data so operators can switch products without touching ladder logic.",
    difficulty: "intermediate",
    estimatedMinutes: 10,
    order: 3,
    tags: ["recipes", "multi-product"],
    content: `If a line runs more than one product — different fill volumes, different cycle times, different torque settings — hardcoding those numbers into ladder logic means an engineer has to edit and redownload the program every time the product changes. Recipe management solves this by moving those numbers into a data table the operator can select from an HMI screen.

## The basic structure

A recipe is just a set of named parameters bundled together:

| Parameter | Product A | Product B | Product C |
|---|---|---|---|
| Fill volume (ml) | 250 | 500 | 1000 |
| Fill speed (%) | 60 | 75 | 50 |
| Cap torque (Nm) | 1.2 | 1.5 | 1.8 |
| Label position (mm) | 40 | 55 | 70 |

Each column is stored as a block of PLC data registers. Selecting a recipe on the HMI triggers a block-move instruction that copies that entire column into the "active recipe" registers your ladder logic actually reads from.

## Why this design matters

Keeping the "active recipe" registers separate from the "stored recipe" table means your control logic never needs to know which product is running — it just reads the active registers. Only the recipe-select routine needs to know about products at all. This separation is what makes adding Product D later a data-entry task, not a logic change.

## Guard against mid-cycle recipe switches

Always interlock the recipe-select function so operators can only change recipes when the machine is idle, never mid-cycle — switching fill volume halfway through a fill is a fast way to make a mess and a safety issue on some lines.`,
  },
];
