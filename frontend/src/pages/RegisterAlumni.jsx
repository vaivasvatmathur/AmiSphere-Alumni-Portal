import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import Footer from "../components/Footer.jsx";

const RegisterAlumni = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  if (user) {
    return <Navigate to="/alumni/dashboard" replace />;
  }

  const [step, setStep] = useState(1);
  const [currentStatus, setCurrentStatus] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [successToast, setSuccessToast] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
    enrollmentNumber: "",
    batch: "",
    course: "",
    phone: "",
    company: "",
    position: "",
    skills: "",
    linkedinUrl: "",
    photo: "",
    higherStudies: false,
    degree: "",
    institution: "",
    specialization: "",
    preparingGovExam: false,
    examType: "",
    targetYear: "",
    currentUniversity: "",
    previousExperience: "",
    githubUrl: "",
    portfolioUrl: ""
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");

  const updateField = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleNameInput = (e) => {
    const { name, value } = e.target;
    const filtered = value.replace(/[^A-Za-z\s-]/g, "");
    setForm((f) => ({ ...f, [name]: filtered }));
  };

  const handlePhoneInput = (e) => {
    const filtered = e.target.value.replace(/\D/g, "").slice(0, 10);
    setForm((f) => ({ ...f, phone: filtered }));
  };

  const handleEnrollmentInput = (e) => {
    const filtered = e.target.value.replace(/[^A-Za-z0-9]/g, "");
    setForm((f) => ({ ...f, enrollmentNumber: filtered }));
  };

  const handleBatchInput = (e) => {
    const filtered = e.target.value.replace(/\D/g, "").slice(0, 4);
    setForm((f) => ({ ...f, batch: filtered }));
  };

  const handleStatusChange = (e) => {
    const status = e.target.value;
    setCurrentStatus(status);

    setForm((f) => ({
      ...f,
      higherStudies: status === "Higher Studies",
      preparingGovExam: status === "Government Exam Preparation",
      degree: status === "Higher Studies" || status === "Student" ? f.degree : "",
      institution: status === "Higher Studies" ? f.institution : "",
      specialization: status === "Higher Studies" ? f.specialization : "",
      examType: status === "Government Exam Preparation" ? f.examType : "",
      targetYear: status === "Government Exam Preparation" ? f.targetYear : "",
      currentUniversity: status === "Student" ? f.currentUniversity : "",
      company: (status === "Working / Employed" || status === "Entrepreneur" || status === "Freelancing") ? f.company : "",
      position: (status === "Working / Employed" || status === "Entrepreneur" || status === "Freelancing") ? f.position : ""
    }));
  };

  const handlePhotoFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");

    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      setError("Please upload a valid image (JPG, JPEG, or PNG).");
      return;
    }

    if (file.size > 1024 * 1024) {
      setError("Image size must be less than 1MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result);
      setForm((f) => ({ ...f, photo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddSkill = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newSkill = skillInput.trim().replace(/,$/, "");
      if (newSkill) {
        const currentSkills = form.skills ? form.skills.split(",").map((s) => s.trim()) : [];
        if (currentSkills.length >= 20) {
          setError("Maximum of 20 skills allowed.");
          return;
        }
        if (!currentSkills.includes(newSkill)) {
          const updatedSkills = [...currentSkills, newSkill].join(", ");
          setForm((f) => ({ ...f, skills: updatedSkills }));
        }
      }
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const currentSkills = form.skills ? form.skills.split(",").map((s) => s.trim()) : [];
    const updatedSkills = currentSkills.filter((s) => s !== skillToRemove).join(", ");
    setForm((f) => ({ ...f, skills: updatedSkills }));
  };

  // Real-time validations
  const nameRegex = /^[A-Za-z\s-]+$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  const phoneRegex = /^[6-9]\d{9}$/;
  const urlRegex = /^https?:\/\/.+/;

  // Pass checks
  const passLength = form.password.length >= 8;
  const passUpper = /[A-Z]/.test(form.password);
  const passLower = /[a-z]/.test(form.password);
  const passNumber = /\d/.test(form.password);
  const passSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(form.password);

  const isStep1Valid = () => {
    if (!form.firstName || !nameRegex.test(form.firstName)) return false;
    if (!form.lastName || !nameRegex.test(form.lastName)) return false;
    if (form.middleName && !nameRegex.test(form.middleName)) return false;
    if (!form.email || !emailRegex.test(form.email)) return false;
    if (!passLength || !passUpper || !passLower || !passNumber || !passSpecial) return false;
    if (form.confirm !== form.password) return false;
    if (!form.phone || !phoneRegex.test(form.phone)) return false;
    return true;
  };

  const isStep2Valid = () => {
    if (!form.enrollmentNumber || !/^[A-Za-z0-9]+$/.test(form.enrollmentNumber)) return false;
    const batchYear = Number(form.batch);
    if (!form.batch || !/^\d{4}$/.test(form.batch) || batchYear < 2000 || batchYear > 2050) return false;
    if (!form.course) return false;
    if (!currentStatus) return false;

    if (currentStatus === "Higher Studies") {
      if (!form.degree || !form.institution || !form.specialization) return false;
    } else if (currentStatus === "Government Exam Preparation") {
      if (!form.examType || !form.targetYear) return false;
    } else if (currentStatus === "Student") {
      if (!form.currentUniversity || !form.degree) return false;
    }
    return true;
  };

  const isStep3Valid = () => {
    const textRegex = /^(?!\d+$).+$/;
    
    if (currentStatus === "Working / Employed" || currentStatus === "Entrepreneur" || currentStatus === "Freelancing") {
      if (!form.company || !textRegex.test(form.company)) return false;
      if (!form.position || !textRegex.test(form.position)) return false;
    }

    if (!form.previousExperience) return false;

    if (form.githubUrl && !/^https:\/\/github\.com\//.test(form.githubUrl)) return false;
    if (form.portfolioUrl && !urlRegex.test(form.portfolioUrl)) return false;

    const skillsCount = form.skills ? form.skills.split(",").map((s) => s.trim()).filter(Boolean).length : 0;
    if (skillsCount < 1 || skillsCount > 20) return false;

    return true;
  };

  const nextStep = () => {
    setError("");
    if (step === 1 && !isStep1Valid()) return;
    if (step === 2 && !isStep2Valid()) return;
    setStep((s) => s + 1);
  };

  const prevStep = () => {
    setError("");
    setStep((s) => s - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (step < 3) {
      nextStep();
      return;
    }

    if (!isStep3Valid()) {
      setError("Please complete all required fields correctly.");
      return;
    }

    setSaving(true);
    try {
      // Dynamic mapping of status to database company/position fields
      let mappedCompany = "";
      let mappedPosition = "";

      if (currentStatus === "Working / Employed") {
        mappedCompany = form.company;
        mappedPosition = form.position;
      } else if (currentStatus === "Entrepreneur") {
        mappedCompany = form.company;
        mappedPosition = form.position;
      } else if (currentStatus === "Higher Studies") {
        mappedCompany = form.institution;
        mappedPosition = `${form.degree} (${form.specialization})`;
      } else if (currentStatus === "Government Exam Preparation") {
        mappedCompany = "Government Exam Prep";
        mappedPosition = `${form.examType} Candidate (${form.targetYear})`;
      } else if (currentStatus === "Student") {
        mappedCompany = form.currentUniversity;
        mappedPosition = `${form.degree} Student`;
      } else if (currentStatus === "Freelancing") {
        mappedCompany = "Freelance";
        mappedPosition = form.position;
      } else {
        mappedCompany = "Other";
        mappedPosition = "Seeking Opportunities";
      }

      const calculatedFullName = [form.firstName, form.middleName, form.lastName]
        .filter(Boolean)
        .join(" ");

      // 1. Create Alumni Account
      await api.post("/auth/register", {
        name: form.firstName,
        email: form.email,
        password: form.password,
        fullName: calculatedFullName,
        enrollmentNumber: form.enrollmentNumber,
        batch: form.batch,
        course: form.course,
        phone: form.phone,
        company: mappedCompany,
        position: mappedPosition,
        skills: form.skills,
        linkedinUrl: form.linkedinUrl,
        photo: form.photo,
        higherStudies: form.higherStudies,
        degree: form.degree || "",
        institution: form.institution || "",
        preparingGovExam: form.preparingGovExam,
        examType: form.examType || "",
        previousExperience: form.previousExperience
      });

      // 2. Auto Login
      await login({ email: form.email, password: form.password });

      // Fetch newly logged-in profile to perform PUT updates of supplementary fields
      const { data } = await api.get("/auth/me");
      const alumniId = data.user?.alumni?.id || data.user?.alumni?._id;

      if (alumniId) {
        await api.put(`/alumni/${alumniId}`, {
          fullName: calculatedFullName,
          enrollmentNumber: form.enrollmentNumber,
          batch: form.batch,
          course: form.course,
          phone: form.phone,
          photo: form.photo,
          skills: form.skills,
          linkedinUrl: form.linkedinUrl,
          company: mappedCompany,
          position: mappedPosition
        });
      }

      // 3. Show Success Toast
      setSuccessToast(true);

      // 4. Redirect automatically after 2s
      setTimeout(() => {
        navigate("/alumni/dashboard");
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to register.");
      setSaving(false);
    }
  };

  // Inline validation checks
  const isFirstNameInvalid = form.firstName && !nameRegex.test(form.firstName);
  const isLastNameInvalid = form.lastName && !nameRegex.test(form.lastName);
  const isMiddleNameInvalid = form.middleName && !nameRegex.test(form.middleName);
  const isEmailInvalid = form.email && !emailRegex.test(form.email);
  const isConfirmInvalid = form.confirm && form.confirm !== form.password;
  const isPhoneInvalid = form.phone && !phoneRegex.test(form.phone);

  const isEnrollmentInvalid = form.enrollmentNumber && !/^[A-Za-z0-9]+$/.test(form.enrollmentNumber);
  const isBatchInvalid = form.batch && (form.batch.length !== 4 || Number(form.batch) < 2000 || Number(form.batch) > 2050);

  const isCompanyInvalid = form.company && /^\d+$/.test(form.company);
  const isPositionInvalid = form.position && /^\d+$/.test(form.position);
  const isGithubInvalid = form.githubUrl && !/^https:\/\/github\.com\//.test(form.githubUrl);
  const isPortfolioInvalid = form.portfolioUrl && !urlRegex.test(form.portfolioUrl);

  const skillsCount = form.skills ? form.skills.split(",").map((s) => s.trim()).filter(Boolean).length : 0;

  return (
    <main className="flex min-h-screen flex-col bg-brand-900 relative">
      
      {/* Toast Success Popup */}
      {successToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl bg-[#061A32] border border-gold-400 p-4 shadow-2xl animate-bounce">
          <span className="text-2xl">🎓</span>
          <div>
            <p className="text-sm font-bold text-white">Welcome to AmiSphere Alumni Network</p>
            <p className="text-xs text-gold-400">Your account has been created successfully.</p>
          </div>
        </div>
      )}

      <div className="flex flex-1 items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(245,197,66,0.22),_transparent_30%),linear-gradient(135deg,_#061a32_0%,_#0b2545_48%,_#173f6b_100%)] px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-[0.85fr_1.15fr]">
          
          {/* Left Panel - Onboarding & Network Stats */}
          <aside className="relative flex flex-col justify-between bg-[#061A32] p-7 text-white sm:p-9 lg:min-h-[600px]">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gold-400" />
            <div className="absolute -right-20 -top-24 h-56 w-56 rounded-full border border-white/10" />
            <div className="absolute -bottom-28 -left-24 h-72 w-72 rounded-full border border-gold-400/20" />

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 border border-white/10">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-400 font-bold text-[#061A32]">
                  A
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-gold-400">
                  Alumni Portal
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  Join the<br />Amity Alumni Network
                </h1>
                <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                  Connect with fellow alumni, showcase your professional journey, explore opportunities, and stay connected with your university community.
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <span className="text-gold-400 font-bold">✓</span> Build Professional Network
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <span className="text-gold-400 font-bold">✓</span> Discover Alumni Opportunities
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <span className="text-gold-400 font-bold">✓</span> Stay Updated with Events
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <span className="text-gold-400 font-bold">✓</span> Connect Across Batches
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <span className="text-gold-400 font-bold">✓</span> Showcase Career Growth
                </div>
              </div>
            </div>

            {/* Statistics Section */}
            <div className="relative z-10 border-t border-b border-white/10 py-6 my-6">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-3">
                Alumni Network Statistics
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xl font-extrabold text-[#f5c542]">1,200+</p>
                  <p className="text-[10px] text-slate-300">Registered Alumni</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-[#f5c542]">15+</p>
                  <p className="text-[10px] text-slate-300">Global Chapters</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-[#f5c542]">80+</p>
                  <p className="text-[10px] text-slate-300">Partner Recruiters</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-[#f5c542]">95%</p>
                  <p className="text-[10px] text-slate-300">Employment Rate</p>
                </div>
              </div>
            </div>

            <div className="relative z-10 text-xs text-slate-400">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-white hover:text-gold-400 transition-colors">
                Sign In
              </Link>
            </div>
          </aside>

          {/* Right Panel - Form Fields */}
          <div className="flex flex-col justify-between h-full min-h-[500px]">
            <form onSubmit={handleSubmit} className="flex flex-col justify-between h-full flex-1">
              <div className="p-6 sm:p-10 flex-1 overflow-y-auto">
                
                {/* Progress Steps Tracker */}
                <div className="mb-8 border-b border-slate-100 pb-4">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-2 uppercase tracking-wide overflow-x-auto whitespace-nowrap scrollbar-none gap-2">
                    <span className={step === 1 ? "text-[#061A32]" : ""}>1. Account Details</span>
                    <span className={step === 2 ? "text-[#061A32]" : ""}>2. Academic Details</span>
                    <span className={step === 3 ? "text-[#061A32]" : ""}>3. Professional Details</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden flex">
                    <div 
                      className="h-full bg-gold-400 transition-all duration-300"
                      style={{ width: `${step === 1 ? "33.3%" : step === 2 ? "66.6%" : "100%"}` }}
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-bold text-brand-900">
                    {step === 1 && "Create Your Account"}
                    {step === 2 && "Academic Profile"}
                    {step === 3 && "Professional Milestones"}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {step === 1 && "Set up your credentials and basic contact details."}
                    {step === 2 && "Specify your educational records and current university status."}
                    {step === 3 && "Share your professional background, links and skill tags."}
                  </p>
                </div>

                {error && <p className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

                {/* Step 1: Account Details */}
                {step === 1 && (
                  <div className="grid gap-4 sm:grid-cols-3">
                    <label className="space-y-1.5">
                      <span className="text-xs font-semibold text-slate-700">First Name *</span>
                      <input 
                        type="text" 
                        name="firstName" 
                        required
                        value={form.firstName} 
                        onChange={handleNameInput} 
                        className={`focus-ring w-full rounded-xl border px-4 py-2.5 text-sm text-brand-900 shadow-sm placeholder:text-slate-400 hover:border-slate-300 focus:bg-white ${
                          isFirstNameInvalid ? "border-red-500" : form.firstName ? "border-emerald-500" : "border-slate-200"
                        }`} 
                      />
                      {isFirstNameInvalid && <p className="text-[10px] text-red-500">Only alphabetic characters are allowed.</p>}
                    </label>

                    <label className="space-y-1.5">
                      <span className="text-xs font-semibold text-slate-700">Middle Name</span>
                      <input 
                        type="text" 
                        name="middleName" 
                        value={form.middleName} 
                        onChange={handleNameInput} 
                        placeholder="Optional"
                        className={`focus-ring w-full rounded-xl border px-4 py-2.5 text-sm text-brand-900 shadow-sm placeholder:text-slate-400 hover:border-slate-300 focus:bg-white ${
                          isMiddleNameInvalid ? "border-red-500" : form.middleName ? "border-emerald-500" : "border-slate-200"
                        }`} 
                      />
                      {isMiddleNameInvalid && <p className="text-[10px] text-red-500">Only alphabetic characters are allowed.</p>}
                    </label>

                    <label className="space-y-1.5">
                      <span className="text-xs font-semibold text-slate-700">Last Name *</span>
                      <input 
                        type="text" 
                        name="lastName" 
                        required
                        value={form.lastName} 
                        onChange={handleNameInput} 
                        className={`focus-ring w-full rounded-xl border px-4 py-2.5 text-sm text-brand-900 shadow-sm placeholder:text-slate-400 hover:border-slate-300 focus:bg-white ${
                          isLastNameInvalid ? "border-red-500" : form.lastName ? "border-emerald-500" : "border-slate-200"
                        }`} 
                      />
                      {isLastNameInvalid && <p className="text-[10px] text-red-500">Only alphabetic characters are allowed.</p>}
                    </label>

                    <label className="space-y-1.5 sm:col-span-3">
                      <span className="text-xs font-semibold text-slate-700">Email Address *</span>
                      <input 
                        type="email" 
                        name="email" 
                        required
                        value={form.email} 
                        onChange={updateField} 
                        placeholder="yourname@gmail.com"
                        className={`focus-ring w-full rounded-xl border px-4 py-2.5 text-sm text-brand-900 shadow-sm placeholder:text-slate-400 hover:border-slate-300 focus:bg-white ${
                          isEmailInvalid ? "border-red-500" : form.email ? "border-emerald-500" : "border-slate-200"
                        }`} 
                      />
                      <p className="text-[10px] text-slate-400">We currently support Gmail-based alumni registration only.</p>
                      {isEmailInvalid && (
                        <p className="text-[10px] text-red-500">
                          Registration is currently available only for Gmail accounts. Please use a valid @gmail.com email address.
                        </p>
                      )}
                    </label>

                    <div className="space-y-1.5 sm:col-span-3">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="space-y-1.5">
                          <span className="text-xs font-semibold text-slate-700">Password *</span>
                          <input 
                            type="password" 
                            name="password" 
                            required
                            value={form.password} 
                            onChange={updateField} 
                            className="focus-ring w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-brand-900 shadow-sm placeholder:text-slate-400 hover:border-slate-300 focus:bg-white" 
                          />
                        </label>
                        <label className="space-y-1.5">
                          <span className="text-xs font-semibold text-slate-700">Confirm Password *</span>
                          <input 
                            type="password" 
                            name="confirm" 
                            required
                            value={form.confirm} 
                            onChange={updateField} 
                            placeholder="Repeat password"
                            className={`focus-ring w-full rounded-xl border px-4 py-2.5 text-sm text-brand-900 shadow-sm placeholder:text-slate-400 hover:border-slate-300 focus:bg-white ${
                              isConfirmInvalid ? "border-red-500" : form.confirm ? "border-emerald-500" : "border-slate-200"
                            }`} 
                          />
                          {isConfirmInvalid && <p className="text-[10px] text-red-500">Passwords do not match.</p>}
                        </label>
                      </div>

                      {/* Live Password Validation Checklist */}
                      {form.password && (
                        <div className="mt-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-[11px] space-y-1.5 shadow-inner">
                          <p className="font-bold text-slate-500 uppercase tracking-wider text-[9px]">Password Checklist</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-slate-500">
                            <p className={`flex items-center gap-1.5 ${passLength ? "text-emerald-600 font-bold" : ""}`}>
                              <span>{passLength ? "✓" : "○"}</span> Minimum 8 characters
                            </p>
                            <p className={`flex items-center gap-1.5 ${passUpper ? "text-emerald-600 font-bold" : ""}`}>
                              <span>{passUpper ? "✓" : "○"}</span> 1 uppercase letter
                            </p>
                            <p className={`flex items-center gap-1.5 ${passLower ? "text-emerald-600 font-bold" : ""}`}>
                              <span>{passLower ? "✓" : "○"}</span> 1 lowercase letter
                            </p>
                            <p className={`flex items-center gap-1.5 ${passNumber ? "text-emerald-600 font-bold" : ""}`}>
                              <span>{passNumber ? "✓" : "○"}</span> 1 number
                            </p>
                            <p className={`flex items-center gap-1.5 ${passSpecial ? "text-emerald-600 font-bold" : ""}`}>
                              <span>{passSpecial ? "✓" : "○"}</span> 1 special character
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <label className="space-y-1.5 sm:col-span-3">
                      <span className="text-xs font-semibold text-slate-700">Phone Number *</span>
                      <input 
                        type="text" 
                        name="phone" 
                        required
                        value={form.phone} 
                        onChange={handlePhoneInput} 
                        className={`focus-ring w-full rounded-xl border px-4 py-2.5 text-sm text-brand-900 shadow-sm placeholder:text-slate-400 hover:border-slate-300 focus:bg-white ${
                          isPhoneInvalid ? "border-red-500" : form.phone ? "border-emerald-500" : "border-slate-200"
                        }`} 
                      />
                      {isPhoneInvalid && <p className="text-[10px] text-red-500">Enter a valid 10-digit mobile number.</p>}
                    </label>

                    {/* Photo Upload Area */}
                    <div className="space-y-1.5 sm:col-span-3">
                      <span className="text-xs font-semibold text-slate-700">Profile Photo (Optional)</span>
                      <div className="mt-1 flex items-center gap-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-4 hover:bg-slate-50 transition-colors">
                        {photoPreview ? (
                          <img 
                            src={photoPreview} 
                            alt="preview" 
                            className="h-16 w-16 rounded-full object-cover border-2 border-brand-500 shadow-md shrink-0" 
                          />
                        ) : (
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-400 text-sm font-bold border border-slate-300 shadow-inner">
                            {form.firstName ? (form.firstName[0] + (form.lastName[0] || "")).toUpperCase() : "👤"}
                          </div>
                        )}
                        <div className="space-y-1">
                          <input 
                            type="file" 
                            accept="image/jpeg,image/jpg,image/png" 
                            onChange={handlePhotoFile} 
                            className="block w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#061A32] file:text-white hover:file:bg-opacity-90 transition-all cursor-pointer" 
                          />
                          <p className="text-[10px] text-slate-400">JPG, JPEG or PNG. Max size 1MB.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Academic Details */}
                {step === 2 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-1.5">
                      <span className="text-xs font-semibold text-slate-700">Enrollment Number *</span>
                      <input 
                        type="text" 
                        name="enrollmentNumber" 
                        required
                        value={form.enrollmentNumber} 
                        onChange={handleEnrollmentInput} 
                        placeholder="A230521001"
                        className={`focus-ring w-full rounded-xl border px-4 py-2.5 text-sm text-brand-900 shadow-sm placeholder:text-slate-400 hover:border-slate-300 focus:bg-white ${
                          isEnrollmentInvalid ? "border-red-500" : form.enrollmentNumber ? "border-emerald-500" : "border-slate-200"
                        }`} 
                      />
                      {isEnrollmentInvalid && <p className="text-[10px] text-red-500">Only letters and numbers are allowed.</p>}
                    </label>

                    <label className="space-y-1.5">
                      <span className="text-xs font-semibold text-slate-700">Graduating Batch (Year) *</span>
                      <input 
                        type="text" 
                        name="batch" 
                        required
                        value={form.batch} 
                        onChange={handleBatchInput} 
                        placeholder="2024"
                        className={`focus-ring w-full rounded-xl border px-4 py-2.5 text-sm text-brand-900 shadow-sm placeholder:text-slate-400 hover:border-slate-300 focus:bg-white ${
                          isBatchInvalid ? "border-red-500" : form.batch ? "border-emerald-500" : "border-slate-200"
                        }`} 
                      />
                      {isBatchInvalid && <p className="text-[10px] text-red-500">Enter a valid 4-digit batch year (2000 - 2050).</p>}
                    </label>

                    <label className="space-y-1.5">
                      <span className="text-xs font-semibold text-slate-700">Programme *</span>
                      <select 
                        name="course" 
                        required
                        value={form.course} 
                        onChange={updateField} 
                        className={`focus-ring w-full rounded-xl border px-4 py-2.5 text-sm text-brand-900 shadow-sm hover:border-slate-300 focus:bg-white ${
                          form.course ? "border-emerald-500" : "border-slate-200"
                        }`}
                      >
                        <option value="">Select Programme</option>
                        <option value="BTECH_IT">B.Tech IT</option>
                        <option value="BTECH_CSBS">B.Tech CSBS</option>
                        <option value="BTECH_CSSS">B.Tech CSSS</option>
                      </select>
                    </label>

                    <label className="space-y-1.5">
                      <span className="text-xs font-semibold text-slate-700">Current Status *</span>
                      <select 
                        value={currentStatus} 
                        required
                        onChange={handleStatusChange} 
                        className={`focus-ring w-full rounded-xl border px-4 py-2.5 text-sm text-brand-900 shadow-sm hover:border-slate-300 focus:bg-white ${
                          currentStatus ? "border-emerald-500" : "border-slate-200"
                        }`}
                      >
                        <option value="">Select Status</option>
                        <option>Student</option>
                        <option>Working / Employed</option>
                        <option>Higher Studies</option>
                        <option>Entrepreneur</option>
                        <option>Government Exam Preparation</option>
                        <option>Freelancing</option>
                        <option>Other</option>
                      </select>
                    </label>

                    {/* Dynamic Status - Student */}
                    {currentStatus === "Student" && (
                      <>
                        <label className="space-y-1.5">
                          <span className="text-xs font-semibold text-slate-700">Current University *</span>
                          <input 
                            type="text" 
                            name="currentUniversity" 
                            required
                            value={form.currentUniversity} 
                            onChange={updateField} 
                            placeholder="e.g. Amity University"
                            className="focus-ring w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-brand-900 shadow-sm focus:bg-white" 
                          />
                        </label>
                        <label className="space-y-1.5">
                          <span className="text-xs font-semibold text-slate-700">Degree Pursuing *</span>
                          <input 
                            type="text" 
                            name="degree" 
                            required
                            value={form.degree} 
                            onChange={updateField} 
                            placeholder="e.g. M.Tech CS"
                            className="focus-ring w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-brand-900 shadow-sm focus:bg-white" 
                          />
                        </label>
                      </>
                    )}

                    {/* Dynamic Status - Higher Studies */}
                    {currentStatus === "Higher Studies" && (
                      <>
                        <label className="space-y-1.5">
                          <span className="text-xs font-semibold text-slate-700">Institution Name *</span>
                          <input 
                            type="text" 
                            name="institution" 
                            required
                            value={form.institution} 
                            onChange={updateField} 
                            placeholder="e.g. Stanford University"
                            className="focus-ring w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-brand-900 shadow-sm focus:bg-white" 
                          />
                        </label>
                        <label className="space-y-1.5">
                          <span className="text-xs font-semibold text-slate-700">Degree *</span>
                          <input 
                            type="text" 
                            name="degree" 
                            required
                            value={form.degree} 
                            onChange={updateField} 
                            placeholder="e.g. M.S."
                            className="focus-ring w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-brand-900 shadow-sm focus:bg-white" 
                          />
                        </label>
                        <label className="space-y-1.5 sm:col-span-2">
                          <span className="text-xs font-semibold text-slate-700">Specialization / Branch *</span>
                          <input 
                            type="text" 
                            name="specialization" 
                            required
                            value={form.specialization} 
                            onChange={updateField} 
                            placeholder="e.g. Artificial Intelligence"
                            className="focus-ring w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-brand-900 shadow-sm focus:bg-white" 
                          />
                        </label>
                      </>
                    )}

                    {/* Dynamic Status - Government Exam Prep */}
                    {currentStatus === "Government Exam Preparation" && (
                      <>
                        <label className="space-y-1.5">
                          <span className="text-xs font-semibold text-slate-700">Target Exam *</span>
                          <select 
                            name="examType" 
                            required
                            value={form.examType} 
                            onChange={updateField} 
                            className="focus-ring w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-brand-900 shadow-sm focus:bg-white"
                          >
                            <option value="">Select Exam</option>
                            <option>UPSC</option>
                            <option>SSC</option>
                            <option>GATE</option>
                            <option>CAT</option>
                            <option>Banking</option>
                            <option>State PCS</option>
                            <option>Other</option>
                          </select>
                        </label>
                        <label className="space-y-1.5">
                          <span className="text-xs font-semibold text-slate-700">Target Year *</span>
                          <input 
                            type="text" 
                            name="targetYear" 
                            required
                            value={form.targetYear} 
                            onChange={updateField} 
                            placeholder="e.g. 2027"
                            className="focus-ring w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-brand-900 shadow-sm focus:bg-white" 
                          />
                        </label>
                      </>
                    )}
                  </div>
                )}

                {/* Step 3: Professional Details */}
                {step === 3 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    
                    {/* Render Company & Position conditionally if Working/Entrepreneur/Freelancing */}
                    {(currentStatus === "Working / Employed" || currentStatus === "Entrepreneur" || currentStatus === "Freelancing") && (
                      <>
                        <label className="space-y-1.5">
                          <span className="text-xs font-semibold text-slate-700">
                            {currentStatus === "Entrepreneur" ? "Startup / Company *" : "Current Company *"}
                          </span>
                          <input 
                            type="text" 
                            name="company" 
                            required
                            value={form.company} 
                            onChange={updateField} 
                            placeholder="e.g. Microsoft"
                            className={`focus-ring w-full rounded-xl border px-4 py-2.5 text-sm text-brand-900 shadow-sm focus:bg-white ${
                              isCompanyInvalid ? "border-red-500" : form.company ? "border-emerald-500" : "border-slate-200"
                            }`} 
                          />
                          {isCompanyInvalid && <p className="text-[10px] text-red-500">Please enter a valid company name.</p>}
                        </label>
                        <label className="space-y-1.5">
                          <span className="text-xs font-semibold text-slate-700">
                            {currentStatus === "Entrepreneur" ? "Role *" : "Current Position *"}
                          </span>
                          <input 
                            type="text" 
                            name="position" 
                            required
                            value={form.position} 
                            onChange={updateField} 
                            placeholder="e.g. Senior Architect"
                            className={`focus-ring w-full rounded-xl border px-4 py-2.5 text-sm text-brand-900 shadow-sm focus:bg-white ${
                              isPositionInvalid ? "border-red-500" : form.position ? "border-emerald-500" : "border-slate-200"
                            }`} 
                          />
                          {isPositionInvalid && <p className="text-[10px] text-red-500">Please enter a valid position.</p>}
                        </label>
                      </>
                    )}

                    <label className="space-y-1.5">
                      <span className="text-xs font-semibold text-slate-700">Previous Experience *</span>
                      <select 
                        name="previousExperience" 
                        required
                        value={form.previousExperience} 
                        onChange={updateField} 
                        className={`focus-ring w-full rounded-xl border px-4 py-2.5 text-sm text-brand-900 shadow-sm hover:border-slate-300 focus:bg-white ${
                          form.previousExperience ? "border-emerald-500" : "border-slate-200"
                        }`}
                      >
                        <option value="">Select Experience</option>
                        <option>Fresher</option>
                        <option>0–1 Years</option>
                        <option>1–3 Years</option>
                        <option>3–5 Years</option>
                        <option>5+ Years</option>
                      </select>
                    </label>

                    <label className="space-y-1.5">
                      <span className="text-xs font-semibold text-slate-700">LinkedIn URL</span>
                      <input 
                        type="text" 
                        name="linkedinUrl" 
                        value={form.linkedinUrl} 
                        onChange={updateField} 
                        placeholder="https://linkedin.com/in/username"
                        className={`focus-ring w-full rounded-xl border px-4 py-2.5 text-sm text-brand-900 shadow-sm placeholder:text-slate-400 hover:border-slate-300 focus:bg-white ${
                          form.linkedinUrl ? "border-emerald-500" : "border-slate-200"
                        }`} 
                      />
                    </label>

                    <label className="space-y-1.5">
                      <span className="text-xs font-semibold text-slate-700">GitHub Profile URL</span>
                      <input 
                        type="text" 
                        name="githubUrl" 
                        value={form.githubUrl} 
                        onChange={updateField} 
                        placeholder="https://github.com/username"
                        className={`focus-ring w-full rounded-xl border px-4 py-2.5 text-sm text-brand-900 shadow-sm placeholder:text-slate-400 hover:border-slate-300 focus:bg-white ${
                          isGithubInvalid ? "border-red-500" : form.githubUrl ? "border-emerald-500" : "border-slate-200"
                        }`} 
                      />
                      {isGithubInvalid && <p className="text-[10px] text-red-500">GitHub URL must begin with https://github.com/</p>}
                    </label>

                    <label className="space-y-1.5">
                      <span className="text-xs font-semibold text-slate-700">Portfolio URL</span>
                      <input 
                        type="text" 
                        name="portfolioUrl" 
                        value={form.portfolioUrl} 
                        onChange={updateField} 
                        placeholder="https://username.dev"
                        className={`focus-ring w-full rounded-xl border px-4 py-2.5 text-sm text-brand-900 shadow-sm placeholder:text-slate-400 hover:border-slate-300 focus:bg-white ${
                          isPortfolioInvalid ? "border-red-500" : form.portfolioUrl ? "border-emerald-500" : "border-slate-200"
                        }`} 
                      />
                      {isPortfolioInvalid && <p className="text-[10px] text-red-500">Please enter a valid portfolio website URL.</p>}
                    </label>

                    {/* Tag-based Skills Chip Input */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <span className="text-xs font-semibold text-slate-700">Core Skills * (Minimum 1, Maximum 20)</span>
                      <div className={`flex flex-wrap gap-1.5 border p-2.5 rounded-xl transition-colors focus-within:bg-white focus-within:border-brand-600 ${
                        skillsCount > 0 ? "border-emerald-500 bg-emerald-50/10" : "border-slate-200 bg-slate-50/50"
                      }`}>
                        {form.skills && form.skills.split(",").map((s) => s.trim()).filter(Boolean).map((skill, index) => (
                          <span 
                            key={index} 
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#061A32] px-2.5 py-1 text-xs font-semibold text-white shadow-sm shrink-0"
                          >
                            {skill}
                            <button 
                              type="button" 
                              onClick={() => handleRemoveSkill(skill)}
                              className="text-gold-400 hover:text-white transition-colors text-sm font-black"
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                        <input
                          type="text"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={handleAddSkill}
                          placeholder="Type skill and press Enter"
                          className="flex-1 bg-transparent border-0 p-0 text-sm focus:ring-0 focus:outline-none min-w-[150px]"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">Press Enter or comma (,) to add individual skill tags. Current skills added: {skillsCount}/20.</p>
                    </div>
                  </div>
                )}

              </div>

              {/* Sticky Action Footer */}
              <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 flex items-center justify-between rounded-b-3xl shrink-0">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}
                {step === 1 && (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStep1Valid()}
                    className="rounded-xl bg-[#061A32] px-6 py-2.5 text-xs font-bold text-white hover:bg-opacity-95 transition-all shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Continue
                  </button>
                )}
                {step === 2 && (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStep2Valid()}
                    className="rounded-xl bg-[#061A32] px-6 py-2.5 text-xs font-bold text-white hover:bg-opacity-95 transition-all shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Continue
                  </button>
                )}
                {step === 3 && (
                  <button
                    type="submit"
                    disabled={saving || !isStep3Valid()}
                    className="rounded-xl bg-[#f5c542] px-6 py-2.5 text-xs font-bold text-[#061A32] hover:bg-opacity-90 transition-all shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving ? "Registering..." : "Create Account"}
                  </button>
                )}
              </div>

            </form>
          </div>

        </section>
      </div>
      <Footer className="border-white/10 bg-brand-900 text-white/70" />
    </main>
  );
};

export default RegisterAlumni;
