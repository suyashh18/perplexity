import jwt from 'jsonwebtoken'

export async function identifyUser(req, res, next) {
    console.log("HAS COOKIE HEADER:", !!req.headers.cookie)
    console.log("COOKIE KEYS:", Object.keys(req.cookies || {}))
    console.log("TOKEN EXISTS:", !!req.cookies?.token)

    const token = req.cookies?.token

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
        console.log("JWT ERROR:", err.message)

        return res.status(401).json({
            message: "Unauthorized",
            success: false,
            err: "Invalid token"
        })
    }
}