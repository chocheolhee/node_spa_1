const express = require('express');
const router = express.Router();
const {Post, User, PostLike} = require('../models')
const authMiddleware = require("../middlewares/auth-middleware");
const {where} = require("sequelize");

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
        const data = []
        posts.map((x) => data.push(x))

        return res.status(200).json({result: "success", date: data})
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

/**
 * 게시글 좋아요 API
 * - 로그인 토큰을 전달했을 때에만 좋아요 할 수 있게 하기 --> ok
 * - 로그인 토큰에 해당하는 사용자가 좋아요 한 글에 한해서, 좋아요 취소 할 수 있게 하기
 * - 게시글 목록 조회시 글의 좋아요 갯수도 같이 표출하기
 */
const postLike = async (req, res) => {
    const {postId} = req.params;
    const user = res.locals.user;

    const post = await Post.findOne({
        where: {
            id: postId
        }
    });

    if (post === null) {
        return res.status(400).json({result: 'fail', message: '게시글이 없습니다.'})
    }

    try {
        await PostLike.create({
            userId: user.id,
            postId: postId
        });

        return res.status(200).json({result: 'success', message: '좋아요 추가 성공'})

    } catch (error) {
        console.error(error);
        return res.status(500).json({result: 'fail', message: "server error"})
    }
}

/**
 * 게시글 좋아요 취소 API
 */
const removePostLike = async (req, res) => {
    const {postId} = req.params;
    const user = res.locals.user;

    const isPostLike = await PostLike.findOne({
        where: {postId}
    });

    if (isPostLike === null) {
        return res.status(400).json({result: 'fail', message: '게시글이 없습니다.'})
    }

    if (isPostLike.userId !== user.id) {
        return res.status(401).json({message: "작성자의 좋아요 아닙니다."})
    }

    try {
        await PostLike.destroy({
            where: {postId}
        })

        return res.status(200).json({result: 'success', message: '좋아요 삭제 성공'})

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
router.post('/:postId/like', authMiddleware, postLike)
router.delete('/:postId/removeLike', authMiddleware, removePostLike)

module.exports = router;