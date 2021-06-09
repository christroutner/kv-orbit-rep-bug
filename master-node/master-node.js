/*
  This is a 'master' IPFS node that generates the OrbitDB. The 'peer' node
  connects to this node and replicates the database.
*/

// Customize these variables.
const INIT_DB = true;
const DB_NAME = "test1003";

// Public npm libraries
const IPFS = require("ipfs");
const OrbitDB = require("orbit-db");

async function start() {
  try {
    // Ipfs Options
    const ipfsOptions = {
      repo: "./ipfsdata",
      start: true,
      config: {
        relay: {
          enabled: true, // enable circuit relay dialer and listener
          hop: {
            enabled: true // enable circuit relay HOP (make this node a relay)
          }
        },
        pubsub: true, // enable pubsub
        Swarm: {
          ConnMgr: {
            HighWater: 30,
            LowWater: 10
          }
        },
        Addresses: {
          Swarm: [`/ip4/0.0.0.0/tcp/${5100}`, `/ip4/0.0.0.0/tcp/${5101}/ws`]
        }
      }
    };

    const ipfs = await IPFS.create(ipfsOptions);

    // Set the 'server' profile so the node does not scan private networks.
    await ipfs.config.profiles.apply("server");

    const orbitdb = await OrbitDB.createInstance(ipfs, {
      directory: "./orbitdb/dbs/keyvalue"
    });

    const options = {
      accessController: {
        write: ["*"]
      }
    };

    const db = await orbitdb.keyvalue(DB_NAME, options);
    console.log(`db name: ${db.id}`);

    await db.load();

    // console.log("db: ", db);

    // Add data to the database.
    if (INIT_DB) {
      const hash1 = await db.put("one", { name: "bob" });
      console.log(`hash1: ${hash1}`);

      const hash2 = await db.put("two", { name: "alice" });
      console.log(`hash2: ${hash2}`);

      const hash3 = await db.put("three", { name: "sam" });
      console.log(`hash3: ${hash3}`);
    }
  } catch (err) {
    console.log("Error in start(): ", err);
  }
}
start();
