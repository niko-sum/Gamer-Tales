const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')

module.exports = function(passport) {
    passport.use(new GoogleStrategy ({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.NODE_ENV === 'production' 
            ? 'http://gamer-tales.onrender.com/auth/google/callback' 
            : '/auth/google/callback'

    },
    async (accessToken, refreshToken, profile, done) => {
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value
        }

        try {
            let user = await User.findOne({googleId: profile.id})

            if(user){
                done(null, user)
            }else {
                user = await User.create(newUser)
                done(null, user)
            }

        }catch (err){
            console.error(err)
        }
    }))

    //OLD CODE BLOCK

    // passport.serializeUser((user, cb) => {
    //     process.nextTick(() => {
    //       return cb(null, {
    //         id: user.id,
    //         username: user.username,
    //         picture: user.picture
    //       });
    //     });
    //   });

    // passport.deserializeUser((user, cb) => {
    //   process.nextTick(() => {
    //     return cb(null, user);
    //   });
    // });


    //NEW CODE BLOCK
    passport.serializeUser((user, cb) => {
      process.nextTick(() => {
        return cb(null, user.id);  // Save only the id in the session
      });
    });
    
    passport.deserializeUser(async (id, done) => {
      done(null, await User.findById(id))
    })

    
}