import { Request, Response } from "express";
import Phrase from "../models/phrase";
import { IQueryParams, VocabTopic } from "../utils/types";

// MARK: GET request to retrieve the status of phrases
export const getPhraseStatus = async (_req: Request, res: Response) => {
  try {
    const totalCount = await Phrase.countDocuments();
    const learnedCount = await Phrase.countDocuments({ isLearned: true });
    const notLearnedCount = totalCount - learnedCount;
    const  beginnerCount = await Phrase.countDocuments({ level: "beginner" });
    const intermediateCount = await Phrase.countDocuments({ level: "intermediate" });
    const advancedCount = await Phrase.countDocuments({ level: "advanced" });
    const eachTopicCount = await Phrase.aggregate([
      {
        $group: {
          _id: "$topic",
          count: { $sum: 1 }
        }
      }
    ])

    const status = {
      totalCount,
      learnedCount,
      notLearnedCount,
      beginnerCount,
      intermediateCount,
      advancedCount,
      topics: eachTopicCount.reduce((acc: Record<string, number>, curr: { _id: string; count: number }) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {})
    };

    res.status(200).json(status);
  } catch (error) {
    console.error("Error retrieving phrase status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// MARK: GET request to retrieve all phrases
export const getAllPhrases = async (_req: Request, res: Response) => {
  try {
    const phrases = await Phrase.find();
    res.status(200).json(phrases);
  } catch (error) {
    console.error("Error retrieving phrases:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// MARK: GET request to retrieve phrases by topic
export const getPhrasesByTopic = async (req: Request, res: Response) => {
  try {
    const { topic } = req.params;
    const { level, isLearned } = req.query as IQueryParams;

    if (!Object.values(VocabTopic).includes(topic as VocabTopic)) {
      return res.status(400).json({ message: "Invalid topic" });
    }

    const query: IQueryParams = {
      topic: topic as VocabTopic,
    }

    if (level) query.level = level;
    if (isLearned !== undefined) query.isLearned = String(isLearned) === 'true';

    const phrases = await Phrase.find(query);
    res.status(200).json(phrases);
  } catch (error) {
    console.error("Error retrieving phrases by topic:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// GET request to retrieve phrases by word or translation
export const getPhrasesByWordOrTranslation = async (req: Request, res: Response) => {
  try {
    const { searchTerm } = req.params;

    if (!searchTerm) {
      return res.status(400).json({ message: "Search term is required." });
    }

    const phrases = await Phrase.find({
      $or: [
        { phrase: new RegExp(searchTerm, 'i') },
        { translation: new RegExp(searchTerm, 'i') }
      ]
    });

    res.status(200).json(phrases);
  } catch (error) {
    console.error("Error retrieving phrases by word or translation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// MARK: GET request to fetch phrases by level
export const getPhrasesByLevel = async (req: Request, res: Response) => {
  try {
    const { level } = req.params;

    if (!["beginner", "intermediate", "advanced"].includes(level)) {
      return res.status(400).json({ message: "Invalid level provided." });
    }

    const phrases = await Phrase.find({ level });

    if (phrases.length === 0) {
      return res.status(404).json({ message: "No phrases found for the specified level." });
    }

    res.status(200).json(phrases);
  } catch (error) {
    console.error("Error retrieving phrases by level:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// MARK: GET request to fetch random phrases
export const getRandomPhrase = async (req: Request, res: Response) => {
  try {
    const {
      n,
      topic,
      level,
      isLearned,
    } = req.query as IQueryParams;

    const query: IQueryParams = {};

    if (topic) {
      query.topic = topic as VocabTopic;
    }

    if (level) {
      query.level = level;
    }

    if (isLearned !== undefined) {
      query.isLearned = String(isLearned) === 'true';
    }

    const size = n ? parseInt(n.toString(), 10) : 10;
    const phraseList = await Phrase.aggregate([
      { $match: query },
      { $sample: { size } }
    ]); 

    res.status(200).json(phraseList);
  } catch (error) {
    console.error("Error retrieving random phrase:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// MARK: POST request to add a new phrase
export const postPhrase = async (req: Request, res: Response) => {
  try {
    const { phrase, translation, exampleSentence, exampleTranslation, topic, level, isLearned } = req.body;

    if (!phrase || !translation || !exampleSentence || !exampleTranslation || !topic || !level) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (!Object.values(VocabTopic).includes(topic)) {
      return res.status(400).json({ message: "Invalid topic provided." });
    }

    if (!["beginner", "intermediate", "advanced"].includes(level)) {
      return res.status(400).json({ message: "Invalid level provided." });
    }

    const newPhrase = await Phrase.create({
      phrase,
      translation,
      exampleSentence,
      exampleTranslation,
      topic,
      level,
      isLearned: isLearned || false
    });

    res.status(201).json(newPhrase);
  } catch (error) {
    console.error("Error adding new phrase:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}