# iqps-logger
Logging to the IPFS

The repo is a server which logs to the IPFS
It contains to major endpoints

### POST `/write`
The endpoint accepts POST requests which contain data in JSON format like below
```
{
  "activity": "string",
  "from": "string",
  "to": "string",
  "timestamp": "string"
}
```

### GET `/read`
The endpoint returns a table containing the List of transactions


