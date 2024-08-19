/* eslint-disable react/prop-types */
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch({ type: "LOGOUT" });
        navigate("/login");
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <button
                onClick={handleLogout}
                className="bg-red-500 text-white py-2 px-4 rounded-lg text-[18px] leading-[30px]"
            >
                Logout
            </button>
        </div>
    );
};

export default Profile;
