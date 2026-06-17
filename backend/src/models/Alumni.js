import mongoose from "mongoose";

const COURSE_OPTIONS = ["B.Tech IT", "B.Tech CSBS", "B.Tech CSSS"];

const alumniSchema = new mongoose.Schema(
  {
    photo: {
      type: String,
      trim: true,
      default: ""
    },
    fullName: {
      type: String,
      required: [true, "Full name is required."],
      trim: true,
      minlength: [2, "Full name must be at least 2 characters."]
    },
    enrollmentNumber: {
      type: String,
      required: [true, "Enrollment number is required."],
      unique: true,
      trim: true,
      uppercase: true
    },
    batch: {
      type: String,
      required: [true, "Batch is required."],
      trim: true,
      match: [/^\d{4}$/, "Batch must be a four-digit year."]
    },
    course: {
      type: String,
      required: [true, "Course is required."],
      enum: COURSE_OPTIONS
    },
    phone: {
      type: String,
      trim: true,
      default: ""
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address."]
    },
    company: {
      type: String,
      trim: true,
      default: ""
    },
    position: {
      type: String,
      trim: true,
      default: ""
    },
    skills: {
      type: [String],
      default: [],
      set: (skills) =>
        Array.isArray(skills)
          ? skills.map((skill) => String(skill).trim()).filter(Boolean)
          : []
    },
    linkedinUrl: {
      type: String,
      trim: true,
      default: ""
    }
  },
  { timestamps: true }
);

alumniSchema.index({
  fullName: "text",
  enrollmentNumber: "text",
  email: "text",
  company: "text",
  position: "text",
  skills: "text"
});
alumniSchema.index({ batch: 1 });
alumniSchema.index({ course: 1 });
alumniSchema.index({ company: 1 });
alumniSchema.index({ position: 1 });
alumniSchema.index({ skills: 1 });

const Alumni = mongoose.model("Alumni", alumniSchema);

export { COURSE_OPTIONS };
export default Alumni;
