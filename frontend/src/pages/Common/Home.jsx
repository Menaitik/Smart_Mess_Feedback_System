import { useNavigate } from "react-router-dom";


const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-white/30">
        <h1 className="text-4xl font-extrabold text-gray-500 mb-6 drop-shadow-md">
          Smart Mess Feedback
        </h1>
        <p className="text-white/90 mb-8 text-sm">
          A secure and smart platform to manage hostel mess feedback.
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate("/admin/login")}
            className="bg-white text-indigo-600 font-semibold py-2 px-4 rounded-full hover:bg-indigo-100 transition duration-200"
          >
            Admin Login
          </button>
          <button
            onClick={() => navigate("/student/login")}
            className="bg-white text-pink-600 font-semibold py-2 px-4 rounded-full hover:bg-pink-100 transition duration-200"
          >
            Student Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
