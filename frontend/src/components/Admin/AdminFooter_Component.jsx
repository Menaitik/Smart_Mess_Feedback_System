const AdminFooter = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 border-t shadow-inner mt-10">
      <div className="max-w-7xl mx-auto px-4 py-5 text-center text-sm text-gray-700 tracking-wide">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-indigo-700">
          Mess Feedback System
        </span>{" "}
        | MMMUT, Gorakhpur —
        <span className="text-purple-600 font-medium"> Code Crafters</span>
      </div>
    </footer>
  );
};

export default AdminFooter;
