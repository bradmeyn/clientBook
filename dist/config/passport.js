import { Strategy as LocalStrategy } from 'passport-local';
import { compare } from 'bcrypt';
import User from '../models/userModel.js';
export default (passport) => {
    passport.use(new LocalStrategy(async (username, password, done) => {
        const user = await User.findOne({
            username,
        });
        if (!user) {
            return done(null, false, {
                message: 'Username and/or password is invalid',
            });
        }
        // Match password
        compare(password, user.password, (err, match) => {
            if (err)
                throw err;
            if (match) {
                return done(null, user);
            }
            else {
                return done(null, false, {
                    message: 'Username and/or password is invalid',
                });
            }
        });
    }));
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
};
