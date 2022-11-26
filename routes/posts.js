const express = require('express');
const router = express.Router();
const Post = require('../schemas/post')

/**
 * 게시글 작성
 */
const create = async (req, res) => {
    const {user, password, title, content} = req.body;

    try {
        await Post.create({
            user: user,
            password: password,
            title: title,
            content: content
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
        let post = await Post.find().select('title user createdAt').sort({"createAt": -1})

        return res.status(200).json(post)
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
        let post = await Post.findById(postId).select('title user createdAt content');

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
    const {password, title, content} = req.body;

    try {
        let post = await Post.findById(postId);

        if (post.password !== password) {
            return res.status(400).json({message: "비밀번호가 틀렸습니다."})
        }

        await Post.updateOne({_id: postId}, {$set: {title, content}});

        return res.status(200).json({result: 'success', message: '게시글 수정 성공'})
    } catch (error) {
        console.error(error);
        return res.status(500).json({result: 'fail', message: "server error"})
    }
}

/**
 * 게시글 삭제
 */
const del = async (req, res) => {
    const {postId} = req.params;
    const {password} = req.body

    try {
        let post = await Post.findById(postId);

        if (post.password !== password) {
            return res.status(400).json({message: "비밀번호가 틀렸습니다."})
        }

        await Post.deleteOne({"_id": postId});
        return res.status(200).json({result: 'success', message: '게시글 삭제 성공'})

    } catch (error) {
        console.error(error);
        return res.status(500).json({result: 'fail', message: "server error"})
    }
}

router.post("/", create);
router.get("/", findAll);
router.get('/:postId', findOne)
router.patch('/:postId', update)
router.delete('/:postId', del)

module.exports = router;