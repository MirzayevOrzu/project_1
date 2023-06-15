const express = require('express');
const config = require('./shared/config');
const stuffRoutes = require('./routes/stuff');
const studentsRoutes = require('./routes/students');
const groupsRoutes = require('./routes/groups');
const directionsRoutes = require('./routes/directions');

const app = express();

app.use(express.json());

app.use(stuffRoutes);
app.use(studentsRoutes);
app.use(groupsRoutes);
app.use(directionsRoutes);

app.listen(config.port, () => {
  console.log(`Server ${config.port}-portda ishlayapti`);
});
