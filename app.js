const app = require('./config');
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:" + port);
});