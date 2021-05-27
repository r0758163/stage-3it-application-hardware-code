// @ts-check

const config = {
    endpoint: "#enpoint",
    key: "#key",
    databaseId: "stage-gianni-cosmos",
    containerId: "Users",
    partitionKey: {
        kind: "Hash",
        paths: ["/userid"]
    }
};

module.exports = config;
