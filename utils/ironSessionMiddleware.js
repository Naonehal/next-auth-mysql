// ironSessionMiddleware.js

import { withIronSession } from "next-iron-session";

export default function withSession(handler) {
  return withIronSession(handler, {
    password: process.env.SECRET_COOKIE_PASSWORD, // Set this in your .env.local file
    cookieName: "next-auth-session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  });
}
