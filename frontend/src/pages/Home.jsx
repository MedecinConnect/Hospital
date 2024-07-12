import heroImg01 from '../assets/images/hero-img01.png';
import heroImg02 from '../assets/images/hero-img02.png';
import heroImg03 from '../assets/images/hero-img03.png';
import icon01 from '../assets/images/icon01.png';
import icon02 from '../assets/images/icon02.png';
import icon03 from '../assets/images/icon03.png';
import About from '../componnents/about/About';

import { Link } from 'react-router-dom';
import { BsArrowRight } from 'react-icons/bs';

const Home = () => {
  return (
    <>
      <section className="hero__section pt-[60px] 2x1:h-[800px]">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-[90px] items-center justify-between">
            <div className="lg:w-[570px]">
              <h1 className="text-[36px] leading-[46px] text-headingColor font-[800] md:text-[60px] md:leading-[70px]">
                We help patients live a healthy, longer life
              </h1>
              <p className="text__para">
                Établissement public ou établissement privé ayant passé certaines conventions avec l'État et où peuvent être admis tous les malades pour y être traités.
              </p>
              <button className="btn">Demander un rendez-vous</button>
              <div className="mt-[30px] lg:mt-[70px] flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-[30px]">
                <div>
                  <h2 className="text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor">30+</h2>
                  <span className="w-[100px] h-2 bg-yellowColor rounded-full block mt-[-14px]"></span>
                  <p className="text__para">Years of experience</p>
                </div>
                <div>
                  <h2 className="text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor">+15</h2>
                  <span className="w-[100px] h-2 bg-purpleColor rounded-full block mt-[-14px]"></span>
                  <p className="text__para">Clinic Location</p>
                </div>
                <div>
                  <h2 className="text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor">100%</h2>
                  <span className="w-[100px] h-2 bg-yellowColor rounded-full block mt-[-14px]"></span>
                  <p className="text__para">Years of experience</p>
                </div>
              </div>
            </div>
            <div className="flex gap-[30px] justify-end">
              <div>
                <img className="w-full" src={heroImg01} alt="" />
              </div>
              <div className="mt-[30px]">
                <img src={heroImg02} className="w-full mb-[30px]" alt="" />
                <img src={heroImg03} className="w-full" alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="lg:w-[470px] mx-auto">
            <h2 className="heading text-center">Providing the best medical services</h2>
            <p className="text__para text-center">
              À la clinique médicale privée RocklandMD, nous mettons l’accent sur la qualité des soins et le confort de nos patients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]">
            <div className="py-[30px] px-5 flex flex-col items-center text-center">
              <img src={icon01} alt="" />
              <h2 className="mt-4">Find a doctor</h2>
              <p className="text-[16px] leading-7 text-textColor font-[400] mt-4">Best medical care...</p>
              <Link
                to="/doctors"
                className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] flex items-center justify-center group hover:bg-primaryColor hover:border-none mt-4"
              >
                <BsArrowRight className="group-hover:text-white w-6 h-5" />
              </Link>
            </div>
            <div className="py-[30px] px-5 flex flex-col items-center text-center">
              <img src={icon02} alt="" />
              <h2 className="mt-4">Savoir Localisation</h2>
              <p className="text-[16px] leading-7 text-textColor font-[400] mt-4">Best medical care...</p>
              <Link
                to="/doctors"
                className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] flex items-center justify-center group hover:bg-primaryColor hover:border-none mt-4"
              >
                <BsArrowRight className="group-hover:text-white w-6 h-5" />
              </Link>
            </div>
            <div className="py-[30px] px-5 flex flex-col items-center text-center">
              <img src={icon03} alt="" />
              <h2 className="mt-4">Prendre un Rendez-vous</h2>
              <p className="text-[16px] leading-7 text-textColor font-[400] mt-4">Best medical care...</p>
              <Link
                to="/doctors"
                className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] flex items-center justify-center group hover:bg-primaryColor hover:border-none mt-4"
              >
                <BsArrowRight className="group-hover:text-white w-6 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

<About/>








    </>
  );
};

export default Home;
