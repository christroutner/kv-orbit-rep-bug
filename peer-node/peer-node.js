/*
  This is a 'master' IPFS node that generates the OrbitDB. The 'peer' node
  connects to this node and replicates the database.
*/

// Customize these variables.
const MASTER_NODE =
  "/ip4/127.0.0.1/tcp/5100/p2p/QmZ1WQExQmnBECZyUB4woEKo7D2G7YZErSuN7HYxGJnzS9";
const DB_NAME =
  "/orbitdb/zdpuAntT14Rvn25AC5rnKg79RfKGUtvm2C8ekM2x5G91J6nsy/test1003";

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
          Swarm: [`/ip4/0.0.0.0/tcp/${6100}`, `/ip4/0.0.0.0/tcp/${6101}/ws`]
        }
      }
    };

    const ipfs = await IPFS.create(ipfsOptions);

    // Set the 'server' profile so the node does not scan private networks.
    // await ipfs.config.profiles.apply("server");

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

    await ipfs.swarm.connect(MASTER_NODE);
    console.log(`Connect to master node: ${MASTER_NODE}`);

    // console.log("db: ", db);

    db.events.on("replicate", async (address, entry) => {
      try {
        console.log("replicate event fired");
        console.log("replicate address: ", address);
        console.log("replicate entry: ", entry);
        console.log("db._index: ", db._index);
      } catch (err) {
        console.log("Error in replicate event: ", err);
      }
    });

    setTimeout(function() {
      const all = db.all;
      console.log("all: ", all);
    }, 7000);
  } catch (err) {
    console.log("Error in start(): ", err);
  }
}
start();
