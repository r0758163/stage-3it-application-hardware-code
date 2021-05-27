// @ts-check

const config3 = {
    endpoint: "#endpoint",
    key: "#key",
    databaseId: "stage-gianni-cosmos",
    containerId: "Klanten",
    partitionKey: {
        kind: "Hash",
        paths: ["/klantid"]
    }
};

module.exports = config3;
