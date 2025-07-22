import { Request, Response } from "express";
import Question from "../models/question";
import { QuestionType } from "../utils/types";

// MARK: POST request to add a question
export const addQuestion = async (req: Request, res: Response) => {
  const { question, options, answer, explanation, topic, level, difficultyScore, type, sourceLang, targetLang, acceptableAnswers } = req.body;

  if (!question || !answer || !topic || !level || !type) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  if (["multiple-choice", "true-false", "fill-in-the-blank"].includes(type)) {
    if (!options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ message: "Options must have at least 2 items." });
    }
  }

  if (type === "written") {
    if (!sourceLang || !targetLang) {
      return res.status(400).json({ message: "Source and Target language are required for written questions." });
    }
  }

  const newQuestion = await Question.create({
    question,
    options,
    answer,
    explanation,
    topic,
    level,
    difficultyScore,
    type,
    sourceLang,
    targetLang,
    acceptableAnswers,
    isLearned: false,
  });

  res.status(201).json(newQuestion);
}

// MARK: GET request to retrieve questions by topic
export const getQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.status(200).json(questions);
  } catch (error) {
    console.error("Error retrieving questions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// MARK: GET request to retrieve questions by id
export const getQuestionById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    res.status(200).json(question);
  } catch (error) {
    console.error("Error retrieving question:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// MARK: GET request to retrieve random n questions by topic, level, and type
export const getRandomQuestions = async (req: Request, res: Response) => {
  try {
    const {
      topic,
      level,
      type,
      isLearned,
      partOfSpeech,
      minDifficulty,
      maxDifficulty,
      n,
    } = req.query;

    const limit = parseInt(n as string) || 10;

    // Validate question type
    if (type && !Object.values(QuestionType).includes(type as QuestionType)) {
      return res.status(400).json({ message: "Invalid question type provided." });
    }

    const match: Record<string, any> = {};

    if (topic) match.topic = topic;
    if (level) match.level = level;
    if (type) match.type = type;
    if (partOfSpeech) match.partOfSpeech = partOfSpeech;
    if (isLearned !== undefined) match.isLearned = isLearned === "true";

    if (minDifficulty || maxDifficulty) {
      match.difficultyScore = {};
      if (minDifficulty) match.difficultyScore.$gte = parseInt(minDifficulty as string);
      if (maxDifficulty) match.difficultyScore.$lte = parseInt(maxDifficulty as string);
    }

    const questions = await Question.aggregate([
      { $match: match },
      { $sample: { size: limit } },
    ]);

    res.status(200).json(questions);
  } catch (error) {
    console.error("Error retrieving random questions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};