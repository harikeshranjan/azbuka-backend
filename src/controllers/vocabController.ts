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

// MARK: GET request to fetch a random vocabulary entry
export const getRandomVocab = async (_req: Request, res: Response) => {
  try {
    const count = await Vocab.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const randomVocab = await Vocab.findOne().skip(randomIndex); // Skip to the random index

    if (!randomVocab) {
      return res.status(404).json({ message: "No vocabulary entries found." });
    }

    res.status(200).json(randomVocab);
  } catch (error) {
    console.error("Error retrieving random vocabulary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// MARK: GET request to fetch 10 random vocabulary by level
export const getTenRandomVocabByLevel = async (req: Request, res: Response) => {
  try {
    const { level } = req.params;

    // Validate level
    if (!["beginner", "intermediate", "advanced"].includes(level)) {
      return res.status(400).json({ message: "Invalid level provided." });
    }

    const randomVocab = await Vocab.aggregate([
      { $match: { level, isLearned: false } },
      { $sample: { size: 10 } }
    ])

    if (randomVocab.length === 0) {
      return res.status(404).json({ message: `No unlearned vocabulary entries found for level: ${level}` });
    }

    res.status(200).json(randomVocab);
  } catch (error) {
    console.error("Error retrieving 10 random vocabulary by level:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// // MARK: GET request to fetch 10 random vocabulary entries of beginner level
// export const getTenRandomBeginnerVocab = async (_req: Request, res: Response) => {
//   try {
//     const randomBeginnerVocab = await Vocab.aggregate([
//       { $match: { level: "beginner", isLearned: false } },
//       { $sample: { size: 10 } }
//     ])

//     if (randomBeginnerVocab.length === 0) {
//       return res.status(404).json({ message: "No unlearned beginner vocabulary entries found." });
//     }

//     res.status(200).json(randomBeginnerVocab);
//   } catch (error) {
//     console.error("Error retrieving random beginner vocabulary:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }

// // MARK: GET request to fetch 10 random vocabulary entries of intermediate level
// export const getTenRandomIntermediateVocab = async (_req: Request, res: Response) => {
//   try {
//     const randomIntermediateVocab = await Vocab.aggregate([
//       { $match: { level: "intermediate", isLearned: false } },
//       { $sample: { size: 10 } }
//     ])

//     if (randomIntermediateVocab.length === 0) {
//       return res.status(404).json({ message: "No unlearned intermediate vocabulary entries found." });
//     }

//     res.status(200).json(randomIntermediateVocab);
//   } catch (error) {
//     console.error("Error retrieving random intermediate vocabulary:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }

// // MARK: GET request to fetch 10 random vocabulary entries of advanced level
// export const getTenRandomAdvancedVocab = async (_req: Request, res: Response) => {
//   try {
//     const randomAdvancedVocab = await Vocab.aggregate([
//       { $match: { level: "advanced", isLearned: false } },
//       { $sample: { size: 10 } }
//     ])

//     if (randomAdvancedVocab.length === 0) {
//       return res.status(404).json({ message: "No unlearned advanced vocabulary entries found." });
//     }

//     res.status(200).json(randomAdvancedVocab);
//   } catch (error) {
//     console.error("Error retrieving random advanced vocabulary:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }

// MARK: GET request to fetch 20 random vocabulary entries by level
export const getTwentyRandomVocabByLevel = async (req: Request, res: Response) => {
  try {
    const { level } = req.params;

    // Validate level
    if(!["beginner", "intermediate", "advanced"].includes(level)) {
      return res.status(400).json({ message: "Invalid level provided." });
    }

    const randomVocab = await Vocab.aggregate([
      { $match: { level, isLearned: false } },
      { $sample: { size: 20 } }
    ])

    if (randomVocab.length === 0) {
      return res.status(404).json({ message: `No unlearned vocabulary entries found for level: ${level}` });
    }

    res.status(200).json(randomVocab);
  } catch (error) {
    console.error("Error retrieving 20 random vocabulary by level:", error);
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

    res.status(201).json(newVocab);
  } catch (error) {
    console.error("Error creating vocabulary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}