import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AddAlumni from "./pages/AddAlumni.jsx";
import AlumniDetails from "./pages/AlumniDetails.jsx";
import AlumniDirectory from "./pages/AlumniDirectory.jsx";
import BulkUpload from "./pages/BulkUpload.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/alumni" element={<AlumniDirectory />} />
          <Route path="/alumni/new" element={<AddAlumni />} />
          <Route path="/alumni/:id" element={<AlumniDetails />} />
          <Route path="/alumni/:id/edit" element={<AddAlumni />} />
          <Route path="/upload" element={<BulkUpload />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
