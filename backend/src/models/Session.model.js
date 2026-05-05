import mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    containerId: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ['active', 'closed', 'disconnected'],
      default: 'active',
    },

    endedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

const Session = mongoose.model('Session', sessionSchema)
export default Session