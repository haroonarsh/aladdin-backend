import express from 'express';
import passport from 'passport';

const route = express.Router();

    // google auth
route.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
}));

    // google auth callback
route.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
        const { accessToken } = req.authInfo; // Get the access token from the authInfo
        // Set the JWT token in a cookie
        res.cookie("jwt", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })
        // Set the user information in the session
        // res.json(req.user);
        // Redirect to frontend after successful auth
        res.redirect("http://localhost:3000/products-page"); // Adjust to your frontend URL
    }
);

    // Logout route
route.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ message: 'Logout failed' });
        res.redirect('http://localhost:3000/login'); // Redirect to login after logout
    });
});

export default route;