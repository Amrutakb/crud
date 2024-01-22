

import React, { useState , useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './update.css'

const Update = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const initialCourseData = location.state?.initialCourseData ;
    const [coField, setCOField] = useState('');
    const [coNumber, setCONumber] = useState(0);
    const [academicYear, setAcademicYear] = useState('2020-2021');
    const [courseCode, setCourseCode] = useState(initialCourseData?.courseCode || '');
    const [ltp, setLTP] = useState({ lectures: 0, tutorials: 0, labs: 0 });
    const [coMapping, setCOMapping] = useState([]);
    const [performanceIndicator, setPerformanceIndicator] = useState('');
    const [activity, setActivities] = useState([]);
    const [rubrics, setRubrics] = useState([]);
    const [delivery, setDelivery] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [units, setUnits] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});


    const validateGeneralInfo = () => {
        let errors = {};
        if (!courseCode) errors.courseCode = '*Course code is required.';
        if (!academicYear) errors.academicYear = '*Academic year is required.';
        if (coNumber <= 0) errors.coNumber = '*CO number must be greater than zero.';
        if (!ltp.lectures || !ltp.tutorials || !ltp.labs) errors.ltp = '*All LTP fields are required.';
        if (!coField) errors.coField = '*CO field is required.';
        return errors;
    };

    const validateUnits = () => {
        let errors = {};
        units.forEach((unit, index) => {
            if (!unit.unit_number) {
                errors[`unitNumber_${index}`] = '*Unit number is required.';
            }
            unit.topics.forEach((topic, tIndex) => {
                if (!topic.topic_number || !topic.topic_name || !topic.content || !topic.hours) {
                    errors[`unit_${index}_topic_${tIndex}`] = '*All topic fields are required.';
                }
            });
        });
        return errors;
    };


    const validateActivities = () => {
        let errors = {};
        if (activity.length === 0) errors.activity = '*At least one activity is required.';
        if (rubrics.length === 0) errors.rubrics = '*At least one rubric is required.';
        if (delivery.length === 0) errors.delivery = '*At least one delivery method is required.';
        return errors;
    };


    const validateForm = () => {
        let errors = {
            ...validateGeneralInfo(),
            ...validateUnits(),
            ...validateActivities(),
        };
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };


    useEffect(() => {
        if (initialCourseData?.courseCode) {
          setCourseCode(initialCourseData.courseCode);
        }
      }, [initialCourseData]);

      const addNewCO = () => {
        const newCOMapping = Array.from({ length: coNumber }, (_, index) => {
            return { CO_Number: `CO${index + 1}`, Values: {} };
        });
        setCOMapping(newCOMapping);
    };


    
    const handleUnitChange = (index, value) => {
        const updatedUnits = [...units];
        updatedUnits[index] = { ...updatedUnits[index], unit_number: value };
        setUnits(updatedUnits);
    };

    const handleAddUnit = () => {
        setUnits([...units, { unit_number: '', topics: [] }]);
    };

    const handleTopicChange = (unitIndex, topicIndex, key, value) => {
        const updatedUnits = units.map((unit, uIndex) => {
            if (uIndex === unitIndex) {
                const updatedTopics = unit.topics.map((topic, tIndex) => {
                    if (tIndex === topicIndex) {
                        return { ...topic, [key]: value };
                    }
                    return topic;
                });
                return { ...unit, topics: updatedTopics };
            }
            return unit;
        });
        setUnits(updatedUnits);
    };

    const handleAddTopic = (unitIndex) => {
        const updatedUnits = units.map((unit, uIndex) => {
            if (uIndex === unitIndex) {
                return { ...unit, topics: [...unit.topics, { topic_number: '', topic_name: '', content: '', hours: '' }] };
            }
            return unit;
        });
        setUnits(updatedUnits);
    };



  

    const isEmpty = (value) => {
      return value === '' || value === null || value === undefined;
    };
    
  

  const addNewActivity = () => {
      setActivities([...activity, '']);
  };

  const addNewRubric = () => {
      setRubrics([...rubrics, '']);
  };

  const addNewDelivery = () => {
      setDelivery([...delivery, '']);
  };

  const handleLTPChange = (e, field) => {
    const value = e.target.value;
    setLTP((prevLTP) => {
      return {
        ...prevLTP,
        [field]: !isEmpty(value) ? value : prevLTP[field]
      };
    });
  };
  

 
  
  

  const handleActivitiesChange = (index, value) => {
    setActivities((prevActivities) => {
      let updatedActivities = [...prevActivities];
      if (!isEmpty(value)) {
        updatedActivities[index] = value;
      }
      return updatedActivities;
    });
  };
  
  const handleRubricsChange = (index, value) => {
    setRubrics((prevRubrics) => {
      let updatedRubrics = [...prevRubrics];
      if (!isEmpty(value)) {
        updatedRubrics[index] = value;
      }
      return updatedRubrics;
    });
  };
  
  const handleDeliveryChange = (index, value) => {
    setDelivery((prevDelivery) => {
      let updatedDelivery = [...prevDelivery];
      if (!isEmpty(value)) {
        updatedDelivery[index] = value;
      }
      return updatedDelivery;
    });
  };
  
  const handleCOMappingChange = (coIndex, poIndex, value) => {
    const updatedCOMapping = coMapping.map((co, index) => {
        if (index === coIndex) {
            return { 
                ...co, 
                Values: {
                    ...co.Values,
                    [`PO${poIndex + 1}`]: value
                }
            };
        }
        return co;
    });
    setCOMapping(updatedCOMapping);
};

  const handleSubmit = async () => {

    if (!validateForm()) {
        return; // Stop the submission if validation fails
    }

    
    setIsLoading(true);

    const updatedLTP = {
        lectures: isEmpty(ltp.lectures) ? initialCourseData.ltp.lectures : ltp.lectures,
        tutorials: isEmpty(ltp.tutorials) ? initialCourseData.ltp.tutorials : ltp.tutorials,
        labs: isEmpty(ltp.labs) ? initialCourseData.ltp.labs : ltp.labs,
    };

 

    const updatedActivities = activity.map((act, index) => 
        isEmpty(act) ? initialCourseData.copo.activity[index] : act
    );

    const updatedRubrics = rubrics.map((rubric, index) => 
        isEmpty(rubric) ? initialCourseData.copo.rubrics[index] : rubric
    );

    const updatedDelivery = delivery.map((deliver, index) => 
        isEmpty(deliver) ? initialCourseData.copo.delivery[index] : deliver
    );

    const updatedPerformanceIndicator = isEmpty(performanceIndicator) ? initialCourseData.copo.performance_indicator : performanceIndicator;

    const updatedCOField = isEmpty(coField) ? initialCourseData.copo.CO: coField;

    const updatedCOMapping = coMapping.map((co, index) => {
        let updatedCO = {};
        Object.keys(co).forEach((key) => {
            updatedCO[key] = isEmpty(co[key]) ? initialCourseData.co_po_mapping[index][key] : co[key];
        });
        return updatedCO;
    });


    try {
        await axios.put(`http://localhost:8000/api/structure/update-ltp/${courseCode}`, updatedLTP);
       
        for (const unit of units) {
                await axios.put(`http://localhost:8000/api/structure/update-topic/${courseCode}/${unit.unit_number}`, { topics: unit.topics });
            }
        await axios.put(`http://localhost:8000/api/structure/update-copo/${courseCode}`, {
            CO_PO_Mapping: updatedCOMapping,
            PerformanceIndicator: updatedPerformanceIndicator,
            activity: updatedActivities,
            rubrics: updatedRubrics,
            delivery: updatedDelivery,
            CO: updatedCOField 
        });

        navigate('/final', { state: { initialCourseData } });
    } catch (error) {
        console.error("Error updating data:", error);
    } finally {
        setIsLoading(false);
    }
};






    
    return (
    <div className='big'>

       
        <div className='updateForm'>
            <h2>Update Course Details</h2>
         
                 
            <div>
                <label>Academic Year:</label>
                <br></br>
                <select value={academicYear} onChange={(e) => setAcademicYear(e.target.value)}>
                    {/* Example years, add more as needed */}
                    <option value="2019-2020">2019-2020</option>
                    <option value="2020-2021">2020-2021</option>
                    <option value="2021-2022">2021-2022</option>
                </select>
                {validationErrors.academicYear && <div className="error">{validationErrors.academicYear}</div>}
            </div>
            <div>
      <label>Course Code: </label><br></br>
      <input
        type="text"
        value={courseCode}
        onChange={(e) => setCourseCode(e.target.value)}
        
      />
     {validationErrors.courseCode && <div className="error">{validationErrors.courseCode}</div>}
    </div>
            <div>
                <br></br>
                <label>Lectures:</label>
                <br></br>
                <input type="number" value={ltp.lectures} onChange={(e) => handleLTPChange(e, 'lectures')} />
                <br></br>
                <label>Tutorials:</label>
                <br></br>
                <input type="number" value={ltp.tutorials} onChange={(e) => handleLTPChange(e, 'tutorials')} />
                <br></br>
                <label>Labs:</label>
                <br></br>
                <input type="number" value={ltp.labs} onChange={(e) => handleLTPChange(e, 'labs')} />
                {validationErrors.ltp && <div className="error">{validationErrors.ltp}</div>}
            </div>
            <div>
    <label>CO:</label>
    <input type="text" value={coField} onChange={(e) => setCOField(e.target.value)} />
    {validationErrors.coField && <div className="error">{validationErrors.coField}</div>}
    </div>

    <div>
            <label>CO Number:</label>
            <input
                type="number"
                value={coNumber}
                onChange={(e) => setCONumber(e.target.value)}
            />
            <br></br>
            <button onClick={addNewCO}>Generate CO-PO Mapping</button>
            {validationErrors.coNumber && <div className="error">{validationErrors.coNumber}</div>}
        </div>

        <div>
            <br></br>
            <label>CO-PO Mapping:</label>
            <table>
            <thead>
    <tr>
        <th>CO's/PO's</th>
        {Array(14).fill().map((_, index) => <th key={index}>{index + 1}</th>)}
    </tr>
</thead>
<tbody>
    {coMapping.map((co, coIndex) => (
        <tr key={coIndex}>
            <td>{co.CO_Number}</td>
            {Array(14).fill().map((_, poIndex) => (
                <td key={poIndex}>
                    <select 
                        value={co.Values[`PO${poIndex + 1}`] || ''} 
                        onChange={(e) => handleCOMappingChange(coIndex, poIndex, e.target.value)}
                    >
                        <option value="">Select</option>
                        <option value="H">H</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                    </select>
                </td>
            ))}
        </tr>
    ))}
</tbody>

            </table>
        </div>


        <div>
                    <label>Performance Indicator:</label>
                    <input type="text" value={performanceIndicator} onChange={(e) => setPerformanceIndicator(e.target.value)} />
                    </div>

                    
        {units.map((unit, unitIndex) => (
                <div key={unitIndex}>
                    <label>Unit Number: </label>
                    <input 
                        type="number" 
                        value={unit.unit_number} 
                        onChange={(e) => handleUnitChange(unitIndex, e.target.value)} 
                    />
                    <button onClick={() => handleAddTopic(unitIndex)}>Add Topic</button>
                    {unit.topics.map((topic, topicIndex) => (
                        <div key={topicIndex}>
                            <input type="text" placeholder="Topic Number" value={topic.topic_number} onChange={(e) => handleTopicChange(unitIndex, topicIndex, 'topic_number', e.target.value)} />
                            <input type="text" placeholder="Topic Name" value={topic.topic_name} onChange={(e) => handleTopicChange(unitIndex, topicIndex, 'topic_name', e.target.value)} />
                            <input type="text" placeholder="Content" value={topic.content} onChange={(e) => handleTopicChange(unitIndex, topicIndex, 'content', e.target.value)} />
                            <input type="text" placeholder="Hours" value={topic.hours} onChange={(e) => handleTopicChange(unitIndex, topicIndex, 'hours', e.target.value)} />
                        </div>
                        
                    ))}

{validationErrors[`unitNumber_${unitIndex}`] && <div className="error">{validationErrors[`unitNumber_${unitIndex}`]}</div>}
                </div>
            ))}
            <button onClick={handleAddUnit}>Add Unit</button>
   
            <div>
                <button onClick={addNewActivity}>Add Activity</button>
                {activity.map((activity, index) => (
                    <textarea key={index} value={activity} onChange={(e) => handleActivitiesChange(index, e.target.value)} />

                ))}

{validationErrors.activity && <div className="error">{validationErrors.activity}</div>}
            </div>

            <div>
                <button onClick={addNewRubric}>Add Rubric</button>
                {rubrics.map((rubric, index) => (
                    <textarea key={index} value={rubric} onChange={(e) => handleRubricsChange(index, e.target.value)} />
                    ))}

{validationErrors.rubrics && <div className="error">{validationErrors.rubrics}</div>}
            </div>

            <div>
                <button onClick={addNewDelivery}>Add Delivery Method</button>
                {delivery.map((deliver, index) => (
                    <textarea key={index} value={deliver} onChange={(e) => handleDeliveryChange(index, e.target.value)} />
                    ))}
               
            </div>
             {validationErrors.delivery && <div className="error">{validationErrors.delivery}</div>}
          
                    <button onClick={handleSubmit} disabled={isLoading}>{isLoading ? 'Updating...' : 'Submit'}</button>
                    </div>
        </div>
                    );
                    };



                    
                    
                    export default Update;