import { RouterProvider } from "react-router-dom";
import { router } from "./shared/router";
import "./shared/styles/App.css";

function App() {

    return <RouterProvider router={router} />;
}

export default App;
