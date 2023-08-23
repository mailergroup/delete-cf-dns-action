const _ = require('underscore');
const core = require('@actions/core');
const cf = require('cloudflare')({
    token: core.getInput('token')
});

function areWeTestingWithJest() {
    return process.env.JEST_WORKER_ID !== undefined;
}

async function getRecords() {
    let name = core.getInput('name');
    let zone = core.getInput('zone');
    let types = core.getInput('types');
    let page = 1;
    const pageSize = 100;

    const allRecords = [];

    let recordTypes = types.replace(/\s+/g, '').split(',');

    let hasMoreRecords = true;
    while (hasMoreRecords) {
        let resp = await cf.dnsRecords.browse(zone, { type: recordTypes, name, page, per_page: pageSize });
        allRecords.push(...resp.result);

        if (resp.result_info && resp.result_info.page < resp.result_info.total_pages) {
            page++;
        } else {
            hasMoreRecords = false;
        }
    }

    return allRecords;
}

async function deleteRecord(id) {
    let zone = core.getInput('zone');
    if (areWeTestingWithJest()) {
        console.log("would have deleted the record " + id);
    } else {
        await cf.dnsRecords.del(zone, id);
    }
}

async function run() {
    try {
        const records = await getRecords();

        for (const record of records) {
            const name = record['name'];
            const id = record['id'];

            if (record['type'] === 'TXT') {
                await deleteRecord(id);

                if (name.startsWith('a-')) {
                    const aRecordId = id.replace(/^txt/, '');
                    await deleteRecord(aRecordId);
                }
            }
        }
    } catch (e) {
        console.log('There has been a problem: ' + e.message);
    }
}

run();
