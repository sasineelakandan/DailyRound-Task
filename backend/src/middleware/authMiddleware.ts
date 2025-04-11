import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.jwt
        if (!token) {
            return res.status(401).send('you are not authenticated')
        }
        jwt.verify(token, process.env.JWT_KEY, async (err: any, payload: { userId: any }) => {
            if (err) return res.status(403).send('Token is not valid')
            req.userId = payload.userId
            next()
        })
    } catch (error) {
        console.log(error);
    }
}