import mongoose from 'mongoose';
export const connectDB = async (dbUrl) => {
    try {
        await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        });
        console.log('db', dbUrl);
        console.log('Connected to database');
    }
    catch (error) {
        process.exit(1);
    }
};
