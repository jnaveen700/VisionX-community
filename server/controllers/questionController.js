const Question = require('../models/Question');
const User = require('../models/User');

exports.createQuestion = async (req, res) => {
  try {
    const { title, body, tags } = req.body;

    const question = new Question({
      title,
      body,
      tags,
      author: req.user.id
    });

    await question.save();

    // Add points to user for asking a question
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { points: 5 }
    });

    res.json(question);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .sort({ createdAt: -1 })
      .populate('author', 'name avatar')
      .populate('answers.author', 'name avatar');
    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('author', 'name avatar')
      .populate('answers.author', 'name avatar');
    
    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }

    // Increment view count
    question.views += 1;
    await question.save();

    res.json(question);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Question not found' });
    }
    res.status(500).send('Server error');
  }
};

exports.addAnswer = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }

    const newAnswer = {
      body: req.body.body,
      author: req.user.id
    };

    question.answers.unshift(newAnswer);
    await question.save();

    // Add points to user for answering
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { points: 10 }
    });

    res.json(question.answers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.upvoteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }

    // Check if already upvoted
    if (question.upvotes.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Question already upvoted' });
    }

    question.upvotes.push(req.user.id);
    await question.save();

    // Add points to question author
    await User.findByIdAndUpdate(question.author, {
      $inc: { points: 2 }
    });

    res.json(question.upvotes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
