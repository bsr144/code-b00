const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

require("../models/celebrity");
require("../models/comment");
require("../models/profile");
require("../models/user");

async function connect() {
  const mongod = await MongoMemoryServer.create({
    instance: {
      port: +process.env.DB_PORT,
      ip: process.env.DB_HOST,
    },
  });

  const uri = mongod.getUri();

  await mongoose.connect(uri);
  console.log(`MongoDB successfully connected to ${uri}`);
}

async function closeDatabase() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
}

module.exports = { connect, closeDatabase };
