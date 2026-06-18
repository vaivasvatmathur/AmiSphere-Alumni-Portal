import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Save,
  ArrowLeft,
  User,
  GraduationCap,
  Briefcase,
  Globe,
  Upload,
  CheckCircle2
} from "lucide-react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import FormField from "../components/FormField.jsx";

const COURSE_OPTIONS = ["B.Tech IT", "B.Tech CSBS", "B.Tech CSSS"];
const EXPERIENCE_OPTIONS = ["Fresher", "0–1 Year", "1–3 Years", "1-3 Years", "3–5 Years", "5+ Years"];
const EXAM_OPTIONS = ["UPSC", "SSC CGL", "Banking", "Railways", "State PCS", "Defence", "GATE", "Other"];

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [alumniId, setAlumniId] = useState(null);

  // Form State containing DB fields and local extra fields
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    photo: "",
    enrollmentNumber: "",
    batch: "",
    course: "B.Tech IT",
    company: "",
    position: "",
    skills: "",
    linkedinUrl: "",
    // Extra fields stored in localStorage
    address: "",
    higherStudies: false,
    degree: "",
    institution: "",
    preparingGovExam: false,
    examType: "",
    previousExperience: "Fresher",
    portfolioUrl: "",
    githubUrl: ""
  });

  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => {
    // Fetch alumni profile data
    api
      .get("/auth/me")
      .then(({ data }) => {
        const alumniData = data.user?.alumni;
        if (alumniData) {
          const id = alumniData.id || alumniData._id;
          setAlumniId(id);

          // Fetch extra fields from localStorage
          const extraKey = `alumni_extra_details_${id}`;
          const extras = JSON.parse(localStorage.getItem(extraKey) || "{}");

          setForm((prev) => ({
            ...prev,
            ...alumniData,
            skills: Array.isArray(alumniData.skills) ? alumniData.skills.join(", ") : alumniData.skills || "",
            ...extras
          }));

          if (alumniData.photo) {
            setPhotoPreview(alumniData.photo);
          }
        }
      })
      .catch(() => {
        setError("Could not load profile information.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handlePhotoFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result);
      setForm((prev) => ({ ...prev, photo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    if (!form.fullName.trim()) {
      setError("Full Name is required.");
      setSaving(false);
      return;
    }

    try {
      // Split database fields from local storage fields
      const dbPayload = {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        photo: form.photo,
        enrollmentNumber: form.enrollmentNumber,
        batch: form.batch,
        course: form.course,
        company: form.company,
        position: form.position,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        linkedinUrl: form.linkedinUrl
      };

      const extraPayload = {
        address: form.address,
        higherStudies: form.higherStudies,
        degree: form.degree,
        institution: form.institution,
        preparingGovExam: form.preparingGovExam,
        examType: form.examType,
        previousExperience: form.previousExperience,
        portfolioUrl: form.portfolioUrl,
        githubUrl: form.githubUrl
      };

      // 1. Save DB fields
      if (alumniId) {
        await api.put(`/alumni/${alumniId}`, dbPayload);

        // 2. Save extra fields locally
        const extraKey = `alumni_extra_details_${alumniId}`;
        localStorage.setItem(extraKey, JSON.stringify(extraPayload));

        setSuccess("Profile updated successfully!");
        
        // Notify other layout components to update the visual state
        window.dispatchEvent(new Event("profileUpdated"));

        setTimeout(() => {
          navigate("/alumni/profile");
        }, 1200);
      } else {
        setError("Alumni profile ID not found. Save aborted.");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-slate-200 rounded-xl" />
        <div className="h-64 bg-slate-200 rounded-3xl" />
        <div className="h-64 bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Header Back Button & Title */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/alumni/profile")}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
            type="button"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Edit Career Profile</h1>
            <p className="text-xs text-slate-500">Update your career details and networking preferences.</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 flex items-center gap-2">
          <span>⚠️</span>
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-700 flex items-center gap-2">
          <CheckCircle2 size={16} />
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: Personal Information */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-[#061A32] flex items-center gap-2 border-b border-slate-100 pb-3">
            <User size={18} className="text-gold-400" />
            Section 1: Personal Information
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              label="Full Name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
            />
            <FormField
              label="Email Address"
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              required
            />
            <FormField
              label="Phone Number"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
            />
            <FormField
              label="City / Location"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="e.g. Noida, Delhi NCR"
            />

            {/* Profile Picture Upload & Preview */}
            <div className="md:col-span-2 space-y-2">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Profile Picture</span>
              <div className="flex flex-col sm:flex-row items-center gap-4 border border-slate-100 rounded-2xl p-4 bg-slate-50/50">
                <div className="relative shrink-0">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Avatar Preview"
                      className="h-20 w-20 rounded-2xl object-cover border border-slate-200 bg-white"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-200 text-slate-400">
                      <User size={24} />
                    </div>
                  )}
                </div>
                <div className="space-y-1.5 text-center sm:text-left">
                  <label className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-sm">
                    <Upload size={14} />
                    Upload Image File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoFile}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-slate-400">Supported formats: JPG, PNG, GIF. Max file size: 1MB.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Academic Information */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-[#061A32] flex items-center gap-2 border-b border-slate-100 pb-3">
            <GraduationCap size={18} className="text-gold-400" />
            Section 2: Academic Information
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              label="Enrollment Number"
              name="enrollmentNumber"
              value={form.enrollmentNumber}
              onChange={handleChange}
              required
            />
            <FormField
              label="Graduation Batch"
              name="batch"
              value={form.batch}
              onChange={handleChange}
              placeholder="e.g. 2024"
              required
            />
            
            <FormField label="Degree Course" required>
              <select
                name="course"
                value={form.course}
                onChange={handleChange}
                className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 hover:border-slate-300 transition-all shadow-sm"
              >
                {COURSE_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </FormField>

            {/* Higher Studies Fields */}
            <div className="md:col-span-2 border-t border-slate-100 pt-4 mt-2">
              <label className="flex items-center gap-3 cursor-pointer group select-none">
                <input
                  type="checkbox"
                  name="higherStudies"
                  checked={form.higherStudies}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                  Are you currently pursuing higher studies?
                </span>
              </label>

              {form.higherStudies && (
                <div className="grid gap-6 md:grid-cols-2 mt-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-150 animate-fadeIn">
                  <FormField
                    label="Degree Name"
                    name="degree"
                    value={form.degree}
                    onChange={handleChange}
                    placeholder="e.g. M.Tech, MS in CS"
                  />
                  <FormField
                    label="Institution Name"
                    name="institution"
                    value={form.institution}
                    onChange={handleChange}
                    placeholder="e.g. Stanford University, IIT Delhi"
                  />
                </div>
              )}
            </div>

            {/* Government Examinations */}
            <div className="md:col-span-2 border-t border-slate-100 pt-4 mt-2">
              <label className="flex items-center gap-3 cursor-pointer group select-none">
                <input
                  type="checkbox"
                  name="preparingGovExam"
                  checked={form.preparingGovExam}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                  Are you currently preparing for government competitive examinations?
                </span>
              </label>

              {form.preparingGovExam && (
                <div className="grid gap-6 md:grid-cols-2 mt-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-150 animate-fadeIn">
                  <FormField label="Examination Type">
                    <select
                      name="examType"
                      value={form.examType}
                      onChange={handleChange}
                      className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 hover:border-slate-300 transition-all shadow-sm"
                    >
                      <option value="">Select Examination</option>
                      {EXAM_OPTIONS.map((e) => (
                        <option key={e} value={e}>
                          {e}
                        </option>
                      ))}
                    </select>
                  </FormField>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 3: Professional Information */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-[#061A32] flex items-center gap-2 border-b border-slate-100 pb-3">
            <Briefcase size={18} className="text-gold-400" />
            Section 3: Professional Information
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              label="Current Company"
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="e.g. Google, Microsoft"
            />
            <FormField
              label="Current Position"
              name="position"
              value={form.position}
              onChange={handleChange}
              placeholder="e.g. Software Engineer, Tech Lead"
            />

            <FormField label="Previous Experience Level">
              <select
                name="previousExperience"
                value={form.previousExperience}
                onChange={handleChange}
                className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 hover:border-slate-300 transition-all shadow-sm"
              >
                {EXPERIENCE_OPTIONS.map((exp) => (
                  <option key={exp} value={exp}>
                    {exp}
                  </option>
                ))}
              </select>
            </FormField>

            <div className="md:col-span-2 space-y-1.5">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Skills (Comma Separated)
              </span>
              <textarea
                name="skills"
                rows="3"
                value={form.skills}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB, Python, cloud computing"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 hover:border-slate-300 transition-all shadow-sm"
              />
              <p className="text-[10px] text-slate-400">Separate skills with commas (e.g. Python, JS, Figma).</p>
            </div>
          </div>
        </div>

        {/* SECTION 4: Social & Networking Information */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-[#061A32] flex items-center gap-2 border-b border-slate-100 pb-3">
            <Globe size={18} className="text-gold-400" />
            Section 4: Social & Networking Information
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              label="LinkedIn URL"
              name="linkedinUrl"
              value={form.linkedinUrl}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
            />

            <FormField
              label="Portfolio Link"
              name="portfolioUrl"
              value={form.portfolioUrl}
              onChange={handleChange}
              placeholder="https://myportfolio.com"
            />

            <FormField
              label="GitHub Link"
              name="githubUrl"
              value={form.githubUrl}
              onChange={handleChange}
              placeholder="https://github.com/username"
            />
          </div>
        </div>

        {/* Sticky Save Button Bar */}
        <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/90 backdrop-blur-md py-4 px-6 sm:px-8 flex justify-between items-center shadow-lg z-30 transition-[padding]">
          <span className="text-xs text-slate-400 hidden sm:inline-block font-medium">
            Review your inputs before hitting save.
          </span>
          <div className="flex gap-3 ml-auto">
            <button
              onClick={() => navigate("/alumni/profile")}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
              type="button"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#061A32] px-5 py-2.5 text-xs font-semibold text-white hover:bg-opacity-95 shadow-sm transition-all disabled:opacity-75 disabled:cursor-not-allowed"
            >
              <Save size={14} />
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default EditProfile;

