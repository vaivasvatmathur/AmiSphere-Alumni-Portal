import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Award,
  Globe,
  Calendar,
  Hash,
  Edit3,
  ExternalLink,
  BookOpen,
  Code
} from "lucide-react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const LinkedinIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GithubIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);





const MyProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dbAlumni, setDbAlumni] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfileData = () => {
    api
      .get("/auth/me")
      .then(({ data }) => {
        const rawAlumni = data.user?.alumni || null;
        if (rawAlumni) {
          setDbAlumni(rawAlumni);
        } else {
          setDbAlumni(null);
        }
      })
      .catch(() => setDbAlumni(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-64 bg-slate-200 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-48 bg-slate-200 rounded-2xl" />
          <div className="md:col-span-2 h-48 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  const alumni = dbAlumni || {
    fullName: user?.fullName || user?.name || "Guest Alumni",
    email: user?.email || "",
    batch: "Not Specified",
    course: "Not Specified",
    phone: "Not Specified",
    company: "Not Specified",
    position: "Not Specified",
    skills: "",
    linkedinUrl: "",
    higherStudies: false,
    preparingGovExam: false,
    address: "Noida, India",
    photo: ""
  };


  const initials = (name = "") =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const skillsList = Array.isArray(alumni.skills)
    ? alumni.skills
    : (alumni.skills || "").split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <div className="space-y-8">
      {/* Page Header with Edit Profile Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Profile</h1>
          <p className="text-xs text-slate-500 mt-1">Your professional career identity on the Alumni Network.</p>
        </div>
        <button
          onClick={() => navigate("/alumni/edit-profile")}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm self-start sm:self-center"
        >
          <Edit3 size={14} />
          Edit Profile
        </button>
      </div>

      {/* Uninitialized Profile Warning Banner */}
      {!dbAlumni && (

        <div className="rounded-2xl bg-amber-50 border border-amber-200/60 p-4 text-xs font-medium text-amber-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>Your alumni profile has not been completed. Let recruiters know you exist by adding details.</span>
          </div>
          <button
            onClick={() => navigate("/alumni/edit-profile")}
            className="text-xs font-bold text-amber-900 underline hover:no-underline self-start sm:self-center"
          >
            Complete Profile Now
          </button>
        </div>
      )}

      
      {/* Top Profile Banner Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {/* Banner Pattern Background */}
        <div className="h-44 bg-gradient-to-r from-[#061A32] to-[#0f3158] relative">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute bottom-4 right-6 flex items-center gap-2 rounded-lg bg-black/30 backdrop-blur-sm px-3 py-1.5 text-xs text-white">
            <MapPin size={12} className="text-gold-400" />
            Amity Noida Campus
          </div>
        </div>

        {/* Profile Header Contents */}
        <div className="px-6 pb-6 pt-0 sm:px-8 sm:pb-8 relative">
          
          {/* Avatar Positioned Overlap */}
          <div className="relative -mt-20 mb-4 inline-block">
            {alumni.photo ? (
              <img
                src={alumni.photo}
                alt="Profile Avatar"
                className="h-32 w-32 rounded-3xl border-4 border-white object-cover shadow-md bg-white"
              />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-3xl border-4 border-white bg-brand-500 text-3xl font-bold text-white shadow-md">
                {initials(alumni.fullName)}
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{alumni.fullName}</h1>
                <span className="inline-flex items-center rounded-full bg-gold-50 px-2.5 py-0.5 text-xs font-semibold text-gold-600 border border-gold-200/40">
                  Class of {alumni.batch}
                </span>
                {alumni.email && alumni.email.endsWith("@gmail.com") && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-200/40">
                    ✓ Gmail Verified
                  </span>
                )}
              </div>
              
              <p className="text-base font-semibold text-slate-800 flex items-center gap-2">
                {alumni.position ? (
                  <>
                    <Briefcase size={16} className="text-slate-400" />
                    <span>{alumni.position}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500">{alumni.company}</span>
                  </>
                ) : (
                  <span className="text-slate-500 font-medium">Seeking Opportunities / Not Specified</span>
                )}
              </p>
              
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin size={14} className="text-slate-400" />
                {alumni.address || "Noida, Uttar Pradesh, India"}
              </p>
            </div>

            <div>
              <button
                onClick={() => navigate("/alumni/edit-profile")}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm w-full md:w-auto justify-center"
              >
                <Edit3 size={15} />
                Edit Profile
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Main Details Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Personal & Social Details (1 Column) */}
        <div className="space-y-6">
          
          {/* Card 1: Contact Details */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-50 pb-3">
              <Mail size={16} className="text-gold-400" />
              Contact Information
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500 shrink-0">
                  <Mail size={14} />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                  <p className="text-sm font-semibold text-slate-800 truncate">{alumni.email || user?.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500 shrink-0">
                  <Phone size={14} />
                </span>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</p>
                  <p className="text-sm font-semibold text-slate-800">{alumni.phone || "Not Registered"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500 shrink-0">
                  <MapPin size={14} />
                </span>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Address / Location</p>
                  <p className="text-sm font-semibold text-slate-800">{alumni.address || "Noida, India"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Professional Networks */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-50 pb-3">
              <Globe size={16} className="text-gold-400" />
              Social & Web Links
            </h3>
            
            <div className="space-y-3">
              {alumni.linkedinUrl ? (
                <a
                  href={alumni.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <LinkedinIcon className="w-5 h-5 text-[#0A66C2]" />
                    <span className="text-xs font-bold text-slate-700">LinkedIn Profile</span>
                  </div>
                  <ExternalLink size={12} className="text-slate-400 group-hover:text-slate-600" />
                </a>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 p-3 text-center text-xs text-slate-400 font-medium">
                  No LinkedIn profile linked
                </div>
              )}

              {alumni.portfolioUrl ? (
                <a
                  href={alumni.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Globe size={20} className="text-emerald-500" />
                    <span className="text-xs font-bold text-slate-700">Portfolio Website</span>
                  </div>
                  <ExternalLink size={12} className="text-slate-400 group-hover:text-slate-600" />
                </a>
              ) : null}

              {alumni.githubUrl ? (
                <a
                  href={alumni.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <GithubIcon className="w-5 h-5 text-slate-900" />
                    <span className="text-xs font-bold text-slate-700">GitHub Profile</span>
                  </div>
                  <ExternalLink size={12} className="text-slate-400 group-hover:text-slate-600" />
                </a>
              ) : null}
            </div>
          </div>

        </div>

        {/* Right Side: Academic & Work Details (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Academic Profile */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2 border-b border-slate-50 pb-3">
              <GraduationCap size={18} className="text-gold-400" />
              Academic Profile
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-600 shrink-0">
                  <Hash size={16} />
                </span>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Enrollment Number</p>
                  <p className="text-sm font-semibold text-slate-800">{alumni.enrollmentNumber || "Not Registered"}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-600 shrink-0">
                  <Calendar size={16} />
                </span>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Batch Period</p>
                  <p className="text-sm font-semibold text-slate-800">Class of {alumni.batch || "Not Specified"}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-600 shrink-0">
                  <BookOpen size={16} />
                </span>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Degree Course</p>
                  <p className="text-sm font-semibold text-slate-800">{alumni.course || "Not Specified"}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-600 shrink-0">
                  <GraduationCap size={16} />
                </span>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Higher Studies</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {alumni.higherStudies ? `${alumni.degree} at ${alumni.institution}` : "No / None Registered"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Portfolio */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2 border-b border-slate-50 pb-3">
              <Briefcase size={18} className="text-gold-400" />
              Professional Portfolio
            </h3>
            
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Employment</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {alumni.position ? `${alumni.position} at ${alumni.company}` : "Seeking Opportunities / Not Specified"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Experience Level</p>
                  <p className="text-sm font-semibold text-slate-800">{alumni.previousExperience || "Fresher"}</p>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Government Examinations</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {alumni.preparingGovExam ? `Preparing for ${alumni.examType}` : "Not preparing for government exams"}
                  </p>
                </div>

              </div>

              {/* Skills Tags */}
              <div className="border-t border-slate-100 pt-5">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Code size={12} /> Registered Skill Set
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {skillsList.length > 0 ? (
                    skillsList.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-800 capitalize border border-slate-200/50"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">No skills uploaded</span>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default MyProfile;

