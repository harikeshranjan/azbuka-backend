import mongoose from "mongoose";

// Define your allowed topics as an enum or a const array
export enum VocabTopic {
  BasicSurvival = "Basic Survival & Greetings",
  EverydayObjects = "Everyday Objects",
  Verbs = "Verbs",
  Adjectives = "Adjectives",
  Numbers = "Numbers & Quantities",
  TimeDates = "Time & Dates",
  PeopleFamily = "People & Family",
  FoodDrink = "Food & Drink",
  TravelTransport = "Travel & Transportation",
  WorkStudy = "Work & Study",
  HealthBody = "Health & Body",
  PlacesDirections = "Places & Directions",
  HobbiesInterests = "Hobbies & Interests",
  NatureEnvironment = "Nature & Environment",
  Adverbs = "Adverbs",
  Prepositions = "Prepositions",
  Conjunctions = "Conjunctions & Linking Words",
  Pronouns = "Pronouns",
}

export interface IVocab {
  _id: mongoose.Types.ObjectId;
  word: string;
  translation: string;
  partOfSpeech: string;
  gender?: "masculine" | "feminine" | "neutral";
  plural?: string;
  exampleSentence: string;
  exampleTranslation: string;
  topic: VocabTopic;
  level: "beginner" | "intermediate" | "advanced";
  isLearned: boolean;
}

export interface IPhrase {
  _id: mongoose.Types.ObjectId;
  phrase: string;
  translation: string;
  exampleSentence: string;
  exampleTranslation: string;
  topic: VocabTopic;
  level: "beginner" | "intermediate" | "advanced";
  isLearned: boolean;
}

export enum QuestionType {
  MultipleChoice = "multiple-choice",
  FillInTheBlank = "fill-in-the-blank",
  TrueFalse = "true-false",
  Written = "written",
}

export interface IQuestion {
  _id: mongoose.Types.ObjectId;
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
  topic: VocabTopic;
  level: "beginner" | "intermediate" | "advanced";
  difficultyScore?: number; // Optional field for difficulty score
  type: QuestionType;
  sourceLang?: "en" | "ru";
  targetLang?: "en" | "ru";
  acceptableAnswers?: string[]; // For written questions
  isLearned: boolean;
}

export interface IUserInfo {
  _id: mongoose.Types.ObjectId;
  xpEarned: number;
  vocabLearned: number;
  phrasesLearned: number;
  questionsAnswered: number;
  level: "beginner" | "intermediate" | "advanced";
  lastLessonDate: Date;
}

export interface IQueryParams {
  n?: number; // Number of items to fetch
  type?: QuestionType;
  topic?: string;
  level?: "beginner" | "intermediate" | "advanced";
  isLearned?: boolean;
  gender?: string;
  partOfSpeech?: string;
}