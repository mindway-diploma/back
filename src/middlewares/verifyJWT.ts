import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";

export interface CustomRequest extends Request {
    id: string;
    email: string;
}

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log(token);
    console.log(process.env.ACCESS_TOKEN_SECRET)
    jwt.verify(
        token as string,
        process.env.ACCESS_TOKEN_SECRET as string, (err: any, decoded: any) => {
            if (err) return res.status(401).json({'error': 'No token profided or token expired'});
            (req as CustomRequest).id = decoded.userId;
            (req as CustomRequest).email = decoded.email;
            next();
        }
    );
}

export default verifyJWT;