/* eslint-disable react/prop-types */
const Tabs = ({ tab, setTab, isApproved }) => {
    return (
      <div className="flex flex-col space-y-4 lg:space-y-0 lg:space-x-4 lg:flex-row">
        <button
          onClick={() => setTab("settings")}
          className={`${
            tab === "settings" && "bg-[#0067FF] text-white font-normal"
          } py-2 px-5 rounded-md font-semibold text-headingColor text-[16px] leading-7  border border-solid border-[#0067FF]`}
        >
          Settings
        </button>
        {isApproved === "approved" && (
          <button
            onClick={() => setTab("addBed")}
            className={`${
              tab === "addBed" && "bg-[#0067FF] text-white font-normal"
            } py-2 px-5 rounded-md font-semibold text-headingColor text-[16px] leading-7  border border-solid border-[#0067FF]`}
          >
            Add Bed
          </button>
        )}
      </div>
    );
  };
  
  export default Tabs;
  