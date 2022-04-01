const peopleRouter = require("express").Router();
const pool = require("../db");

peopleRouter.get("/", (req, res) => {
    var peopleTableQuery = "SELECT * FROM people;";

    pool.query(peopleTableQuery, (error, result) => {
        if (error) {
            console.log(error);
            return;
        }
        var results = { rows: result.rows };
        res.json(results.rows);
    });
});

peopleRouter.post("/add", async (req, res) => {
    try {
        var name = req.body.name;
        var checkForNameQuery = `select * from people where name = '${name}';`;
        var result = await pool.query(checkForNameQuery);

        if (result.rows.length >= 1) {
            var returnQuery = `SELECT * from people;`;
            var resultRet = await pool.query(returnQuery);

            let resultsRet = { rows: resultRet.rows, canAdd: false };
            console.log("test");
            return res.status(200).json(resultsRet);
        }

        var addPeopleTableQuery = `INSERT into people values(nextval('people_user_id_seq'),'${name}');`;

        await pool.query(addPeopleTableQuery);

        var returnQuery = `SELECT * from people;`;
        var resultFromReturnQuery = await pool.query(returnQuery);
        let results = { rows: resultFromReturnQuery.rows, canAdd: true };
        return res.status(200).json(results);
    } catch (e) {
        res.status(400).send(e);
    }
});

peopleRouter.post("/edit", async (req, res) => {
    var user_id = req.body.user_id;

    var name = req.body.name;

    var editPeopleTableQuery = `UPDATE people SET name='${name}'WHERE user_id = ${user_id};`;
    var isEntryQuery = `select * from people where user_id=${user_id} and name = '${name}';`
    try {
        var isEntryRes = await pool.query(isEntryQuery);
        if (isEntryRes.rows.length == 0) {
            var checkForNameQuery = `select * from people where name = '${name}';`;
            var result = await pool.query(checkForNameQuery);

            if (result.rows.length >= 1) {
                var returnQuery = `SELECT * from people;`;
                var resultRet = await pool.query(returnQuery);

                let resultsRet = { rows: resultRet.rows, canEdit: false };
                return res.status(200).json(resultsRet);
            } else {
                await pool.query(editPeopleTableQuery);

                var returnQuery = `SELECT * from people;`;
                var result = await pool.query(returnQuery);

                let results = { rows: result.rows, canEdit: true };
                return res.status(200).json(results);
            }
        }
        await pool.query(editPeopleTableQuery);

        var returnQuery = `SELECT * from people;`;
        var result = await pool.query(returnQuery);

        let results = { rows: result.rows, canEdit: true };
        return res.status(200).json(results);
    } catch (e) {
        return res.status(400).json(e);
    }
});

peopleRouter.post("/delete", async (req, res) => {
    try {
        var user_id = req.body.user_id;
        var logQuery = `select * from logs where user_id = ${user_id};`;
        var logResults = await pool.query(logQuery);

        if (logResults.rows.length >= 1) {
            var returnQuery = `SELECT * from people;`;
            var resultRet = await pool.query(returnQuery);

            let resultsRet = { rows: resultRet.rows, canDelete: false };
            return res.status(200).json(resultsRet);
        }
        var deletePeopleTableQuery = `delete from people WHERE user_id = ${user_id};`;

        await pool.query(deletePeopleTableQuery);
        var returnQuery = `SELECT * from people;`;
        var result = await pool.query(returnQuery);

        let results = { rows: result.rows, canDelete: true };
        return res.status(200).json(results);
    } catch (e) {
        return res.status(400).json(e);
    }
});

module.exports = peopleRouter;
