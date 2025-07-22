import { Request, Response } from "express";
import Question from "../models/question";

export const generateEasyLesson = async (req: Request, res: Response) => {
  try {
    const { lessonNumber } = req.query;
    const level = Number(lessonNumber) || 1;

    // calculate the difficulty range based on the lesson number
    const difficultyLevel = Math.floor((level - 1) / 30);
    const minDifficulty = 1 + difficultyLevel * 2;
    const maxDifficulty = Math.min(minDifficulty + 2, 10);

    const matchFilter = {
      difficultyScore: {
        $gte: minDifficulty,
        $lte: maxDifficulty,
      }
    }

    const [FillInTheBlank, TrueFalse, MultipleChoice, Written] = await Promise.all([
      Question.aggregate([
        { $match: { type: "fill-in-the-blank", ...matchFilter } },
        { $sample: { size: 3 } },
      ]),
      Question.aggregate([
        { $match: { type: "true-false", ...matchFilter } },
        { $sample: { size: 2 } },
      ]),
      Question.aggregate([
        { $match: { type: "multiple-choice", ...matchFilter } },
        { $sample: { size: 3 } },
      ]),
      Question.aggregate([
        { $match: { type: "written", ...matchFilter } },
        { $sample: { size: 2 } },
      ]),
    ]);

    const lesson = {
      lessonNumber: Number(lessonNumber),
      questions: [
        ...FillInTheBlank.map(q => ({ ...q, type: "fill-in-the-blank" })),
        ...TrueFalse.map(q => ({ ...q, type: "true-false" })),
        ...MultipleChoice.map(q => ({ ...q, type: "multiple-choice" })),
        ...Written.map(q => ({ ...q, type: "written" })),
      ],
      xpReward: 15,
      difficultyRange: `${minDifficulty}-${maxDifficulty}`,
    }

    res.status(200).json(lesson);
  } catch (error) {
    console.error("Error generating lesson:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export const generateHardLesson = async (req: Request, res: Response) => {
  try {
    const { lessonNumber } = req.query;
    const level = Number(lessonNumber) || 1;

    // calculate the difficulty range based on the lesson number
    const difficultyLevel = Math.floor((level - 1) / 30);
    const minDifficulty = 3 + difficultyLevel * 2;
    const maxDifficulty = Math.min(minDifficulty + 2, 10);

    const matchFilter = {
      difficultyScore: {
        $gte: minDifficulty,
        $lte: maxDifficulty,
      }
    }

    const [FillInTheBlank, TrueFalse, MultipleChoice, Written] = await Promise.all([
      Question.aggregate([
        { $match: { type: "fill-in-the-blank", ...matchFilter } },
        { $sample: { size: 5 } },
      ]),
      Question.aggregate([
        { $match: { type: "true-false", ...matchFilter } },
        { $sample: { size: 5 } },
      ]),
      Question.aggregate([
        { $match: { type: "multiple-choice", ...matchFilter } },
        { $sample: { size: 5 } },
      ]),
      Question.aggregate([
        { $match: { type: "written", ...matchFilter } },
        { $sample: { size: 5 } },
      ]),
    ]);

    const lesson = {
      lessonNumber: Number(lessonNumber),
      questions: [
        ...FillInTheBlank.map(q => ({ ...q, type: "fill-in-the-blank" })),
        ...TrueFalse.map(q => ({ ...q, type: "true-false" })),
        ...MultipleChoice.map(q => ({ ...q, type: "multiple-choice" })),
        ...Written.map(q => ({ ...q, type: "written" })),
      ],
      xpReward: 30,
      difficultyRange: `${minDifficulty}-${maxDifficulty}`,
    }

    res.status(200).json(lesson);
  } catch (error) {
    console.error("Error generating hard lesson:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}