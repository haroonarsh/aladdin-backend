import stripe from "../config/stripe.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

    // Create Order
const createOrder = asyncHandler(async (req, res) => {
    const { products, shippingAddress, name, email, phone, city, state } = req.body;
    const userId = req.user._id;

    if (!products || products.length === 0) {
        return res.status(400).json({ message: "No products in the order" });
    }

    if (!shippingAddress) {
        return res.status(400).json({ message: "Shipping address is required" });
    }

    try {
        let totalAmount = 0;
        for (const item of products) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for product ${product.name}` });
            }
            totalAmount += product.price * item.quantity;
        }

        const amountInCents = Math.round(totalAmount * 100);

        const order = new Order({
            userId,
            name,
            email,
            phone,
            city,
            state,
            products,
            totalAmount,
            shippingAddress,
            paymentStatus: "Pending",
            orderStatus: "Pending"
        });
        await order.save();

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents, // Stripe expects the amount in cents
            currency: 'usd',
            metadata: { orderId: order._id.toString() }
        });
        
        res
        .status(201)
        .json(new ApiResponse(201, { 
            order, 
            clientSecret: paymentIntent.client_secret },
            "Order created successfully"
        ));
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: error.message || "Failed to create order",
        });
    }
});

    // Update Order Status
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderId, paymentStatus, orderStatus } = req.body;

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found"});
        }

        if (paymentStatus) order.paymentStatus = paymentStatus;
        if (orderStatus) order.orderStatus = orderStatus;

        await order.save();

        res
        .status(200)
        .json(new ApiResponse(200, { order }, "Order updated successfully"));

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: error.message || "Failed to update order",
        });
    }
})

    // Fetch Order by ID
const fetchAllOrders = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    try {
        const orders = await Order.find({ userId })
            .populate("products.productId", "name price")
            .populate("userId", "name email phone city state")
            .sort({ createdAt: -1 });
        res
        .status(200)
        .json(new ApiResponse(200, { orders }, "Orders fetched successfully"));
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: error.message || "Failed to fetch orders",
        });
    }
})

    // Fetch Ordered Products
const fetchOrderedProducts = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    try {
        const orders = await Order.find({ userId })
            .populate("products.productId", "name price")
            .sort({ createdAt: -1 });

        const products = orders.flatMap(order => order.products.map(product => ({
            ...product.productId.toObject(),
            quantity: product.quantity,
            orderId: order._id
        })));

        res
        .status(200)
        .json(new ApiResponse(200, { products }, "Ordered products fetched successfully"));
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: error.message || "Failed to fetch ordered products",
        });
    }
})

export { createOrder, updateOrderStatus, fetchAllOrders, fetchOrderedProducts };