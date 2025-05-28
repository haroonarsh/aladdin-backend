import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
    },
    category: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: false,
    },
    brand: {
        type: String,
        required: false,
    },
    SKU: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        enum: ["Active", "Inactive", "Out of Stock"],
        default: "Active",
    },
    weight: {
        type: String,
        required: false,
    },
    dimensions: {
        type: String,
        required: false,
    },
    tags: {
        type: [String],
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Product = mongoose.model("Product", productSchema);

export default Product;