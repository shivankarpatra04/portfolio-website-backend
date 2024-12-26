const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: String,
    description: String,
    category: String,
    imageUrl: String,
    videoUrl: String,  // Already added
    link: String,
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    frontendGithubLink: { type: String, default: null }, // GitHub link for frontend, can be null
    backendGithubLink: { type: String, default: null },  // GitHub link for backend, can be null
    projectDescription: { type: String, default: "" }   // Additional description of the project
});

module.exports = mongoose.model('Project', ProjectSchema);
