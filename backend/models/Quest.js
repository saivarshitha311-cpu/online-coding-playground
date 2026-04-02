import mongoose from "mongoose";

const QuestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], required: true },
  test_cases: [
    {
      input: String,
      expected_output: String,
    },
  ],
});

export default mongoose.model("Quest", QuestSchema);
