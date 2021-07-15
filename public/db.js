let db;
const dbName = "BudgetDB";
const dbVersion = 1;
const request = indexedDB.open(dbName, dbVersion);

request.onupgradeneeded = (event) => {

    console.log("An upgrade is require for", dbName);
    db = event.target.result;

    if (db.objectStoreNames.length === 0) {
        db.createObjectStore("transactions", {autoIncrement: true});
    }
};

request.onerror = (event) => {
    console.log(`Woops! ${event.target.errorCode}`);
};

function saveToDb() {

    console.log("Save to database invoked");

    let transaction = db.transaction(["transactions"], "readwrite");
    const store = transaction.objectStore("transactions");
    const getAll = store.getAll();

    // If the request was successful
    getAll.onsuccess = function () {
        
        // If there are items in the store, we need to bulk add them when we are back online
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*", "Content-Type": "application/json",
                },
            })
            .then((response) => response.json())
            .then((res) => {
                
                // If our returned response is not empty
                if (res.length !== 0) {
                    
                    // Open another transaction to transactions with the ability to read and write
                    transaction = db.transaction(["transactions"], "readwrite");
                
                    // Assign the current store to a variable
                    const currentStore = transaction.objectStore("transactions");
                
                    // Clear existing entries because our bulk add was successful
                    currentStore.clear();
                    console.log("Clearing store 🧹");
                }
            });
        }
    };
}