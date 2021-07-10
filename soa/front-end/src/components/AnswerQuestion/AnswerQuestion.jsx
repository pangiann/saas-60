import React from 'react';
import {bus_qa_url, qa_url} from "../../base_url";
import FeedQuestion from "./FeedQuestion.jsx";
import search from '../images/search.png';
import Swal from "sweetalert2";

class AnswerQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      click: true,
      questions: [],
      keywords: []
    };
  }
  async componentDidMount() {
    // console.log(Cookies.get("token_id"));
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
        base_route: "questionsAnswers",
        api_route: "question",
        method: "get",
        data: {}
    })
    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: raw
    };
    const response = await fetch(bus_qa_url, requestOptions)
    const json = await response.json();
    console.log(json);
    await this.setState({
      questions: json.result.questions
    })
    // await console.log(this.state.questions);
  }
  changeState = async (event) =>  {
      const keywords = this.state.keywords;
      const data = JSON.stringify({
          keywords: keywords
      })
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      let raw;
      const keys = document.getElementById('key_search').value
      if (data.length === 0 || keys === "") {
          this.setState({
              questions: []
          })
          raw = JSON.stringify({
              base_route: "questionsAnswers",
              api_route: "question",
              method: "get",
              data: {}
          })

      }
      else {
          raw = JSON.stringify({
              base_route: "questionsAnswers",
              api_route: "questions/questionsPerKeyword",
              method: "post",
              data: data
          })
          this.setState({
              questions: []
          })
      }
      const requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
      };


      await fetch(bus_qa_url, requestOptions)
          .then(response => {
              if (response.status === 200) {
                return response.text();
              } else {
                throw new Error(response.status);
              }
          })
          .then(async result => {
              const json = JSON.parse(result)
              await this.setState({
                  questions: json.result.questions

              })
              //this.render()
              console.log(this.state.questions)
              //window.location.replace("/");
              //window.location.reload();
          })
          .catch(error => {
              Swal.fire({
                title: 'Error!',
                text: error,
                icon: 'error',
                customClass: "swal_ok_button",
                confirmButtonColor: "#242424"
              });
          });
  }
  closeMobileMenu = () => this.setState({ click: false });


  render() {
    return (
        <div>
            <div className="answer_title">Answer a question!</div>
            <div className="wrap">
              <div className="search">
                <input type="text" className="searchTerm" id="key_search" placeholder="Search by keyword, separated by space.." onChange={(e) => {this.setState({keywords: e.target.value.split(' ')})}}/>
                  <button type="submit" className="searchButton" onClick={this.changeState}>
                    <img src={search} className="image_search" alt={search}/>
                  </button>
              </div>
            </div>
            {
                  this.state.questions.map(question => <FeedQuestion question={question} />)
            }
        </div>
    );
  }
}


export default AnswerQuestion;