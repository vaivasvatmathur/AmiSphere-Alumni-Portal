import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AddAlumni from "./pages/AddAlumni.jsx";
import AlumniDetails from "./pages/AlumniDetails.jsx";
import AlumniDirectory from "./pages/AlumniDirectory.jsx";
import BulkUpload from "./pages/BulkUpload.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import RegisterAlumni from "./pages/RegisterAlumni.jsx";
import AlumniDashboard from "./pages/AlumniDashboard.jsx";
import MyProfile from "./pages/MyProfile.jsx";
import EditProfile from "./pages/EditProfile.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Alumni routes */}
      <Route path="/alumni/register" element={<RegisterAlumni />} />

      {/* Admin main dashboard */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["ALUMNI"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/alumni/dashboard" element={<AlumniDashboard />} />
          <Route path="/alumni/profile" element={<MyProfile />} />
          <Route path="/alumni/edit-profile" element={<EditProfile />} />
          <Route path="/directory" element={<AlumniDirectory />} />
        </Route>
      </Route>

      {/* Admin routes */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin/alumni" element={<AlumniDirectory />} />
          <Route path="/admin/alumni/new" element={<AddAlumni />} />
          <Route path="/admin/alumni/:id" element={<AlumniDetails />} />
          <Route path="/admin/alumni/:id/edit" element={<AddAlumni />} />
          <Route path="/admin/upload" element={<BulkUpload />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
