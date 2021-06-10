# kv-orbit-rep-bug

This repository was created to help me chase down a bug I was experiencing in the P2WDB around replicating a key-value store OrbitDB.

There are three sub-directories:

- [master-node](./master-node) sets up a normal IPFS node with an KeyValue OrbitDB store.
- [peer-node](./peer-node) has variables at the top that should be customized. It will connect to the master node and replicate the database.
- [master-custom-ACL](./master-custom-ACL) implements a custom access controller for its KeyValue store. When the peer node tries to replicate the database, it replicates the bug I've been running up against.

## Good Output

When the peer node replicates the vanilla master node, it looks like this. This is the **GOOD** output:

```
db name: /orbitdb/zdpuAxV6JYd8dkeNc9pUVe6Z6Ea1Nr8ftduJY7M9MxR62YBFY/test1005
Connect to master node: /ip4/127.0.0.1/tcp/5100/p2p/QmQyUDcgx3wprSrv3qTNt1SuF4oYKy6tbSk2JnFqi3YiK3
replicate event fired
replicate address:  /orbitdb/zdpuAxV6JYd8dkeNc9pUVe6Z6Ea1Nr8ftduJY7M9MxR62YBFY/test1005
replicate entry:  {
  hash: 'zdpuAsFoDh8C5k31UbCWe4tFScijun3K1zaXuFwDsznhGWRrc',
  id: '/orbitdb/zdpuAxV6JYd8dkeNc9pUVe6Z6Ea1Nr8ftduJY7M9MxR62YBFY/test1005',
  payload: { op: 'PUT', key: 'three', value: { name: 'sam' } },
  next: [ 'zdpuAoVaeg6KSHYXAKSrRhrkVoWQeLfXXcBhb2QPtPuhEftpe' ],
  refs: [ 'zdpuB2uH1ZoFzDxnm36vtZq9uHShQuri78NM7EaFTjHLC9W1L' ],
  v: 2,
  clock: {
    id: '04834bfd620ec1cce87ffc0479f658559697c262530d97b614183802b2c272f5baa6a59d91b69ead845f9d85ad5024df8493e6dffe8e172edb72c132013ab39b7a',
    time: 3
  },
  key: '04834bfd620ec1cce87ffc0479f658559697c262530d97b614183802b2c272f5baa6a59d91b69ead845f9d85ad5024df8493e6dffe8e172edb72c132013ab39b7a',
  identity: {
    id: '0275447dd73aa6f2c0ef219384391b552cf2e1efa768aceb5bbca2dc78e815fc7e',
    publicKey: '04834bfd620ec1cce87ffc0479f658559697c262530d97b614183802b2c272f5baa6a59d91b69ead845f9d85ad5024df8493e6dffe8e172edb72c132013ab39b7a',
    signatures: {
      id: '30450221009a9500b61c0d4d740c267117257d5aac24142af1fc14a675e25f20dd319c164202200570769b28c0b7512b7c50bcfbdd8d49ff62e8f528c87a6b7c8fe0d08d9809f7',
      publicKey: '3045022100c51388a551bfedab037fb6584eb9133d693aad11596ea28d4ef8b6f654e766900220610fa6d4cb7713dea5544a812a3fb33da5bf68c578a97c6327d76b97b03cd9a4'
    },
    type: 'orbitdb'
  },
  sig: '3045022100c53eabb9643bf6e0eb8e3572855d2aaa872270080bc1a1c53c77a606ab11109e022072e1a6a41ea72e376e1e88450beeb1cc316dced6fff8879b2eec75edcde99cd7'
}
db._index:  KeyValueIndex { _index: {} }
replicate event fired
replicate address:  /orbitdb/zdpuAxV6JYd8dkeNc9pUVe6Z6Ea1Nr8ftduJY7M9MxR62YBFY/test1005
replicate entry:  zdpuAoVaeg6KSHYXAKSrRhrkVoWQeLfXXcBhb2QPtPuhEftpe
db._index:  KeyValueIndex { _index: { three: { name: 'sam' } } }
replicate event fired
replicate address:  /orbitdb/zdpuAxV6JYd8dkeNc9pUVe6Z6Ea1Nr8ftduJY7M9MxR62YBFY/test1005
replicate entry:  zdpuB2uH1ZoFzDxnm36vtZq9uHShQuri78NM7EaFTjHLC9W1L
db._index:  KeyValueIndex {
  _index: { three: { name: 'sam' }, two: { name: 'alice' } }
}
all:  {
  three: { name: 'sam' },
  two: { name: 'alice' },
  one: { name: 'bob' }
}

```

