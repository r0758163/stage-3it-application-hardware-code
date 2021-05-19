// @ts-check

const config2 = {
    endpoint: "https://cosmos-stage-gianni-serverless.documents.azure.com:443/",
    key: #primarykey,
    databaseId: "stage-gianni-cosmos",
    containerId: "Items",
    partitionKey: { kind: "Hash", paths: ["/frameid"] }
};

module.exports = config2;
