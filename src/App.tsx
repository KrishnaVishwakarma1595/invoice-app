import "./App.css";
import Sidebar from "./components/sidebar";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

function App() {
	return (
		<main className="App">
			<Sidebar />
			<div className="AppRC">
				<RouterProvider router={router} />
			</div>
		</main>
	);
}

export default App;
