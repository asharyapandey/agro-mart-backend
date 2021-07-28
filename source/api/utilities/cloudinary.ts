import { v2 as cloudinary } from "cloudinary";

// console.log(process.env.API_SECRET);
// cloudinary.config({
//     cloud_name: process.env.C_NAME,
//     api_key: "864233231861498",
//     api_secret: process.env.API_SECRET as string,
// });

// export default cloudinary;

const getCloudinary = () => {
    cloudinary.config({
        cloud_name: process.env.C_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
    });
    return cloudinary;
};

export default getCloudinary;
