import React from 'react';
import './scss/style.scss';
import { Link } from 'react-router-dom';
import {show_qa_url} from "../../base_url";
import Cookies from "js-cookie";

class AnswerQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          click: true,
          questions: [],
          question:[]
        };
      }
    async componentDidMount(){
      console.log(Cookies.get("token_id"));
      const myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + Cookies.get("token_id"))

      const requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
      };

      const response = await fetch(show_qa_url + "/question", requestOptions)
      const json = await response.json();
      // console.log(json);
        await this.setState({
          questions: json.result
        })
        await console.log(this.state.questions);
  }

    closeMobileMenu = () => this.setState({click:false});

    render() {
        return (
            <div>
              <div className="answer_title">Answer a question!</div>
            {this.state.questions.map(question => 
                <div key={question._id} className="box_of_question"> 
                  <div className="title_of_question">
                  {question.title}
                  </div>
                  
                  {/* {question.keywords.map(keyword =>
                  <div className="keyword_display">
                  <p>Keywords: {keyword}</p>
                  </div>
                  )} */}
                   <div className="author">
                  Written by: {question.username}
                  </div>
                  
                  <div className="those">
                  <div className="num_of_answers">
                  Answers: {question.num_of_answers}
                  </div>
                 
                    <Link to= {
                      {
                          pathname: "/question", 
                          state: {
                            selected_question : question._id
                          }
                      }
                      
                    } type="button"  className="answer_button" >
                      {/* <i class="fas fa-plug"></i> */}
                      Answer now!
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