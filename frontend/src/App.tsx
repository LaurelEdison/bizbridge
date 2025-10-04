import './App.css'
import CompanyLogin from './pages/CompanyLogin'
import CustomerLogin from './pages/CustomerLogin'
import Profile from './pages/Profile'

//TODO: Move profile to own page, currently only for testing
function App() {
	return (
		<div>
			<CustomerLogin />
			<CompanyLogin />
			<Profile />
		</div>
	)
}

export default App
