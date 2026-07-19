export const blogPosts = [
  {
    type: "blog",
    slug: "why-volume-based-filling-beats-time-based",
    title: "Why Volume-Based Filling Beats Time-Based Filling",
    excerpt: "Time-based filling looks simpler on paper. Here's why it quietly costs more in giveaway and rework than most people account for.",
    tags: ["filling", "PLC", "opinion"],
    authorName: "AutomationHub Team",
    content: `Time-based filling — open the valve for a fixed number of seconds — is the first thing most people build, because it needs almost no hardware beyond a valve and a timer. It also quietly costs money in ways that don't show up until someone actually measures fill weights across a shift.

## The problem isn't the logic, it's the assumption

A timer-based fill assumes flow rate is constant. In practice, line pressure fluctuates as other equipment draws air or product from the same supply, viscosity shifts with temperature over a shift, and a nozzle gradually fouls. None of that shows up as a fault — the timer still runs for exactly the same number of seconds, and the fill quietly drifts.

Most plants running time-based fills compensate by overfilling on purpose — targeting comfortably above the labeled amount so the worst-case drift still passes a minimum-fill check. That's giveaway, every single fill, every single shift, indefinitely.

## What volume-based filling actually buys you

A flowmeter-driven fill (see the Filling Machine page for the actual ladder logic) measures real delivered volume, not elapsed time. Line pressure variation, viscosity drift, and valve wear all still exist — but the fill logic is measuring their actual effect on delivered volume and stopping exactly there, instead of hoping a fixed time still produces the right amount.

The upfront cost is a calibrated flowmeter and slightly more ladder logic. The ongoing payoff is a target you can set close to the actual label claim instead of padded for worst-case drift — which on high-volume lines adds up to real money over a year, not just a theoretical improvement.

## When time-based still makes sense

For low-cost, low-volume applications where a flowmeter's cost isn't justified, or where the product itself doesn't tolerate a flow sensor well, time-based filling with generous tolerance is still a reasonable engineering tradeoff. The point isn't that time-based is always wrong — it's that the "simpler" option has a real, ongoing cost that's worth actually calculating before defaulting to it.`,
  },
  {
    type: "blog",
    slug: "reading-a-ladder-diagram-like-an-electrician",
    title: "Reading a Ladder Diagram Like an Electrician, Not a Programmer",
    excerpt: "Ladder logic looks like code once you're used to it, but it was designed to be read like a relay schematic — and that framing makes it click faster.",
    tags: ["PLC", "ladder logic", "learning"],
    authorName: "AutomationHub Team",
    content: `People coming to PLCs from a software background often try to read ladder logic top-to-bottom like a script, and get confused about why the "order" of things seems to matter differently than they expect. Ladder logic wasn't designed as code — it was designed to replace a wall of relays, and it reads best when you keep that origin in mind.

## Think current flow, not sequential execution

A rung isn't a line of instructions — it's a description of whether current can flow from the left power rail to the right, through whatever contacts are in the way, to energize a coil. Reading a rung is asking "if I stood at the left rail with a multimeter, could I trace a path of closed contacts all the way to this coil?" That's a fundamentally different mental model than "what does this line of code do."

## The scan cycle is doing the "programming" part

The sequential, program-like behavior lives in the scan cycle (reading inputs, evaluating rungs top to bottom, writing outputs), not in any individual rung. Once that separation clicks — "current flow" within a rung, "sequential re-evaluation" across the whole program, repeated hundreds of times a second — a lot of ladder logic that looked arbitrary starts looking like straightforward relay replacement.

## A practical exercise

Next time you're looking at an unfamiliar rung, try reading it out loud as an electrician would: "if this switch is closed, and this one isn't closed, energize this coil." Not "if X0 and not X1, set Y0." The same information, but the electrician's framing is what ladder logic was actually built to express, and it tends to make the intent behind the logic click faster than treating it as unusually terse code.`,
  },
  {
    type: "blog",
    slug: "the-15-percent-overload-setting-explained",
    title: "That '+15% Overload Setting' You Keep Seeing — Where It Actually Comes From",
    excerpt: "Motor overload protection isn't set at the calculated full-load current. Here's the reasoning most references skip over.",
    tags: ["electrical", "motors", "protection"],
    authorName: "AutomationHub Team",
    content: `If you've used the Motor Current calculator, you've seen it suggest an overload setting around 15% above the calculated full-load current, and it's a number that shows up constantly in motor protection without much explanation of where it comes from.

## Motors don't trip cleanly at exactly their rating

A motor's nameplate full-load current is the current it draws at rated load under standard conditions — but real starting current, momentary load spikes, and normal minor voltage variation all produce brief currents above that nameplate value without anything actually being wrong. If overload protection were set to trip at exactly the nameplate current, completely healthy motors would nuisance-trip constantly.

## The margin has to be big enough to ignore noise, small enough to still protect

Overload protection needs to tolerate short-duration normal variation while still tripping promptly on a genuine sustained overload — a locked rotor, a mechanical binding fault, a phase loss forcing the motor to draw more current on the remaining phases to deliver the same power. A margin in roughly the 10-25% range above full-load current is a common starting point precisely because it's usually enough headroom to ignore normal variation while still catching a real sustained fault within a reasonable time.

## This is a starting point, not a fixed rule

The actual correct setting depends on the specific overload device's trip curve, the motor's service factor, and the application's normal starting/load profile — a motor with frequent hard starts (like some conveyor or crusher applications) may need different consideration than one that starts once a shift and runs steady. Treat the +15% figure as a reasonable planning estimate, always followed by checking the actual overload relay's documentation and the motor's nameplate service factor before finalizing a real installation.`,
  },
];

