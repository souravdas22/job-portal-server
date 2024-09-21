const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    company: { type: String, required: true },
    salary: { type: String, required: true },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "intership"],
      required: true,
    },
    vaccancies: { type: Number, required: true },
    skills: { type: [String], required: true },
    category: { type: String, required: true },
    image: {
      type: String,
      required: true,
    },
    postedDate: { type: Date, default: Date.now },
    isdeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);
const JObModel = mongoose.model("Job", jobSchema);
module.exports = JObModel;
