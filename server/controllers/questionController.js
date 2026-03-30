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
    console.log('🔍 getAllQuestions controller called');
    console.time('questions-query');
    
    const questions = await Question.find()
      .sort({ createdAt: -1 })
      .populate('author', 'name avatar')
      .populate('answers.author', 'name avatar')
      .maxTimeMS(30000);  // 30 second timeout for this query
    
    console.timeEnd('questions-query');
    console.log(`✅ Found ${questions.length} questions`);
    res.json(questions);
  } catch (err) {
    console.error('❌ getAllQuestions error:', err.message);
    console.error('Error name:', err.name);
    res.status(500).json({ 
      error: 'Server error', 
      message: err.message,
      type: err.name
    });
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

exports.upvoteAnswer = async (req, res) => {
  try {
    const { answerIndex } = req.body;
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }

    if (answerIndex < 0 || answerIndex >= question.answers.length) {
      return res.status(400).json({ msg: 'Answer not found' });
    }

    const answer = question.answers[answerIndex];

    // Check if already upvoted
    if (answer.upvotes.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Answer already upvoted' });
    }

    answer.upvotes.push(req.user.id);
    await question.save();

    // Award 2 points to answer author
    await User.findByIdAndUpdate(answer.author, {
      $inc: { points: 2 }
    });

    console.log(`⭐ User ${answer.author} earned 2 points for answer upvote`);
    res.json(question.answers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.acceptAnswer = async (req, res) => {
  try {
    const { answerIndex } = req.body;
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }

    // Only question author can accept answer
    if (question.author.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Only question author can accept answer' });
    }

    if (answerIndex < 0 || answerIndex >= question.answers.length) {
      return res.status(400).json({ msg: 'Answer not found' });
    }

    const answer = question.answers[answerIndex];

    // Check if already accepted
    if (answer.isAccepted) {
      return res.status(400).json({ msg: 'Answer already accepted' });
    }

    answer.isAccepted = true;
    await question.save();

    // Award 25 points to answer author (accepted answer)
    await User.findByIdAndUpdate(answer.author, {
      $inc: { points: 25 }
    });

    // Award 5 bonus points to question author for accepting answer
    await User.findByIdAndUpdate(question.author, {
      $inc: { points: 5 }
    });

    console.log(`✅ Answer accepted! ${answer.author} earned 25 points, ${question.author} earned 5 bonus points`);
    res.json(question.answers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
