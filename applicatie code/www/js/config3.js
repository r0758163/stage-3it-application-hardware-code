// @ts-check

const config3 = {
    endpoint: "https://cosmos-stage-gianni-serverless.documents.azure.com:443/",
    key: "VMrTTA0rM9MlqNMKpKj3Gyq4DWp4lJe8gh1koWFmIqHMickBOo43WL292oK2rO4rjafb9Rj3oNa99hYAOAMwHw==",
    databaseId: "stage-gianni-cosmos",
    containerId: "Klanten",
    partitionKey: { kind: "Hash", paths: ["/klantid"] }
};

module.exports = config3;
