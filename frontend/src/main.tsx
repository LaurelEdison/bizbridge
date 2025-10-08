import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import ProfileEdit from './pages/ProfileEdit.tsx'
import Login from './pages/LoginPage.tsx'
import Signup from './pages/SignUp.tsx'
import { ChatPage } from './pages/ChatPage.tsx'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<App />} />
				<Route path='/profile' element={<ProfileEdit />} />
				<Route path='/login' element={<Login />} />
				<Route path='/register' element={<Signup />} />
				<Route path='/chat' element={<ChatPage />} />
			</Routes>
		</BrowserRouter>

	</StrictMode >,
)
