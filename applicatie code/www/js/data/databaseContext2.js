
// import config from '../config';
// import CosmosClient from '/@azure/cosmos';
const config = require("../config2");
const CosmosClient = require("@azure/cosmos").CosmosClient;

async function create(client, databaseId, containerId) {
    const partitionKey = config.partitionKey;


    const { database } = await client.databases.createIfNotExists({
        id: databaseId
    });
    // console.log(`created database:\n${database.id}\n`);

    const { container } = await client
        .database(databaseId)
        .containers.createIfNotExists(
            {
                id: containerId, partitionKey
            },{offerThroughput: 400}
        );
    // console.log(`created container:\n${container.id}\n`);


}
module.exports = { create };

