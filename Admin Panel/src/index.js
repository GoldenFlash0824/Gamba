import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'bootstrap-css-only/css/bootstrap.min.css'
import 'mdbreact/dist/css/mdb.css'
import App from './App'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import rootReducer from './Redux/Reducers/index'
import './assets/fonts/PlusJakartaSans-Bold.ttf'
import './assets/fonts/PlusJakartaSans-Regular.ttf'
import 'react-datepicker/dist/react-datepicker.css'

const store = createStore(rootReducer)

ReactDOM.render(
	<>
		<Provider store={store}>
			<App />
		</Provider>
	</>,
	document.getElementById('root')
)
