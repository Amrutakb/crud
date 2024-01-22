// models.js
import mongoose from 'mongoose';

const creditHoursSchema = new mongoose.Schema({
    lectures: Number,
    tutorials: Number,
    labs: Number
});

const structureCourseSchema = new mongoose.Schema({
    course_code: {
        type: String,
        required: true
    },
    course_name: {
        type: String,
        required: true
    },
    credit_hours: creditHoursSchema
});

const structureSchema = new mongoose.Schema({
    semester: {
        type: Number,
        required: true
    },
    courses: [structureCourseSchema],
    credits: Number
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


const courseSchema = new mongoose.Schema({
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


const semesterSchema = new mongoose.Schema({
    semester: {
        type: Number,
        required: true
    },
    courses: [courseSchema]
});

const POValueSchema = new mongoose.Schema({
    PO1: { type: String, enum: ['H', 'M', 'L'], default: null },
    PO2: { type: String, enum: ['H', 'M', 'L'], default: null },
    PO3: { type: String, enum: ['H', 'M', 'L'], default: null },
    PO4: { type: String, enum: ['H', 'M', 'L'], default: null },
    PO5: { type: String, enum: ['H', 'M', 'L'], default: null },
    PO6: { type: String, enum: ['H', 'M', 'L'], default: null },
    PO7: { type: String, enum: ['H', 'M', 'L'], default: null },
    PO8: { type: String, enum: ['H', 'M', 'L'], default: null },
    PO9: { type: String, enum: ['H', 'M', 'L'], default: null },
    PO10: { type: String, enum: ['H', 'M', 'L'], default: null },
    PO11: { type: String, enum: ['H', 'M', 'L'], default: null },
    PO12: { type: String, enum: ['H', 'M', 'L'], default: null },
    PO13: { type: String, enum: ['H', 'M', 'L'], default: null },
    PO14: { type: String, enum: ['H', 'M', 'L'], default: null },
}, { _id: false });

const COPOMappingSchema = new mongoose.Schema({
    course_code: {
        type: String,
        required: true,
    },
   
    CO: {
        type: String,
        required: true,
    },
    CO_PO_Mapping: [{
        CO_Number: String,
        Values: POValueSchema
    }],
    PerformanceIndicator: {
        type: String,
        required: true
    },
    activity: {
        type: [String],
        required: true
    },
    rubrics: {
        type: [String],
        required: true
    },
    delivery: {
        type: [String],
        required: true
    },
    course_name: {
        type: String,
        required: true,
    }
});



// Reusing existing Schemas
const ValueSchema = new mongoose.Schema({
    PO1: { type: String, enum: ['H', 'M', 'L'], default: null },
    PO2: { type: String, enum: ['H', 'M', 'L'], default: null },
    PO3: { type: String, enum: ['H', 'M', 'L'], default: null },
    PO4: { type: String, enum: ['H', 'M', 'L'], default: null },
    PO5: { type: String, enum: ['H', 'M', 'L'], default: null },
    PO6: { type: String, enum: ['H', 'M', 'L'], default: null },
    PO7: { type: String, enum: ['H', 'M', 'L'], default: null },
    PO8: { type: String, enum: ['H', 'M', 'L'], default: null },
    PO9: { type: String, enum: ['H', 'M', 'L'], default: null },
    PO10: { type: String, enum: ['H', 'M', 'L'], default: null },
    PO11: { type: String, enum: ['H', 'M', 'L'], default: null },
    PO12: { type: String, enum: ['H', 'M', 'L'], default: null },
    PO13: { type: String, enum: ['H', 'M', 'L'], default: null },
    PO14: { type: String, enum: ['H', 'M', 'L'], default: null },
}, { _id: false });

const topic = new mongoose.Schema({
    topic_number: Number,
    topic_name: String,
    content: String,
    hours: String
});


const LTPSchema = new mongoose.Schema({
    lectures: Number,
    tutorials: Number,
    practicals: Number
}, { _id: false });


const changeSummarySchema = new mongoose.Schema({
    course_code: {
        type: String,
        required: true
    },
    ltp: LTPSchema,
   
    co_po_mapping: [{
        co: [String],
        CO_Number: String,
        Values: ValueSchema,
        performance_indicator: String,
        activity: [String],
        rubrics: [String],
        delivery: [String]
    }],
   
   topics: [topic],
    
});

// Change Summary Model
export const ChangeSummary = mongoose.model("ChangeSummary", changeSummarySchema, "ChangeSummary");

export const Structures = mongoose.model("Structures", structureSchema, "Structures");
export const Syllabus = mongoose.model("Syllabus", semesterSchema, "Syllabus");
export const COPO = mongoose.model("COPO", COPOMappingSchema, "COPO");
