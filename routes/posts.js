const express = require('express');
const router = express.Router();
const {Post, User} = require('../models')
const authMiddleware = require("../middlewares/auth-middleware");

/**
 * 게시글 작성
 */
const create = async (req, res) => {
    const {title, content} = req.body;
    const user = res.locals.user;

    try {
        await Post.create({
            title: title,
            content: content,
            userId: user.id
        });

        return res.status(200).json({result: 'success', message: '게시글 생성 성공'})
    } catch (error) {
        console.error(error);
        return res.status(500).json({result: 'fail', message: "server error"})
    }
}

/**
 * 게시글 전체 조회
 */
const findAll = async (req, res) => {

    try {
        /**
         * 배열 안에 오브젝트형식 {"data":[{"postId": 2,"userId": 1,"nickname": "Developer"
         *                            ,"title": "안녕하세요 2번째 게시글 제목입니다.","createdAt": "2022-07-25T07:45:56.000Z",
         *                            "updatedAt": "2022-07-25T07:45:56.000Z","likes": 0}]
         *
         */
        const posts = await Post.findAll({
            include: [{
                model: User,
                attributes: ['nickname']
            }],
            order: [['id', 'DESC']]
        })
        const temp = []
        posts.map((x) => temp.push(x))

        return res.status(200).json({result: "success", date: temp})
    } catch (error) {
        console.error(error);
        return res.status(500).json({result: 'fail', message: "server error"})
    }
}

/**
 * 게시글 단건 조회
 */
const findOne = async (req, res) => {
    const {postId} = req.params;

    try {
        const post = await Post.findOne({
            include: [{
                model: User,
                attributes: ['nickname'],
            }],
            where: {
                id: postId
            }
        })
        if (post === null) {
            return res.status(400).json({result: 'fail', message: '게시글이 없습니다.'})
        }

        return res.status(200).json(post)
    } catch (error) {
        console.error(error);
        return res.status(500).json({result: 'fail', message: "server error"})
    }
}

/**
 * 게시글 수정
 */
const update = async (req, res) => {
    const {postId} = req.params;
    const {title, content} = req.body;

    try {
        const post = await Post.update({title, content}, {where: {id: postId}});
        if (post[0] === 0) {
            return res.status(400).json({result: 'fail', message: '게시글이 없습니다.'})
        }

        return res.status(200).json({result: 'success', message: '게시글 수정 성공'})
    } catch (error) {
        console.error(error);
        return res.status(500).json({result: 'fail', message: "server error"})
    }
}

/**
 * 게시글 삭제
 */
const remove = async (req, res) => {
    const {postId} = req.params;

    try {
        const post = await Post.findOne({
            where: {
                id: postId
            }
        });
        if (post === null) {
            return res.status(400).json({result: 'fail', message: '게시글이 없습니다.'})
        }

        await Post.destroy({
            where: {
                id: postId
            }
        })
        return res.status(200).json({result: 'success', message: '게시글 삭제 성공'})

    } catch (error) {
        console.error(error);
        return res.status(500).json({result: 'fail', message: "server error"})
    }
}

router.post("/", authMiddleware, create);
router.get("/", findAll);
router.get('/:postId', findOne)
router.patch('/:postId', authMiddleware, update)
router.delete('/:postId', authMiddleware, remove)

module.exports = router;