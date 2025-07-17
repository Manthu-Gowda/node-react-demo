import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RouterComponent from "./App/RouterComponent/RouterComponent";
import ChatBot from "./App/Components/ChatBot/ChatBot";

function App() {
    const accessToken = localStorage.getItem("accessToken");
  return (
    <div className="App">
      <RouterComponent />
      <ToastContainer theme="colored" position="top-right" autoClose={5000} />
      {accessToken && <ChatBot />}
    </div>
  );
}

export default App;
