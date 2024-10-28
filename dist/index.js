"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
morgan_1.default.token('body', (req) => JSON.stringify(req.body));
app.use((0, morgan_1.default)(':method :url :status :res[content-length] - :response-time ms :body'));
let persons = [
    {
        id: '1',
        name: 'Arto Hellas',
        number: '040-123456',
    },
    {
        id: '2',
        name: 'Ada Lovelace',
        number: '39-44-5323523',
    },
    {
        id: '3',
        name: 'Dan Abramov',
        number: '12-43-234345',
    },
    {
        id: '4',
        name: 'Mary Poppendieck',
        number: '39-23-6423122',
    },
];
app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>');
});
app.get('/info', (req, res) => {
    const { length } = persons;
    const date = new Date();
    res.send(`<p>Phonebook has info for ${length} people</p><p>${date}</p>`);
});
app.get('/api/persons', (req, res) => {
    res.json(persons);
});
app.get('/api/persons/:id', (req, res) => {
    const { id } = req.params;
    const person = persons.find((p) => p.id === id);
    if (person)
        res.json(person);
    else
        res.status(404).send('Person could not be found');
});
app.delete('/api/persons/:id', (req, res) => {
    const { id } = req.params;
    persons = persons.filter((person) => person.id !== id);
    res.status(204).end();
});
const generateId = () => {
    const maxId = persons.length > 0 ? Math.max(...persons.map((n) => Number(n.id))) : 0;
    return String(maxId + 1);
};
app.post('/api/persons', (req, res) => {
    const body = req.body;
    if (!body.name || !body.number) {
        res.status(400).json({
            error: 'name and number are required',
        });
        return;
    }
    const exists = persons.find((p) => p.name.toLowerCase() === body.name.toLowerCase());
    if (exists) {
        res.status(400).json({
            error: 'name must be unique',
        });
        return;
    }
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    };
    persons = persons.concat(person);
    res.json(person);
});
const PORT = 3001;
app.listen(PORT, () => {
    console.log('Server listening on port', PORT);
});
