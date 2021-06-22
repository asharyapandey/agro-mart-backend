import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const encryptPassword = async (
    plainPassword: string,
    saltRounds: number = 10
): Promise<passwordError> => {
    try {
        const hash = await bcrypt.hash(plainPassword, saltRounds);

        return { error: false, hash };
    } catch (error) {
        console.error(error);
        return { error: true, hash: "" };
    }
};

export const decryptPassword = async (
    plainPassword: string,
    hashedPassword: string
): Promise<boolean> => {
    try {
        const hash = await bcrypt.compare(plainPassword, hashedPassword);

        return hash;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const generateToken = (id: string) => {
    return jwt.sign(id, process.env.ACCESS_TOKEN_SECRET as string);
};

type passwordError = {
    error: boolean;
    hash: string;
};
