const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Types.ObjectId, ref: "Job", required: true },
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    resume: { type: String, required: true },
    coverLetter: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    appliedDate: { type: Date, default: Date.now },
  },
  { timestamps: true, versionKey: false }
);
const ApplicationModel = mongoose.model("Application", applicationSchema);
module.exports = ApplicationModel;
