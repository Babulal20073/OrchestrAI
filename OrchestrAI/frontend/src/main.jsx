import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider} from "react-redux"
import { store } from './redux/store.js'
//we will wrap our app inside provider so that it can access store within any element inside it

createRoot(document.getElementById('root')).render(
  <Provider store = {store}>
    <App />
  </Provider>
    
  )
