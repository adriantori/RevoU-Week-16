import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
    windowMs: 30 * 1000, // 30 seconds
    max: 5, // Limit each IP to 5 requests per windowMs
    skipSuccessfulRequests: true,
    message: 'Too many requests from this IP, please try again later.'
});

export default loginLimiter