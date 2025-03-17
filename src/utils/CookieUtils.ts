import { Cookies } from "react-cookie";
import { CookieOptions } from "react-router-dom";

const cookies = new Cookies();

export const setCookie = (
  key: string,
  value: string,
  options?: CookieOptions
): void => {
  cookies.set(key, value, { ...options });
};

export const getCookie = (key: string): string | undefined => {
  return cookies.get(key);
};

export const removeCookie = (key: string): void => {
  cookies.remove(key);
};
