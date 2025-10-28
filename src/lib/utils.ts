/* eslint-disable */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import jwt from "jsonwebtoken";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const decodeJwt = (token: string) => {
  try {
    // Decode token and extract payload
    const decoded = jwt.decode(token);
    return decoded;
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
};

export default decodeJwt;