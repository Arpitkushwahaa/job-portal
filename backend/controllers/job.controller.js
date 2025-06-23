import { Job } from "../models/job.model.js";

// admin post krega job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "All fields are required. Please check your input.",
                success: false
            });
        }
        
        // Create job with proper validation and type conversion
        const job = await Job.create({
            title,
            description,
            requirements: typeof requirements === 'string' ? requirements.split(",") : requirements,
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: Number(experience),
            position: Number(position),
            company: companyId,
            created_by: userId
        });
        
        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.error("Job creation error:", error);
        return res.status(500).json({
            message: error.message || "Failed to create job",
            success: false
        });
    }
}
// student k liye
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };
        
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });
        
        if (!jobs || jobs.length === 0) {
            return res.status(404).json({
                message: "No jobs found matching your criteria.",
                success: false
            });
        }
        
        return res.status(200).json({
            jobs,
            success: true
        });
    } catch (error) {
        console.error("Get all jobs error:", error);
        return res.status(500).json({
            message: error.message || "Failed to fetch jobs",
            success: false
        });
    }
}
// student
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        
        // Basic job data for all users (authenticated or not)
        let job = await Job.findById(jobId).populate({
            path: "company"
        });
        
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }
        
        // If user is authenticated, also include applications data
        if (req.id) {
            // User is authenticated, include applications data
            job = await Job.findById(jobId)
                .populate({
                    path: "applications"
                })
                .populate({
                    path: "company"
                });
        } else {
            // For non-authenticated users, provide an empty applications array
            job = job.toObject();
            job.applications = [];
        }
        
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.error("Get job by ID error:", error);
        return res.status(500).json({
            message: error.message || "Failed to fetch job",
            success: false
        });
    }
}
// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path:'company',
            createdAt:-1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.error("Get admin jobs error:", error);
        return res.status(500).json({
            message: error.message || "Failed to fetch admin jobs",
            success: false
        });
    }
}
