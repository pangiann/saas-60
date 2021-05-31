const questions = require('./models/add_q&a_service/questions');

async function populateQuestions(username) {
    const fs = require('fs')
    var json_data;
    try {
        const data = fs.readFileSync('/home/pangiann/questions.json', 'utf8');
        json_data = JSON.parse(data);
        //console.log(json_data);

    } catch (err) {
        console.error(err);
    }
    let i;
    for (i = 0; i < json_data.length; i++) {
        try {
            // console.log(json_data[i].title);
            const res = await questions.insertQuestion(username, json_data[i].title, json_data[i].question, json_data[i].keywords);
            //console.log(res);
        }
        catch (error) {
            console.log(error);
        }
    }
}

populateQuestions("pan");
