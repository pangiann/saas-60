import './App.css';
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom';
import LoginRegister from './pages/LoginRegister';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Keywords from './components/Keywords/Keywords';
import TimeSearch from './components/TimeSearch/TimeSearch';
import AskQuestion from './components/AskQuestion/AskQuestion';
import AnswerQuestion from './components/AnswerQuestion/AnswerQuestion';
import Home from './pages/Home';



// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

function App() {
  return (
      <div>
        <Router>
          <Header />
          <Switch>
            <Route path='/' exact component=
                  {Home}/>
            <Route path='/loginregister' exact component=
                {LoginRegister}/>
            <Route path='/keywords' exact component=
                  {Keywords}/>
            <Route path='/timesearch' exact component=
                {TimeSearch}/>
            <Route path='/askquestion' exact component=
                  {AskQuestion}/>
            <Route path='/answerquestion' exact component=
                {AnswerQuestion}/>

          </Switch>
          <Footer />
        </Router>
      </div>

  );
}

export default App;
