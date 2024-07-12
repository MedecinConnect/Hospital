/* eslint-disable no-empty-pattern */
import starIcon from '../../assets/images/Star.png';
import  {Link} from 'react-router-dom';
import { BsArrowRight } from 'react-icons/bs';
const DoctorCard = ({ doctor }) => {
    // eslint-disable-next-line react/prop-types
    const { name, avgRating, totalRating, photo, specialization, totalPatient, hospital } = doctor;
    return (
      <div className="p-3 lg:p-5">
        <img src={photo} className="w-full" alt={name} />
        <h2 className="text-[18px] leading-[30px] lg:text-[26px] text-headingColor font-[700] mt-3 lg:mt-5">
          {name}
        </h2>
        <p className="text-[16px] leading-6 text-gray-600 mt-2">{specialization}</p>
        <div className="flex justify-between mt-3 lg:mt-5">
          <div>
            <p className="text-[14px] text-gray-500">Avg Rating</p>
            <p className="text-[16px] font-semibold">{avgRating}</p>
          </div>
          <div>
            <p className="text-[14px] text-gray-500">Total Ratings</p>
            <p className="text-[16px] font-semibold">{totalRating}</p>
          </div>
          <div>
            <p className="text-[14px] text-gray-500">Patients</p>
            <p className="text-[16px] font-semibold">{totalPatient}</p>
          </div>
        </div>
        <p className="text-[14px] text-gray-500 mt-3">{hospital}</p>
        <Link to='/doctors' className='w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto flex items-center justify-center group  hover:bg-primaryColor hover:border-none'>
      
            <BsArrowRight className='group-hover:text-white w-6 h-5'/>
        </Link>
      </div>
    );
  }
  
  export default DoctorCard;
  