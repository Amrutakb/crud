import React, { useState, useEffect } from 'react';
import { useParams,  Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';



const Edit = () => {
  const { semesterNumber, courseCode } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState({
    course_code: '',
    course_name: '',
    category: '',
    credit_hours: { lectures: 0, tutorials: 0, practicals: 0 },
    credits: 0,
    contact_hours: 0,
    isa_esa_duration: { ISA: 0, ESA: 0, Total: 0, Exam_Duration: '' }
  });

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/getSchemeBySemester`, {
          params: { semesterNumber: semesterNumber }
        });
        const courseToEdit = response.data.courses.find(c => c.course_code === courseCode);
    
        if (courseToEdit) {
          setCourse(courseToEdit);
        } else {
          // Handle case when course is not found
          console.error('Course not found');
          toast.error('Course not found');
          navigate('/'); // Redirect to home or error page
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
        toast.error('Error fetching course data');
      }
    };
    

    fetchCourseData();
  }, [semesterNumber, courseCode]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name.includes('.')) {
      const [mainField, subField] = name.split('.');
      setCourse(prev => ({
        ...prev,
        [mainField]: { ...prev[mainField], [subField]: value }
      }));
    } else {
      setCourse({ ...course, [name]: value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Updating Course:', course); // Debugging line
  
    try {
      const response = await axios.put(`http://localhost:8001/api/editCourse/${semesterNumber}/${courseCode}`, course);
      console.log('Update Response:', response); // Debugging line
      toast.success('Course updated successfully');
      navigate('/');
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Error updating course');
    }
  };
  
  
  return (
    <div className="editCourse">
      <Link to="/">Back to Courses</Link>
      <h3>Edit Course</h3>
      <form onSubmit={handleSubmit}>
        {/* Course Code */}
        <div>
          <label>Course Code:</label>
          <input
            type="text"
            name="course_code"
            value={course.course_code}
            onChange={handleChange}
          />
        </div>

        {/* Course Name */}
        <div>
          <label>Course Name:</label>
          <input
            type="text"
            name="course_name"
            value={course.course_name}
            onChange={handleChange}
          />
        </div>

        {/* Category */}
        <div>
          <label>Category:</label>
          <input
            type="text"
            name="category"
            value={course.category}
            onChange={handleChange}
          />
        </div>

        {/* Credit Hours */}
        <div>
          <label>Lectures:</label>
          <input
            type="number"
            name="credit_hours.lectures"
            value={course.credit_hours.lectures}
            onChange={handleChange}
          />
          <label>Tutorials:</label>
          <input
            type="number"
            name="credit_hours.tutorials"
            value={course.credit_hours.tutorials}
            onChange={handleChange}
          />
          <label>Practicals:</label>
          <input
            type="number"
            name="credit_hours.practicals"
            value={course.credit_hours.practicals}
            onChange={handleChange}
          />
        </div>

        {/* Credits and Contact Hours */}
        <div>
          <label>Credits:</label>
          <input
            type="number"
            name="credits"
            value={course.credits}
            onChange={handleChange}
          />
          <label>Contact Hours:</label>
          <input
            type="number"
            name="contact_hours"
            value={course.contact_hours}
            onChange={handleChange}
          />
        </div>

        {/* ISA and ESA Duration */}
        <div>
          <label>ISA:</label>
          <input
            type="number"
            name="isa_esa_duration.ISA"
            value={course.isa_esa_duration.ISA}
            onChange={handleChange}
          />
          <label>ESA:</label>
          <input
            type="number"
            name="isa_esa_duration.ESA"
            value={course.isa_esa_duration.ESA}
            onChange={handleChange}
          />
          <label>Total:</label>
          <input
            type="number"
            name="isa_esa_duration.Total"
            value={course.isa_esa_duration.Total}
            onChange={handleChange}
          />
          <label>Exam Duration:</label>
          <input
            type="text"
            name="isa_esa_duration.Exam_Duration"
            value={course.isa_esa_duration.Exam_Duration}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Update Course</button>
      </form>
    </div>
  );
};

export default Edit;