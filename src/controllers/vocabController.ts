import { Request, Response } from "express";
import Vocab from "../models/vocab";
import { IQueryParams, VocabTopic } from "../utils/types";

// MARK: GET request to retrieve all vocabulary entries
export const getAllVocab = async (_req: Request, res: Response) => {
  try {
    const vocabList = await Vocab.find();
    res.status(200).json(vocabList);
  } catch (error) {
    console.error("Error retrieving vocabulary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// MARK: GET request to retrieve vocabulary entries by topic
export const getVocabByTopic = async (req: Request, res: Response) => {
  try {
    const { topic } = req.params;
    const { level, isLearned, gender, partOfSpeech } = req.query;

    // Validate topic
    if (!Object.values(VocabTopic).includes(topic as VocabTopic)) {
      return res.status(400).json({ message: "Invalid topic provided." });
    }

    // Validate gender if provided
    if (!["masculine", "feminine", "neutral"].includes(gender as string)) {
      return res.status(400).json({
        message: "Invalid gender provided. Allowed values are: masculine, feminine, neutral."
      });
    }

    // Build dynamic query
    const query: IQueryParams = {
      topic: topic as VocabTopic,
    };

    if (level) query.level = level as "beginner" | "intermediate" | "advanced";
    if (isLearned !== undefined) query.isLearned = isLearned === 'true';
    if (gender) query.gender = gender as string;
    if (partOfSpeech) query.partOfSpeech = partOfSpeech as string;

    const vocab = await Vocab.find(query);

    if (vocab.length === 0) {
      return res.status(404).json({ message: "No vocabulary found for the specified topic." });
    }

    res.status(200).json({
      message: `Vocabulary entries for topic: ${topic}`,
      filters: { level, isLearned },
      vocab: vocab,
    })
  } catch (error) {
    console.error("Error retrieving vocabulary by topic:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// MARK: POST request to create a new vocabulary entry
export const postVocab = async (req: Request, res: Response) => {
  try {
    const { word, translation, partOfSpeech, gender, plural, exampleSentence, exampleTranslation, topic, level, isLearned } = req.body;

    // Basic validation for topic from request body
    if (!Object.values(VocabTopic).includes(topic as VocabTopic)) {
      return res.status(400).json({ message: "Invalid topic provided in request body." });
    }

    // Validate gender if provided
    if (!["masculine", "feminine", "neutral"].includes(gender as string)) {
      return res.status(400).json({
        message: "Invalid gender provided. Allowed values are: masculine, feminine, neutral."
      });
    }

    const newVocab = await Vocab.create({ word, translation, partOfSpeech, gender, plural, exampleSentence, exampleTranslation, topic, level, isLearned });

    res.status(201).json({
      message: "Vocabulary created successfully",
      vocab: newVocab,
    });
  } catch (error) {
    console.error("Error creating vocabulary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}