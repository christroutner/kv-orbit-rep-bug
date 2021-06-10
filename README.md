# kv-orbit-rep-bug

This repository was created to help me chase down a bug I was experiencing in the P2WDB around replicating a key-value store OrbitDB.

There are three sub-directories:

- [master-node](./master-node) sets up a normal IPFS node with an KeyValue OrbitDB store.
- [peer-node](./peer-node) has variables at the top that should be customized. It will connect to the master node and replicate the database.
- [master-custom-ACL](./master-custom-ACL) implements a custom access controller for its KeyValue store.

## Summary

Through the process of trying to recreate the bug I was facing, I discovered the issue was how the ACL was constructed. I had tried to copy this [ipfs ACL](https://github.com/orbitdb/orbit-db-access-controllers/blob/main/src/ipfs-access-controller.js), which turned out the be the mistake. Instead, I should have started with this [orbitdb ACL](https://github.com/orbitdb/orbit-db-access-controllers/blob/main/src/orbitdb-access-controller.js), then only modified the `canAppend()` method.
