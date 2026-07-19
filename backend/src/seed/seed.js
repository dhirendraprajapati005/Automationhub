import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Lesson from "../models/Lesson.js";
import Machine from "../models/Machine.js";
import Post from "../models/Post.js";
import WiringDiagram from "../models/WiringDiagram.js";
import Fault from "../models/Fault.js";

import { plcLessons } from "./lessons.plc.js";
import { hmiLessons } from "./lessons.hmi.js";
import { scadaLessons, vfdLessons } from "./lessons.scada-vfd.js";
import { servoLessons, sensorLessons } from "./lessons.servo-sensors.js";
import {
  pneumaticsLessons,
  roboticsLessons,
  networkingLessons,
} from "./lessons.pneumatics-robotics-networking.js";

import { machinesBatch1 } from "./machines.batch1.js";
import { machinesBatch2 } from "./machines.batch2.js";
import { machinesBatch3 } from "./machines.batch3.js";

import { blogPosts, newsPosts } from "./posts.js";
import { wiringDiagrams } from "./wiringDiagrams.js";
import { faults } from "./faults.js";

const allLessons = [
  ...plcLessons,
  ...hmiLessons,
  ...scadaLessons,
  ...vfdLessons,
  ...servoLessons,
  ...sensorLessons,
  ...pneumaticsLessons,
  ...roboticsLessons,
  ...networkingLessons,
];

const allMachines = [...machinesBatch1, ...machinesBatch2, ...machinesBatch3];

const run = async () => {
  await connectDB();

  console.log(`Seeding ${allLessons.length} lessons across ${new Set(allLessons.map((l) => l.track)).size} tracks...`);
  for (const lesson of allLessons) {
    await Lesson.findOneAndUpdate(
      { track: lesson.track, slug: lesson.slug },
      lesson,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  console.log(`Seeding ${allMachines.length} machine library entries...`);
  for (const machine of allMachines) {
    await Machine.findOneAndUpdate(
      { slug: machine.slug },
      machine,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  const allPosts = [...blogPosts, ...newsPosts];
  console.log(`Seeding ${allPosts.length} blog/news posts...`);
  for (const post of allPosts) {
    await Post.findOneAndUpdate(
      { type: post.type, slug: post.slug },
      post,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  console.log(`Seeding ${wiringDiagrams.length} wiring diagrams...`);
  for (const diagram of wiringDiagrams) {
    await WiringDiagram.findOneAndUpdate(
      { slug: diagram.slug },
      diagram,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  console.log(`Seeding ${faults.length} fault finder entries...`);
  for (const fault of faults) {
    await Fault.findOneAndUpdate(
      { slug: fault.slug },
      fault,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  console.log("Seed complete.");
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