export const newsPosts = [
  {
    type: "news",
    slug: "automationhub-machine-library-launch",
    title: "AutomationHub Machine Library Now Live: 10 Machines, Full Depth",
    excerpt: "The Machine Library is live with working principle through maintenance for 10 real production machines.",
    tags: ["announcement", "machine library"],
    authorName: "AutomationHub Team",
    content: `The AutomationHub Machine Library is now live, covering 10 machines across filling, quality inspection, capping, labeling, material handling, and finishing — each with all nine sections: Working Principle, Components, Electrical Wiring, Pneumatic Diagram, PLC Logic, Sequence of Operation, Common Faults, Troubleshooting, and Maintenance.

The Filling Machine, Leak Testing Machine, and Rotary Capping Machine pages are built from real, hands-on PLC work — actual Delta PLC ladder patterns for HSC counter scaling, pressure-drop leak detection, and line-speed synchronization, not textbook approximations.

Browse the full library at the Machine Library page.`,
  },
  {
    type: "news",
    slug: "12-engineering-calculators-launch",
    title: "12 Engineering Calculators Added to AutomationHub",
    excerpt: "Instant, free calculators for flow scaling, motor sizing, cable selection, and unit conversions.",
    tags: ["announcement", "calculators"],
    authorName: "AutomationHub Team",
    content: `AutomationHub now includes 12 free engineering calculators covering flow and fill scaling (Pulse to Gram, Pulse to Liter, Tank Volume, Flow Rate), electrical sizing (Motor Current, Cable Size, Motor Synchronous Speed), mechanical (Conveyor Speed), unit conversion (Pressure, Temperature, Length), and production planning (cycle time to units per shift).

All calculators run instantly in the browser with no sign-up required. Try them on the Calculators page.`,
  },
  {
    type: "news",
    slug: "community-forum-and-ai-assistant-launch",
    title: "Community Forum and AI Assistant Now Open",
    excerpt: "Ask questions, share projects, and get instant automation troubleshooting help from the new AI Assistant.",
    tags: ["announcement", "community", "AI assistant"],
    authorName: "AutomationHub Team",
    content: `Two new ways to get help are live on AutomationHub. The Community Forum lets you ask questions, post projects, comment, like, and follow other engineers — with reputation points earned for contributing. The AI Assistant answers PLC, HMI, VFD, and troubleshooting questions instantly, trained to stay focused on practical, technically accurate industrial automation help.

Both require a free account. Sign up on the Register page to get started.`,
  },
];
