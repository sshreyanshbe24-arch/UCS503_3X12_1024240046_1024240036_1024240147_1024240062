const express = require('express');

const router =
  express.Router();

const User = require('./user');

const {
  protect
} = require('./auth');


// GET PROFILE

router.get(
  '/me',
  protect,
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user.id
        ).select('-password');

      if (!user) {
        return res.status(404).json({
          message: 'User not found'
        });
      }

      res.json(user);

    } catch (err) {

      res.status(500).json({
        message: 'Server error',
        error: err.message
      });
    }
  }
);


// UPDATE PROFILE

router.put(
  '/me',
  protect,
  async (req, res) => {

    try {

      const {
        department,
        cgpa,
        skills,
        github,
        linkedin,
        resume,
        profilePicture,
        designation,
        expertise
      } = req.body;

      const user =
        await User.findById(
          req.user.id
        );

      if (!user) {
        return res.status(404).json({
          message: 'User not found'
        });
      }


      if (user.role === 'student') {

        if (
          !department ||
          cgpa === undefined ||
          cgpa === null ||
          !skills ||
          skills.length === 0
        ) {
          return res.status(400).json({
            message:
              'Department, CGPA and at least one skill are required.'
          });
        }

        if (
          Number(cgpa) < 0 ||
          Number(cgpa) > 10
        ) {
          return res.status(400).json({
            message:
              'CGPA must be between 0 and 10.'
          });
        }

        user.department =
          department;

        user.cgpa =
          Number(cgpa);

        user.skills =
          skills;

        user.github =
          github || '';

        user.linkedin =
          linkedin || '';

        user.resume =
          resume || '';

        user.profilePicture =
          profilePicture || '';
      }


      if (user.role === 'teacher') {

        if (
          !department ||
          !designation
        ) {
          return res.status(400).json({
            message:
              'Department and designation are required.'
          });
        }

        user.department =
          department;

        user.designation =
          designation;

        user.expertise =
          expertise || [];

        user.profilePicture =
          profilePicture || '';
      }


      await user.save();

      const updatedUser =
        await User.findById(
          req.user.id
        ).select('-password');

      res.json({

        message:
          'Profile updated successfully',

        user: updatedUser

      });

    } catch (err) {

      res.status(500).json({
        message: 'Server error',
        error: err.message
      });
    }
  }
);

module.exports = router;