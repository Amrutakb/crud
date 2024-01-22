//display.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './display.css'; 




const Display = () => {
    const navigate = useNavigate();
    const [courseCode, setCourseCode] = useState('');
    const [courseData, setCourseData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [initialCourseData, setInitialCourseData] = useState(null);

    useEffect(() => {
     
        fetchData();
           // eslint-disable-next-line 
    }, []);
   
    const renderTopics = (topics) => {
        if (!topics || !Array.isArray(topics)) {
            return <div>No topics available.</div>;
        }
    
        return topics.map((topic, index) => (
            <div key={index}>
                {`${topic.topic_number}. ${topic.topic_name}`}
            </div>
        ));
    };
    
    

    const renderListItems = (items) => {
        return items.map((item, index) => (
            <div key={index}>{`• ${item}`}</div>
        ));
    };
    const fetchData = async () => {
        if (!courseCode) {
            // Exit early if no course code is provided
            return;
        }
        setIsLoading(true);
    
        try {
            const ltpResponse = await axios.get(`http://localhost:8000/api/structure/get-ltp`, { params: { courseCode } });
            const copoResponse = await axios.get(`http://localhost:8000/api/structure/get-copo`, { params: { courseCode } });
            const topicResponse = await axios.get(`http://localhost:8000/api/structure/get-topic`, { params: { courseCode } });
            console.log(topicResponse.data);
    
            // Example: Check if responses contain expected data
            if (ltpResponse.data && copoResponse.data && topicResponse.data) {
                const newCourseData = {
                    courseCode: courseCode,
                    ltp: ltpResponse.data,
                    copo: copoResponse.data,
                    topics: topicResponse.data 
                };
    
                setCourseData(newCourseData);
                setInitialCourseData(newCourseData);
            } else {
                setCourseData(null);
                alert('Course code not found in the database.');
            }
        } catch (error) {
            console.error("Error fetching data:", error);
    
            // If the error is due to a non-existent course code, handle it here
            if (error.response && error.response.status === 404) { // Example status check
                setCourseData(null);
                alert('Course-Code not found in the database.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    
  // Inside the handleUpdateClick function in Display.jsx
const handleUpdateClick = () => {
    navigate('/update', { state: { initialCourseData } });
};


    const handleCourseCodeChange = (event) => {
        setCourseCode(event.target.value);
    };

    const handleSubmit = () => {
        fetchData();
    };

    useEffect(() => {
        console.log("Initial Data:", initialCourseData);
        console.log("Current Data:", courseData);
    }, [initialCourseData, courseData]);


    const getActivePOColumns = (mappingData) => {
        const activePOs = new Set();
        mappingData.forEach(co => {
            Object.keys(co.Values).forEach(poKey => {
                if (co.Values[poKey]) {
                    // Extract the numeric part from poKey (e.g., "PO1" becomes 1)
                    const poNumberMatch = poKey.match(/\d+/);
                    if (poNumberMatch) {
                        const poNumber = parseInt(poNumberMatch[0]);
                        activePOs.add(poNumber);
                    }
                }
            });
        });
        // Convert the set to an array and sort it numerically
        return Array.from(activePOs).sort((a, b) => a - b);
    };
    
    const renderCOPOMappingTable = (mappingData) => {
        const activePOColumns = getActivePOColumns(mappingData);
        return (
            <table border="1">
                <thead>
                    <tr>
                        <th>CO's/PO's</th>
                        {activePOColumns.map(poNumber => <th key={poNumber}>{poNumber}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {mappingData.map((co, coIndex) => (
                        <tr key={coIndex}>
                            <td>{co.CO_Number}</td>
                            {activePOColumns.map(poNumber => (
                                <td key={poNumber}>{co.Values[`PO${poNumber}`] || '-'}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };
    
    return (
        <div className='userTable'>
            <p>Change Summary of the Year 2022-2023</p>
          
            <input
                type="text"
                placeholder="Enter Course Code"
                value={courseCode}
                onChange={handleCourseCodeChange}
            />
            <button onClick={handleSubmit}>Submit</button>

            {isLoading ? (
                <p></p>
            ) : courseData ? (
                <table border={1} cellPadding={10}>
                    <thead>
                        <tr>
                            <th>Academic Year</th>
                            <th>Course Code</th>
                            <th>Credits L-T-P</th>
                            <th>CO's</th>
                            <th>CO-PO Mapping</th>
                            <th>Course Content</th>
                            <th>Course Activity/Tutorials</th>
                            <th>Rubrics/Assessment</th>
                            <th>Course Delivery</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>2022-2023</td>
                            <td>{courseCode}</td>
                            <td>{courseData.ltp.lectures}-{courseData.ltp.tutorials}-{courseData.ltp.labs}</td>
                            <td>{courseData.copo.CO}</td>
                            <td>
                                
            {renderCOPOMappingTable(courseData.copo.CO_PO_Mapping)}
                                Performance Indicators: {courseData.copo.PerformanceIndicator}
                            </td>
                            <td>
                                
                            <td>{renderTopics(courseData.topics)}</td>
 
                                
                            </td>
                            <td>{renderListItems(courseData.copo.activity)}</td>
                            <td>  {renderListItems(courseData.copo.rubrics)}</td>
                            <td> {renderListItems(courseData.copo.delivery)}</td>
                          
                        </tr>
                    </tbody>
                    <div className="update-button-container">
            <button onClick={handleUpdateClick}>Update</button>
        </div>
                </table>
                
            ) : null}
        </div>
    );
};

export default Display;
