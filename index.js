const os = require('os');
const jp = require('jsonpath');
const assert = require('assert');
const cron = require('node-cron');

function queryInterfaces(jsonpath) {
  const interFaces = os.networkInterfaces();
  return jp.query(interFaces, jsonpath)
}

async function uploadListToMinio(client, list) {
  return Promise.all(list.map(({
    bucket,
    object,
    jsonpath
  }) => {
    const ips = queryInterfaces(jsonpath);
    if (ips.length === 0) {
      console.log(`${jsonpath} is empty`);
      return;
    }

    return client.putObject(bucket, object, ips[0])
      .then(() => {
        console.log('success upload', bucket, object, ips[0])
      })
      .catch(err => {
        console.log(err)
      })
  }))
}


function createTask({
  client,

  list = [],
  cronString = '* * * * *' // per minutes

} = {}) {
  assert(client, 'minio client is required');

  return cron.schedule(cronString, () => {
    uploadListToMinio(client, list)
  })
}

module.exports = {
  createTask,

  uploadListToMinio
}