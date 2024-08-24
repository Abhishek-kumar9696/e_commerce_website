import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    console.log(req);

    // Check if there are any order items
    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    // Create a new order
    const order = new Order({
      user: req.user.id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    // Save the order to the database
    const createdOrder = await order.save();

    // Return the created order
    return res.status(201).json(createdOrder);
  } catch (error) {
    // Catch any errors and return them
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    // Find orders for the logged-in user
    const orders = await Order.find({ user: req.user.id });

    // Return the user's orders
    return res.json(orders);
  } catch (error) {
    // Catch any errors and return them
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
// @desc    Update order to paid
// @route    PUT /api/orders/:id/pay
// @access    Private
const updateOrderToPaid = async (req, res) => {
  
  try {
    
    const order = await Order.findOne(req.params._id);
    console.log(order.id)
    if (order) {
      
      (order.isPaid = true),
        (order.paidAt = Date.now()),
        (order.paymentResult = {
          id: req.body.id,
          status: req.body.status,
          update_time: req.body.update_time,
          email_address: req.body.payer.email_address
          
        });
        
      const updateOrder = await order.save();
     

      res.json(updateOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
// @desc    Update order to delivered
// @route    PUT /api/orders/:id/deliver
// @access    Private

const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();

      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Get an order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Get all orders
// @route    GET /api/orders
// @access    Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id name");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
};
