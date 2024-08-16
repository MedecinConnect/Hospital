import Hospital from "../models/HospitalSchema.js";

// Ajouter un nouvel hôpital
export const addHospital = async (req, res) => {
    const { hospitalName, location, departments, photo } = req.body;
  
    try {
      const hospital = new Hospital({
        hospitalName,
        location,
        departments,
        photo,  // Added the photo field
      });
  
      await hospital.save();
      res.status(200).json({ success: true, message: "Hospital successfully added", data: hospital });
    } catch (err) {
      res.status(500).json({ success: false, message: "Internal server error! Try again" });
    }
  };
  
  // Obtenir tous les hôpitaux
  export const getAllHospitals = async (req, res) => {
    try {
      const hospitals = await Hospital.find({});
      res.status(200).json({ success: true, message: "Successful", data: hospitals });
    } catch (err) {
      res.status(404).json({ success: false, message: "Not found" });
    }
  };
  
  // Mettre à jour un hôpital
  export const updateHospital = async (req, res) => {
    const id = req.params.id;
    const { hospitalName, location, departments, photo } = req.body; // Destructure photo from req.body
  
    try {
      const updatedHospital = await Hospital.findByIdAndUpdate(
        id,
        { $set: { hospitalName, location, departments, photo } }, // Update the fields including photo
        { new: true }
      );
  
      res.status(200).json({
        success: true,
        message: "Successfully updated",
        data: updatedHospital,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Failed to update",
      });
    }
  };
  
  // Supprimer un hôpital
  export const deleteHospital = async (req, res) => {
    const id = req.params.id;
  
    try {
      await Hospital.findByIdAndDelete(id);
      res.status(200).json({
        success: true,
        message: "Successfully deleted",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Failed to delete",
      });
    }
  };