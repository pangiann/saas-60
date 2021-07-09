import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LoginRegister from './pages/LoginRegister';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import QuestionsPerKeywordPage from './pages/QuestionsPerKeyword';
import QuestionsPerTimePage from "./pages/QuestionsPerTime";
import AskQuestionPage from './pages/AskQuestion';
import AnswerQuestionPage from './pages/AnswerQuestion';
import ShowQuestion from './components/ShowQuestion/ShowQuestion';
import MyProfile from './components/MyProfile/MyProfile';
import MyQnA from './components/MyQnA/MyQnA';

import Home from './pages/Home';


function App() {
  return (
    <div>
      <Router>
        <Header />
        <Switch>
          <Route path='/' exact component=
            {Home} />
          <Route path='/loginregister' exact component=
            {LoginRegister} />
          <Route path='/keywords' exact component=
            {QuestionsPerKeywordPage} />
          <Route path='/timesearch' exact component=
            {QuestionsPerTimePage} />
          <Route path='/askquestion' exact component=
            {AskQuestionPage} />
          <Route path='/answerquestion' exact component=
            {AnswerQuestionPage} />
          <Route path='/question' exact component=
            {ShowQuestion} />
          <Route path='/myprofile' exact component=
            {MyProfile} />
          <Route path='/myqna' exact component=
            {MyQnA} />
        </Switch>
        <Footer />
      </Router>
    </div>

  );
}

export default App;
