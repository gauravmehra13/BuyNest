const Product = require("../models/Product");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product", error });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const query = req.query.q;
    const products = await Product.find({
      name: { $regex: query, $options: "i" },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Search failed", error });
  }
};
