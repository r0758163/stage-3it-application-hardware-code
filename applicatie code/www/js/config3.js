// @ts-check

const config3 = {
    endpoint: "https://cosmos-stage-gianni-serverless.documents.azure.com:443/",
    key: #primarykey,
    databaseId: "stage-gianni-cosmos",
    containerId: "Klanten",
    partitionKey: { kind: "Hash", paths: ["/klantid"] }
};

module.exports = config3;
