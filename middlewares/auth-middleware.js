const jwt = require("jsonwebtoken");
const {User} = require("../models");
require('dotenv').config();

module.exports = (req, res, next) => {
    const {authorization} = req.headers;
    const [authType, authToken] = (authorization || "").split(" ");

    if (!authToken || authType !== "Bearer") {
        return res.status(401).send({errorMessage: "로그인이 필요합니다.",});
    }

    try {
        const {userId} = jwt.verify(authToken, process.env.JWT_SECRET_KEY);
        User.findByPk(userId).then((user) => {
            res.locals.user = user;
            next();
        });
    } catch (err) {
        res.status(401).send({
            errorMessage: "로그인 후 이용 가능한 기능입니다.",
        });
    }
};