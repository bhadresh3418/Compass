// Middleware are functions that can be used to passing some authetication rules
// or checking headers handling request before get executed by controller

const jwt = require("jsonwebtoken");

const env = require("../../config/env");

module.exports = function (req, res, next) {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];

    if (token) {
        return jwt.verify(token, env.JWT_SECRET, function (err, decoded) {
            if (err) {
                // logger.error(err);
                return res.json({
                    success: false,
                    message: "Failed to authenticate token.",
                });
            }
            req.user = decoded;
            return next();
        });
    }
    return res.unauthorized( );
};


