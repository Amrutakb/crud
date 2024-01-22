import { Scheme } from "../model/model1.js";
import { Syllabus } from "../model/model1.js";



// Display the entire scheme for a given semester
export const getSchemeBySemester = async (req, res) => {
    try {
        const { semesterNumber } = req.query;
        const scheme = await Scheme.findOne({ semester: semesterNumber });

        if (!scheme) {
            return res.status(404).json({ msg: "Scheme for the specified semester not found" });
        }

        res.status(200).json(scheme);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add a new course to an existing semester
export const addCourse = async (req, res) => {
    try {
        const { semesterNumber } = req.params;
        const newCourse = req.body;

        const scheme = await Scheme.findOneAndUpdate(
            { semester: semesterNumber },
            { $push: { courses: newCourse } },
            { new: true }
        );

        if (!scheme) {
            return res.status(404).json({ msg: "Semester not found" });
        }

        res.status(200).json({ msg: "Course added successfully", updatedScheme: scheme });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Edit a course in a semester
export const editCourse = async (req, res) => {
    try {
        console.log(req.body); // Log received data
        const { semesterNumber, courseCode } = req.params;
        const courseUpdates = req.body;

        // Fetch the scheme first
        let scheme = await Scheme.findOne({ semester: semesterNumber });
        
        if (!scheme) {
            return res.status(404).json({ msg: "Semester not found" });
        }

        // Find the index of the course within the courses array
        const courseIndex = scheme.courses.findIndex(course => course.course_code === courseCode);

        if (courseIndex === -1) {
            return res.status(404).json({ msg: "Course not found" });
        }

        // Update the course with the provided changes
        scheme.courses[courseIndex] = { ...scheme.courses[courseIndex], ...courseUpdates };

        // Save the updated scheme
        scheme = await scheme.save();

        res.status(200).json({ msg: "Course updated successfully", updatedScheme: scheme });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Delete a course in the semester
export const deleteCourse = async (req, res) => {
    try {
        const { semesterNumber, courseCode } = req.params;

        // Find the scheme with the given semester and remove the course with the given course code
        const scheme = await Scheme.findOneAndUpdate(
            { semester: semesterNumber },
            { $pull: { courses: { course_code: courseCode } } },
            { new: true }
        );

        if (!scheme) {
            return res.status(404).json({ msg: "Semester not found or course not present in the semester" });
        }

        res.status(200).json({ msg: "Course deleted successfully", updatedScheme: scheme });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Fetch the entire syllabus for a given semester
export const getSyllabusBySemester = async (req, res) => {
    try {
        const { semesterNumber } = req.query;
        const syllabus = await Syllabus.findOne({ semester: semesterNumber });

        if (!syllabus) {
            return res.status(404).json({ msg: "Syllabus for the specified semester not found" });
        }

        res.status(200).json(syllabus);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Edit and update the syllabus for a given course in a semester
export const editSyllabus = async (req, res) => {
    try {
        console.log(req.body); // Log received data
        const { semesterNumber, courseCode } = req.params;
        const syllabusUpdates = req.body;

        // Fetch the syllabus first
        let syllabus = await Syllabus.findOne({ semester: semesterNumber });

        if (!syllabus) {
            return res.status(404).json({ msg: "Syllabus for the specified semester not found" });
        }

        // Find the index of the course within the courses array
        const courseIndex = syllabus.courses.findIndex(course => course.course_code === courseCode);

        if (courseIndex === -1) {
            return res.status(404).json({ msg: "Course not found in the syllabus" });
        }

        // Include `course_name` and `course_code` in the update
        const { ...remainingUpdates } = syllabusUpdates;

        // Update the course syllabus with the provided changes
        syllabus.courses[courseIndex] = { ...syllabus.courses[courseIndex], ...remainingUpdates };

        // Save the updated syllabus
        syllabus = await syllabus.save();

        res.status(200).json({ msg: "Syllabus updated successfully", updatedSyllabus: syllabus });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};