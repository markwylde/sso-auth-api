exports.up = db => {
  return Promise.all([
    db.tableCreate('apps'),
    db.tableCreate('users'),
    db.tableCreate('permissions'),
    db.tableCreate('sessions')
  ])
}

exports.down = db => {
  return Promise.all([
    db.tableDrop('apps'),
    db.tableDrop('users'),
    db.tableDrop('permissions'),
    db.tableCreate('sessions')
  ])
}
