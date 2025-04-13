import "./App.css";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { Sender } from "./components/Sender";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/sender" element={<Sender />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
