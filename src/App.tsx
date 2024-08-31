import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/sidebar";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { ToastContainer } from 'react-toastify';

function App() {
	return (
		<main className="App">
			<Sidebar />
			<div className="AppRC">
				<RouterProvider router={router} />
			</div>
			<ToastContainer />
		</main>
	);
}

export default App;
