import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

const AdminStudentList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const data = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((user) => user.role === "student");

        setStudents(data);
        setFilteredStudents(data);
      } catch (error) {
        console.error("Failed to fetch students:", error);
        alert("❌ Failed to load student data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    setFilteredStudents(
      students.filter(
        (s) =>
          s.name?.toLowerCase().includes(lowerSearch) ||
          s.roll?.toLowerCase().includes(lowerSearch)
      )
    );
  }, [searchTerm, students]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteDoc(doc(db, "users", id));
        setStudents((prev) => prev.filter((s) => s.id !== id));
        alert("✅ Student deleted successfully.");
      } catch (error) {
        console.error("Error deleting student:", error);
        alert("❌ Failed to delete student.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            🎓 Registered Students
          </h2>
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="🔍 Search by name or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={() => navigate("/admin/addstudent")}
              className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-lg transition-all duration-200"
            >
              ➕ Add Student
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-10">
            Loading students...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No students found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left border">Name</th>
                  <th className="px-4 py-3 text-left border">Roll/ID</th>
                  <th className="px-4 py-3 text-left border">Course</th>
                  <th className="px-4 py-3 text-left border">Email</th>
                  <th className="px-4 py-3 text-center border">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {filteredStudents.map((student, i) => (
                  <tr
                    key={student.id}
                    className={`hover:bg-gray-50 ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-2 border">{student.name}</td>
                    <td className="px-4 py-2 border">{student.roll}</td>
                    <td className="px-4 py-2 border">{student.course}</td>
                    <td className="px-4 py-2 border">{student.email}</td>
                    <td className="px-4 py-2 border text-center space-x-2">
                      <button
                        onClick={() =>
                          navigate(`/admin/editstudent/${student.id}`)
                        }
                        className="text-indigo-600 hover:underline font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="text-red-500 hover:underline font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStudentList;
