import React, { useEffect } from 'react'
import LeftNavBar from './components/common/LeftNavBar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import moment from 'moment-timezone';
import { BrowserRouter as Router, Route, NavLink, useHistory } from 'react-router-dom'
const App = () => {

	useEffect(() => {
		// moment.tz.setDefault('America/New_York');
	}, [])

	return (
		<Router>
			<LeftNavBar />
			<ToastContainer position="top-center" />
		</Router>
	)
}
export default App
