// @ts-check

const config2 = {
    endpoint: "#endpoint",
    key: "#key",
    databaseId: "stage-gianni-cosmos",
    containerId: "Items",
    partitionKey: {
        kind: "Hash",
        paths: ["/frameid"]
    }
};

module.exports = config2;
