import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import SignUp from "../pages/Signup";
import Doctors from "../pages/Doctors/Doctors";
import Services from "../pages/Services";
import MyAccount from "../Dashboard/User-Account/MyAccount";

import Dashboard from "../Dashboard/Doctor-Account/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import DoctorDetails from "../pages/Doctors/DoctorDetails";
import Contact from "../pages/Contact";
import CheckoutSuccess from "../pages/CheckoutSuccess";
import NurseAccount from "../Dashboard/NurseAccount/NurseAccount";
import Prediction from "../pages/Prediction";
import Covid from "../pages/Covid";
import ManageHospitals from "../components/Hospitals/ManageHospitals";
import Profile from "../Dashboard/Admin-Account/Profile";
const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/doctors/:id" element={<DoctorDetails />} />
      <Route path="/services" element={<Services />} />
      <Route
        path="/users/profile/me"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <MyAccount />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctors/profile/me"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

<Route
        path="/nurses/profile/me"
        element={
          <ProtectedRoute allowedRoles={["nurse"]}>
            <NurseAccount />
          </ProtectedRoute>
        }
      />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<SignUp />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/checkout-success" element={<CheckoutSuccess />} />
      <Route path="/prediction" element={<Prediction />} /> 
      <Route path="/covid" element={<Covid />} /> 
      <Route path="/ManageHospitals" element={<ManageHospitals />} />
      <Route path="/admins/profile/me" element={<Profile />} />

    </Routes>
  );
};

export default Router;
