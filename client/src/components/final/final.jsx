import React, { useEffect, useState , useRef} from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import './final.css';

import html2canvas from 'html2canvas';



const Final = () => {
    const location = useLocation();
    const { initialCourseData } = location.state || {};
    const [updatedData, setUpdatedData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [formValues, setFormValues] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const pageRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            // Fetch updated data using API calls
            try {
                const ltpResponse = await axios.get(`http://localhost:8000/api/structure/get-ltp`, {
                    params: { courseCode: initialCourseData.courseCode }
                });
                const copoResponse = await axios.get(`http://localhost:8000/api/structure/get-copo`, {
                    params: { courseCode: initialCourseData.courseCode }
                });
                const topicResponse = await axios.get(`http://localhost:8000/api/structure/get-topic`, {
                    params: { courseCode: initialCourseData.courseCode }
                });

                const newUpdatedData = {
                    ltp: ltpResponse.data,
                    copo: copoResponse.data,
                    topics: topicResponse.data
                    
                };

                setUpdatedData(newUpdatedData);
            } catch (error) {
                console.error("Error fetching updated data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [initialCourseData]);

    const [additionalInputs, setAdditionalInputs] = useState({
        context: '',
        experience: '',
        approach: '',
    });

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
    

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleAdditionalInputChange = (name, value) => {
        setAdditionalInputs({
            ...additionalInputs,
            [name]: value,
        });
    };

    const handleSubmit = () => {
        setSubmitted(true);
        console.log(formValues);
        alert('Data Submitted!');
    };

    const downloadPDF = () => {
        // Temporarily hide buttons
        const buttons = document.querySelectorAll('button');
        buttons.forEach((btn) => (btn.style.visibility = 'hidden'));
    
        const pdf = new jsPDF('p', 'mm', 'a4');
    
        // Additional Inputs Section
        pdf.setFontSize(12);
        pdf.text('Additional Inputs:', 20, 20);
    
        // Format and add additional inputs as paragraphs
        const formattedContext = formatText(additionalInputs.context);
        const formattedExperience = formatText(additionalInputs.experience);
        const formattedApproach = formatText(additionalInputs.approach);
    
        pdf.text('Context:', 20, 30);
        pdf.text(formattedContext, 30, 40);
    
        pdf.text('Experience:', 20, pdf.previousAutoTable ? pdf.previousAutoTable.finalY + 10 : 60);
        pdf.text(formattedExperience, 30, pdf.previousAutoTable ? pdf.previousAutoTable.finalY + 20 : 70);
    
        pdf.text('Approach:', 20, pdf.previousAutoTable ? pdf.previousAutoTable.finalY + 10 : 90);
        pdf.text(formattedApproach, 30, pdf.previousAutoTable ? pdf.previousAutoTable.finalY + 20 : 100);
    
        // Save the current Y position for reference
        const additionalInputsEndY = pdf.previousAutoTable ? pdf.previousAutoTable.finalY + 20 : 120;
    
        // Add spacing between sections
        pdf.text('', 20, additionalInputsEndY + 10);
    
        // Table Section on the next page
        pdf.addPage();
    
        const tableWidth = pdf.internal.pageSize.getWidth() - 40; // Width of the table (left and right margin 20 each)
        const leftMargin = (pdf.internal.pageSize.getWidth() - tableWidth) / 2;
    
        pdf.text('Table Section:', 20, 20);
    
        // Use html2canvas addHTML to add the HTML content to the PDF
        html2canvas(pageRef.current, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            pdf.addImage(imgData, 'JPEG', leftMargin, 30, tableWidth, 0, '', 'FAST');
    
            // Show buttons again after PDF is generated
            buttons.forEach((btn) => (btn.style.visibility = 'visible'));
    
            // Save the PDF file with a proper name
            pdf.save('download.pdf');
        });
    };
    
    
    

    const formatText = (text) => {
        // Adjust the number (40) based on your preference for characters per line
        const maxCharactersPerLine = 90;
        const words = text.split(' ');
        let formattedText = '';
        let currentLine = '';
    
        words.forEach((word) => {
            if (currentLine.length + word.length <= maxCharactersPerLine) {
                currentLine += ` ${word}`;
            } else {
                formattedText += `${currentLine}\n`;
                currentLine = `${word}`;
            }
        });
    
        // Add the last line
        formattedText += `${currentLine}\n`;
    
        return formattedText.trim();
    };
    
    
    
    
    
    
    
    
    
    
    const renderTopics = (topics) => {
        if (!topics || !Array.isArray(topics)) {
            return <div>No topics available.</div>;
        }
    
        return topics.map((topic, index) => (
            <div key={index}>
                {` ${topic.topic_number}. ${topic.topic_name}`}
            </div>
        ));
    };

    const renderListItems = (items) => {
        return items.map((item, index) => (
            <div key={index}>{`• ${item}`}</div>
        ));
    };

    return (
        <div>
            <div id="one"></div>
            <div>
                <h2>Change summary in the course {initialCourseData?.copo?.course_name}</h2>
                <h3>2022-2023 to 2023-2024</h3>
                <div>
                    <label>Context:</label>
                    <textarea
                        value={additionalInputs.context}
                        onChange={(e) => handleAdditionalInputChange('context', e.target.value)}
                    />
                </div>
                <div>
                    <label>Experience:</label>
                    <textarea
                        value={additionalInputs.experience}
                        onChange={(e) => handleAdditionalInputChange('experience', e.target.value)}
                    />
                </div>
                <div>
                    <label>Approach:</label>
                    <textarea
                        value={additionalInputs.approach}
                        onChange={(e) => handleAdditionalInputChange('approach', e.target.value)}
                    />
                </div>
            </div>
        <div ref={pageRef} className="pdf-content">
            <h2>Final Values</h2>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <table  id="finalTable" className="custom-table" cellPadding={10}>
                 <thead>
             <tr>
        <th>Sl.No.</th>
        <th colSpan="3">Details</th>
        <th width='300px' rowSpan="2">Change Summary</th>
        <th width='300px' rowSpan="2">Evidence</th>
            </tr>
            </thead>
                    <tbody>
                 
                        <tr>
                            <td>1.</td>
                            <td>Academic Year</td>
                            <td>2022-2023</td>
                            <td>2023-2024</td>
                            <td></td>
                            <td></td>
                          
                        </tr>
                        <tr>
    <td>2.</td>
    <td>Course Code</td>
    <td>{initialCourseData?.courseCode}</td>
    <td>{initialCourseData.courseCode}</td>
    <td>
        {submitted ? formValues.c2 : (
            <textarea name="c2" className="textarea-300" onChange={handleInputChange}></textarea>
        )}
    </td>
    <td>
        {submitted ? formValues.e2 : (
            <textarea name="e2" className="textarea-300" onChange={handleInputChange}></textarea>
        )}
    </td>
</tr>


<tr>
    <td>3.</td>
    <td>LTP</td>
    <td>{initialCourseData?.ltp?.lectures}-{initialCourseData?.ltp?.tutorials}-{initialCourseData?.ltp?.labs}</td>
    <td>{updatedData?.ltp?.lectures}-{updatedData?.ltp?.tutorials}-{updatedData?.ltp?.labs}</td>
    <td>
        {submitted ? formValues.c3 : (
            <textarea name="c3" className="textarea-300" onChange={handleInputChange}></textarea>
        )}
    </td>
    <td>
        {submitted ? formValues.e3 : (
            <textarea name="e3" className="textarea-300" onChange={handleInputChange}></textarea>
        )}
    </td>
</tr>
                        <tr>
                        <td>4.</td>
                            <td>CO's</td>
                            <td>{initialCourseData.copo?.CO}</td>
                            <td>{updatedData?.copo?.CO}</td>
                            <td>
        {submitted ? formValues.c4 : (
            <textarea name="c4" className="textarea-300" onChange={handleInputChange}></textarea>
        )}
    </td>
    <td>
        {submitted ? formValues.e4 : (
            <textarea name="e4" className="textarea-300" onChange={handleInputChange}></textarea>
        )}
    </td></tr>

<tr>
    <td>5.</td>
    <td>CO-PO Mapping</td>
    <td>
        <table className="copo-mapping-table">
            {renderCOPOMappingTable(initialCourseData.copo.CO_PO_Mapping)}
            Performance Indicator:{initialCourseData.copo?.PerformanceIndicator}
        </table>
    </td>
    <td>
        <table className="copo-mapping-table">
            {renderCOPOMappingTable(updatedData.copo.CO_PO_Mapping)}
            Performance Indicator: {updatedData?.copo?.PerformanceIndicator}
        </table>
    </td>
    <td>
        {submitted ? formValues.c5 : (
            <textarea name="c5" className="textarea-300" onChange={handleInputChange}></textarea>
        )}
    </td>
    <td>
        {submitted ? formValues.e5 : (
            <textarea name="e5" className="textarea-300" onChange={handleInputChange}></textarea>
        )}
    </td>
</tr>


                        <tr>
                        <td>6.</td>
                    <td>Course Content</td>
                    <td>{renderTopics(initialCourseData.topics)}</td>
                    <td>{renderTopics(updatedData.topics)}</td>
                    <td>
        {submitted ? formValues.c6 : (
            <textarea name="c6" className="textarea-300" onChange={handleInputChange}></textarea>
        )}
    </td>
    <td>
        {submitted ? formValues.e6 : (
            <textarea name="e6" className="textarea-300" onChange={handleInputChange}></textarea>
        )}
    </td></tr>
                        <tr>
                        <td>7.</td>
                        <td>Course Activity/Tutorials</td>
                            <td>{renderListItems(initialCourseData.copo.activity)}</td>

                            <td>{renderListItems(updatedData.copo.activity)}</td>
                            <td>
        {submitted ? formValues.c7 : (
            <textarea name="c7" className="textarea-300" onChange={handleInputChange}></textarea>
        )}
    </td>
    <td>
        {submitted ? formValues.e7 : (
            <textarea name="e7" className="textarea-300" onChange={handleInputChange}></textarea>
        )}
    </td></tr>
                        <tr>
                        <td>8.</td>
                        <td>Rubrics/Assessment</td>
                           
                        <td>{renderListItems(initialCourseData.copo.rubrics)}</td>
                        <td>{renderListItems(updatedData.copo.rubrics)}</td>
                        <td>
        {submitted ? formValues.c8 : (
            <textarea name="c8" className="textarea-300" onChange={handleInputChange}></textarea>
        )}
    </td>
    <td>
        {submitted ? formValues.e8 : (
            <textarea name="e8" className="textarea-300" onChange={handleInputChange}></textarea>
        )}
    </td></tr>
                        <tr>
                        <td>9.</td>
                        <td>Course Delivery</td>
                        <td>{renderListItems(initialCourseData.copo.delivery)}</td>
                        <td>{renderListItems(updatedData.copo.delivery)}</td>
                      
                        <td>
        {submitted ? formValues.c9 : (
            <textarea name="c9" className="textarea-300" onChange={handleInputChange}></textarea>
        )}
    </td>
    <td>
        {submitted ? formValues.e9 : (
            <textarea name="e9" className="textarea-300" onChange={handleInputChange}></textarea>
        )}
    </td></tr>
                            
                     
                    </tbody>
                </table>
            )}
               <button onClick={handleSubmit}>Submit</button>
            <button onClick={downloadPDF}>Download as PDF</button>
        </div>
        </div>
    );
};

export default Final;