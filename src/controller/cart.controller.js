import Cart from "../models/cart.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

    // Add to Cart
const AddToCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
    }

    if (quantity < 1) {
        return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    try {
        let cart = await Cart.findOne({ userId, productId });

        if (cart) {
            cart.quantity += quantity;
            await cart.save();
        } else {
            cart = new Cart({
                userId,
                productId,
                quantity
            })
            await cart.save();
        }

        res
        .status(200)
        .json( new ApiResponse(200, { cart }, "Product added to cart successfully"));
    } catch (error) {
        console.log(error.message);
        res.status(400).json({
            message: error.message || "Product not added to cart",
        });
    }
})

    // Get Cart
const GetCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    try {
        const cart = await Cart.find({ userId });
        if (!cart) {
            res.status(400).json({
                message: "Cart not found",
            });
        }
        res
        .status(200)
        .json( new ApiResponse(200, { cart }, "Cart found successfully"));
    } catch (error) {
        console.log(error.message);
        res.status(400).json({
            message: error.message || "Cart not found",
        });
    }
})

export { AddToCart, GetCart };