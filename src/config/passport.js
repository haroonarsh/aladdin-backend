import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:5000/auth/google/callback",
            scope: ["profile", "email"]
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if the user already exists in the database
                let user = await User.findOne({ GoogleId: profile.id});
                if (!user) {
                    // If the user doesn't exist, create a new user
                    user = await User.create({
                        GoogleId: profile.id,
                        FirstName: profile.name.givenName,
                        LastName: profile.name.familyName,
                        Email: profile.emails[0].value,
                        ProfileImage: profile.photos[0].value,
                        PhoneNo: profile.phoneNumbers ? profile.phoneNumbers[0].value : null,
                        Password: "GoogleUser",
                        Gender: profile.gender,
                        Date: profile.birthday,
                        CountryCode: profile.countryCode
                    });
                    await user.save();
                } else if (!user.GoogleId) {
                    // If the user exists but doesn't have a Google ID, update the user with the Google ID
                    user.GoogleId = profile.id;
                    await user.save();
                }

                // Generate a JWT token for the user
                // const { accessToken, refreshToken } = generateToken(user._id);
                const { accessToken: jwtAccessToken, refreshToken: jwtRefreshToken } = generateToken(user._id);

                // Return the user object
                return done(null, user, { accessToken: jwtAccessToken, refreshToken: jwtRefreshToken });
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;