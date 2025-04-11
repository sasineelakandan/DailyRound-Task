import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../../../utils/constants'

interface UserPayload extends JwtPayload {
  id: string;
  role: string;
  exp: number; // Expiry time (in seconds since epoch)
  iat: number; // Issued at time (in seconds since epoch)
}

export interface CustomRequest extends Request {
  user?: UserPayload;
}

const authMiddleware = async (req:CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  
  const accessToken = req.cookies.accessToken
  const refreshToken = req.cookies.refreshToken;

  const isTokenExpired = (exp: number) => Date.now() >= exp * 1000;

  try {
    if (accessToken) {
      const decoded = jwt.decode(accessToken) as UserPayload;

      if (decoded && !isTokenExpired(decoded.exp)) {
        req.user = decoded; 
       
        next(); 
        return; 
      }

      console.log('Access token expired.');
    }

    if (refreshToken) {
      const decoded = jwt.decode(refreshToken) as UserPayload;

      if (decoded && !isTokenExpired(decoded.exp)) {
        const newAccessToken = jwt.sign(
          { id: decoded.id, role: decoded.role },
          JWT_SECRET(),
          { expiresIn: '1h' }
        );

        res.cookie('accessToken', newAccessToken, {
          httpOnly: true,
          
        });

        req.user = decoded; 
        next(); 
        return; 
      }

      console.log('Refresh token expired.');
      res.status(403).json({ message: 'Refresh token expired. Please log in again.' });
      return;
    }
    console.log(req)
    res.status(401).json({ message: 'Unauthorized. Please log in.' });
    return;
  } catch (error) {
    console.error('Error in authentication middleware:', error);
    res.status(500).json({ message: 'Internal server error.' });
    return;
  }
};

export default authMiddleware;
