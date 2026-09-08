const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ['student', 'teacher', 'admin'],
      required: true
    },

    rollNumber: {
      type: String
    },

    department: {
      type: String
    },

    cgpa: {
      type: Number
    },

    skills: {
      type: [String],
      default: []
    },

    github: {
      type: String
    },

    linkedin: {
      type: String
    },

    resume: {
      type: String
    },

    profilePicture: {
      type: String
    },

    designation: {
      type: String
    },

    expertise: {
      type: [String],
      default: []
    },

    resetPasswordToken: {
      type: String
    },

    resetPasswordExpires: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports =
  mongoose.model('User', userSchema);