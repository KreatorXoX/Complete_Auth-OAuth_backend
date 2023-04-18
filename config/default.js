"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    PORT: 1337,
    DBURI: process.env.DB_URI,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    stmp: {
        user: "s5joj4uoxq2g6y74@ethereal.email",
        pass: "nmJwZgMEwVbfBRn1W2",
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
    },
};
