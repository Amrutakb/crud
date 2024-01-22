import mongoose from 'mongoose';

// Schema for Credit Hours
const creditHoursSchema = new mongoose.Schema({
    lectures: Number,
    tutorials: Number,
    practicals: Number
});

// Schema for ISA and ESA Duration
const isaEsaDurationSchema = new mongoose.Schema({
    ISA: Number,
    ESA: Number,
    Total: Number,
    Exam_Duration: String
});

// Schema for Course
const courseSchema = new mongoose.Schema({
    course_code: String,
    course_name: String,
    category: String,
    credit_hours: creditHoursSchema,
    credits: Number,
    contact_hours: Number,
    isa_esa_duration: isaEsaDurationSchema
});

// Schema for Semester
const semesterSchema = new mongoose.Schema({
    semester: Number,
    courses: [courseSchema],
    total_credits: Number,
    total_contact_hours: Number,
    total_ISA: Number,
    total_ESA: Number,
    total: Number
});

const topicSchema = new mongoose.Schema({
    topic_number: Number,
    topic_name: String,
    content: String,
    hours: String
});

const unitSchema = new mongoose.Schema({
    unit_number: Number,
    topics: [topicSchema]
});


const syllabuscourseSchema = new mongoose.Schema({
    course_code: {
        type: String,
        required: true
    },
    course_name: {
        type: String,
        required: true
    },
    units: [unitSchema],
    text_books: [String],
    reference_books: [String]
});


const syllabusSchema = new mongoose.Schema({
    semester: {
        type: Number,
        required: true
    },
    courses: [syllabuscourseSchema]
});

// Create the model from the schema
export const Scheme = mongoose.model("Scheme", semesterSchema, "Scheme");
export const Syllabus = mongoose.model("syllabus", syllabusSchema, "Syllabus");