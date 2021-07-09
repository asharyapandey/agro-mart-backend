import multer from "multer";

const fileStorageProfile = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images/profile_picture");
    },
    filename: (req, file, cb) => {
        const fileName = `PROFILE-${new Date().toDateString()}-${
            file.originalname
        }`;
        cb(null, fileName);
    },
});

const fileStoragePost = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images/post");
    },
    filename: (req, file, cb) => {
        const fileName = `POST-${new Date().toDateString()}-${
            file.originalname
        }`;
        cb(null, fileName);
    },
});

const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

export const postUpload = multer({ storage: fileStoragePost, fileFilter });
export const profileUpload = multer({
    storage: fileStorageProfile,
    fileFilter,
});
