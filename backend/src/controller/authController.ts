import tokenBlackListModel from '../model/jwtBlackList'
import user from "../model/userModel"
import jwt from 'jsonwebtoken'



const maxAge = 3 * 24 * 60 * 60 * 1000
const createToken = (email: any, userId: any) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge })
}

export const login = async (req, res) => {
    try {
        const { email, displayName, photoURL } = req.body;

        if (!email) {
            return res.status(400).send('Email is required');
        }

        const userDetails = await user.findOneAndUpdate(
            { email },
            {
                email,
                displayName,
                photoURL,
                createdAt: new Date(),
            },
            {
                new: true,
                upsert: true,
            }
        );

        const token = createToken(email, userDetails.id);

        res.cookie('jwt', token, {
            httpOnly: false,
            maxAge,
            sameSite: 'none',
            secure: true,
            path: '/',

        });

        return res.status(200).json(userDetails);
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).send('Internal Server Error');
    }
};


export const verfiyJwt = async (req, res) => {
    try {
        const token = req.cookies.jwt
        console.log(req.cookies)
        if (!token) {
            return res.status(401).send('you are not authenticated')
        }
        const isBlackListed=await tokenBlackListModel.findOne({blackListedToken:token})
        if(isBlackListed){
            return res.status(403).send('Token is not valid')
        }
        jwt.verify(token, process.env.JWT_KEY, async (err: any, payload: { userId: any }) => {
            if (err) return res.status(403).send('Token is not valid')
            res.json({ success: true })
        })
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).send('Internal Server Error');
    }
};

export const logoutUser = async (req, res) => {
    try {
        console.log(req.cookies.jwt);
        const blackListedToken = req.cookies.jwt
        await tokenBlackListModel.create({ blackListedToken })
        res.status(200).send('jwt blacklisted')

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).send('Internal Server Error');
    }
};
