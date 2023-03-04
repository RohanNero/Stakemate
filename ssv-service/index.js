const express = require('express')
const app = express()
const port = 3000
const fs = require('fs');
const crypto = require('crypto');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const createValidatorConfig = (withdrawal_address) => {
    let validatorConfig = {
        "validator_count": 1,
        "withdrawal_creds": withdrawal_address,
        "keystore_password": ""
    }
    let data = JSON.stringify(validatorConfig);
    fs.writeFileSync(`${withdrawal_address}-validator_config.json`, data);

}

app.post('/create-keys', (req, res) => {
    console.log(req.body.withdrawal_address);
    createValidatorConfig(req.body.withdrawal_address);
    res.sendStatus(200);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})