import bcrypt from "bcrypt";

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

type passwordError = {
    error: boolean;
    hash: string;
};
