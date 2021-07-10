import React from 'react';
import './scss/style.scss';
import { Link } from 'react-router-dom';
import {analytics_url, bus_analytics_url} from "../../base_url";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

class TotalAnalytics extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tot_questions: 0,
            tot_answers: 0,
            best_questions_contributor: '',
            best_answers_contributor: ''
        };

    }
    componentDidMount() {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let raw = JSON.stringify({
            base_route: "analytics",
            api_route: "questionsPerUser",
            method: "get",
            data: {}
        })
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        fetch(bus_analytics_url, requestOptions)
            .then(response => {
                if (response.status === 200) {
                    return response.text();
                } else {
                    throw new Error(response.status);
                }
            })
            .then(result => {
                let json_obj = JSON.parse(result)
                console.log(json_obj)
                let questions_stats = json_obj.result.result
                this.setState({

                })
                let sum = 0;
                for (let i = 0; i < questions_stats.length; i++) {
                    sum += questions_stats[i].no_of_questions;
                }

                this.setState({
                    best_questions_contributor: questions_stats[0].username,
                    tot_questions: sum
                })
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


        raw = JSON.stringify({
            base_route: "analytics",
            api_route: "answersPerUser",
            method: "get",
            data: {}
        })
        requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        fetch(bus_analytics_url, requestOptions)
            .then(response => {
                if (response.status === 200) {
                    return response.text();
                } else {
                    throw new Error(response.status);
                }
            })
            .then(result => {
                let json_obj = JSON.parse(result)
                let answers_stats = json_obj.result.result
                console.log(answers_stats)
                this.setState({

                })
                let sum = 0;
                for (let i = 0; i < answers_stats.length; i++) {
                    sum += answers_stats[i].no_of_answers;
                }

                this.setState({
                    best_answers_contributor: answers_stats[0].username,
                    tot_answers: sum
                })
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

    render() {
        return (
            <div className={"tot_anal_flex"}>
                    <div className={"tot_box"}>
                        <div className={"box_info"}>
                            <p className={"info"}>{this.state.tot_questions}</p>
                            <p>Questions</p>
                        </div>
                        <div  className={"box_info"}>
                            <p  className={"info"}>{this.state.best_questions_contributor}</p>
                            <p>Best Questions Contributor</p>
                        </div>
                        <div  className={"box_info"}>
                            <p  className={"info"}>{this.state.best_answers_contributor}</p>
                            <p>Best Answers Contributor</p>
                        </div>
                        <div  className={"box_info"}>
                            <p  className={"info"}> {this.state.tot_answers}</p>
                            <p>Answers</p>
                        </div>
                    </div>

            </div>

        );
    }
}

export default TotalAnalytics;