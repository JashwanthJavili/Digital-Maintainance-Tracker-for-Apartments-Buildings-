import express from 'express';
import cors from 'cors';
import adminRoutes from './routes/admin.routes';
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/admin', adminRoutes);
app.get('/', (req, res) => {
  res.send('Digital Maintenance Tracker API running');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
