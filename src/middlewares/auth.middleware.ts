import type { Request, Response, NextFunction } from "express";
import { verifyTokenAcess, } from '../common/utils/jwt'
import type { RoleType } from "../prisma/generated/prisma";
import type { TokenPayload } from '../common/utils/jwt'

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({
      error: 'missing token'
    })
  }

  try {
    const token = header.slice('Bearer '.length);
    const payload = verifyTokenAcess(token)
    
    if (!payload) 
      return res.status(401).json({
        error: 'invalid token'
      })

    req.user = payload as TokenPayload
    next();

  } catch {
    return res.status(401).json({
      error: 'invalid or expired token'
    })
  }
}

export function authorize(...roles: RoleType[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRoles = req.user?.role ?? [];
    const hasRole = roles.some(r => userRoles.includes(r));

    if (!hasRole) {
      return res.status(403).json({ error: 'insufficient permissions' });
    }

    next();
  };
}
