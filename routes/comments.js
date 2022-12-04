const express = require('express');
const router = express.Router();
const {Comment, Post} = require('../models')
const authMiddleware = require("../middlewares/auth-middleware");

/**
 * 댓글 작성
 */
const create = async (req, res) => {
    const {postId} = req.params;
    const {content} = req.body;
    const user = res.locals.user;

    if (content === "") {
        return res.status(400).json({message: "댓글 내용을 입력해주세요."})
    }
    try {
        const post = await Post.findOne({
            where: {
                id: postId
            }
        });
        console.log(post)

        if (post === null) {
            return res.status(400).json({message: "게시글이 없습니다."})
        }

        await Comment.create({
            userId: user.id,
            postId: postId,
            content: content,
        });

        return res.status(200).json({result: 'success', message: '댓글 생성 성공'})
    } catch (error) {
        console.error(error);
        return res.status(500).json({result: 'fail', message: "server error"})
    }
}

/**
 * 댓글 전체 조회
 */
const findAll = async (req, res) => {
    /**
     * - 로그인 토큰을 전달하지 않아도 댓글 목록 조회가 가능하도록 하기 --> ok
     * - 조회하는 게시글에 작성된 모든 댓글을 목록 형식으로 response 에 포함하기 -->
     * - 제일 최근 작성된 댓글을 맨 위에 정렬하기
     */

    try {
        // const comments = await Comment.find().select('user content postId createdAt').sort({"createdAt": -1})
        const comments = await Comment.findAll({
            include: [{
                model: Post,
            }],
            order: [['id', 'DESC']]
        })
        const data = []
        comments.map((x) => data.push(x))

        return res.status(200).json({result: "success", date: data})
    } catch (error) {
        console.error(error);
        return res.status(500).json({result: 'fail', message: "server error"})
    }
}

/**
 * 댓글 수정
 */
const update = async (req, res) => {
    const {commentId} = req.params;
    const {content} = req.body;
    const user = res.locals.user;

    const isComment = await Comment.findOne({
        where: {
            id: commentId
        }
    });
    if (isComment.id !== user.id) {
        return res.status(401).json({message: "작성자가 쓴 댓글이 아닙니다."})
    }

    if (content === "") {
        return res.status(400).json({message: "댓글 내용을 입력해주세요."})
    }
    try {
        const comment = await Comment.update({content}, {where: {id: commentId}});
        if (comment[0] === 0) {
            return res.status(400).json({result: 'fail', message: '댓글이 없습니다.'})
        }

        return res.status(200).json({result: 'success', message: '댓글 수정 성공'})
    } catch (error) {
        console.error(error);
        return res.status(500).json({result: 'fail', message: "server error"})
    }

}

/**
 * 댓글 삭제
 */
const remove = async (req, res) => {
    const {commentId} = req.params;
    const user = res.locals.user;

    const isComment = await Comment.findOne({
        where: {
            id: commentId
        }
    });
    if (isComment.id !== user.id) {
        return res.status(401).json({message: "작성자가 쓴 댓글이 아닙니다."})
    }

    try {
        const comment = await Comment.findOne({
            where: {
                id: commentId
            }
        });
        if (comment === null) {
            return res.status(400).json({result: 'fail', message: '게시글이 없습니다.'})
        }

        await Comment.destroy({
            where: {
                id: commentId
            }
        })

        return res.status(200).json({result: 'success', message: '게시글 삭제 성공'})

    } catch (error) {
        console.error(error);
        return res.status(500).json({result: 'fail', message: "server error"})
    }
}
router.post("/:postId", authMiddleware, create);
router.get("/", findAll);
router.patch('/:commentId', authMiddleware, update)
router.delete('/:commentId', authMiddleware, remove)

module.exports = router;