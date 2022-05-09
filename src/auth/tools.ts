import jwt from "jsonwebtoken";
import IUser from "../interfaces/IUser";
import { Document } from "mongoose";
import {UserModel} from "../model/users"
import IUserPro from "../interfaces/IUserPro"
import { ProUserModel } from "../model/professionalUser";

type JWTToken = {
  _id: string;
};

export const JWTAuth = async (user: IUser & Document | IUserPro & Document) => {
  const accessToken = await generateJWTToken({ _id: user._id });
  const refreshToken = await generateRefreshJWTToken({ _id: user._id });

  user.refreshToken = refreshToken;

  await user.save();

  return { accessToken, refreshToken };
};

const generateJWTToken = (payload: JWTToken) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET!,
      { expiresIn: "10 mins" },
      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      }
    )
  );

export const verifyJWT = (token: string) =>
  new Promise<JWTToken>((resolve, reject) =>
    jwt.verify(token, process.env.JWT_SECRET!, (err, decodedToken) => {
      if (err) reject(err);
      else resolve(decodedToken as JWTToken);
    })
  );

const generateRefreshJWTToken = (payload: JWTToken) =>
  new Promise<string>((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "1 week" },
      (err, token) => {
        if (err) reject(err);
        else resolve(token as string);
      }
    )
  );

  export const verifyRefreshJWT = (token: string) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_REFRESH_SECRET!, (err, decodedToken) => {
      if (err) reject(err);
      else resolve(decodedToken);
    })
  );

export const verifyRefreshToken = async (currentRefreshToken: string) => {
  const decodedRefreshToken: any = await verifyRefreshJWT(currentRefreshToken);

  const user = await UserModel.findById(decodedRefreshToken._id);

  if (!user) throw new Error("User not found!");

  if (user.refreshToken && user.refreshToken === currentRefreshToken) {
    const { accessToken, refreshToken } = await JWTAuth(user);

    return { accessToken, refreshToken };
  } else {
    throw new Error("Token not valid!");
  }
};

export const verifyRefreshTokenPro = async (currentRefreshToken: string) => {
  const decodedRefreshToken: any = await verifyRefreshJWT(currentRefreshToken);

  const user = await ProUserModel.findById(decodedRefreshToken._id);

  if (!user) throw new Error("ProUser not found!");

  if (user.refreshToken && user.refreshToken === currentRefreshToken) {
    const { accessToken, refreshToken } = await JWTAuth(user);

    return { accessToken, refreshToken };
  } else {
    throw new Error("Token not valid!");
  }
};
