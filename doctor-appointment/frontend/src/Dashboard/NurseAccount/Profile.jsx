/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { BASE_URL, token } from "../../config";
import uploadImageToCloudinary from "../../utils/uploadCloudinary";
import { toast } from "react-toastify";

const Profile = ({ userData }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    department: "", // Specific for nurse
    shift: "", // Specific for nurse
    photo: "",
  });

  const [activeTab, setActiveTab] = useState("settings");
  const [bedData, setBedData] = useState({
    bedNumber: "",
    department: "",
    status: "available",
  });

  useEffect(() => {
    setFormData({
      name: userData?.name || "",
      email: userData?.email || "",
      gender: userData?.gender || "",
      department: userData?.department || "", // Specific for nurse
      shift: userData?.shift || "", // Specific for nurse
      photo: userData?.photo || "",
    });
  }, [userData]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    const data = await uploadImageToCloudinary(file);

    setSelectedFile(data.url);
    setFormData({ ...formData, photo: data.url });
  };

  const updateUserHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${BASE_URL}/nurses/${userData._id}`, {
        method: "put",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) {
        return toast.error(result.message);
      }

      toast.success("Successfully updated");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update profile");
    }
  };

  const handleBedInputChange = (e) => {
    setBedData({ ...bedData, [e.target.name]: e.target.value });
  };

  const handleAddBed = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${BASE_URL}/beds`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bedData),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message);
      }

      toast.success("Bed successfully added");
      setBedData({
        bedNumber: "",
        department: "",
        status: "available",
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-5">
        <button
          onClick={() => setActiveTab("settings")}
          className={`${
            activeTab === "settings" && "bg-[#0067FF] text-white font-normal"
          } py-2 px-5 rounded-md font-semibold text-headingColor text-[16px] leading-7 border border-solid border-[#0067FF]`}
        >
          Settings
        </button>
        <button
          onClick={() => setActiveTab("addBed")}
          className={`${
            activeTab === "addBed" && "bg-[#0067FF] text-white font-normal"
          } py-2 px-5 rounded-md font-semibold text-headingColor text-[16px] leading-7 border border-solid border-[#0067FF]`}
        >
          Add Bed
        </button>
      </div>

      {activeTab === "settings" && (
        <form onSubmit={updateUserHandler}>
          <div className="mb-5">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Full Name"
              className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-[#0067FF] text-[16px] leading-7 text-headingColor placeholder:text-textColor"
            />
          </div>
          <div className="mb-5">
            <input
              type="email"
              readOnly
              value={formData.email}
              onChange={handleInputChange}
              name="email"
              placeholder="Enter Your Email"
              className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-[#0067FF] text-[16px] leading-7 text-headingColor placeholder:text-textColor"
              aria-readonly
            />
          </div>
          <div className="mb-5">
            <input
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              name="password"
              placeholder="Password"
              className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-[#0067FF] text-[16px] leading-7 text-headingColor placeholder:text-textColor"
            />
          </div>
          <div className="mb-5">
            <input
              type="text"
              value={formData.department}
              onChange={handleInputChange}
              name="department"
              placeholder="Department"
              className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-[#0067FF] text-[16px] leading-7 text-headingColor placeholder:text-textColor"
            />
          </div>
          <div className="mb-5">
            <input
              type="text"
              value={formData.shift}
              onChange={handleInputChange}
              name="shift"
              placeholder="Shift"
              className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-[#0067FF] text-[16px] leading-7 text-headingColor placeholder:text-textColor"
            />
          </div>
          <div className="mb-5 flex items-center justify-between">
            <label className="text-headingColor font-bold text-[16px] leading-7">
              Gender:
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-none"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>
          <div className="mb-5 flex items-center gap-3">
            {formData.photo && (
              <figure className="w-[60px] h-[60px] rounded-full border-2 border-solid border-[#0067FF] flex items-center justify-center">
                <img
                  src={formData.photo}
                  alt="Preview"
                  className="w-full rounded-full"
                />
              </figure>
            )}
            <div className="relative inline-block w-[130px] h-[50px]">
              <input
                className="custom-file-input absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                id="customFile"
                name="photo"
                type="file"
                accept=".jpg,.png"
                placeholder="Upload Profile"
                onChange={handleFileInputChange}
              />
              <label
                className="custom-file-label absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer"
                htmlFor="customFile"
              >
                {selectedFile ? selectedFile.name : "Upload Photo"}
              </label>
            </div>
          </div>
          <div className="mt-7">
            <button
              type="submit"
              className="w-full bg-[#0067FF] text-white py-3 px-4 rounded-lg text-[18px] leading-[30px]"
            >
              Update Profile
            </button>
          </div>
        </form>
      )}

      {activeTab === "addBed" && (
        <form onSubmit={handleAddBed}>
          <div className="mb-5">
            <input
              type="text"
              name="bedNumber"
              value={bedData.bedNumber}
              onChange={handleBedInputChange}
              placeholder="Bed Number"
              className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-[#0067FF] text-[16px] leading-7 text-headingColor placeholder:text-textColor"
              required
            />
          </div>
          <div className="mb-5">
            <input
              type="text"
              name="department"
              value={bedData.department}
              onChange={handleBedInputChange}
              placeholder="Department"
              className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-[#0067FF] text-[16px] leading-7 text-headingColor placeholder:text-textColor"
              required
            />
          </div>
          <div className="mb-5">
            <select
              name="status"
              value={bedData.status}
              onChange={handleBedInputChange}
              className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-[#0067FF] text-[16px] leading-7 text-headingColor placeholder:text-textColor"
              required
            >
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
            </select>
          </div>
          <div className="mt-7">
            <button
              type="submit"
              className="w-full bg-[#0067FF] text-white py-3 px-4 rounded-lg text-[18px] leading-[30px]"
            >
              Add Bed
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;