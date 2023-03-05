const express = require('express')
const app = express()
const port = 3000
const fs = require('fs');
const { exec } = require("child_process");

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
    let withdrawal_fn = `${withdrawal_address}-validator_config.json`;
    fs.writeFileSync(`${withdrawal_fn}`, data);
    exec(`python3 main.py create-keys -c ../${withdrawal_fn}`, { cwd: '/home/ferric/hardhat-dvt-staking/ssv-service/ssv' }, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
  });
}

app.post('/create-keys', (req, res) => {
    console.log(req.body.withdrawal_address);
    createValidatorConfig(req.body.withdrawal_address);
    res.sendStatus(200);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})