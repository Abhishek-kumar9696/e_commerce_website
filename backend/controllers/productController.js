import Product from "../models/productModel.js";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public

const createProduct = async (req, res) => {
  try {
    // Destructure the fields from the request body
    const { name, description, price, countInStock, image } = req.body;

    // validate the request body
    if (!name || !description || !price || !countInStock || !image) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const existingProduct = Product.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({ message: "Product already exists" });
    }

    //create a new product instance
    const product = new Product({
      name,
      description,
      price,
      countInStock,
      image,
    });

    // Save the product to the database
    const createdProduct = await product.save();

    // Return the created product as a JSON response
    console.log(createProduct);
    return res.status(201).send({ message: "reatedProduct", data: product });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, description, price, countInStock, image } = req.body;
    const product = await Product.findById(req.params._id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    product.name = name;
    product.description = description;
    product.price = price;
    product.countInStock = countInStock;
    product.image = image;
    await product.save();
    res.json(product);

    // Save the product to the database
    const savedProduct = await product.save();
    res.json(savedProduct);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const getProducts = async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find({});
    // Return the products as a JSON response
    return res.json({ count: products.length, data: products });
  } catch (error) {
    // Handle any errors that occur during the process
    return res.status(500).json({ message: "Server error" });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    // Fetch the product by ID from the database
    const product = await Product.findById(req.params.id);

    if (product) {
      // If product is found, return it as a JSON response
      return res.json(product);
    } else {
      // If product is not found, return a 404 error
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    // Handle any errors that occur, such as an invalid ID format
    return res.status(500).json({ message: "Server error" });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
  updateProduct,
};
