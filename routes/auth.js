const express = require('express');
const router = express.Router();
const {User} = require('../models')
const jwt = require("jsonwebtoken");
const isNotLoggedIn = require("../middlewares/auth-isNotLoggedIn-middleware");

/**
 * 회원가입
 */
const signup = async (req, res) => {
    const {email, nickname, password, passwordCheck} = req.body;
    /**
     * - 닉네임은 `최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)`로 구성하기 --> ok
     * - 비밀번호는 `최소 4자 이상이며, 닉네임과 같은 값이 포함된 경우 회원가입에 실패`로 만들기 --> ok
     * - 비밀번호 확인은 비밀번호와 정확하게 일치하기 ->> ok
     * - 닉네임, 비밀번호, 비밀번호 확인을 request 에서 전달받기 --> ok
     * - 데이터베이스에 존재하는 닉네임을 입력한 채 회원가입 버튼을 누른 경우 "중복된 닉네임입니다." 라는 에러메세지를 response 에 포함하기 --> ok
     * # 412 닉네임이 중복된 경우
     * {"errorMessage": "중복된 닉네임입니다."} --> ok
     * # 412 비밀번호가 일치하지 않는 경우
     * {"errorMessage": "패스워드가 일치하지 않습니다."} ->> ok
     * # 412 ID 형식이 비정상적인 경우
     * {"errorMessage": "ID의 형식이 일치하지 않습니다."} --> ok
     * # 412 password 에 닉네임이 포함되어있는 경우
     * {"errorMessage": "패스워드에 닉네임이 포함되어 있습니다."} --> ok
     * # 400 예외 케이스에서 처리하지 못한 에러
     * {"errorMessage": "요청한 데이터 형식이 올바르지 않습니다."} ->> ok
     */

    const nicknameReg = /^[a-zA-z0-9]{3,12}$/;
    if (!nicknameReg.test(nickname)) {
        return res.status(412).json({"errorMessage": "닉네임 형식이 일치하지 않습니다."})
    }
    if (password.length < 4) {
        return res.status(412).json({"errorMessage": "최소 4글자 이상 입력해 주세요."})
    }

    /**
     * 질문하기 password.includes(nickname) = true/false
     * joi
     */
    if (password.includes(nickname)) {
        return res.status(412).json({"errorMessage": "패스워드에 닉네임이 포함되어 있습니다."})
    }

    if (password !== passwordCheck) {
        return res.status(412).json({"errorMessage": "패스워드가 일치하지 않습니다."})
    }

    try {
        const exUser = await User.findOne({
            where: {email}
        });

        if (exUser !== null && exUser.nickname === nickname) {
            return res.status(412).json({"errorMessage": "중복된 닉네임입니다."})
        }

        await User.create({
            email, nickname, password
        });

        return res.status(200).json({result: 'success', message: '회원가입 성공'})
    } catch (error) {
        console.error(error);
        return res.status(500).json({result: 'fail', message: "server error"})
    }
}

/**
 * 로그인
 */
const login = async (req, res) => {
    const {nickname, password} = req.body;
    /**
     * - 닉네임, 비밀번호를 request 에서 전달받기 --> ok
     * - 로그인 버튼을 누른 경우 닉네임과 비밀번호가 데이터베이스에 등록됐는지 확인한 뒤,
     *   하나라도 맞지 않는 정보가 있다면 "닉네임 또는 패스워드를 확인해주세요."라는 에러 메세지를 response 에 포함하기 --> ok
     * - 로그인 성공 시 로그인 토큰을 클라이언트에게 Cookie 로 전달하기 --> ok
     * # 412 해당하는 유저가 존재하지 않는 경우
     * {"errorMessage": "닉네임 또는 패스워드를 확인해주세요." --> ok
     * # 400 예외 케이스에서 처리하지 못한 에러
     * {"errorMessage": "로그인에 실패하였습니다."} --< ok
     */

    try {
        const user = await User.findOne({
            where: {nickname},
        });

        if (!user || password !== user.password) {
            return res.status(412).json({errorMessage: "닉네임 또는 패스워드가 틀렸습니다."});
        }

        const token = jwt.sign({userId: user.userId}, "mysecretkey")
        res.cookies('token', token);

        return res.status(200).json({result: "success"})
    } catch (error) {
        console.error(error);
        return res.status(500).json({errorMessage: "로그인에 실패하였습니다."});
    }
}

router.post("/signup", isNotLoggedIn, signup);
router.post("/login", isNotLoggedIn, login);

module.exports = router;