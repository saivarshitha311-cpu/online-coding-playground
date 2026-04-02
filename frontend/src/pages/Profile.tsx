import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

interface Project {
  filename: string;
  title: string;
  language: string;
}

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [newProject, setNewProject] = useState({ title: "", code: "", language: "" });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/users/${userId}/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(response.data.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [userId]);

  const handleSaveProject = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/users/${userId}/projects`,
        newProject,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Project saved successfully!");
      setProjects([...projects, response.data]);
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Failed to save project.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">User Projects</h2>
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
      >
        Back to Dashboard
      </button>

      {/* Input Fields for New Project */}
      <div className="mb-6 p-4 border rounded bg-gray-50">
        <h3 className="font-semibold mb-2">Add a New Project</h3>
        <input
          type="text"
          placeholder="Project Title"
          className="w-full mb-2 p-2 border rounded"
          value={newProject.title}
          onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
        />
        <textarea
          placeholder="Enter your code here..."
          className="w-full mb-2 p-2 border rounded"
          rows={4}
          value={newProject.code}
          onChange={(e) => setNewProject({ ...newProject, code: e.target.value })}
        />
        <select
          className="w-full mb-2 p-2 border rounded"
          value={newProject.language}
          onChange={(e) => setNewProject({ ...newProject, language: e.target.value })}
        >
          <option value="">Select Language</option>
          <option value="js">JavaScript</option>
          <option value="py">Python</option>
          <option value="cpp">C++</option>
        </select>
        <button
          onClick={handleSaveProject}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Save Project
        </button>
      </div>

      {/* Display Saved Projects */}
      {loading ? (
        <p>Loading...</p>
      ) : projects.length === 0 ? (
        <p className="text-center">No projects found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project.filename} className="border p-4 rounded-lg shadow bg-white">
              <h3 className="font-semibold text-lg">{project.title}</h3>
              <p className="text-sm text-gray-600">Language: {project.language}</p>
              <a
                href={`/programs/${project.filename}`}
                className="text-blue-600 hover:underline text-sm mt-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Code
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
