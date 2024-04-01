import PouchDB from "pouchdb";
import upsert from "pouchdb-upsert";
import { standardCatch } from "../components/Forum/New";

export const abbreviateNumber = (num) => {
  var newnum = String(num);
  var app = null;
  const suff = ["", "k", "m", "b", "t"];
  for (let i = 0; i < suff.length; i++) {
    if (newnum.length > 3) {
      newnum = newnum.substring(0, newnum.length - 3);
    } else {
      app = i;
      break;
    }
  }
  return newnum + suff[app];
};

/*navigator.permissions && navigator.permissions.query({name: 'geolocation'})
.then(function(PermissionStatus) {
  if (PermissionStatus.state == 'granted') {
        //allowed
  } else if (PermissionStatus.state == 'prompt') {
        // prompt - not yet grated or denied
  } else {
      //denied
  }
})*/
/*const getPermissions = () =>
navigator.permissions
.query({ name: "geolocation" })
.then((permissionStatus) => {
permissionStatus.onchange = (state) => {
  //'granted', 'denied', or 'prompt'.
  if (state === "denied") {
    this.setState({ deviceLocation: false });
  }
  console.log(state);
};
})
.catch(standardCatch);*/

/*

export class PDB {
  constructor(name) {
    this.db = new PouchDB("thumbprint");
  }
  async getAllNotes() {
    let allNotes = await this.db
      .allDocs({ include_docs: true })
      .catch(standardCatch);
    let notes = {};

    allNotes.rows.forEach((n) => (notes[n.id] = n.doc));

    return notes;
  }

  async createNote(note) {
    note.createdAt = new Date();
    note.updatedAt = new Date();

    const res = note._id
      ? await this.db.put({ ...note }).catch((err) => {
          if (err.message === "Document update conflict") {
            this.updateNote(note);
          }
          console.log(err.message);
        })
      : await this.db
          .post({ ...note })
          .then(() => "success")
          .catch(standardCatch);

    return res;
  }
  async updateNote(note) {
    note.updatedAt = new Date();

    const res = await this.db.put({ ...note }).catch(standardCatch);
    return res;
  }

  async deleteNote(note) {
    await this.db.remove(note).catch(standardCatch);
  }
}*/

/**
 *
 * destroy, read, set pouch-db handler(s)
 */
const deletion = (d, db) => db.remove(d).catch(standardCatch);
const destroy = (db) => db.destroy();
const set = (db, c) =>
  !c._id
    ? window.alert(
        "pouchdb needs ._id key:value: JSON.parse= " + JSON.parse(c)
      ) &&
      db
        .destroy()
        .then(() => null)
        .catch(standardCatch)
    : db //has upsert plugin from class constructor
        .upsert(c._id, (copy) => {
          copy = { ...c }; //pouch-db \(construct, protocol)\
          return copy; //return a copy, don't displace immutable object fields
        })
        .then(
          () => null /*"success"*/
          /** or
          notes.find((x) => x._id === c._id)
            ? this.db
              .post(c)
              .then(() => null)
              .catch(standardCatch)
          : deletion(c) && set(db, c);  
          */
        )
        .catch(standardCatch);
const read = async (db, notes /*={}*/) =>
  //let notes = {};
  await db
    .allDocs({ include_docs: true })
    .then(
      (
        allNotes //new Promise cannot handle JSON objects, Promise.all() doesn't
      ) =>
        Promise.all(
          allNotes.rows.map(async (n) => await (notes[n.doc.key] = n.doc))
        )
      // && and .then() are functionally the same;
    )
    .catch(standardCatch);
const optsForPouchDB = {
  revs_limit: 1, //revision-history
  auto_compaction: true //zipped...
};
export class Pouchredux {
  constructor(name) {
    this.deletion = (d, db) => db.remove(d).catch(standardCatch);
    this.destroy = (db) => db.destroy();
    this.set = (db, c) =>
      !c._id
        ? window.alert(
            "pouchdb needs ._id key:value: JSON.parse= " + JSON.parse(c)
          )
        : //await db.destroy()
          db //has upsert plugin from class constructor
            .upsert(c._id, (copy) => {
              copy = { ...c }; //pouch-db \(construct, protocol)\
              return copy; //return a copy, don't displace immutable object fields
            })
            .then(
              () => null /*"success"*/
              /** or
          notes.find((x) => x._id === c._id)
            ? this.db
              .post(c)
              .then(() => null)
              .catch(standardCatch)
          : deletion(c) && set(db, c);
          */
            )
            .catch(standardCatch);
    this.read = async (db, notes /*={}*/) =>
      //let notes = {};
      await db
        .allDocs({ include_docs: true })
        .then(
          (
            allNotes //new Promise cannot handle JSON objects, Promise.all() doesn't
          ) =>
            Promise.all(
              allNotes.rows.map(async (n) => await (notes[n.doc.key] = n.doc))
            )
          // && and .then() are functionally the same;
        )
        .catch(standardCatch);
    this.optsForPouchDB = {
      revs_limit: 1,
      auto_compaction: true //zipped...
    };
    //return name
    return {
      read: this.read,
      set: this.set,
      destroy: this.destroy,
      deletion: this.deletion,
      optsForPouchDB
    };
  }
}

export class CDB {
  //Country caching for phone-input module-dependency
  constructor(name) {
    PouchDB.plugin(upsert);
    const title = "meCountry";
    this.db = new PouchDB(title, optsForPouchDB);
  }
  deleteKeys = () => destroy(this.db);
  setCountry = async (key) =>
    await new Promise((resolve) => resolve(set(this.db, key)));
  readCountry = async (notes = {}) =>
    //let notes = {};
    await read(this.db, notes);
}

export class ADB {
  constructor(name) {
    PouchDB.plugin(upsert);
    const title = "meAuth";
    this.db = new PouchDB(title, optsForPouchDB);
  }
  deleteKeys = () => destroy(this.db);
  store = (key) => set(this.db, key);
  readAuth = async (notes = {}) =>
    //let notes = {};
    await read(this.db, notes);
}

export const parseAuthObj = (meAuth) => {
  var {
    uid,
    displayName,
    photoURL,
    email,
    emailVerified,
    phoneNumber,
    isAnonymous,
    tenantId,
    providerData,
    apiKey,
    appName,
    authDomain,
    stsTokenManager,
    refreshToken,
    accessToken,
    expirationTime,
    redirectEventId,
    lastLoginAt,
    createdAt,
    multiFactor
  } = meAuth;
  return {
    _id: uid,
    uid,
    displayName,
    photoURL,
    email,
    emailVerified,
    phoneNumber,
    isAnonymous,
    tenantId,
    providerData,
    apiKey,
    appName,
    authDomain,
    stsTokenManager,
    refreshToken,
    accessToken,
    expirationTime,
    redirectEventId,
    lastLoginAt,
    createdAt,
    multiFactor: JSON.stringify(multiFactor)
  };
};
