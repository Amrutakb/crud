import { Structures, Syllabus, COPO , ChangeSummary } from "../model/model.js";


// Get LTP values based on course code
export const getLTP = async (req, res) => {
    try {
        const { courseCode } = req.query;

        // Find the course by course code in the Structures model
        const structure = await Structures.findOne({ "courses.course_code": courseCode });

        if (!structure) {
            return res.status(404).json({ msg: "Course not found" });
        }

        const course = structure.courses.find(course => course.course_code === courseCode);
        const { lectures, tutorials, labs } = course.credit_hours;
        res.status(200).json({ lectures, tutorials, labs });
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

// Get topic names and their contents based on course code
export const getTopic = async (req, res) => {
    try {
        const { courseCode } = req.query;

        // Find the course by course code in the Syllabus model
        const syllabus = await Syllabus.findOne({ "courses.course_code": courseCode });

        if (!syllabus) {
            return res.status(404).json({ msg: "Course not found" });
        }

        const course = syllabus.courses.find(course => course.course_code === courseCode);
        
        // Aggregate topics from all units
        const topics = course.units.flatMap(unit => unit.topics).map(topic => ({
            
            topic_number: topic.topic_number,
            topic_name: topic.topic_name,
            content: topic.content,
            hours: topic.hours
        }));

        res.status(200).json(topics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getCOPO = async (req, res) => {
    try {
        const { courseCode } = req.query;

        const copo = await COPO.findOne({ course_code: courseCode });
        if (!copo) {
            return res.status(404).json({ msg: "CO-PO mapping not found" });
        }

        const {course_name, CO, CO_PO_Mapping, PerformanceIndicator , activity, rubrics, delivery} = copo;
        res.status(200).json({course_name, CO,  CO_PO_Mapping, PerformanceIndicator , activity, rubrics, delivery });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update LTP values based on course code
export const updateLTP = async (req, res) => {
    try {
        const { courseCode } = req.params; // Extract courseCode from URL
        const { lectures, tutorials, labs } = req.body;

        // Find and update the course by course code in the Structures model
        const result = await Structures.findOneAndUpdate(
            { "courses.course_code": courseCode },
            { $set: { "courses.$.credit_hours": { lectures, tutorials, labs } } },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ msg: "Course not found" });
        }

        res.status(200).json({ msg: "LTP values updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateTopic = async (req, res) => {
    try {
        const { courseCode, unitNumber } = req.params; // Extract courseCode and unitNumber from URL
        const { topics } = req.body; // New topics for the specified unit
        const parsedUnitNumber = parseInt(unitNumber); // Parse unitNumber to integer

        // Find the course by course code
        const syllabus = await Syllabus.findOne({ "courses.course_code": courseCode });

        if (!syllabus) {
            return res.status(404).json({ msg: "Course not found" });
        }

        // Find the specific course and unit to update
        const course = syllabus.courses.find(course => course.course_code === courseCode);
        const unit = course.units.find(unit => unit.unit_number === parsedUnitNumber);

        if (!unit) {
            return res.status(404).json({ msg: "Unit not found" });
        }

        // Update the topics in the specified unit
        unit.topics = topics;

        // Save the updated syllabus
        const result = await syllabus.save();

        res.status(200).json({ msg: "Topics updated successfully", updatedCourse: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Update CO, CO-PO mapping, and performance indicators based on course code
export const updateCOPO = async (req, res) => {
    try {
        const { courseCode } = req.params; // Extract courseCode from URL
        const { CO, CO_PO_Mapping, PerformanceIndicator , activity, rubrics, delivery} = req.body;

        // Find and update the COPO document by course code in the COPO model
        const result = await COPO.findOneAndUpdate(
            { course_code: courseCode },
            { CO, CO_PO_Mapping, PerformanceIndicator, activity, rubrics, delivery },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ msg: "CO-PO mapping not found" });
        }

        res.status(200).json({ msg: "CO-PO mapping and Performance Indicators updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get Change Summary based on course code
export const getChangeSummary = async (req, res) => {
    try {
        const { courseCode } = req.query;

        const changeSummary = await ChangeSummary.findOne({ course_code: courseCode });
        if (!changeSummary) {
            return res.status(404).json({ msg: "Change summary not found" });
        }

        res.status(200).json(changeSummary);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Update Change Summary based on course code
export const updateChangeSummary = async (req, res) => {
    try {
        const { courseCode } = req.params;
        const updateData = req.body;

        const existingChangeSummary = await ChangeSummary.findOne({ course_code: courseCode });

        if (!existingChangeSummary) {
            return res.status(404).json({ msg: "Change summary not found" });
        }

        // Update each field of the existingChangeSummary with corresponding values from updateData
        existingChangeSummary.ltp = updateData.ltp;
        existingChangeSummary.topics = updateData.topics;
        existingChangeSummary.co_po_mapping = updateData.copo;
        // Update other fields as needed based on your schema

        await existingChangeSummary.save();

        res.status(200).json({ msg: "Change summary updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

