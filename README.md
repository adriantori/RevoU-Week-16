# RevoU Week 16

Creates Back-End (and hopefully) Front-End which basically contains essential JWT and Cookie manipulations.

Below is a little bit of code snippet to makes it more "to the point" according to the assignment requirements.

## Username Demo

User Examples:

```sql
user@dev.com || user123
admin@dev.com || admin123
```

## Login Token

```javascript
const token = jwt.sign({
    userId: user.user_id,
    username: user.user_name,
    role: user.role.role_name
}, JWT_SIGN!);

res.cookie('loginCookie', token, {
    httpOnly: true,
    maxAge: 1000 * 60, // 1 minute
    path: '/', // Optional: specify the cookie path
});

res.cookie('loginCookieRefresh', token, {
    httpOnly: true,
    maxAge: 600000, // 10 minutes in milliseconds
    path: '/', // Optional: specify the cookie path
});
```

## Refresh Expired Token

```javascript
if (!loginCookie && loginCookieRefresh) {
    try {
        const decodedPayload: jwt.JwtPayload = jwt.decode(loginCookieRefresh) as jwt.JwtPayload
        // Generate a new token and set it in the loginCookie
        const newToken = jwt.sign(decodedPayload, JWT_SIGN!);

        res.cookie('loginCookie', newToken, {
            httpOnly: true,
            maxAge: 1000 * 60, // 1 minute
            path: '/', // Optional: specify the cookie path
        });
    }
}
```

## Logout Clearing Cookies

```javascript
function logoutUserController(req: Request, res: Response) {
    res.cookie('loginCookie', '', { expires: new Date(0) });
    res.cookie('loginCookieRefresh', '', { expires: new Date(0) });
    res.status(200).json({ message: 'Logout successful' });
}
```

## Reset Password

I split request password route into 2 sections, first User have to insert their email address and they'll get Reset Token. Then User will insert said Reset Token and their new Password on other route.

### Generate Reset Password Request Token

```javascript
const tokenCache = new Map<string, { token: string, timestamp: number }>();

function generateResetToken() {
    return uuidv4();
}

async function storeResetTokenInMemory(userEmail: string, resetToken: string) {
    // Store the reset token in memory with a timestamp
    const timestamp = Date.now();
    tokenCache.set(userEmail, { token: resetToken, timestamp: timestamp });

    // Expire the token after 5 minutes
    setTimeout(() => {
        tokenCache.delete(userEmail);
    }, 5 * 60 * 1000); // 5 minutes in milliseconds
}

async function generateResetUserController(req: Request, res: Response) {
    try {
        const userEmail = req.body.email; // Assuming the email is submitted in the request body

        // Generate a reset token
        const resetToken = generateResetToken();

        // Store the reset token in memory and set an expiration
        await storeResetTokenInMemory(userEmail, resetToken);

        // Respond with the reset token
        res.status(200).json({
            message: 'Reset token generated successfully',
            resetToken: resetToken
        });
    } catch (error) {
        console.error('Error generating reset token:', error);
        res.status(500).json({ message: 'An error occurred while generating reset token' });
    }
}
```

### Actually Resetting Password

```javascript
async function retrieveResetTokenFromMemoryByToken(resetToken: string) {
    for (const [email, tokenData] of tokenCache.entries()) {
        if (tokenData.token === resetToken) {
            return email;
        }
    }
    return null;
}


async function resetPasswordController(req: Request, res: Response) {
    try {
        const resetToken = req.body.resetToken;
        const newPassword = req.body.newPassword;

        // Retrieve the user's email using the reset token
        const userEmail = await retrieveResetTokenFromMemoryByToken(resetToken);

        if (!userEmail) {
            return res.status(400).json({ message: 'Invalid reset token' });
        }

        // Update the user's password
        await updatePasswordUserService(userEmail, newPassword);

        for (const [email] of tokenCache.entries()) {
            if (email === userEmail) {
                tokenCache.delete(email);
            }
        }

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'An error occurred while resetting the password' });
    }
}
```

## Multiple Roles

```javascript
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../middlewares/database';

class Role extends Model {
    public role_id!: number;
    public role_name!: "admin" | "user";
}

Role.init(
    {
        role_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        role_name: {
            type: DataTypes.ENUM("admin", "user"),
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'roles',
        timestamps: false
    }
);
export default Role; // Export the Role model

// Only 2 roles, Admin and User.
// 3rd role is redundantdue to no other authorization needs.
```

## GET and other Posts routing

All of the routes can be obtained by importing Postman configuration, which should be inside this repository's root (Week-16.postman_collection.json).

## Login Limitation when Failed

```javascript
import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
    windowMs: 30 * 1000, // 30 seconds
    max: 5, // Limit each IP to 5 requests per windowMs
    skipSuccessfulRequests: true,
    message: 'Too many requests from this IP, please try again later.'
});

export default loginLimiter
```

## Deployment Link

Back-end: [revou-week16-be.vercel.app](https://revou-week16-be.vercel.app/)


