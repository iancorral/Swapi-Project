import bcrypt from 'bcryptjs';

const encrypt = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash;
};

const verify = async (password: string, passwordHash: string) => {
    const isCorrect = await bcrypt.compare(password, passwordHash);
    return isCorrect;
};

export { encrypt, verify };