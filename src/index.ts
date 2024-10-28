import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { PersonType } from './types';

const app = express();
app.use(express.json());
app.use(cors());

morgan.token('body', (req: Request) => JSON.stringify(req.body));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body'),
);

let persons: PersonType[] = [
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

app.get('/', (req: Request, res: Response) => {
  res.send('<h1>Hello World!</h1>');
});

app.get('/info', (req: Request, res: Response) => {
  const { length } = persons;
  const date = new Date();

  res.send(`<p>Phonebook has info for ${length} people</p><p>${date}</p>`);
});

app.get('/api/persons', (req: Request, res: Response) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const person = persons.find((p) => p.id === id);

  if (person) res.json(person);
  else res.status(404).send('Person could not be found');
});

app.delete('/api/persons/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

const generateId = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map((n) => Number(n.id))) : 0;
  return String(maxId + 1);
};

app.post('/api/persons', (req: Request, res: Response) => {
  const body = req.body;

  if (!body.name || !body.number) {
    res.status(400).json({
      error: 'name and number are required',
    });
    return;
  }

  const exists = persons.find(
    (p) => p.name.toLowerCase() === body.name.toLowerCase(),
  );

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
