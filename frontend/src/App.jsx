import { createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import adminroute from "./routes/Admin/AdminRoutes.jsx";
import studentroute from "./routes/Student/StudentRoutes.jsx";


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    {studentroute}
    {adminroute}
    </>
  )
);

const App = () => {
  return <RouterProvider router={router}/>
};
export default App;
