import { useState } from "react";
import { BASE_URL, token } from "../../config";
import { toast } from "react-toastify";

const AddBed = () => {
  const [formData, setFormData] = useState({
    bedNumber: "",
    department: "",
    status: "available",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${BASE_URL}/beds`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message);
      }

      toast.success("Bed successfully added");
      setFormData({
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
      <h2 className="heading text-[30px]">Add Bed</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <input
            type="number"
            name="bedNumber"
            value={formData.bedNumber}
            onChange={handleInputChange}
            placeholder="Bed Number"
            className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-[#0067FF] text-[16px] leading-7 text-headingColor placeholder:text-textColor"
            required
          />
        </div>
        <div className="mb-5">
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            placeholder="Department"
            className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-[#0067FF] text-[16px] leading-7 text-headingColor placeholder:text-textColor"
            required
          />
        </div>
        <div className="mb-5">
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
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
    </div>
  );
};

export default AddBed;
