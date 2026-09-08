const express = require('express');

const router =
  express.Router();

const Post = require('./post');

const {
  protect,
  authorize
} = require('./auth');


// GET ALL POSTS

router.get(
  '/',
  protect,
  async (req, res) => {

    try {

      const posts =
        await Post.find()
          .populate(
            'teacher',
            'name department designation'
          )
          .sort({
            createdAt: -1
          });

      res.json(posts);

    } catch (err) {

      res.status(500).json({
        message: 'Server error',
        error: err.message
      });
    }
  }
);


// CREATE POST - TEACHER ONLY

router.post(
  '/',
  protect,
  authorize('teacher'),
  async (req, res) => {

    try {

      const {
        title,
        type,
        description,
        requiredSkills
      } = req.body;


      if (
        !title ||
        !type ||
        !description
      ) {

        return res.status(400).json({
          message:
            'Title, type and description are required.'
        });

      }


      const post =
        await Post.create({

          teacher:
            req.user.id,

          title,

          type,

          description,

          requiredSkills:
            requiredSkills || []

        });


      const populatedPost =
        await Post.findById(
          post._id
        ).populate(
          'teacher',
          'name department designation'
        );


      res.status(201).json({

        message:
          'Post published successfully',

        post:
          populatedPost

      });

    } catch (err) {

      res.status(500).json({

        message:
          'Server error',

        error:
          err.message

      });
    }
  }
);


module.exports = router;