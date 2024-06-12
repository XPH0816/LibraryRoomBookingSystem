import bcrypt from 'bcryptjs';

/**
 * @param {string} password
 * @returns {Promise<string>}
 */
export const hashPassword = async (/** @type {string} */ password) => {
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(password, salt);
}

/** 
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export const verify = async (password, hash) => {
    return await bcrypt.compare(password, hash);
}