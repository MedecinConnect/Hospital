import React from 'react';
import PropTypes from 'prop-types';
import { BsArrowRight } from 'react-icons/bs';
import { Link } from 'react-router-dom';

const ServiceCard = ({ item, index }) => {
  const { name, desc, bgColor, textColor } = item;
  return (
    <div className="py-6 px-4 lg:px-6 flex flex-col items-start bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 w-full">
      <h2 className="text-2xl leading-9 text-headingColor font-bold">{name}</h2>
      <p className="text-base leading-7 font-medium text-gray-600 mt-4">
        {desc}
      </p>

      <div className="flex items-center justify-between mt-6 w-full">
        <Link
          to="/doctors"
          className="w-11 h-11 rounded-full border border-solid border-gray-800 flex items-center justify-center group hover:bg-primaryColor hover:border-none mt-4 transition-all duration-300"
        >
          <BsArrowRight className="group-hover:text-white w-6 h-5 transition-all duration-300" />
        </Link>
        <span
          className="w-11 h-11 flex items-center justify-center text-xs leading-[30px] font-semibold"
          style={{ background: bgColor, color: textColor, borderRadius: '6px 0 0 6px' }}
        >
          {index + 1}
        </span>
      </div>
    </div>
  );
};

ServiceCard.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    bgColor: PropTypes.string,
    textColor: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default ServiceCard;
