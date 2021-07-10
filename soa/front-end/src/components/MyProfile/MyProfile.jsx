import React from 'react';
import './scss/style.scss';
import { Link } from 'react-router-dom';
import {analytics_url, bus_analytics_url} from "../../base_url";
import Cookies from "js-cookie";

import ChoicesBoxesLoggedIn from "../ChoicesBoxesLoggedIn/ChoicesBoxesLoggedIn";

class MyProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            click: true,
            user: {}
        };
    }
    async componentDidMount() {
        console.log(Cookies.get("token_id"));
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + Cookies.get("token_id"));
        myHeaders.append("Content-Type", "application/json");
        const data = JSON.stringify({"userId":Cookies.get("user_id")});
        const raw = JSON.stringify({
            base_route: "analytics",
            api_route: "user",
            method: "post",
            data: data
        })
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        
        const response = await fetch(bus_analytics_url, requestOptions)
        const json = await response.json();
        console.log(json.result);
        await this.setState({
          user: json.result.result
        })
    }




    closeMobileMenu = () => this.setState({ click: false });

    render() {
        return (
            <div>

                <section className="hero">
                    <div className="hero__background">
                        <div className="hero__title">
                            <div className="bullet">
                                <div className="bullet__one">

                                </div>
                            </div>
                            <h3> Profile Info </h3>
                        </div>
                        <div className="hero__info">
                            <div className="circle">
                                <div className="circle__one">

                                </div>
                            </div>
                            <p id="username">Username: {this.state.user.username}</p>
                        </div>
                        <div className="hero__info">
                            <div className="circle">
                                <div className="circle__one">

                                </div>
                            </div>
                            <p id="email">Email: {this.state.user.email}</p>
                        </div>
                        <div className="hero__info">
                            <div className="circle">
                                <div className="circle__one">

                                </div>
                            </div>
                            <p id="num_of_questions">Number of Questions: {this.state.user.num_of_questions}</p>
                        </div>

                        <div className="hero__info">
                            <div className="circle">
                                <div className="circle__one">

                                </div>
                            </div>
                            <p id="name">Number of Answers: {this.state.user.num_of_answers}</p>
                        </div>
                        <div className="hero__info">
                            <div className="circle">
                                <div className="circle__one">

                                </div>
                            </div>
                            <p id="address">Upvotes Received: {this.state.user.upvotes_received}</p>
                        </div>
                    </div>
                </section>
                <ChoicesBoxesLoggedIn />

            </div>
        );

    }
}

export default MyProfile;