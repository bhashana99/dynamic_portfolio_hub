// One-off admin reset utility.
//
// Deletes all existing admin user(s) and creates a fresh one with a password
// you choose. Run it from the PROJECT ROOT so it picks up the root .env (MONGO):
//
//   node back-end/scripts/reset-admin.js <new-username> <new-password>
//
// Example:
//   node back-end/scripts/reset-admin.js admin MyNewPass123
//
// Nothing here is committed with your credentials — they are passed at runtime.

import mongoose from "mongoose";
import dotenv from "dotenv";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";

dotenv.config();

const [username, password] = process.argv.slice(2);

if (!username || !password) {
  console.error(
    "\n✗ Usage: node back-end/scripts/reset-admin.js <username> <password>\n"
  );
  process.exit(1);
}

if (!process.env.MONGO) {
  console.error(
    "\n✗ MONGO connection string not found. Make sure your root .env has MONGO=...\n"
  );
  process.exit(1);
}

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to MongoDB.");

    const removed = await User.deleteMany({});
    console.log(`Removed ${removed.deletedCount} existing admin user(s).`);

    const hashedPassword = bcryptjs.hashSync(password, 10);
    await new User({ username, password: hashedPassword }).save();

    console.log(`\n✓ New admin created.`);
    console.log(`   Username: ${username}`);
    console.log(`   Password: (the one you just entered)\n`);
  } catch (error) {
    console.error("\n✗ Failed:", error.message, "\n");
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();
