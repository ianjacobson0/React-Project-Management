export const getErrorMessage = (msg: string) => {
    switch (msg) {
        case "EMAIL_NOT_FOUND":
            return { message: "Email not found", statusCode: 401 };
        case "INCORRECT_PASSWORD":
            return { message: "Incorrect password", statusCode: 401 };
        default:
            return { message: msg, statusCode: 500 };
    }
}

export type jwtPayload = {
    id: number;
    expires: Date;
    iat: number;
}

export type verifyRequest = {
    token: string;
}
