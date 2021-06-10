/*
  Creates an Orbit-DB Access Controller with a 50% chance of success when
  writing data. It's an exercise for creating a custom ACL.
*/

// Public npm libraries
const AccessController = require("orbit-db-access-controllers/src/access-controller-interface");
const pMapSeries = require("p-map-series");

// Local libraries
const ensureAddress = require("./ensure-ac-address");

let _this;

// Based on orbitdb-access-controller.js:
// https://github.com/orbitdb/orbit-db-access-controllers/blob/main/src/orbitdb-access-controller.js
class CustomAccessController extends AccessController {
  constructor(orbitdb, options) {
    super();
    this._orbitdb = orbitdb;
    this._db = null;
    this._options = options || {};

    _this = this;
  }

  /* Factory */
  static async create(orbitdb, options = {}) {
    const ac = new CustomAccessController(orbitdb, options);

    // console.log('orbitdb: ', orbitdb)
    console.log("create options: ", options);

    await ac.load(
      options.address || options.name || "default-access-controller"
    );

    // Add write access from options
    if (options.write && !options.address) {
      await pMapSeries(options.write, async e => ac.grant("write", e));
    }

    return ac;
  }

  async load(address) {
    if (this._db) {
      await this._db.close();
    }

    // Force '<address>/_access' naming for the database
    this._db = await this._orbitdb.keyvalue(ensureAddress(address), {
      // use ipfs controller as a immutable "root controller"
      accessController: {
        type: "ipfs",
        write: this._options.admin || [this._orbitdb.identity.id]
      },
      sync: true
    });

    this._db.events.on("ready", this._onUpdate.bind(this));
    this._db.events.on("write", this._onUpdate.bind(this));
    this._db.events.on("replicated", this._onUpdate.bind(this));

    await this._db.load();
  }

  // Returns the type of the access controller
  static get type() {
    return "halfAndHalf";
  }

  // Returns the address of the OrbitDB used as the AC
  get address() {
    return this._db.address;
  }

  // Return true if entry is allowed to be added to the database
  async canAppend(entry, identityProvider) {
    try {
      console.log("canAppend entry: ", entry);

      // 50% chance of entry being accepted into the database.
      // const rndNum = Math.random();
      // if (rndNum < 0.5) {
      //   return false;
      // } else {
      //   return true;
      // }

      return true;
    } catch (err) {
      console.log(
        "Error in pay-to-write-access-controller.js/canAppend(). Returning false. Error: \n",
        err
      );
      return false;
    }
  }

  get capabilities() {
    if (this._db) {
      const capabilities = this._db.index;

      const toSet = e => {
        const key = e[0];
        capabilities[key] = new Set([...(capabilities[key] || []), ...e[1]]);
      };

      // Merge with the access controller of the database
      // and make sure all values are Sets
      Object.entries({
        ...capabilities,
        // Add the root access controller's 'write' access list
        // as admins on this controller
        ...{
          admin: new Set([
            ...(capabilities.admin || []),
            ...this._db.access.write
          ])
        }
      }).forEach(toSet);

      return capabilities;
    }
    return {};
  }

  get(capability) {
    return this.capabilities[capability] || new Set([]);
  }

  async close() {
    await this._db.close();
  }

  async save() {
    // return the manifest data
    return {
      address: this._db.address.toString()
    };
  }

  async grant(capability, key) {
    console.log("grant capability: ", capability);
    console.log("grant key: ", key);

    // Merge current keys with the new key
    const capabilities = new Set([
      ...(this._db.get(capability) || []),
      ...[key]
    ]);
    await this._db.put(capability, Array.from(capabilities.values()));
  }

  async revoke(capability, key) {
    const capabilities = new Set(this._db.get(capability) || []);
    capabilities.delete(key);
    if (capabilities.size > 0) {
      await this._db.put(capability, Array.from(capabilities.values()));
    } else {
      await this._db.del(capability);
    }
  }

  /* Private methods */
  _onUpdate() {
    this.emit("updated");
  }
}

module.exports = CustomAccessController;
