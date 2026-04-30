import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    // Basic user info
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
      ],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Never return password in queries by default
    },

    // User role — for future admin features
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    // Profile
    avatar: {
      type: String,
      default: '',
    },

    // Account status
    isActive: {
      type: Boolean,
      default: true,
    },

    // Last login tracking
    lastLogin: {
      type: Date,
      default: null,
    },

    // Refresh token stored in DB for validation
    refreshToken: {
      type: String,
      default: null,
      select: false, // Never return in queries
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
)

// ===========================
// Pre-save Hook — Hash password before saving
// ===========================
userSchema.pre('save', async function (next) {
  // Only hash if password was modified
  if (!this.isModified('password')) return next()

  try {
    // Generate salt with 12 rounds
    const salt = await bcrypt.genSalt(12)
    // Hash the password
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// ===========================
// Instance Method — Compare passwords
// ===========================
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

// ===========================
// Instance Method — Return user without sensitive fields
// ===========================
userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    avatar: this.avatar,
    isActive: this.isActive,
    lastLogin: this.lastLogin,
    createdAt: this.createdAt,
  }
}

const User = mongoose.model('User', userSchema)

export default User