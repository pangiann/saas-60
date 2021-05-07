import React from 'react';
import './scss/style.scss';
import {Link} from 'react-router-dom';
import business1 from "./images/Business-OEM_Box1.png";
import business2 from "./images/Business-OEM_Box2.png";
import business3 from "./images/Business-OEM_Box3.png";
import business4 from "./images/Business-OEM+Fleet+_Content2.png";

class ChoicesBoxes extends React.Component {

    render() {
        return (
            <section className="choices">

                <div className="choice__content container container--nav container--pall">

                    <div className="choice__grid">

                        <a href="#" className="choice__item">
                            <div className="choice__image"
                                 style={{backgroundImage: `url(${business1})`}}>
                            </div>

                            <div className="choice__text">
                                <div className="choice__title">
                                    Search & Access
                                </div>
                                <div className="choice__description">
                                    Your clients easily find the closest charge point
                                    with our app, site or in-car telematics.
                                </div>
                            </div>
                        </a>
                        <a href="#" className="choice__item">
                            <div className="choice__image"
                                 style={{backgroundImage: `url(${business2})`}}>
                            </div>

                            <div className="choice__text">
                                <div className="choice__title">
                                    Predict & Optimise
                                </div>
                                <div className="choice__description">
                                    Our data allows you to optimise processes by showing where,
                                    how long and how much your fleet charged.
                                </div>
                            </div>
                        </a>
                        <a href="#" className="choice__item">
                            <div className="choice__image"
                                 style={{backgroundImage: `url(${business3})`}}>
                            </div>

                            <div className="choice__text">
                                <div className="choice__title">
                                    Manage & Survey
                                </div>
                                <div className="choice__description">
                                    Automated billing and tariff management give you
                                    oversight of clients’ price administration at all times.
                                </div>
                            </div>
                        </a>
                        <a href="#" className="choice__item">
                            <div className="choice__image"
                                 style={{backgroundImage: `url(${business4})`}}>
                            </div>

                            <div className="choice__text">
                                <div className="choice__title">
                                    Set your own price & profit from insights
                                </div>
                                <div className="choice__description">
                                    It’s up to you how much your fleet and leasing clients pay for electric vehicle
                                    charging sessions. And with our tailored insights into users’ charging habits,
                                    you’ll be able to fine-tune charging consumption to fit your needs.
                                </div>
                            </div>
                        </a>
                    </div>
                </div>

            </section>
        );
    }
}

export default ChoicesBoxes;