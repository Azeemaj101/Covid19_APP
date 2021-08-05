const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const request = require("request");

app.use(bodyParser.urlencoded({ extended: false }));

let Port = process.env.PORT || 8000;

let temp_path = path.join(__dirname, "..", "templates", "views");
const static_path = path.join(__dirname, "..", "templates");
app.use(express.static(static_path));

app.set("view engine", "ejs");
app.set("views", temp_path);

app.get("/", (req, res) => {
    let country = "";
    request(`https://restcountries.eu/rest/v2/`, (err, resp) => {
        if (err) {
            res.status(404).render('404', {
                err: "Country Not Found"
            });
        } else {
            let API_Country = JSON.parse(resp.body);
            country = API_Country;
        }
        res.render("index", {
            country1: country

        });
    });
});

app.post("/", (req, res) => {
    // res.send(req.body.country);
    let covid = "";
    let year1 = new Date();

    request(`https://corona.lmao.ninja/v2/countries/${req.body.country}`, (err, resp) => {
        if (err) {
            res.status(404).render('404', {
                err: "Server Error"
            });
        } else {
            let API_Covid = JSON.parse(resp.body);
            covid = API_Covid;
            if (covid.message != undefined) {
                res.status(404).render('404', {
                    err: "Country Not Found"
                });
            } else {

                res.render("covidPage", {
                    covid1: covid,
                    year: year1.getFullYear()
                });
            }
        }
    });
})

app.listen(Port, () => {
    console.log(`Listing on Port ${Port}`);
});