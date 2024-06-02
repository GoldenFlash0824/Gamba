import React from 'react'
import ReactDOM from 'react-dom'
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'bootstrap-css-only/css/bootstrap.min.css'
import 'mdbreact/dist/css/mdb.css'
import '../src/styled/cart.css'
import './index.css'
import App from './App'
import { Provider } from 'react-redux'
import rootReducer from './reducers/index'
import { configureStore } from '@reduxjs/toolkit'
import { BrowserRouter } from 'react-router-dom'
import { GridThemeProvider } from 'styled-bootstrap-grid'
import { ThemeProvider } from 'styled-components'
import { ToastContainer } from 'react-toastify'

const store = configureStore({
	reducer: rootReducer
})

const gridTheme = {
	gridColumns: 12,
	breakpoints: {
		xxl: 1600,
		xl: 1200,
		lg: 992,
		md: 768,
		sm: 576,
		xs: 575
	},
	row: {
		padding: 15
	},
	col: {
		padding: 15
	},
	container: {
		padding: 15,
		maxWidth: {
			xxl: 1400,
			xl: 1200,
			lg: 960,
			md: 720,
			sm: 540,
			xs: 540
		}
	}
}
const styledTheme = {
	mainColor: 'purple'
}

ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
			<ThemeProvider theme={styledTheme}>
				<GridThemeProvider gridTheme={gridTheme}>
					<App />
				</GridThemeProvider>
				<ToastContainer position="top-center" />
			</ThemeProvider>
		</BrowserRouter>
	</Provider>,
	document.getElementById('root')
)
