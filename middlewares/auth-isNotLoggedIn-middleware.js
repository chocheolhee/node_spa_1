const jwt = require("jsonwebtoken")
const {User} = require("../models");

module.exports = (req, res, next) => {
    const {authorization} = req.headers;
    const [authType, authToken] = (authorization || "").split(" ");

    if (!authToken || authType !== "Bearer") {
        next();
    } else {
        try {
            const {userId} = jwt.verify(authToken, "mysecretkey");
            User.findByPk(userId).then((user) => {
                return res.status(401).json({errorMessage: "이미 로그인이 되어있습니다."})
            });
        } catch (err) {
            res.status(401).json({errorMessage: "token 정보가 다른걸?"});
        }
    }

};