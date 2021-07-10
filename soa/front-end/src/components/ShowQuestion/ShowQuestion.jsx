import React from 'react';
import './scss/style.scss';
import {bus_login_url, bus_qa_url, qa_url} from "../../base_url";
import Cookies from "js-cookie";
import plus from '../images/plus.png'
import Swal from "sweetalert2";
class ShowQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      click: true,
      question: {},
      question_id: this.props.location.state,
      answers: [],
      keywords: [],
      description: '',
      answerActive: false
    };
  }
  async componentDidMount() {
        console.log(Cookies.get("token_id"));
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let data = JSON.stringify({
            "questionId" : this.state.question_id
        });
        let raw = JSON.stringify({
            base_route: "questionsAnswers",
            api_route: "questions/question_id",
            method: "post",
            data: data
        })
        let requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        const response = await fetch(bus_qa_url, requestOptions)
        const json = await response.json();
        console.log(json.result);
        await this.setState({
          question: json.result.result[0]
        })
        await this.setState({
          keywords: this.state.question.keywords
        })

        data = JSON.stringify({
          "questionId" : this.state.question_id
        });
        raw = JSON.stringify({
              base_route: "questionsAnswers",
              api_route: "answers/question",
              method: "post",
              data: data
        })
        requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: raw,
              redirect: 'follow'
        };
        const response2 = await fetch(bus_qa_url, requestOptions)
        const json2 = await response2.json();
        console.log(json2);
        await this.setState({
          answers: json2.result.answers
        })
        await console.log(this.state.answers);
  }
  handleDescriptionChange = (event) => {
    this.setState({
      description: event.target.value
    })
  }
  upvoteAnswer = (answer_id) =>  {
      const myHeaders = new Headers();
      const auth_token = Cookies.get("token_id")
      const user_id = Cookies.get("user_id")
      myHeaders.append("Authorization", "Bearer " + auth_token);
      myHeaders.append("Content-Type", "application/json");
      console.log(answer_id);
      const data = JSON.stringify({
          "answerId": answer_id.toString(),
          "userId": user_id
      });
      const raw = JSON.stringify({
          base_route: "questionsAnswers",
          api_route: "answer/upvote",
          method: "put",
          data: data
      })

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch(bus_qa_url, requestOptions)
          .then(response => {
              if (response.status === 200) {
                return response.text();
              } else {
                throw new Error(response.status);
              }
          })
          .then(result => {
               console.log(result)
               window.location.reload();


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
  submitAnswer = (event) => {
      var myHeaders = new Headers();

      myHeaders.append("Authorization", "Bearer " + Cookies.get("token_id"));
      myHeaders.append("Content-Type", "application/json");
      const data =  JSON.stringify({
          "questionId": this.state.question_id.toString(),
          "userId": Cookies.get("user_id"),
          "answer": this.state.description
      });
      const raw = JSON.stringify({
          base_route: "questionsAnswers",
          api_route: "/answer",
          method: "post",
          data: data
      })
      const requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
      };

      fetch(bus_qa_url, requestOptions)
          .then(response => {
              if (response.status === 200) {
                return response.text();
              } else {
                throw new Error(response.status);
              }
          })
          .then(result => {
              console.log(result)
              window.location.reload();


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
  changeAnswerActive = (event) => {
    const { answerActive } = this.state;
    this.setState(prevState => ({ answerActive: !prevState.answerActive }));
  }


  closeMobileMenu = () => this.setState({ click: false });

  render() {
    return (
      <div>
        <div className="title_of_question">{this.state.question.title}</div>
        <div className="box_of_question">
            <div className="text_of_question">
              {this.state.question.question}
            </div>

            <div className="author">
              Asked by: {this.state.question.username}
            </div>

            <div className="flex">
                {this.state.keywords.map(keyword =>
                  <div className="keyword_display">
                    <p>{keyword}</p>
                  </div>
                )}
                <div className="num_of_answers">
                  Answers: {this.state.question.num_of_answers}
                </div>
            </div>
            <div className={"answer_but "}  onClick={this.changeAnswerActive}>
              [+] Answer
            </div>

          </div>
          {(this.state.answerActive &&
              <div className="my_answer">
                <p>Your answer:</p>
                <div className="textbox">
                    <textarea
                        type="text"
                        value={this.state.description}
                        placeholder="Use up to 1.000 characters"
                        onChange={this.handleDescriptionChange}
                    />
                </div>
                <div className={"add_ans_but"}  onClick={this.submitAnswer}>
                  [+] Add Answer
                </div>
              </div>

         )}
          <div className={"answers_title"}>Answers:</div>
          {this.state.answers.map(answer =>
            <div className="box_of_answer">
              <div className="text_of_question">
                {answer.answer}
              </div>

              <div className="author">
                Written by: {answer.username}
              </div>
              <div className={"upvotes_flex"}>
                  <div className="num_of_upvotes">
                    Upvotes: {answer.upvotes}
                  </div>
                  <div className={"plus_image"} onClick={() => this.upvoteAnswer(answer._id)}>
                      <img src={plus} alt={"plus"} width={"34"} height={"34"} />
                  </div>
              </div>



            </div>
          )}



      </div>
    );

  }
}

export default ShowQuestion;
