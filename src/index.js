const express = require('express');
const config = require('./shared/config')

const app = express();

console.log(config)

app.listen(config.port, () => {
  console.log(`Server ${config.port}-portda ishlayapti`);
});
