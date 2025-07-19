const mongoose = require("mongoose");
const Product = require("../models/Product");
const products = require("../data/products.json");

require("dotenv").config();

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB Atlas");

    // Clear existing products before seeding
    await Product.deleteMany({});
    console.log("⚡ Old products removed");

    await Product.insertMany(products);
    console.log("✅ Products added successfully!");

    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error inserting products:", error);
    process.exit(1);
  }
}

seedDatabase();
