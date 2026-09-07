import jwt from 'jsonwebtoken'

export async function identifyUser(req, res, next) {
    console.log("COOKIE HEADER:", req.headers.cookie)
    console.log("PARSED COOKIES:", req.cookies)

    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
            err: "Token not present"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded
        next()

    } catch (err) {
        console.log("JWT ERROR:", err)

        return res.status(401).json({
            message: "Unauthorized",
            success: false,
            err: "Invalid token"
        })
    }
}