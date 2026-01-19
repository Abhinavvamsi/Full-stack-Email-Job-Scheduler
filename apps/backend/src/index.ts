import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { router } from './routes';
import { setupWorker } from './worker';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api', router);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Start Worker
setupWorker();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
