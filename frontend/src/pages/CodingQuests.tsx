import React, { useEffect, useState } from "react";

const CodingQuests: React.FC = () => {
  const [quests, setQuests] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/quests") // Add `/api`
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Quests:", data);
        setQuests(data);
      })
      .catch((error) => console.error("Error fetching quests", error));
  }, []);
  

  return (
    <div className="quests-page p-6">
      <h1 className="text-3xl font-bold">Coding Quests</h1>
      <ul>
        {quests.map((quest) => (
          <li key={quest._id} className="p-4 border rounded-lg my-2">
            <h2 className="text-xl font-semibold">{quest.title}</h2>
            <p>{quest.description}</p>
            <p className="text-sm text-gray-500">Difficulty: {quest.difficulty}</p>
            <button className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">Start Challenge</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CodingQuests;
