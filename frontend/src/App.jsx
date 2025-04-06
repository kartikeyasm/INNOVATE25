import { Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm"
import SigninForm from "./components/SignupForm"
import ForgotPasswordForm from "./components/ForgotPasswordForm"
import HomePage from "./components/HomePage";
import Layout from "./components/Layout";
import AICanteen from "./components/AI-Canteen/AICanteen"
import LostAndFound from "./components/LostAndFound/LostAndFound";
import Found from "./components/LostAndFound/Found";
import Lost from "./components/LostAndFound/Lost";
import NotFound from "./components/LostAndFound/NotFound";
import PlanMeal from "./components/AI-Canteen/PlanMeal";

/* 
import ChatPage from "./ChatPage";
import GroupsPage from "./GroupsPage";
*/

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SigninForm />} />
      <Route path="/forgot-password" element={<ForgotPasswordForm />} />
      
      {/* All authenticated pages wrapped with layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        
        <Route path="/lostandfound" element={<LostAndFound />} >
          <Route path="not-found" element={<NotFound />} />
          <Route path="lost" element={<Lost />} />
          <Route path="found" element={<Found />} />
        </Route>

        <Route path="/plan-meal" element={<PlanMeal />} /> 
        {/* <Route path="/chat" element={<ChatPage />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
