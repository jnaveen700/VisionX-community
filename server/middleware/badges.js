const User = require('../models/User');

const checkBadges = async (userId) => {
  const user = await User.findById(userId);
  const newBadges = [];

  // Get user's questions and answers count
  const Question = require('../models/Question');
  const questionsCount = await Question.countDocuments({ author: userId });
  const answersCount = await Question.countDocuments({ 'answers.author': userId });

  // First Question Badge
  if (questionsCount === 1 && !user.badges.some(b => b.name === 'First Question')) {
    newBadges.push({
      name: 'First Question',
      earnedAt: Date.now()
    });
  }

  // Helpful Badge
  if (answersCount >= 5 && !user.badges.some(b => b.name === 'Helpful')) {
    newBadges.push({
      name: 'Helpful',
      earnedAt: Date.now()
    });
  }

  // Expert Badge
  if (user.points >= 1000 && !user.badges.some(b => b.name === 'Expert')) {
    newBadges.push({
      name: 'Expert',
      earnedAt: Date.now()
    });
  }

  // Project Master Badge
  const Project = require('../models/Project');
  const projectsCount = await Project.countDocuments({ author: userId });
  if (projectsCount >= 3 && !user.badges.some(b => b.name === 'Project Master')) {
    newBadges.push({
      name: 'Project Master',
      earnedAt: Date.now()
    });
  }

  // Add new badges if any
  if (newBadges.length > 0) {
    await User.findByIdAndUpdate(userId, {
      $push: { badges: { $each: newBadges } }
    });
  }

  return newBadges;
};

module.exports = checkBadges;
