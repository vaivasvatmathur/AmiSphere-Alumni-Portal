import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
import FormField from "../components/FormField.jsx";
import PageHeader from "../components/PageHeader.jsx";

const defaultForm = {
  photo: "",
  fullName: "",
  enrollmentNumber: "",
  batch: "",
  course: "B.Tech IT",
  phone: "",
  email: "",
  company: "",
  position: "",
  skills: "",
  linkedinUrl: ""
};

const courseOptions = ["B.Tech IT", "B.Tech CSBS", "B.Tech CSSS"];

const AddAlumni = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [alumniId, setAlumniId] = useState(null);
  const isAdmin = user?.role === "ADMIN";
  const isEditing = Boolean(id || alumniId);

  useEffect(() => {
    if (id) {
      api
        .get(`/alumni/${id}`)
        .then(({ data }) => {
          setForm({
            ...defaultForm,
            ...data,
            skills: data.skills?.join(", ") || ""
          });
          setAlumniId(id);
        })
        .catch(() => setError("Unable to load alumni record."))
        .finally(() => setLoading(false));
      return;
    }

    if (user?.role === "ALUMNI") {
      api
        .get("/auth/me")
        .then(({ data }) => {
          const alumniData = data.user?.alumni;
          if (alumniData) {
            setForm({
              ...defaultForm,
              ...alumniData,
              skills: alumniData.skills?.join(", ") || ""
            });
            setAlumniId(alumniData.id || alumniData._id || null);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id, user]);

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        ...form,
        skills: form.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
      };

      const response = isEditing
        ? await api.put(`/alumni/${id || alumniId}`, payload)
        : await api.post("/alumni", payload);

      if (isAdmin) {
        const alumniIdResp = isEditing ? id || alumniId : response.data.id;
        navigate(`/admin/alumni/${alumniIdResp}`);
      } else {
        navigate("/alumni/profile");
      }
    } catch (requestError) {
      const response = requestError.response?.data;
      setError(response?.errors?.join(" ") || response?.message || "Unable to save alumni record.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="rounded-lg bg-white p-8 text-center text-sm text-slate-500 shadow-soft">Loading...</div>;
  }

  return (
    <div>
      <PageHeader
        title={isEditing ? "Edit Alumni" : "Add Alumni"}
        description={isEditing ? "Update an existing alumni record." : "Create a new alumni record manually."}
      />

      <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Full Name" name="fullName" value={form.fullName} onChange={updateField} required />
          <FormField
            label="Enrollment Number"
            name="enrollmentNumber"
            value={form.enrollmentNumber}
            onChange={updateField}
            required
          />
          <FormField label="Batch" name="batch" value={form.batch} onChange={updateField} required placeholder="2024" />
          <FormField label="Programme" required>
            <select
              name="course"
              value={form.course}
              onChange={updateField}
              className="focus-ring w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 shadow-sm"
            >
              {courseOptions.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Phone Number" name="phone" value={form.phone} onChange={updateField} />
          <FormField label="Email ID" name="email" type="email" value={form.email} onChange={updateField} required />
          <FormField label="Current Company" name="company" value={form.company} onChange={updateField} />
          <FormField label="Current Position" name="position" value={form.position} onChange={updateField} />
          <FormField label="LinkedIn URL" name="linkedinUrl" value={form.linkedinUrl} onChange={updateField} />
          <FormField label="Photo URL" name="photo" value={form.photo} onChange={updateField} />
          <label className="space-y-1.5 md:col-span-2">
            <span className="text-sm font-medium text-slate-700">Skills</span>
            <textarea
              name="skills"
              rows="3"
              value={form.skills}
              onChange={updateField}
              placeholder="React, Node.js, MongoDB"
              className="focus-ring w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 shadow-sm"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Save size={17} />
            {saving ? "Saving..." : "Save Record"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAlumni;
