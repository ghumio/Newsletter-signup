const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const http = require("http");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    // ... (the existing code remains the same)
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "http://127.0.0.1:1024/api/data";

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    };

    const apiRequest = http.request(url, options, function(apiResponse) {
        let responseData = "";
        apiResponse.on("data", function(chunk) {
            responseData += chunk;
        });
        apiResponse.on("end", function() {
            console.log(JSON.parse(responseData));
        });
    });

    apiRequest.write(jsonData);
    apiRequest.end();
});

app.post("/failure", function(req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || 5000, function() {
    console.log('Server is running on port 5000');
});