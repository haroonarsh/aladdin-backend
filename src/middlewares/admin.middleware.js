const admin = (req, res, next) => {
    if (req.user && req.user.Role === "admin") {
        next();
    } else {
        res.status(403).json({
            message: "Access denied. Admins only.",
        });
    }
}

export default admin;