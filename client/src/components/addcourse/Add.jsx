// Add.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


const Add = () => {
  const navigate = useNavigate();
  const [newCourse, setNewCourse] = useState({
    course_code: '',
    course_name: '',
    category: '',
    credit_hours: { lectures: 0, tutorials: 0, practicals: 0 },
    credits: 0,
    contact_hours: 0,
    isa_esa_duration: { ISA: 0, ESA: 0, Total: 0, Exam_Duration: '' }
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name.includes('.')) {
      const [mainField, subField] = name.split('.');
      setNewCourse((prev) => ({
        ...prev,
        [mainField]: { ...prev[mainField], [subField]: value }
      }));
    } else {
      setNewCourse({ ...newCourse, [name]: value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Adding Course:', newCourse); // Debugging line

    try {
      const { semesterNumber } = newCourse; // Assuming semesterNumber is available
      const response = await axios.post(`http://localhost:8000/api/addCourse/${semesterNumber}`, newCourse);
      console.log('Add Course Response:', response); // Debugging line
      toast.success('Course added successfully');
      navigate('/');
    } catch (error) {
      console.error('Error adding course:', error);
      toast.error('Error adding course');
    }
  };

  return (
    <div className="addCourse">
      <Link to="/">Back to Courses</Link>
      <h3>Add New Course</h3>
      <form onSubmit={handleSubmit}>
        {/* Semester Number */}
        <div>
          <label>Semester Number:</label>
          <input
            type="number"
            name="semesterNumber"
            value={newCourse.semesterNumber}
            onChange={handleChange}
          />
        </div>

        {/* Course Code */}
        <div>
          <label>Course Code:</label>
          <input
            type="text"
            name="course_code"
            value={newCourse.course_code}
            onChange={handleChange}
          />
        </div>

        {/* Course Name */}
        <div>
          <label>Course Name:</label>
          <input
            type="text"
            name="course_name"
            value={newCourse.course_name}
            onChange={handleChange}
          />
        </div>

        {/* Category */}
        <div>
          <label>Category:</label>
          <input
            type="text"
            name="category"
            value={newCourse.category}
            onChange={handleChange}
          />
        </div>

        {/* Credit Hours */}
        <div>
          <label>Lectures:</label>
          <input
            type="number"
            name="credit_hours.lectures"
            value={newCourse.credit_hours.lectures}
            onChange={handleChange}
          />
          <label>Tutorials:</label>
          <input
            type="number"
            name="credit_hours.tutorials"
            value={newCourse.credit_hours.tutorials}
            onChange={handleChange}
          />
          <label>Practicals:</label>
          <input
            type="number"
            name="credit_hours.practicals"
            value={newCourse.credit_hours.practicals}
            onChange={handleChange}
          />
        </div>

        {/* Credits and Contact Hours */}
        <div>
          <label>Credits:</label>
          <input
            type="number"
            name="credits"
            value={newCourse.credits}
            onChange={handleChange}
          />
          <label>Contact Hours:</label>
          <input
            type="number"
            name="contact_hours"
            value={newCourse.contact_hours}
            onChange={handleChange}
          />
        </div>

        {/* ISA and ESA Duration */}
        <div>
          <label>ISA:</label>
          <input
            type="number"
            name="isa_esa_duration.ISA"
            value={newCourse.isa_esa_duration.ISA}
            onChange={handleChange}
          />
          <label>ESA:</label>
          <input
            type="number"
            name="isa_esa_duration.ESA"
            value={newCourse.isa_esa_duration.ESA}
            onChange={handleChange}
          />
          <label>Total:</label>
          <input
            type="number"
            name="isa_esa_duration.Total"
            value={newCourse.isa_esa_duration.Total}
            onChange={handleChange}
          />
          <label>Exam Duration:</label>
          <input
            type="text"
            name="isa_esa_duration.Exam_Duration"
            value={newCourse.isa_esa_duration.Exam_Duration}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Add Course</button>
      </form>
    </div>
  );
};

export default Add;