exports.up = db => {
  return Promise.all([
    db.tableCreate('users'),
    db.tableCreate('permissions'),
    db.tableCreate('sessions')
  ])
}

exports.down = db => {
  return Promise.all([
    db.tableDrop('users'),
    db.tableDrop('permissions'),
    db.tableCreate('sessions')
  ])
}
