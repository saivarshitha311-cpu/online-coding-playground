import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface Project {
  _id: string;
  title: string;
  code: string;
  language: string;
}

const Profile = () => {
  const { userId } = useParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/users/${userId}/projects`, {
          headers: { Authorization: `Bearer ${token}` }
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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User Projects</h2>
      {loading ? (
        <p>Loading...</p>
      ) : projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project._id} className="border p-4 rounded shadow">
              <h3 className="font-semibold">{project.title}</h3>
              <p className="text-sm text-gray-600">Language: {project.language}</p>
              <pre className="bg-gray-100 p-2 mt-2 overflow-auto text-sm">
                {project.code.slice(0, 200)}...
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
