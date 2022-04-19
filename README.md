# auto-upload-ip-to-minio
upload ip to minio by cron

# install
```
npm i auto-upload-ip-to-minio -S
```

# usage
```js

const { createTask } = require('auto-upload-ip-to-minio')
const minio = require('minio')

const client = new minio.Client({
  endPoint: 's3.example.com',
  port: 443,
  useSSL: true,
  accessKey: 'MINIO_ACCESS_KEY',
  secretKey: 'MINIO_SECRET_KEY'
})

createTask({
  client,
  list:[
    {
      bucket: 'bucket-a',
      object: 'ddns/a.example.com',
      jsonpath: '$["interfaceName"][?(@.family=="IPv4")].address'
    },
    {
      bucket: 'bucket-a',
      object: 'ddns/b.example.com',
      jsonpath: '$["interfaceName"][?(@.family=="IPv4")].address'
    }
  ],
  cronString: '* * * * * *'
})

```
# more

[jsonpath](https://github.com/dchester/jsonpath)

[cron](https://github.com/node-cron/node-cron)
