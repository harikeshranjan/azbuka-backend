import { Request, Response } from "express";
import Vocab from "../models/vocab";
import { IQueryParams, VocabTopic } from "../utils/types";

// MARK: GET request to retrieve the status of the vocabularies
export const getVocabStatus = async (_req: Request, res: Response) => {
  try {
    const totalCount = await Vocab.countDocuments();
    const learnedCount = await Vocab.countDocuments({ isLearned: true });
    const notLearnedCount = totalCount - learnedCount;
    const beginnerCount = await Vocab.countDocuments({ level: "beginner" });
    const intermediateCount = await Vocab.countDocuments({ level: "intermediate" });
    const advancedCount = await Vocab.countDocuments({ level: "advanced" });
    const eachTopicCount = await Vocab.aggregate([
      {
        $group: {
          _id: "$topic",
          count: { $sum: 1 }
        }
      }
    ]);

    const levelsCount = {
      beginner: beginnerCount,
      intermediate: intermediateCount,
      advanced: advancedCount,
    };
    
    const status = {
      totalCount,
      learnedCount,
      notLearnedCount,
      levelsCount,
      topics: eachTopicCount.reduce((acc: Record<string, number>, curr: { _id: string; count: number }) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {})
    }

    res.status(200).json(status);
  } catch (error) {
    console.error("Error retrieving vocabulary status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

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

// MARK: GET request to fetch vocabulary either by word or translation
export const getVocabByWordOrTranslation = async (req: Request, res: Response) => {
  try {
    const { searchTerm } = req.params;

    if (!searchTerm || typeof searchTerm !== "string") {
      return res.status(400).json({ message: "Invalid or missing search term." });
    }

    const term = searchTerm.trim();
    const regex = new RegExp(term, "i");
    const vocab = await Vocab.find({
      $or: [
        { word: regex },
        { translation: regex },
      ]
    });

    if (vocab.length === 0) {
      return res.status(404).json({ message: "No vocabulary found matching the search term." });
    }

    res.status(200).json(vocab);
  } catch (error) {
    console.error("Error retrieving vocabulary by word or translation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// MARK: GET request to fetch vocabulary by level
export const getVocabByLevel = async (req: Request, res: Response) => {
  try {
    const { level } = req.params;

    // Validate level
    if (!["beginner", "intermediate", "advanced"].includes(level)) {
      return res.status(400).json({ message: "Invalid level provided." });
    }

    const vocab = await Vocab.find({ level }).sort({ createdAt: -1 });

    if (vocab.length === 0) {
      return res.status(404).json({ message: `No vocabulary found for level: ${level}` });
    }

    res.status(200).json(vocab);
  } catch (error) {
    console.error("Error retrieving vocabulary by level:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// MARK: GET request to fetch 10 random vocabulary entries by topic and level
export const getRandomVocab = async (req: Request, res: Response) => {
  try {
    const {
      n,
      topic,
      level,
      gender,
      partOfSpeech,
      isLearned,
    } = req.query as Partial<IQueryParams>;

    const query: IQueryParams = {};

    // Topic validation
    if (topic) {
      if (!Object.values(VocabTopic).includes(topic as VocabTopic)) {
        return res.status(400).json({ message: "Invalid topic provided." });
      }
      query.topic = topic;
    }

    // Level validation
    if (level) {
      if (!["beginner", "intermediate", "advanced"].includes(level)) {
        return res.status(400).json({ message: "Invalid level provided." });
      }
      query.level = level as IQueryParams["level"];
    }

    if (gender) query.gender = gender;
    if (partOfSpeech) query.partOfSpeech = partOfSpeech;

    // Handle isLearned as boolean
    if (isLearned !== undefined) {
      query.isLearned = String(isLearned) === "true";
    } else {
      query.isLearned = false; // Default behavior
    }

    const size = n ? parseInt(n.toString(), 10) : 10;
    const vocabList = await Vocab.aggregate([
      { $match: query },
      { $sample: { size } }
    ]);

    if (vocabList.length === 0) {
      return res.status(404).json({
        message: "No vocabulary entries found matching your criteria."
      });
    }

    res.status(200).json(vocabList);

  } catch (error) {
    console.error("Error retrieving 10 random vocabulary entries:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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

    res.status(201).json(newVocab);
  } catch (error) {
    console.error("Error creating vocabulary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}