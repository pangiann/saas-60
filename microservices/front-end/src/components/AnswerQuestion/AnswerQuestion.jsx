import React from 'react';
import '../ChoicesBoxes/scss/style.scss';
import answer from "../ChoicesBoxes/images/Answer.jpg";
import ask from "../ChoicesBoxes/images/ask.jpeg";
import statistics from "../ChoicesBoxes/images/statistics.jpg";
import search_keyword from "../ChoicesBoxes/images/search-keyword.jpg";
import { Link } from 'react-router-dom';
import {show_qa_url} from "../../base_url";


class AnswerQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          click: true,
          questions: []
        };
      }
      async componentDidMount(){


        const myHeaders = new Headers();
        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        const response = await fetch(show_qa_url + "/question", requestOptions)
        const json = await response.json();
          await this.setState({
            questions: json
          })
          await console.log(this.state.questions);
        // .then(response => {
        //     if (response.status === 200) {
        //         return response.text();
        //     } else {
        //         throw new Error(response.status);
        //     }
        // })


        // .then(result => {
        //     const json_obj = JSON.parse(result);
        //     Swal.fire({
        //         title: 'Success',
        //         text: json_obj.msg,
        //         icon: 'success',
        //         customClass: "swal_ok_button",
        //         confirmButtonColor: "#242424"
        //     }).then(function () {
        //         window.location.href = '/loginregister';
        //     })

        // })
        // .catch(error => {
        //     Swal.fire({
        //         title: 'Error!',
        //         text: error,
        //         icon: 'error',
        //         customClass: "swal_ok_button",
        //         confirmButtonColor: "#242424"
        //     });
        // });
    }

    closeMobileMenu = () => this.setState({click:false});

    render() {
        return (
            <div>
            {this.state.questions.map(question => 
                <div key={question.question_id} className="box_of_question"> 
                  <p>{question.question_title}</p>
                  
                  <p>Answers: {question.number_of_answers}</p>
                 
                  <p>Written by: {question.author}</p>

                <div>
                    <Link to= {
                      {
                          pathname: "/question", 
                          state: {
                            selected_question : question.question_id
                          }
                      }
                      
                    } type="button"  className="answer_button" >
                      {/* <i class="fas fa-plug"></i> */}
                      &nbsp;&nbsp;Answer now!
                    </Link>
                </div>                    
                </div>
                ) 
                
                }
                </div>
        );
    }
}

export default AnswerQuestion;