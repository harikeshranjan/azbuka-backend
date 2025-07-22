"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionType = exports.VocabTopic = void 0;
// Define your allowed topics as an enum or a const array
var VocabTopic;
(function (VocabTopic) {
    VocabTopic["BasicSurvival"] = "Basic Survival & Greetings";
    VocabTopic["EverydayObjects"] = "Everyday Objects";
    VocabTopic["Verbs"] = "Verbs";
    VocabTopic["Adjectives"] = "Adjectives";
    VocabTopic["Numbers"] = "Numbers & Quantities";
    VocabTopic["TimeDates"] = "Time & Dates";
    VocabTopic["PeopleFamily"] = "People & Family";
    VocabTopic["FoodDrink"] = "Food & Drink";
    VocabTopic["TravelTransport"] = "Travel & Transportation";
    VocabTopic["WorkStudy"] = "Work & Study";
    VocabTopic["HealthBody"] = "Health & Body";
    VocabTopic["PlacesDirections"] = "Places & Directions";
    VocabTopic["HobbiesInterests"] = "Hobbies & Interests";
    VocabTopic["NatureEnvironment"] = "Nature & Environment";
    VocabTopic["Adverbs"] = "Adverbs";
    VocabTopic["Prepositions"] = "Prepositions";
    VocabTopic["Conjunctions"] = "Conjunctions & Linking Words";
    VocabTopic["Pronouns"] = "Pronouns";
})(VocabTopic || (exports.VocabTopic = VocabTopic = {}));
var QuestionType;
(function (QuestionType) {
    QuestionType["MultipleChoice"] = "multiple-choice";
    QuestionType["FillInTheBlank"] = "fill-in-the-blank";
    QuestionType["TrueFalse"] = "true-false";
    QuestionType["Written"] = "written";
})(QuestionType || (exports.QuestionType = QuestionType = {}));
