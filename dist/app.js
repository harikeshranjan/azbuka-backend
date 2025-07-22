"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const vocabRoutes_1 = __importDefault(require("./routes/vocabRoutes"));
const questionRoutes_1 = __importDefault(require("./routes/questionRoutes"));
const lessonRoutes_1 = __importDefault(require("./routes/lessonRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Mongoose connection
(0, db_1.default)();
// routes
app.use('/vocab', vocabRoutes_1.default);
app.use('/question', questionRoutes_1.default);
app.use('/lesson', lessonRoutes_1.default);
app.get('/', (req, res) => {
    res.send('Welcome to the Azbuka API');
});
exports.default = app;
