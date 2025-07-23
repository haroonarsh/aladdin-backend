import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        match: /.+\@.+\..+/ // Basic email validation
    },
    phone: {
        type: String,
        required: true,
        match: /^\d{10}$/ // Basic phone number validation (10 digits)
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    shippingAddress: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending",
        required: true
    },
    orderStatus: {
        type: String,
        enum: ["Pending", "Delivered", "Shipped", "Cancelled"],
        default: "Pending",
        required: true
    }
},
    {
        timestamps: true
    }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;