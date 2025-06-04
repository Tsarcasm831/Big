// LocalDatabase.js - Client-side database implementation using IndexedDB
export class LocalDatabase {
    constructor(dbName = 'oslDatabase', version = 1) {
        this.dbName = dbName;
        this.version = version;
        this.db = null;
        this.collections = new Map();
        this.initPromise = null;
        // Start initialization immediately
        this.initPromise = this.initializeDatabase();
    }

    async initializeDatabase() {
        if (this.db) {
            return Promise.resolve(); // Already initialized
        }

        return new Promise((resolve, reject) => {
            try {
                console.log('Opening IndexedDB database:', this.dbName);
                const request = indexedDB.open(this.dbName, this.version);
                
                request.onerror = (event) => {
                    console.error('Database error:', event.target.error);
                    reject(event.target.error);
                };

                request.onupgradeneeded = (event) => {
                    console.log('Database upgrade needed, creating stores');
                    const db = event.target.result;
                    // Create collections as needed
                    if (!db.objectStoreNames.contains('agents')) {
                        db.createObjectStore('agents', { keyPath: 'id', autoIncrement: true });
                        console.log('Created agents store');
                    }
                };

                request.onsuccess = (event) => {
                    this.db = event.target.result;
                    console.log('Database initialized successfully:', this.dbName);
                    resolve();
                };
            } catch (error) {
                console.error('Failed to initialize database:', error);
                reject(error);
            }
        });
    }

    async collection(collectionName) {
        // Wait for initialization to complete
        if (!this.db) {
            try {
                await this.initPromise;
            } catch (error) {
                console.error('Database initialization failed:', error);
                throw new Error('Database initialization failed');
            }
        }
        
        if (!this.collections.has(collectionName)) {
            this.collections.set(collectionName, new LocalCollection(this, collectionName));
        }
        return this.collections.get(collectionName);
    }

    async close() {
        if (this.db) {
            this.db.close();
            this.db = null;
        }
    }
}

class LocalCollection {
    constructor(database, collectionName) {
        this.database = database; // Store the database reference
        this.collectionName = collectionName;
        this.filters = {};
    }

    filter(filters) {
        this.filters = filters;
        return this;
    }

    async getList() {
        if (!this.database.db) {
            throw new Error('Database not initialized');
        }

        return new Promise((resolve, reject) => {
            try {
                const transaction = this.database.db.transaction([this.collectionName], 'readonly');
                const store = transaction.objectStore(this.collectionName);
                const request = store.getAll();

                request.onsuccess = (event) => {
                    const data = event.target.result;
                    let filteredData = data;
                    
                    for (const [key, value] of Object.entries(this.filters)) {
                        filteredData = filteredData.filter(item => item[key] === value);
                    }
                    
                    resolve(filteredData);
                };

                request.onerror = (event) => {
                    reject(event.target.error);
                };
            } catch (error) {
                reject(error);
            }
        });
    }

    async create(item) {
        if (!this.database.db) {
            throw new Error('Database not initialized');
        }

        return new Promise((resolve, reject) => {
            try {
                const transaction = this.database.db.transaction([this.collectionName], 'readwrite');
                const store = transaction.objectStore(this.collectionName);
                const request = store.add(item);

                request.onsuccess = () => {
                    resolve(item);
                };

                request.onerror = (event) => {
                    reject(event.target.error);
                };
            } catch (error) {
                reject(error);
            }
        });
    }

    async update(id, item) {
        if (!this.database.db) {
            throw new Error('Database not initialized');
        }

        return new Promise((resolve, reject) => {
            try {
                const transaction = this.database.db.transaction([this.collectionName], 'readwrite');
                const store = transaction.objectStore(this.collectionName);
                const request = store.put(item);

                request.onsuccess = () => {
                    resolve(item);
                };

                request.onerror = (event) => {
                    reject(event.target.error);
                };
            } catch (error) {
                reject(error);
            }
        });
    }

    async delete(id) {
        if (!this.database.db) {
            throw new Error('Database not initialized');
        }

        return new Promise((resolve, reject) => {
            try {
                const transaction = this.database.db.transaction([this.collectionName], 'readwrite');
                const store = transaction.objectStore(this.collectionName);
                const request = store.delete(id);

                request.onsuccess = () => {
                    resolve();
                };

                request.onerror = (event) => {
                    reject(event.target.error);
                };
            } catch (error) {
                reject(error);
            }
        });
    }
}
