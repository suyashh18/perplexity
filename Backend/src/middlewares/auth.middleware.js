import jwt from 'jsonwebtoken'

export async function identifyUser(req, res, next) {
    const token = req.cookies.token

    if (!token) {
        return res.status(400).json({
            message: "unauthorized token",
            success: true,
            err: "token not present"
        })
    }
    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();

    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
            err: "Invalid token"
        })
    }

}