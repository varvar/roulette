module.exports = app => {
    const nlp = require("../controllers/nlp.controller.js");

    app.post("/process", nlp.process);

    app.get("/words/:filename/:sort?/:order?", nlp.find);

    app.get("/pipe/:filename", nlp.get);

};
