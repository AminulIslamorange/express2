import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config";

// LOGIN
const loginUserFromDB = async (payload: {
    email: string;
    password: string;
}) => {

    const { email, password } = payload;

    // check user
    const userData = await pool.query(
        `SELECT * FROM users WHERE email=$1`,
        [email]
    );

    if (userData.rows.length === 0) {
        throw new Error("Invalid credential");
    }

    const user = userData.rows[0];

    // compare password
    const matchPassword = await bcrypt.compare(
        password,
        user.password
    );

    if (!matchPassword) {
        throw new Error("Invalid credential");
    }

    // jwt payload
    const jwtPayload = {
        id: user.id,
        name: user.name,
        role: user.role,
        is_active: user.is_active,
        email: user.email,
    };

    // access token
    const accessToken = jwt.sign(
        jwtPayload,
        config.secret as string,
        {
            expiresIn: "1d",
        }
    );

    // refresh token
    const refreshToken = jwt.sign(
        jwtPayload,
        config.refresh_secret as string,
        {
            expiresIn: "10d",
        }
    );

    return {
        accessToken,
        refreshToken,
    };
};

// REFRESH TOKEN
const generateFreshToken = async (token: string) => {

    if (!token) {
        throw new Error("Unauthorized");
    }

    // verify refresh token
    const decoded = jwt.verify(
        token,
        config.refresh_secret as string
    ) as JwtPayload;

    // check user
    const userData = await pool.query(
        `SELECT * FROM users WHERE email=$1`,
        [decoded.email]
    );

    if (userData.rows.length === 0) {
        throw new Error("User not found");
    }

    const user = userData.rows[0];

    // active check
    if (!user.is_active) {
        throw new Error("Forbidden");
    }

    // new payload
    const jwtPayload = {
        id: user.id,
        name: user.name,
        role: user.role,
        is_active: user.is_active,
        email: user.email,
    };

    // new access token
    const accessToken = jwt.sign(
        jwtPayload,
        config.secret as string,
        {
            expiresIn: "1d",
        }
    );

    return {
        accessToken,
    };
};

export const authService = {
    loginUserFromDB,
    generateFreshToken,
};