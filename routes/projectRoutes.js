const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const Project = require("../models/Project");

// Set up Multer for file uploads
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Create Project with File Upload
router.post("/", upload.fields([{ name: "imageFile" }, { name: "videoFile" }]), async (req, res) => {
    try {
        const { title, link, frontendRepo, backendRepo, projectDescription } = req.body;

        let imageUrl = null;
        let videoUrl = null;

        // Upload Image to Cloudinary
        if (req.files["imageFile"]) {
            const imageResult = await cloudinary.uploader.upload(req.files["imageFile"][0].path, {
                resource_type: "image",
                folder: "portfolio_projects",
            });
            imageUrl = imageResult.secure_url;
        }

        // Upload Video to Cloudinary
        if (req.files["videoFile"]) {
            const videoResult = await cloudinary.uploader.upload(req.files["videoFile"][0].path, {
                resource_type: "video",
                folder: "portfolio_projects",
            });
            videoUrl = videoResult.secure_url;
        }

        // Save to MongoDB
        const newProject = new Project({
            title,
            link,
            imageUrl,
            videoUrl,
            frontendGithubLink: frontendRepo || null,
            backendGithubLink: backendRepo || null,
            projectDescription: projectDescription || "",
        });

        await newProject.save();
        res.status(201).json({ message: "Project created successfully!", newProject });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error uploading project", error });
    }
});

// Get All Projects
router.get("/", async (req, res) => {
    const projects = await Project.find();
    res.json(projects);
});

// Update Project with File Uploads
router.put("/:id", upload.fields([{ name: "imageFile" }, { name: "videoFile" }]), async (req, res) => {
    try {
        const { title, link, frontendRepo, backendRepo, projectDescription } = req.body;
        const projectId = req.params.id;

        let project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ message: "Project not found" });

        // Upload New Image to Cloudinary (if provided)
        if (req.files["imageFile"]) {
            const imageResult = await cloudinary.uploader.upload(req.files["imageFile"][0].path, {
                resource_type: "image",
                folder: "portfolio_projects",
            });
            project.imageUrl = imageResult.secure_url;
        }

        // Upload New Video to Cloudinary (if provided)
        if (req.files["videoFile"]) {
            const videoResult = await cloudinary.uploader.upload(req.files["videoFile"][0].path, {
                resource_type: "video",
                folder: "portfolio_projects",
            });
            project.videoUrl = videoResult.secure_url;
        }

        // Update Other Project Details
        project.title = title || project.title;
        project.link = link || project.link;
        project.frontendGithubLink = frontendRepo || project.frontendGithubLink;
        project.backendGithubLink = backendRepo || project.backendGithubLink;
        project.projectDescription = projectDescription || project.projectDescription;

        // Save Updated Project
        await project.save();
        res.status(200).json({ message: "Project updated successfully!", project });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating project", error });
    }
});

// Delete Project
router.delete("/:id", async (req, res) => {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted successfully" });
});

module.exports = router;
