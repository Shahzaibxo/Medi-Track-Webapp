import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-22 text-center ">
      {/* Headings */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-emerald-700">
        MediTrack
      </h1>
      <h2 className="mt-2 text-xl sm:text-2xl md:text-3xl font-semibold text-emerald-600">
        Blockchain-Based Medicine Verification System
      </h2>

      {/* Intro Paragraphs */}
      <p className="mt-4 text-gray-700 max-w-2xl mx-auto">
        Protecting public health by ensuring medicine authenticity from
        manufacturer to consumer. Our tamper-proof system uses blockchain
        technology to eliminate counterfeit drugs and provide complete supply
        chain transparency.
      </p>

      {/* Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
        <Link to="/scan">
          <button className="flex items-center justify-center gap-2 px-8 py-3 text-center bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 transition cursor-pointer">
            <i className="fas fa-qrcode"></i> Verify Medicine
          </button>
        </Link>
        <Link to="/about">
          <button className="flex items-center justify-center gap-2 px-8 py-3 text-center border-2 border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition cursor-pointer">
            <i className="fas fa-book"></i> Learn More
          </button>
        </Link>
      </div>

      {/* How It Works Section */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-emerald-700">How It Works</h3>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <div className="text-emerald-600 text-4xl mb-4">
              <i className="fas fa-industry"></i>
            </div>
            <h4 className="text-lg font-semibold text-gray-800">
              Manufacturer
            </h4>
            <p className="mt-2 text-sm text-gray-600">
              Registers batch on blockchain
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <div className="text-emerald-600 text-4xl mb-4">
              <i className="fas fa-truck"></i>
            </div>
            <h4 className="text-lg font-semibold text-gray-800">
              Distribution
            </h4>
            <p className="mt-2 text-sm text-gray-600">Each transfer recorded</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <div className="text-emerald-600 text-4xl mb-4">
              <i className="fas fa-prescription-bottle-alt"></i>
            </div>
            <h4 className="text-lg font-semibold text-gray-800">Pharmacy</h4>
            <p className="mt-2 text-sm text-gray-600">
              Sells verified medicine
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <div className="text-emerald-600 text-4xl mb-4">
              <i className="fas fa-user-check"></i>
            </div>
            <h4 className="text-lg font-semibold text-gray-800">Consumer</h4>
            <p className="mt-2 text-sm text-gray-600">Verifies with QR scan</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

// src/components/Home.jsx
// import React from "react";
// import { useNavigate } from "react-router-dom";

// const Home = ({ showScreen }) => {
//   const navigate = useNavigate();

//   return (
//     <div className="app">
//       {/* 3D Background */}
//       <iframe
//         id="splineBg"
//         src="https://my.spline.design/pharmanexus-b5ZxlTFUu73N1z49kCPgnAN4/"
//         title="3D Background"
//       ></iframe>

//       {/* Hero Section */}
//       <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-left">
//         {/* Headings */}
//         <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-emerald-700">
//           MediTrack
//         </h1>
//         <h2 className="mt-2 text-xl sm:text-2xl md:text-3xl font-semibold text-emerald-600">
//           Blockchain-Based Medicine Verification System
//         </h2>

//         {/* Intro Paragraphs */}
//         <p className="mt-4 text-gray-700 max-w-2xl">
//           Protecting public health by ensuring medicine authenticity from
//           manufacturer to consumer.
//         </p>
//         <p className="mt-2 text-gray-700 max-w-2xl">
//           Our tamper-proof system uses blockchain technology to eliminate
//           counterfeit drugs and provide complete supply chain transparency.
//         </p>

//         {/* Buttons */}
//         <div className="mt-6 flex flex-col sm:flex-row gap-4">
//           <button
//             className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 transition cursor-pointer"
//             onClick={() => {
//               showScreen("scan");
//               navigate("/scan");
//             }}
//           >
//             <i className="fas fa-qrcode"></i> Verify Medicine
//           </button>
//           <button
//             className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition cursor-pointer"
//             onClick={() => {
//               showScreen("about");
//               navigate("/about");
//             }}
//           >
//             <i className="fas fa-book"></i> Learn More
//           </button>
//         </div>
//       </div>

//       {/* Keep How It Works section as is */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative">
//         <h3 className="text-2xl font-bold text-emerald-700 text-center">
//           How It Works
//         </h3>

//         <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//           <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
//             <div className="text-emerald-600 text-4xl mb-4">
//               <i className="fas fa-industry"></i>
//             </div>
//             <h4 className="text-lg font-semibold text-gray-800">
//               Manufacturer
//             </h4>
//             <p className="mt-2 text-sm text-gray-600">
//               Registers batch on blockchain
//             </p>
//           </div>

//           <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
//             <div className="text-emerald-600 text-4xl mb-4">
//               <i className="fas fa-truck"></i>
//             </div>
//             <h4 className="text-lg font-semibold text-gray-800">
//               Distribution
//             </h4>
//             <p className="mt-2 text-sm text-gray-600">Each transfer recorded</p>
//           </div>

//           <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
//             <div className="text-emerald-600 text-4xl mb-4">
//               <i className="fas fa-prescription-bottle-alt"></i>
//             </div>
//             <h4 className="text-lg font-semibold text-gray-800">Pharmacy</h4>
//             <p className="mt-2 text-sm text-gray-600">
//               Sells verified medicine
//             </p>
//           </div>

//           <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
//             <div className="text-emerald-600 text-4xl mb-4">
//               <i className="fas fa-user-check"></i>
//             </div>
//             <h4 className="text-lg font-semibold text-gray-800">Consumer</h4>
//             <p className="mt-2 text-sm text-gray-600">Verifies with QR scan</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;
