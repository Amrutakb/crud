import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
// eslint-disable-next-line
import html2pdf from 'html2pdf.js';


const User = () => {
  const [courses, setCourses] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(3); // Default to the 3rd semester
  const [selectedType, setSelectedType] = useState("Scheme");

  const fetchCourses = async (semester) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/getSchemeBySemester?semesterNumber=${semester}`);
      console.log('Response:', response.data);

      if (response.data.courses && response.data.courses.length > 0) {
        setCourses(response.data.courses);
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleSemesterChange = (event) => {
    const selectedSemester = parseInt(event.target.value, 10);
    setSelectedSemester(selectedSemester);
  };

  const handleTypeChange = (event) => {
    const selectedType = event.target.value;
    setSelectedType(selectedType);

    // Redirect to the appropriate route based on the selected type
    if (selectedType === "syllabus") {
      // Redirect to the "/syllabus" route
      window.location.href = "/syllabus"; // You can use React Router's Link here if you're using BrowserRouter
    }
  };

  useEffect(() => {
    fetchCourses(selectedSemester);
  }, [selectedSemester]);

  const deleteCourse = async (courseCode) => {
    try {
      // Show a confirmation prompt before deleting
      const userConfirmed = window.confirm("Are you sure you want to delete this course?");

      if (!userConfirmed) {
        // If the user cancels the deletion, do nothing
        return;
      }

      console.log('Deleting course:', courseCode, selectedType);

      // Assuming courseCode and selectedType are available
      const response = await axios.delete(`http://localhost:8001/api/deleteCourse/${selectedSemester}/${courseCode}`);

      // Log the response from the server
      console.log('Delete Course Response:', response.data);

      // Handle success (e.g., redirect or display a success message)
      toast.success(`${selectedType} deleted successfully`, { position: "top-right" });

      // Fetch courses again to update the list after deletion
      fetchCourses(selectedSemester);
    } catch (error) {
      // Handle error
      console.error('Error deleting course:', error);
      toast.error("Error deleting course", { position: "top-right" });
    }
  };

  const downloadPDF = () => {
    // Configuration for html2pdf
    const pdfOptions = {
      margin: 10,
      filename: 'course_table.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
  
    // Element to be converted to PDF
    const element = document.getElementById('courseTable');
  
    // Remove the last column from the table
    const lastColumnIndex = element.rows[0].cells.length - 1;
    for (let i = 0; i < element.rows.length; i++) {
      element.rows[i].deleteCell(lastColumnIndex);
    }
  
    // Generate PDF after a short delay to ensure full rendering
    setTimeout(() => {
      // Generate PDF
      html2pdf(element, pdfOptions);
  
      // Restore the last column after generating PDF
      for (let i = 0; i < element.rows.length; i++) {
        const cell = element.rows[i].insertCell(lastColumnIndex);
        cell.style.display = 'none'; // Hide the cell
      }
    }, 1000); // Adjust the delay as needed
  };
  
  
  
  
  return (
    <div className="userTable">
      <div>
        <label htmlFor="semester">Select Semester:</label>
        <select id="semester" value={selectedSemester} onChange={handleSemesterChange}>
          <option value={3}>Semester 3</option>
          <option value={4}>Semester 4</option>
          <option value={5}>Semester 5</option>
          <option value={6}>Semester 6</option>
          <option value={7}>Semester 7</option>
          <option value={8}>Semester 8</option>
        </select>
        <label htmlFor="type">Select Type:</label>
        <select id="type" value={selectedType} onChange={handleTypeChange}>
          <option value="scheme">Scheme</option>
          <option value="syllabus">Syllabus</option>
        </select>
      </div>
      <Link to="/add" className="addButton">
        Add course
      </Link>
      <button onClick={downloadPDF} className="downloadButton">
        Download as PDF
      </button>
      <table id="courseTable" border={1} cellPadding={10} cellSpacing={0}>
        {/* Table headers */}
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Name</th>
            <th>Category</th>
            <th>Lectures</th>
            <th>Tutorials</th>
            <th>Practicals</th>
            <th>Credits</th>
            <th>Contact Hours</th>
            <th>ISA</th>
            <th>ESA</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        {/* Table body */}
        <tbody>
          {courses.length > 0 ? (
            courses.map((course) => (
              <tr key={course._id}>
                <td>{course.course_code}</td>
                <td>{course.course_name}</td>
                <td>{course.category}</td>
                <td>{course.credit_hours?.lectures || 'N/A'}</td>
                <td>{course.credit_hours?.tutorials || 'N/A'}</td>
                <td>{course.credit_hours?.practicals || 'N/A'}</td>
                <td>{course.credits}</td>
                <td>{course.contact_hours}</td>
                <td>{course.isa_esa_duration?.ISA || 'N/A'}</td>
                <td>{course.isa_esa_duration?.ESA || 'N/A'}</td>
                <td>{course.isa_esa_duration?.Total || 'N/A'}</td>
                <td>
                  <button onClick={() => deleteCourse(course.course_code)}>
                    Delete
                  </button>
                  <Link to={`/edit/${selectedSemester}/${course.course_code}`}>Edit</Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="12">No courses available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default User;