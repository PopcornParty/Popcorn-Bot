const fs = require('fs');
const path = require('path');
function flatten(params) {
  if (params.length === 1 && Array.isArray(params[0])) return params[0];
  return params;
}
class CompatStatement {
  constructor(owner, sql) { this.owner = owner; this.sql = sql; }
  run(...params) {
    this.owner.raw.run(this.sql, flatten(params));
    this.owner.save();
    return { changes: this.owner.raw.getRowsModified() };
  }
  get(...params) {
    const stmt = this.owner.raw.prepare(this.sql);
    try {
      stmt.bind(flatten(params));
      if (!stmt.step()) return undefined;
      const cols = stmt.getColumnNames();
      const vals = stmt.get();
      const row = {};
      cols.forEach((col, i) => { row[col] = vals[i]; });
      return row;
    } finally { stmt.free(); }
  }
  all(...params) {
    const stmt = this.owner.raw.prepare(this.sql);
    try {
      stmt.bind(flatten(params));
      const rows = [];
      const cols = stmt.getColumnNames();
      while (stmt.step()) {
        const vals = stmt.get();
        const row = {};
        cols.forEach((col, i) => { row[col] = vals[i]; });
        rows.push(row);
      }
      return rows;
    } finally { stmt.free(); }
  }
}
class CompatDatabase {
  constructor(raw, filePath) { this.raw = raw; this.filePath = filePath; }
  exec(sql) { this.raw.run(sql); this.save(); return this; }
  pragma() { return this; }
  prepare(sql) { return new CompatStatement(this, sql); }
  save() {
    if (!this.filePath) return;
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    fs.writeFileSync(this.filePath, Buffer.from(this.raw.export()));
  }
}
async function openDatabase(filePath) {
  const initSqlJs = require('sql.js');
  const wasmDir = path.dirname(require.resolve('sql.js'));
  const SQL = await initSqlJs({ locateFile: (file) => path.join(wasmDir, file) });
  const raw = filePath && fs.existsSync(filePath) ? new SQL.Database(fs.readFileSync(filePath)) : new SQL.Database();
  return new CompatDatabase(raw, filePath);
}
module.exports = { openDatabase, CompatDatabase };
