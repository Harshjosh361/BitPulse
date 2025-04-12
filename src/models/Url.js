import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
    unique: true,
  },
  customAlias: {
    type: String,
    unique: true,
    sparse: true,
  },
  expiresAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  deviceStats: {
    type: {
      desktop: { type: Number, default: 0 },
      mobile: { type: Number, default: 0 },
      tablet: { type: Number, default: 0 }
    },
    default: () => ({
      desktop: 0,
      mobile: 0,
      tablet: 0
    })
  }
});

urlSchema.index({ expiresAt: 1 });

// ensure deviceStats is always defined
urlSchema.pre('save', function(next) {
  if (!this.deviceStats) {
    this.deviceStats = {
      desktop: 0,
      mobile: 0,
      tablet: 0
    };
  }
  next();
});

export default mongoose.models.Url || mongoose.model('Url', urlSchema); 