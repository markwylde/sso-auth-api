exports.up = async db => {
  await Promise.all([
    db.tableCreate('apps'),
    db.tableCreate('users'),
    db.tableCreate('permissions'),
    db.tableCreate('sessions')
  ])

  await Promise.all([
    db.table('users').indexCreate('username'),
    db.table('apps').indexCreate('title')
  ])
}

exports.down = db => {
  return Promise.all([
    db.tableDrop('apps'),
    db.tableDrop('users'),
    db.tableDrop('permissions'),
    db.tableDrop('sessions')
  ])
}
