import './App.css'
import { ChatPage } from './pages/ChatPage'
import CompanyLogin from './pages/CompanyLogin'
import CustomerLogin from './pages/CustomerLogin'
import ProfileEdit from './pages/ProfileEdit'

//TODO: Move profile to own page, currently only for testing
function App() {
	return (
		<div>
			<CustomerLogin />
			<CompanyLogin />
			<ProfileEdit />
			<ChatPage />
		</div>
	)
}

export default App
