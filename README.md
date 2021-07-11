# askMeAnything.com

## :question: Project Description

**AskMeAnything** is a question and answer website for all kind of curious and enthusiast people. 
It features questions and answers on a wide range of topics. In this project we used two different architectures, **MSA** and **SOA**. 
For the first one, we split our app in 7 different services:

* MSA services
    * LoginRegister Service
    * Display Q&A Service
    * Q&A management Service
    * User's Analytics Service
    * Total Analytics Service
    * Choreographer
    * Front-end Service
    
Communication between them is handled using kafka implementing a choreographer.
For the former, the app was split in 4 different services:

* SOA services
    * LoginRegister Service
    * Display and Management of Q&A Service
    * Analytics Service
    * Front-end Service
    * Event-bus Service
    
This time we used Redis for the event-bus implementation. You can find more in the vpp file which describes thoroughly our app's 
architecture.

## :mens: Team

This project was curated by "saas-60" team comprising of (alphabetical order):
* [Theodoris Chronopoulos](https://github.com/theodore-chronopoulos) (AM: 03117069)
* [Panagiotis Giannoulis](https://github.com/pangiann) (AM: 03117812)


## :nut_and_bolt: Usage 
You could explore our app using the below urls (two for the 2 different architectures)

 - [ask-me-anything-microservices](https://ask-me-anything-service.herokuapp.com)
 - [ask-me-anything-soa](https://soa-ask-me-antyhing.herokuapp.com)

## :hammer: Technologies Used

* Back-end
    * Express Node JS 14.0
    * Mongo DB
    * Kafka JS
    * Redis


* Front-end
    * HTML5
    * CSS (scss)
    * React JS

* Deployment
    * Heroku
    * Kafka Confluent
    
    

## Directory structure

**/documentation**
- VPP file

**/microservices**
- Source Code of microservices architecture

**/soa**
- Source Code of microservices architecture

