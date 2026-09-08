const mongoose = require('mongoose');

const postSchema =
  new mongoose.Schema(
    {
      teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },

      title: {
        type: String,
        required: true,
        trim: true
      },

      type: {
        type: String,
        enum: [
          'Hackathon',
          'Project'
        ],
        required: true
      },

      description: {
        type: String,
        required: true,
        trim: true
      },

      requiredSkills: {
        type: [String],
        default: []
      }
    },
    {
      timestamps: true
    }
  );

module.exports =
  mongoose.model(
    'Post',
    postSchema
  );