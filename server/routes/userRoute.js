import express from "express";
import { getLTP, getTopic, getCOPO, updateLTP, updateTopic, updateCOPO,getChangeSummary, updateChangeSummary } from "../controller/controller.js";
import { getSchemeBySemester, addCourse, editCourse, deleteCourse ,getSyllabusBySemester,editSyllabus } from "../controller/controller1.js";

const router = express.Router();

// Get LTP data based on course code
router.get("/structure/get-ltp", getLTP);

// Get topic data based on course code
router.get("/structure/get-topic", getTopic);

// Get CO-PO mapping and performance indicators based on course code
router.get("/structure/get-copo", getCOPO);

// Update LTP values based on course code
router.put("/structure/update-ltp/:courseCode", updateLTP);

// Update topics and their content based on course code
router.put("/structure/update-topic/:courseCode/:unitNumber", updateTopic);


// Update CO, CO-PO mapping, and performance indicators based on course code
router.put("/structure/update-copo/:courseCode", updateCOPO);

// Get Change Summary data based on course code
router.get("/structure/get-change-summary", getChangeSummary);

// Update Change Summary data based on course code
router.put("/structure/update-ChangeSummary/:courseCode", updateChangeSummary);






// Route to get the entire scheme for a given semester
router.get("/getSchemeBySemester", getSchemeBySemester);

// Route to add a new course to an existing semester
router.post("/addCourse/:semesterNumber", addCourse);

// Route to edit a course in a semester
router.put("/editCourse/:semesterNumber/:courseCode", editCourse);

// Route to delete a course in a semester
router.delete("/deleteCourse/:semesterNumber/:courseCode", deleteCourse);

router.get("/getSyllabusBySemester", getSyllabusBySemester);
router.put("/editSyllabus/:semesterNumber/:courseCode", editSyllabus);



export default router;
