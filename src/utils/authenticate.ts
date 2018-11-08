import { verify } from "jsonwebtoken";

export interface AuthPayloadInterface {
  userId: number;
  iat: number;
  exp: number;
}

export interface RequestHeaders {
  [key: string]: string;
}

export interface Request {
  headers: RequestHeaders;
}

export const authenticate = ({ req }: { req: Request }): number | undefined => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.slice(7);
    try {
      const payload = verify(token, "secret") as AuthPayloadInterface;
      if (typeof payload === "object") {
        console.log("Authentication token valid");
        if (payload.exp) {
          const expiresOn = new Date(payload.exp * 1000);
          console.log(`Authentication token will expire on ${expiresOn}`);
        }
        return payload.userId;
      }
    } catch (err) {
      console.log("Authentication error", err);
    }
  }
};
