import { useContext, useState } from "react";
import Profile from "./Profile";
import { BASE_URL } from "./../../config";
import HashLoader from "react-spinners/HashLoader";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import useFetchData from "../../hooks/useFetchData";


import Tabs from "./Tabs";
import AddBed from "./AddBed";

const NurseAccount = () => {
  const [tab, setTab] = useState("settings");
  const {
    data: nurseData,
    loading,
    error,
  } = useFetchData(`${BASE_URL}/nurses/profile/me`);

  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  return (
    <section>
      <div className="max-w-[1170px] px-5 mx-auto">
        {loading && (
          <div className="flex items-center justify-center w-full h-full">
            <HashLoader color="#0067FF" />
          </div>
        )}
        {error && !loading && (
          <div className="flex items-center justify-center w-full h-full">
            <h3 className="text-headingColor text-[20px] font-semibold leading-[30px]">
              {error}
            </h3>
          </div>
        )}

        {!loading && !error && (
          <div className="grid lg:grid-cols-3 gap-[30px] lg:gap-[50px]">
            <div className="px-[30px] pb-[50px] rounded-md">
              <div className="flex items-center justify-center">
                <figure className="w-[100px] h-[100px] rounded-full border-2 border-solid border-[#0067FF]">
                  <img
                    src={nurseData?.photo}
                    alt=""
                    className="w-full rounded-full"
                  />
                </figure>
              </div>

              <div className="text-center mt-4">
                <h3 className="text-[18px] leading-[30px] text-headingColor font-bold">
                  {nurseData?.name}
                </h3>
                <p className="text-textColor text-[15px] leading-6 font-medium">
                  {nurseData?.email}
                </p>
              </div>

              <div className="mt-[50px] md:mt-[100px]">
                <button
                  onClick={handleLogout}
                  className="w-full bg-[#181A1E] p-3 rounded-md text-white text-[16px] leading-7"
                >
                  Logout
                </button>
                <button className="w-full bg-red-600 mt-4 p-3 rounded-md text-white text-[16px] leading-7">
                  Delete Account
                </button>
              </div>
            </div>

            <Tabs tab={tab} setTab={setTab} isApproved={nurseData.isApproved} />
            <div className="lg:col-span-2">
              {nurseData.isApproved === "pending" && (
                <div
                  id="alert-4"
                  className="flex p-4 mb-4 text-yellow-800 rounded-lg bg-yellow-50"
                  role="alert"
                >
                  <svg
                    aria-hidden="true"
                    className="flex-shrink-0 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">Info</span>
                  <div className="ml-3 text-sm font-medium">
                    To get approval please complete your profile. We&apos;ll
                    review manually and approve within 3 days.
                  </div>
                </div>
              )}
              <div className="mt-8">
                {tab === "settings" && (
                  <div>
                    <h2 className="heading text-[30px]">Profile Settings</h2>
                    <Profile userData={nurseData} />
                  </div>
                )}
                {tab === "addBed" && nurseData.isApproved === "approved" && (
                  <div>
                    <h2 className="heading text-[30px]">Add Bed</h2>
                    <AddBed />
                  </div>
                )}
                {tab === "addBed" && nurseData.isApproved !== "approved" && (
                  <div className="text-red-500 text-center mt-8">
                    You need to be approved to add beds.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default NurseAccount;