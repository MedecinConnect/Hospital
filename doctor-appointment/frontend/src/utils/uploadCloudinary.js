const uploadImageToCloudinary = async file => {
  const uploadData = new FormData();
  uploadData.append("file", file);
  uploadData.append("upload_preset", "doctor-upload");
  uploadData.append("cloud_name", "dgcaghq3t");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dgcaghq3t/image/upload",
    {
      method: "post",
      body: uploadData,
    }
  );

  const data = await res.json();
  return data;
};

export default uploadImageToCloudinary;
