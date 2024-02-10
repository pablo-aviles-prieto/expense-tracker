import mongoose from "mongoose";
import * as dotenv from "dotenv";

// used for the seeder
dotenv.config({ path: ".env.local" });

interface CachedMongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<mongoose.Mongoose> | null;
}

interface GlobalWithMongoose {
  mongoose: CachedMongooseConnection;
}

const globalWithMongoose = global as unknown as GlobalWithMongoose;

let cached = globalWithMongoose.mongoose;

const { NODE_ENV, MONGODB_URI } = process.env;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
if (!cached) {
  const cacheValue: CachedMongooseConnection = { conn: null, promise: null };
  globalWithMongoose.mongoose = cacheValue;
  cached = cacheValue;
}

async function connectDb() {
  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local",
    );
  }

  if (cached.conn) {
    if (NODE_ENV === "development") console.info("Using cached DB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    // Determines whether Mongoose should buffer commands when the connection is not yet established
    // Any commands attempted to be executed before the connection is open will throw an error
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseCon) => {
      return mongooseCon;
    });
  }
  cached.conn = await cached.promise;

  if (NODE_ENV === "development")
    console.info("New connection to DB stablished");
  return cached.conn;
}

export default connectDb;
