const _ = require('underscore')
const core = require('@actions/core');
const cf = require('cloudflare')({
  token: core.getInput('token')
});

function areWeTestingWithJest() {
  return process.env.JEST_WORKER_ID !== undefined;
}

async function getRecords() {
  let name = core.getInput('name')
  let zone = core.getInput('zone')
  let types = core.getInput('types')

  const records = []

  let recordTypes = types.replace(/\s+/g, '').split(',');

  for (const type of recordTypes) {
    let resp = await cf.dnsRecords.browse(zone, { type, name })
    records.push(...resp.result)
  };

  return records
}

async function deleteRecord(id) {
  let zone = core.getInput('zone')
  if (areWeTestingWithJest()) {
    console.log("would have deleted the record " + id)
  } else {
    await cf.dnsRecords.del(zone, id)
  }
}

async function run() {
  getRecords()
    .catch(e => {
      console.log('There has been a problem: ' + e.message);
    }).then(records => {
      for (const record of records) {
        deleteRecord(record['id'])
      };
    });
}

run();
