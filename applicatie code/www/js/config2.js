// @ts-check

const config2 = {
    endpoint: #endpoint,
    key: #primarykey,
    databaseId: "stage-gianni-cosmos",
    containerId: "Items",
    partitionKey: { kind: "Hash", paths: ["/frameid"] }
};

module.exports = config2;
