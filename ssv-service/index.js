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
    let validatorConfigData = JSON.stringify(validatorConfig);
    let validatorConfigFn = `${withdrawal_address}-validator_config.json`;
    let withdrawal_fn = `${withdrawal_address}-validator_config.json`;

    let validatorKeys = '';
    let depositData = '';

    fs.writeFileSync(`${validatorConfigFn}`, validatorConfigData);
    exec(`python3 main.py create-keys -c ../${validatorConfigFn}`, { cwd: '/home/ferric/hardhat-dvt-staking/ssv-service/ssv' }, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
      }
      console.log(`stdout: ${stdout}`);
      let so = stdout.split('\n');
      validatorKeys = so[3].replaceAll('\'', '').replace('"', '').replace('[', '').replace(']', '');
      depositData = so[5].replace('\'', '');
    });

    let keyshareConfig = 
    {
      "keystore_files": [
        `${validatorKeys}`
      ],
      "keystore_password": "",
      "operators": [
        {
          "id": 1,
          "pubkey": "LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBMVg2MUFXY001QUNLaGN5MTlUaEIKby9HMWlhN1ByOVUralJ5aWY5ZjAyRG9sd091V2ZLLzdSVUlhOEhEbHBvQlVERDkwRTVQUGdJSy9sTXB4RytXbwpwQ2N5bTBpWk9UT0JzNDE5bEh3TzA4bXFja1JsZEg5WExmbmY2UThqWFR5Ym1yYzdWNmwyNVprcTl4U0owbHR1CndmTnVTSzNCZnFtNkQxOUY0aTVCbmVaSWhjRVJTYlFLWDFxbWNqYnZFL2cyQko4TzhaZUgrd0RzTHJiNnZXQVIKY3BYWG1uelE3Vlp6ZklHTGVLVU1CTTh6SW0rcXI4RGZ4SEhSeVU1QTE3cFU4cy9MNUp5RXE1RGJjc2Q2dHlnbQp5UE9BYUNzWldVREI3UGhLOHpUWU9WYi9MM1lnSTU4bjFXek5IM0s5cmFreUppTmUxTE9GVVZzQTFDUnhtQ2YzCmlRSURBUUFCCi0tLS0tRU5EIFJTQSBQVUJMSUMgS0VZLS0tLS0K",
          "name": "Bloxstaking",
          "fee": 0
        },
        {
          "id": 2,
          "pubkey": "LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBeUtVWTVEUmZZREljengzcjhVY0UKTlpFMFdIQXFuV2FIRjZYRlUydVdObjVOVE94Zkt4ZmZaLzkyeVE1citQVkJPRmQrcHhILzI2QXJVT3dNL1lBRQpRbDZ0VzBtc1FqdUtIU1Q4aUtvTDRTNUt0aDNoeTBqeFRHR1ZZaWdjWG1vRURjd2YxaG8wdWRxRmlEN3dFWXN1CmZHa2E2U1ZQNnBab1NMaU9HZFRKUWVzVDI5WEVCdDZnblhMaFB1MER2K0xsQUJJQ1pqWEFTZWtpSFVKUHRjYlgKRjZFL0lScGpkWHVNSmUyOXZDcmZudXhWWk93a1ptdzJXdGljYlNDOVJpSFRYWUQ1dnVGakZXRHNZMERHUDhzOAoyc1haVHdsNWl4dEhlUWM2N1lLRFN6YU1MNnY1VUVZblhUTzZzNHFVSWVnTXJwZjd3S0xGVWxqRTMwbnNIaVBUCjBRSURBUUFCCi0tLS0tRU5EIFJTQSBQVUJMSUMgS0VZLS0tLS0K",
          "name": "Bloxstaking2",
          "fee": 0
        },
        {
          "id": 9,
          "pubkey": "LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBelc5VGNJMWxXbmUydkNqZzJlb2UKY3o3NnZ4OVU2QWgvTnZRT0dJY1JTbk5mUWc1amxjM0JuTUM4eW1pQTQzVHJDejl6UFVhUVozZG5idW9DZEY3awpoOWZKcVd3SFFrU2pFQ1ZtVytQS2FVWmQ4aW42cGVGbmgrZEowenR1cUx1aUlJMWQvU05xdGJUaFA2VjQ4TGxDCklsVUhXVFRaKzNVY2dBanlwenIxRmxYU2hGV0w0aGcxeXF3K0p1WW1yTnY2cGZaeWdVbTZQaTBVazVXUVZnUk4KR2RrU3BTb2ZYZERGcElWN0xBU3V0a2dGUytqVnpaL3E5bmh1ejVjNlJWaDYvV1hiZVpDbXhnMGU2R2hIVXY0bAp4SGNaSUkraWhzWk5KM3V5b2NiaWlubE5EaTNMK2hySEUxMExNeVRoN2lVSC8yd1k4MjJKMmdDSEZzNWhkVkNrCm53SURBUUFCCi0tLS0tRU5EIFJTQSBQVUJMSUMgS0VZLS0tLS0K",
          "name": "Bloxstaking3",
          "fee": 0
        },
        {
          "id": 42,
          "pubkey": "LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBNVV3SFltUnJoL3hwbWovd1RHcWwKLysvZEdNWFFlSkg0VUptSjNNWXhyMUU0aGF4ZkhLK3NzSkhXYzYvbWlpRTdZMTBxcy9sNzRvNHdGNnJ2SXYrVApTYnQ2UjdONXNKYUZsYnZ3M2ZCampiZElQTnBHQ0JTaXl3aTc3M3lQZy8vOG04OHMxNTNwYjZmVnViU2QxMzJWClpEZkhmMEdPdnA4b0hxcHY5ampsQ0NlV2phNXUzVzhqN2RwWDBsQTYvaTJRaW4yN3VESHViMHd1eWFEcGprNDcKWG1tOHV2d1VFTWw1L0trREg3Z2FXUjNzNkluZjR4TVpKbHEvMGplVkdoUll5bHg3RFE1WnVBNDNCSGNGMWtxMAo3ZHU0ejFUQ2tFN0ZIZlZRMTdFUnpwUHlmS2l5YlQ4UXdnb3VVV2hGUjJqK3ExbHZGbHJQR0U2OWpIWE9MVWM0CnV3SURBUUFCCi0tLS0tRU5EIFJTQSBQVUJMSUMgS0VZLS0tLS0K",
          "name": "Bloxstaking4",
          "fee": 0
        }
      ],
      "ssv_fee": 10
    }
    let keyshareData = JSON.stringify(keyshareConfig);
    let keyshareDataFn = `${withdrawal_address}-keyshare_config.json`;
    fs.writeFileSync(`${keyshareDataFn}`, keyshareData);
    exec(`python3 main.py generate-keyshares -c ../${keyshareDataFn}`, { cwd: '/home/ferric/hardhat-dvt-staking/ssv-service/ssv' }, (error, stdout, stderr) => {
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