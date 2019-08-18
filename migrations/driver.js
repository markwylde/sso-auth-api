const rethinkdb = require('rethinkdbdash')

const servers = [{
  host: process.env['DB_HOST'], port: process.env['DB_PORT']
}]

let db
module.exports = {
  init: async () => {
    db = rethinkdb({ servers })

    const dbs = await db.dbList()
    if (!dbs.includes(process.env['DB_NAME'])) {
      await db.dbCreate(process.env['DB_NAME'])
      await db.db(process.env['DB_NAME']).tableCreate('migrations')
    }

    db = rethinkdb({ servers, db: process.env['DB_NAME'] })
  },

  finish: async () => {
    await db.getPoolMaster().drain()
    process.exit()
  },

  getMigrationState: id => db.table('migrations').get(id),

  setMigrationUp: id => db.table('migrations').insert({id}),

  setMigrationDown: id => db.table('migrations').get(id).delete(),

  get db() {
    return db
  }
}
