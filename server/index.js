import React from 'react';
import express from "express";
import {readFileSync} from "fs";
import {renderToString} from "react-dom/server";
import {App} from "../client/App";
import { getData, modifyAnswerUpvotes } from './database';

const app = express();

app.use(express.static("dist"));

app.get("/data", async (_req, res) => {
    res.json(await getData());
});

app.get("/vote/:answerId", (req, res) => {
    const { query, params } = req;
    modifyAnswerUpvotes(params.answerId, parseInt(query.increment));
});

app.get('/', async (_req, res) => {
    const { questions, answers } = await getData();
    const rendered = renderToString(<App questions={questions} answers={answers}/>);

    const index = readFileSync(`public/index.html`, "utf8");
    res.send(index.replace('{{rendered}}', rendered));
});

app.listen(3000);
console.info("Server is listening.");