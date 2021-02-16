import express from 'express';
import db, { ITodo } from './db/db';
import bodyParser from 'body-parser';
import { IFailureResponse, todoInputGuard } from './models';
import _ from 'lodash';

// Set up the express app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// get all todos
app.get('/api/v1/todos', (_req, res) =>
{
    res.status(200).send({
        success: 'true',
        message: 'todos retrieved successfully',
        todos: db
    })
});

app.get('/api/v1/todos/:id', (req, res) => {
    const id: number = parseInt(req.params.id, 10);
    if(isNaN(id))
    {
        return res.status(400).send({
            success: 'false',
            message: 'id must be a number'
        });
    }

    const todoFound = _.find(db, todo => todo.id === id);

    if(!todoFound){
        return res.status(404).send();
    }

    return res.status(200).send(todoFound);
});


app.post('/api/v1/todos', (req: express.Request, res: express.Response<ITodo | IFailureResponse>) =>
{
    if (todoInputGuard(req.body))
    {
        const todo = {
            id: db.length + 1,
            title: req.body.title,
            description: req.body.description
        }
        db.push(todo);
        res.location(`/api/v1/todos/${todo.id}`);
        return res.status(201).send(
            todo
        );
    }
    return res.status(400).send({
        success: 'false',
        message: 'title and description are required'
    });


});

const PORT = 5000;

app.listen(PORT, () =>
{
    console.log(`server running on port ${PORT}`)
});