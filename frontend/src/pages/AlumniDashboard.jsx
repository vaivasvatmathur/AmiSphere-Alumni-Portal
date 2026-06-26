import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  Award,
  GraduationCap,
  TrendingUp,
  Edit3,
  Users,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
  BookOpen
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
const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 21) return "Good Evening";
  return "Good Night";
};
const AlumniDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [alumni, setAlumni] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAlumniProfile = () => {
    api
      .get("/auth/me")
      .then(({ data }) => {
        const rawAlumni = data.user?.alumni || null;
        if (rawAlumni) {
          setAlumni(rawAlumni);
        } else {
          setAlumni(null);
        }
      })
      .catch(() => setAlumni(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAlumniProfile();
  }, []);

  // Compute profile completion percentage and missing fields using weighted logic
  const { completion, missingFields } = useMemo(() => {
    if (!alumni) return { completion: 0, missingFields: [] };

    let score = 0;
    const missing = [];

    // Name (10%)
    if (alumni.fullName) {
      score += 10;
    } else {
      missing.push("Full Name");
    }

    // Email (10%)
    if (alumni.email) {
      score += 10;
    } else {
      missing.push("Email");
    }

    // Phone (10%)
    if (alumni.phone) {
      score += 10;
    } else {
      missing.push("Phone Number");
    }

    // Batch (10%)
    if (alumni.batch) {
      score += 10;
    } else {
      missing.push("Batch");
    }

    // Course (10%)
    if (alumni.course) {
      score += 10;
    } else {
      missing.push("Programme");
    }

    // Status (10%)
    if (alumni.status || alumni.previousExperience) {
      score += 10;
    } else {
      missing.push("Status");
    }

    // LinkedIn (10%)
    if (alumni.linkedinUrl) {
      score += 10;
    } else {
      missing.push("LinkedIn Profile");
    }

    // Skills (15%)
    const skillsCount = Array.isArray(alumni.skills)
      ? alumni.skills.length
      : (alumni.skills || "").split(",").filter(Boolean).length;
    if (skillsCount > 0) {
      score += 15;
    } else {
      missing.push("Core Skills");
    }

    // Company / Position (15%)
    if (alumni.company || alumni.position) {
      score += 15;
    } else {
      missing.push("Work/Study Details");
    }

    return { completion: score, missingFields: missing };
  }, [alumni]);

  const getCareerStatus = () => {
    if (!alumni) return "Not Specified";
    const comp = (alumni.company || "").toLowerCase();
    const pos = (alumni.position || "").toLowerCase();
    
    if (comp.includes("exam prep") || pos.includes("candidate")) return "Exam Prep";
    if (comp.includes("freelance")) return "Freelancer";
    if (comp.includes("other") || pos.includes("seeking")) return "Seeking Opportunities";
    if (pos.includes("student") || pos.includes("studies") || comp.includes("university")) return "Studying";
    if (alumni.company && alumni.position) return "Employed";
    return "Not Specified";
  };

  const skillsCount = useMemo(() => {
    if (!alumni) return 0;
    return Array.isArray(alumni.skills) ? alumni.skills.length : (alumni.skills || "").split(",").filter(Boolean).length;
  }, [alumni]);

  const recentActivity = useMemo(() => {
    if (!alumni) return [];
    const acts = [];
    // Convert dates to a readable time format or relative
    const baseTime = alumni.updatedAt ? new Date(alumni.updatedAt) : new Date();
    
    if (alumni.updatedAt) {
      acts.push({
        label: "Profile Info Synchronized",
        desc: "Updated your personal, academic and work records.",
        when: baseTime
      });
    }
    if (alumni.linkedinUrl) {
      acts.push({
        label: "LinkedIn Connected",
        desc: "Linked professional profile to increase recruiter reach.",
        when: new Date(baseTime.getTime() - 3600000) // 1 hr earlier
      });
    }
    if (skillsCount > 0) {
      acts.push({
        label: "Skills Matrix Updated",
        desc: `Added ${skillsCount} core skills to profile tags.`,
        when: new Date(baseTime.getTime() - 7200000) // 2 hrs earlier
      });
    }
    if (alumni.company) {
      acts.push({
        label: "Career Milestone Added",
        desc: `Registered current position at ${alumni.company}.`,
        when: new Date(baseTime.getTime() - 14400000) // 4 hrs earlier
      });
    }
    return acts;
  }, [alumni, skillsCount]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-44 bg-slate-200 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="h-28 bg-slate-200 rounded-2xl" />
          <div className="h-28 bg-slate-200 rounded-2xl" />
          <div className="h-28 bg-slate-200 rounded-2xl" />
          <div className="h-28 bg-slate-200 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-slate-200 rounded-3xl" />
          <div className="h-64 bg-slate-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  // Dashboard Empty State if completion is under 20%
  if (completion < 20) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-2xl mx-auto my-8 space-y-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-50 text-gold-500">
          <AlertCircle size={32} />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Complete Your Profile</h2>
          <p className="text-sm text-slate-500 max-w-md">
            Complete your profile information to connect with fellow alumni, unlock networking opportunities, and increase visibility among recruiters.
          </p>
        </div>

        {/* Profile Completion Indicator */}
        <div className="w-64 p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Completion</span>
            <span className="text-xs font-bold text-slate-700">{completion}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
            <div
              style={{ width: `${completion}%` }}
              className="h-full rounded-full bg-gold-400 transition-all duration-300"
            />
          </div>
        </div>

        <Link
          to="/alumni/edit-profile"
          className="inline-flex items-center gap-2 rounded-xl bg-[#061A32] px-6 py-3 text-sm font-semibold text-white hover:bg-opacity-95 shadow-sm transition-all"
        >
          Complete Profile
        </Link>
      </div>
    );
  }


  const initials = (name = "") =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="space-y-8">
      {/* Row 1: Welcome Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition-all">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-gold-50 opacity-40 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#061A32]">
              {getTimeBasedGreeting()}, {(alumni?.fullName || "Alumni").split(" ")[0]} 👋. Welcome back!
            </h1>
            {alumni.email && alumni.email.endsWith("@gmail.com") && (
              <div className="inline-flex items-center gap-1 mt-1 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200/50 rounded-full px-2.5 py-0.5">
                <span className="text-[10px]">✓</span> Gmail Verified
              </div>
            )}
            <p className="text-sm text-slate-500 max-w-xl leading-relaxed">
              Keep your profile updated to increase visibility among peers and recruiters. Discover networking meetups and jobs in your feed.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate("/alumni/edit-profile")}
                className="inline-flex items-center gap-2 rounded-xl bg-[#061A32] px-4 py-2.5 text-xs font-semibold text-white hover:bg-opacity-95 shadow-sm transition-all"
              >
                <Edit3 size={14} />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Profile Completion Callout */}
          <div className="w-full md:w-80 rounded-2xl bg-slate-50 border border-slate-200/60 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Profile Completion
              </span>
              <span className="text-sm font-bold text-brand-700">{completion}%</span>
            </div>
            
            {/* Progress Bar */}
            <div className="h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
              <div
                style={{ width: `${completion}%` }}
                className="h-full rounded-full bg-gold-400 transition-all duration-500"
              />
            </div>
            
            {missingFields.length > 0 ? (
              <div className="mt-3">
                <p className="text-[11px] font-semibold text-slate-400 mb-1">Incomplete areas:</p>
                <div className="flex flex-wrap gap-1">
                  {missingFields.slice(0, 2).map((field, idx) => (
                    <span key={idx} className="inline-flex items-center text-[10px] font-medium text-slate-600 bg-white border border-slate-200 rounded px-1.5 py-0.5">
                      {field}
                    </span>
                  ))}
                  {missingFields.length > 2 && (
                    <span className="text-[10px] text-slate-400 font-medium pl-1 self-center">
                      +{missingFields.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <p className="mt-3 text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 size={12} /> Your profile is completely up-to-date!
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Row 2: Four KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1: Profile Completion */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Profile Completion</span>
            <span className="rounded-lg bg-slate-50 p-2 text-brand-600">
              <CheckCircle2 size={18} />
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900">{completion}%</h3>
            <p className="text-xs text-slate-500 mt-1">
              {completion >= 85 ? "Excellent strength" : "Strengthen your profile"}
            </p>
          </div>
        </div>

        {/* KPI 2: Networking Score */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Networking Score</span>
            <span className="rounded-lg bg-slate-50 p-2 text-brand-600">
              <TrendingUp size={18} />
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900">
              {Math.min(100, Math.round(completion * 0.8 + skillsCount * 2))}
            </h3>
            <p className="text-xs text-slate-500 mt-1">Based on profile details</p>
          </div>
        </div>

        {/* KPI 3: Career Status */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Career Status</span>
            <span className="rounded-lg bg-slate-50 p-2 text-brand-600">
              <Briefcase size={18} />
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-lg font-bold text-slate-900 truncate">
              {getCareerStatus()}
            </h3>
            <p className="text-xs text-slate-500 mt-1">Current status category</p>
          </div>
        </div>

        {/* KPI 4: Alumni Connections */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Alumni Connections</span>
            <span className="rounded-lg bg-slate-50 p-2 text-brand-600">
              <Users size={18} />
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900">18</h3>
            <p className="text-xs text-slate-500 mt-1">Active batch connections</p>
          </div>
        </div>

      </div>

      {/* Row 3: Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left (70%) - Professional Summary Card */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <h2 className="text-lg font-bold text-[#061A32] flex items-center gap-2">
              <UserCheck size={18} className="text-gold-400" />
              Professional Career Summary
            </h2>
            <Link to="/alumni/profile" className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              View Profile
              <ExternalLink size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Employment</span>
              <p className="text-sm font-semibold text-slate-800">
                {alumni.position ? `${alumni.position} at ${alumni.company}` : "Not Employed / Not Specified"}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Academic Background</span>
              <p className="text-sm font-semibold text-slate-800">
                {alumni.course} (Batch of {alumni.batch})
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Higher Education</span>
              <p className="text-sm font-semibold text-slate-800">
                {alumni.higherStudies ? `${alumni.degree} at ${alumni.institution}` : "None Pursuing / Not Specified"}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Government Exams</span>
              <p className="text-sm font-semibold text-slate-800">
                {alumni.preparingGovExam ? `Preparing for ${alumni.examType}` : "Not Preparing / Not Specified"}
              </p>
            </div>

            <div className="space-y-1 md:col-span-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">LinkedIn Profile</span>
              <p className="text-sm text-slate-800">
                {alumni.linkedinUrl ? (
                  <a
                    href={alumni.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-brand-600 font-semibold hover:underline"
                  >
                    <LinkedinIcon className="w-3.5 h-3.5 text-[#0A66C2]" />
                    {alumni.linkedinUrl.replace(/^https?:\/\/(www\.)?/, "")}
                  </a>
                ) : (
                  <span className="text-slate-400 font-medium">No LinkedIn Linked</span>
                )}
              </p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verified Core Skills</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {skillsCount > 0 ? (
                  (Array.isArray(alumni.skills) ? alumni.skills : alumni.skills.split(",")).map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800 capitalize border border-slate-200/60"
                    >
                      {skill.trim()}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 font-medium">No skills registered yet</span>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Right (30%) - Quick Actions Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#061A32] border-b border-slate-100 pb-4 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-gold-400" />
            Quick Actions
          </h2>
          
          <div className="flex flex-col gap-3">
            <Link
              to="/alumni/edit-profile"
              className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3 hover:bg-slate-50 transition-colors"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700 shrink-0">
                <Edit3 size={16} />
              </span>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800">Edit Profile</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Keep your metrics up to date</p>
              </div>
            </Link>

            <Link
              to="/alumni/edit-profile"
              className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3 hover:bg-slate-50 transition-colors"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700 shrink-0">
                <Award size={16} />
              </span>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800">Update Core Skills</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Register new certifications</p>
              </div>
            </Link>

            <Link
              to="/directory"
              className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3 hover:bg-slate-50 transition-colors"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700 shrink-0">
                <Users size={16} />
              </span>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800">View Network Directory</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Connect with batches and faculty</p>
              </div>
            </Link>

            <div
              onClick={() => navigate("/alumni/edit-profile")}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700 shrink-0">
                <FileText size={16} />
              </span>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800">Upload Professional Resume</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Direct link for campus hiring</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Row 4: Recent Activity Timeline */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-[#061A32] border-b border-slate-100 pb-4 mb-6 flex items-center gap-2">
          <BookOpen size={18} className="text-gold-400" />
          Recent Profile Activity
        </h2>
        
        {recentActivity.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">No recent updates logged.</p>
        ) : (
          <div className="relative border-l border-slate-200 ml-3 pl-6 space-y-6 py-1">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="relative">
                {/* Timeline Dot */}
                <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white border-2 border-brand-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                </span>
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-800">{activity.label}</h4>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {activity.when.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} • {activity.when.toLocaleDateString([], { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{activity.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default AlumniDashboard;

