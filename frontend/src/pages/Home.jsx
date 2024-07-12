import heroImg01 from '../assets/images/hero-img01.png';
import heroImg02 from '../assets/images/hero-img02.png';
import heroImg03 from '../assets/images/hero-img03.png';
import icon01 from '../assets/images/icon01.png';
import icon02 from '../assets/images/icon02.png';
import icon03 from '../assets/images/icon03.png';
import About from '../componnents/about/About';
import featureImg from '../assets/images/feature-img.png';
import videoIcon from '../assets/images/video-icon.png';
import DoctorList from '../componnents/Doctors/DoctorList';
import ServiceList from '../componnents/services/ServiceList';

import { Link } from 'react-router-dom';
import { BsArrowRight } from 'react-icons/bs';


const Home = () => {
    return (
      <>
        <section className="hero__section pt-16 2xl:h-96 bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12 items-center justify-between">
              <div className="lg:w-1/2">
                <h1 className="text-4xl md:text-6xl text-headingColor font-extrabold leading-tight">
                  We help patients live a healthy, longer life
                </h1>
                <p className="mt-6 text-lg text-gray-700">
                  Établissement public ou établissement privé ayant passé certaines conventions avec l'État et où peuvent être admis tous les malades pour y être traités.
                </p>
                <button className="mt-8 btn bg-primaryColor text-white py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:bg-secondaryColor">
                  Demander un rendez-vous
                </button>
                <div className="mt-12 lg:mt-16 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                  <div className="text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-headingColor">30+</h2>
                    <span className="w-24 h-1 bg-yellow-500 rounded-full block mt-1"></span>
                    <p className="text-lg text-gray-700">Years of experience</p>
                  </div>
                  <div className="text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-headingColor">+15</h2>
                    <span className="w-24 h-1 bg-purple-500 rounded-full block mt-1"></span>
                    <p className="text-lg text-gray-700">Clinic Locations</p>
                  </div>
                  <div className="text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-headingColor">100%</h2>
                    <span className="w-24 h-1 bg-yellow-500 rounded-full block mt-1"></span>
                    <p className="text-lg text-gray-700">Patient Satisfaction</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-8 justify-end">
                <div className="flex-shrink-0 transform hover:scale-105 transition duration-300 ease-in-out">
                  <img className="w-80 h-80 object-cover rounded-lg shadow-lg" src={heroImg01} alt="Hero Image 1" />
                </div>
                <div className="mt-8">
                  <img src={heroImg02} className="w-80 h-40 object-cover rounded-lg shadow-lg mb-8 transform hover:scale-105 transition duration-300 ease-in-out" alt="Hero Image 2" />
                  <img src={heroImg03} className="w-80 h-40 object-cover rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out" alt="Hero Image 3" />
                </div>
              </div>
            </div>
          </div>
        </section>
        <br /><br />
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="lg:w-1/2 mx-auto text-center">
              <h2 className="text-3xl font-bold text-headingColor">Providing the best medical services</h2>
              <p className="mt-4 text-lg text-gray-700">
                À la clinique médicale privée RocklandMD, nous mettons l’accent sur la qualité des soins et le confort de nos patients.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {[
                { img: icon01, title: 'Find a doctor', link: '/doctors' },
                { img: icon02, title: 'Savoir Localisation', link: '/locations' },
                { img: icon03, title: 'Prendre un Rendez-vous', link: '/appointments' },
              ].map((item, index) => (
                <div key={index} className="py-8 px-6 flex flex-col items-center text-center border border-gray-200 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
                  <img src={item.img} alt={item.title} className="w-16 h-16 mb-4" />
                  <h2 className="text-xl font-semibold text-headingColor">{item.title}</h2>
                  <p className="mt-4 text-gray-600">Best medical care...</p>
                  <Link
                    to={item.link}
                    className="w-11 h-11 rounded-full border border-solid border-gray-800 flex items-center justify-center group hover:bg-primaryColor hover:border-none mt-4 transition duration-300 ease-in-out"
                  >
                    <BsArrowRight className="group-hover:text-white w-6 h-5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
  
        <About />
  
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-headingColor">Our Medical Services</h2>
              <p className="text-lg text-gray-600 mt-2">Meilleur soins de tout les temps</p>
            </div>
            <ServiceList />
          </div>
        </section>
  
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-bold text-headingColor">Get virtual treatment</h2>
                <ul className="list-disc pl-5 mt-4 text-lg text-gray-700">
                  <li>Schedule appointment directly</li>
                  <li>Search for your physician here, and contact their office</li>
                  <li>Regarder nos médecins qui acceptent de nouveaux patients</li>
                </ul>
                <Link to='/virtual-treatment'>
                  <button className="mt-8 btn bg-primaryColor text-white py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:bg-secondaryColor">
                    Learn more
                  </button>
                </Link>
              </div>
              <div className="relative z-10 lg:w-1/2 flex justify-end mt-8 lg:mt-0">
                <img src={featureImg} alt="Feature" className="rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out" />
                <div className="absolute bottom-12 left-0 bg-white p-4 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-semibold text-headingColor">Tue, 24</p>
                      <p className="text-sm font-normal text-headingColor">10.00 AM</p>
                    </div>
                    <span className="w-8 h-8 flex items-center justify-center bg-yellow-500 rounded-full">
                      <img src={videoIcon} alt="Video Icon" />
                    </span>
                  </div>
                  <div className="mt-2 text-center bg-blue-100 py-1 px-2 rounded-lg text-sm font-medium text-blue-600">Consultation</div>
                </div>
              </div>
            </div>
          </div>
        </section>
  
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-headingColor">Our Doctors</h2>
              <p className="text-lg text-gray-600 mt-2">Meilleur soins de tout les temps</p>
            </div>
            <DoctorList />
          </div>
        </section>
      </>
    );
  };
  
  export default Home;