import Product from "../models/product.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

    // Get all products
const GetProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find();
        if (!products) {
            return res.status(404).json({
                message: "No products found",
            });
        }

        res
        .status(200)
        .json( new ApiResponse(200, { products }, "Products found successfully"));
    } catch (error) {
        console.log(error.message);
        res.status(400).json({
            message: error.message || "Products not found",
        });
    }
});

    // Add product
const AddProduct = asyncHandler(async (req, res) => {
    const { name, description, price, stock, category, imageUrl } = req.body;
    try {
        const product = new Product({
            name,
            description,
            price,
            stock,
            category,
            imageUrl,
        });

        await product.save();
        res
        .status(201)
        .json( new ApiResponse(201, { product }, "Product added successfully"));
    } catch (error) {
        console.log(error.message);
        res.status(400).json({
            message: error.message || "Product not added",
        });
    }
});

    // Update product
const UpdateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const product = await Product.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        );
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        res
        .status(200)
        .json( new ApiResponse(200, { product }, "Product updated successfully"));
    } catch (error) {
        console.log(error.message);
        res.status(400).json({
            message: error.message || "Product not updated",
        });
    }
});

    // Delete product
const DeleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }
        res
        .status(200)
        .json( new ApiResponse(200, { product }, "Product deleted successfully"));
    } catch (error) {
        console.log(error.message);
        res.status(400).json({
            message: error.message || "Product not deleted",
        });
    }
})

export { GetProducts, AddProduct, UpdateProduct, DeleteProduct };