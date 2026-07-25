import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`[FlixStream Backend] REST API listening on port ${PORT}`);
});
