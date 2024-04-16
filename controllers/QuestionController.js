import Question from '../models/Question.js';

export async function createQAQuestion(req,res,next) {
  try {
    const { complexity,question, motsClés, marks, type} = req.body;
    const image = `${req.protocol}://${req.get('host')}/img/${req.file.filename}`;
    const newQAQuestion = new Question({
        complexity,
        question,
        response,
        marks, 
        type:'QA',
        image
    });
    await newQAQuestion.save();
    res.status(201).json(newQAQuestion); 
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export async function createQuizQuestion(req,res,next) {
    try {
      const { complexity,question, response, marks, type, options} = req.body;
      const image = `${req.protocol}://${req.get('host')}/img/${req.file.filename}`;
      const newQuizQuestion = new Question({
          complexity,
          question,
          response,
          marks, 
          type:'Quiz',
          options,
          image
      });
      await newQuizQuestion.save();
      res.status(201).json(newQuizQuestion); 
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  export async function compareQuizAnswer(req, res) {
    try {
        const { questionId, studentAnswer } = req.body;

        const question = await Question.findById(questionId);
        if (!question || question.type !== 'Quiz') {
            return res.status(404).json({ message: "Quiz question not found" });
        }

        const isCorrect = question.options.some(option => option.correct && option.text === studentAnswer);

        res.json({ correct: isCorrect });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export async function compareQAAnswer(req, res) {
    try {
        const { questionId, studentAnswer } = req.body;

        const question = await Question.findById(questionId);
        if (!question || question.type !== 'QA') {
            return res.status(404).json({ message: "Q&A question not found" });
        }

        const keywords = question.motsClés || [];
        const isCorrect = keywords.length > 0 ? keywords.every(keyword => studentAnswer.toLowerCase().includes(keyword.toLowerCase())) : false;

        res.json({ correct: isCorrect });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};