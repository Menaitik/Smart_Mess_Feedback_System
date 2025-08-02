import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig.js";
import { useNavigate } from "react-router-dom";

const AdminStudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      const snapshot = await getDocs(collection(db, "users"));
      const data = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((user) => user.role === "student");

      setStudents(data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteDoc(doc(db, "users", id));
        setStudents((prev) => prev.filter((student) => student.id !== id));
        alert("✅ Student deleted from Firestore.");
      } catch (error) {
        console.error("Error deleting student:", error);
        alert("❌ Failed to delete student.");
      }
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-purple-700">
            All Registered Students
          </h2>
          <button
            onClick={() => navigate("/admin/addstudent")}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            ➕ Add Student
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : students.length === 0 ? (
          <p className="text-center text-gray-500">No students found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-md">
              <thead className="bg-purple-100 text-purple-800">
                <tr>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Roll/ID</th>
                  <th className="px-4 py-2 border">Course</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="text-center">
                    <td className="px-4 py-2 border">{student.name}</td>
                    <td className="px-4 py-2 border">{student.roll}</td>
                    <td className="px-4 py-2 border">{student.course}</td>
                    <td className="px-4 py-2 border">{student.email}</td>
                    <td className="px-4 py-2 border space-x-2">
                      <button
                        onClick={() =>
                          navigate(`/admin/editstudent/${student.id}`)
                        }
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="text-sm text-red-600 hover:underline"
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
