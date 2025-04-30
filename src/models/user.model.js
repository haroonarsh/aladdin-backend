import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema({
    GoogleId: {
        type: String,
        unique: true,
        sparse: true
    },
    FirstName: {
        type: String,
        required: true
    },
    LastName: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    ProfileImage: {
        type: String,
        default: "https://cdn-icons-png.freepik.com/512/5045/5045878.png"
    },
    PhoneNo: {
        type: String,
        required: false,
        unique: true
    },
    Password: {
        type: String,
        required: true
    },
    Date: {
        type: String,
        default: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }),
    },  
    Gender: {
        type: String,
        default: "Male",
        enum: ["Male", "Female"]
    },
    CountryCode: {
        type: String,
        default: "pk"
    }
},
    {
        timestamps: true
    }
)

    // hashing password
userSchema.pre("save", async function (next) {
    if (!this.isModified("Password")) return next();

    this.Password = await bcrypt.hash(this.Password, 10);
    next();
})

    // comparing password
userSchema.methods.comparePassword = async function (Password) {
    return await bcrypt.compare(Password, this.Password);
}

const User = mongoose.model("User", userSchema);

export default User;