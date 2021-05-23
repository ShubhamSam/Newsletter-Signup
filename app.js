const express = require('express');
const request = require('request');
const https = require('https');

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({
    extended: true
}));

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', (req, res) => {
    const fname = req.body.fName;
    const lname = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [{
            email_address: email,
            status: 'subscribed',
            merge_fields: {
                FNAME: fname,
                LNAME: lname
            }
        }]
    };

    const jsonData = JSON.stringify(data);
// console.log(jsonData);
    const url = "https://us7.api.mailchimp.com/3.0/lists/0f48af8786";

    const options = {
        method: "POST",
        auth: "shubham:17afe16fa35ed417e1f626d9af9f07ee-us7"
    }

    const request = https.request(url, options, (response) => {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html');
        } else {
            res.sendFile(__dirname + '/failure.html');
        }
        response.on("data", (data) => {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
});

app.post("/failure", (req, res) => {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, () => {
    console.log('Listening');
})