const Project = require('../models/Project');
const User = require('../models/User');

exports.createProject = async (req, res) => {
  try {
    const { title, description, githubLink, techStack, liveLink } = req.body;

    const project = new Project({
      title,
      description,
      githubLink,
      techStack,
      liveLink,
      author: req.user.id
    });

    await project.save();

    // Add points to user for sharing a project
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { points: 15 }
    });

    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .sort({ createdAt: -1 })
      .populate('author', 'name avatar');
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('author', 'name avatar')
      .populate('comments.author', 'name avatar');
    
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    res.json(project);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.status(500).send('Server error');
  }
};

exports.addComment = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    const newComment = {
      body: req.body.body,
      author: req.user.id
    };

    project.comments.unshift(newComment);
    await project.save();

    // Add points for commenting
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { points: 2 }
    });

    res.json(project.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.likeProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    // Check if already liked
    if (project.likes.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Project already liked' });
    }

    project.likes.push(req.user.id);
    await project.save();

    // Add points to project author
    await User.findByIdAndUpdate(project.author, {
      $inc: { points: 3 }
    });

    res.json(project.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
