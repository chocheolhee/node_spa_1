const express = require('express');
const router = express.Router();
const Comment = require('../schemas/comment')
const Post = require("../schemas/post");

/**
 * 댓글 작성
 */
const create = async (req, res) => {
    const {postId} = req.params;
    const {user, password, content} = req.body;

    if (content === "") {
        return res.status(400).json({message: "댓글 내용을 입력해주세요."})
    }
    try {
        const post = await Post.findById(postId);

        if (post == null) {
            return res.status(400).json({message: "게시글이 없습니다."})
        }

        await Comment.create({
            user: user,
            password: password,
            content: content,
            postId: postId
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

    try {
        const comments = await Comment.find().select('user content postId createdAt').sort({"createAt": -1})

        return res.status(200).json(comments)
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
    if (content === "") {
        return res.status(400).json({message: "댓글 내용을 입력해주세요."})
    }
    try {
        await Comment.updateOne({_id: commentId}, {$set: {content}});

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
    try {
        await Comment.deleteOne({"_id": commentId});

    } catch (error) {
        console.error(error);
        return res.status(500).json({result: 'fail', message: "server error"})
    }

    res.json({result: "success"});
}

router.post("/:postId", create);
router.get("/", findAll);
router.patch('/:commentId', update)
router.delete('/:commentId', remove)

module.exports = router;