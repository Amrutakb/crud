
import './App.css';
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import Display from './components/display/display';
import Update from './components/update/update';
import Final from './components/final/final';
import User from './components/getcourse/User';
import Add from './components/addcourse/Add';
import Edit from './components/updatecourse/edit';
import GetSyllabus from './components/Syllabus/fetchsyllabus';
import EditSyllabus from './components/Syllabus/updatesyllabus';


function App() {

  const route = createBrowserRouter(
    [
      {
        path:"/",
        element: <User/>,
      }, 

      {
        path:"/add",
        element:<Add/>,
      },


      {
        path:"/edit/:semesterNumber/:courseCode",
        element:<Edit/>,
      },

      {
        path:"/syllabus",
        element:<GetSyllabus/>,
      },

      {
        path:"/editSyllabus/:semesterNumber/:courseCode",
        element:<EditSyllabus/>,
      },
      {
        path:"/display",
        element: <Display/>,
      },
      {
        path:"/update",
        element: <Update/>,
      },
      {
        path:"/final",
        element: <Final/>,
      },

    ]
  )
  return (

    <div className="App">
    <RouterProvider router={route} ></RouterProvider>
    </div>
  
  );
}

export default App;
