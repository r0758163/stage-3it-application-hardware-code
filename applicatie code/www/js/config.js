// @ts-check

const config = {
    endpoint: #endpoint,
    key: #primarykey,
    databaseId: "stage-gianni-cosmos",
    containerId: "Users",
    partitionKey: { kind: "Hash", paths: ["/userid"] }
};

module.exports = config;

