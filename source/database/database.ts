import mongoose from "mongoose";

export default async (MONGO_URI: string) => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        console.info(`MongoDB is connected\nURI: ${MONGO_URI}`);
    } catch (error) {
        console.error(error);
    }
};