## Bad Output

When the peer node tries to replicate the master node with a custom access controller, it looks like this. This is the **BAD** output:

```
db name: /orbitdb/zdpuAngAcmgtNfybm8Ducmp8HH9JaCJE2pLzwpr3fS15DcNt2/test1004/_access
Connect to master node: /ip4/127.0.0.1/tcp/7100/p2p/QmW8dShXjpK4ou5gweL6gbuMWuAUzBqmQAfA4rR9cesz6N
replicate event fired
replicate address:  /orbitdb/zdpuAngAcmgtNfybm8Ducmp8HH9JaCJE2pLzwpr3fS15DcNt2/test1004/_access
replicate entry:  {
  hash: 'zdpuAzUkwtzX4WWbEMqKmgSSsqQuJu5jJ4SC8LFPAQD5Ycqwy',
  id: '/orbitdb/zdpuAngAcmgtNfybm8Ducmp8HH9JaCJE2pLzwpr3fS15DcNt2/test1004/_access',
  payload: { op: 'PUT', key: 'write', value: [ '*' ] },
  next: [ 'zdpuApLewr21agFucqrhyecWF39g6wn3SJS5T35fAGsEiJVaZ' ],
  refs: [
    'zdpuAvC1r3Jpxw9CWViThXDLW4BB97B2JLccRacBt4PUnognJ',
    'zdpuAp89XcVgy88RXYRCUqbXooix4ZSmwq1uJ2Vth43nxPt33'
  ],
  v: 2,
  clock: {
    id: '0472ff73c5efd52e071818f70cd5e48823c31aefd4d206b4993184880d21930f08c80c07fb5f69fff3f6a4b1dc1183f33b34e10c09da5a32db00bdfad565c995c8',
    time: 4
  },
  key: '0472ff73c5efd52e071818f70cd5e48823c31aefd4d206b4993184880d21930f08c80c07fb5f69fff3f6a4b1dc1183f33b34e10c09da5a32db00bdfad565c995c8',
  identity: {
    id: '034ab881dcab4fd208648b28fef24b78259a530e771e961768ca347aaada951316',
    publicKey: '0472ff73c5efd52e071818f70cd5e48823c31aefd4d206b4993184880d21930f08c80c07fb5f69fff3f6a4b1dc1183f33b34e10c09da5a32db00bdfad565c995c8',
    signatures: {
      id: '3045022100f83999e509e4890ec5497ecf34ed55aa1c43c592180f1345507adcd0ce30ecb102201e218c3ce44fd20ac89151b6ac4763fabe8ab79a278d68e9b83ba28b194877bc',
      publicKey: '304402204b158b351f0363f82daf2d5e27a43f6dd2b538305df9f9143091e26f65fce17702203c91b6267d4122bd4693f861d0219db835d780b3ae2b0ab6409143247a0985d8'
    },
    type: 'orbitdb'
  },
  sig: '304502210096b09dd7cb2cdb0f1c22ed74c37cc7f26e2b72f6df9286b282a0e66119058d2a022065bb287d9ebbb2d6a7b734b186d808361e9e50f8ef741660bbc8293da373fd37'
}
db._index:  KeyValueIndex { _index: {} }
replicate event fired
replicate address:  /orbitdb/zdpuAngAcmgtNfybm8Ducmp8HH9JaCJE2pLzwpr3fS15DcNt2/test1004/_access
replicate entry:  zdpuApLewr21agFucqrhyecWF39g6wn3SJS5T35fAGsEiJVaZ
db._index:  KeyValueIndex { _index: { write: [ '*' ] } }
replicate event fired
replicate address:  /orbitdb/zdpuAngAcmgtNfybm8Ducmp8HH9JaCJE2pLzwpr3fS15DcNt2/test1004/_access
replicate entry:  zdpuAvC1r3Jpxw9CWViThXDLW4BB97B2JLccRacBt4PUnognJ
db._index:  KeyValueIndex { _index: { write: [ '*' ] } }
replicate event fired
replicate address:  /orbitdb/zdpuAngAcmgtNfybm8Ducmp8HH9JaCJE2pLzwpr3fS15DcNt2/test1004/_access
replicate entry:  zdpuAp89XcVgy88RXYRCUqbXooix4ZSmwq1uJ2Vth43nxPt33
db._index:  KeyValueIndex { _index: { write: [ '*' ] } }
all:  { write: [ '*' ] }

```

## Summary

In the Good output, notice that the `db._index` value has the key and value of the entry. In the Bad output, the
