module.exports = (req, res, next) => {
    const {authorization} = req.headers;
    const [authType, authToken] = (authorization || "").split(" ");

    if (!authToken || authType !== "Bearer") {
        next();
    } else {
        return res.status(401).send({errorMessage: "이미 로그인이 되어있습니다."});
    }
};