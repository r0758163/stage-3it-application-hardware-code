// @ts-check

const config = {
    endpoint: "https://cosmos-stage-gianni-serverless.documents.azure.com:443/",
    key: #primarykey,
    databaseId: "stage-gianni-cosmos",
    containerId: "Users",
    partitionKey: { kind: "Hash", paths: ["/userid"] }
};

module.exports = config;

