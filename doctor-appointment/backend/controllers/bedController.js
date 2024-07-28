import Bed from "../models/BedSchema.js";

export const addBed = async (req, res) => {
  const { bedNumber, department, isOccupied } = req.body;

  try {
    const bed = new Bed({
      bedNumber,
      department,
      isOccupied,
    });

    await bed.save();
    res.status(200).json({ success: true, message: "Bed successfully added" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error! Try again" });
  }
};

export const updateBed = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedBed = await Bed.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updatedBed,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "failed to update",
    });
  }
};

export const deleteBed = async (req, res) => {
  const id = req.params.id;

  try {
    await Bed.findByIdAndDelete(id);

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

export const getSingleBed = async (req, res) => {
  const id = req.params.id;

  try {
    const bed = await Bed.findById(id);

    res.status(200).json({
      success: true,
      message: "Successful",
      data: bed,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "Not found",
    });
  }
};

export const getAllBed = async (req, res) => {
  try {
    const beds = await Bed.find({});

    res.status(200).json({
      success: true,
      message: "Successful",
      data: beds,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "Not found",
    });
  }
};
