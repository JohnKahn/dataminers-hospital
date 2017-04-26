const _     = require('lodash');
const mysql = require('mysql');
const pool  = mysql.createPool('mysql://kj7vk9fjlhh1s7ha:dxlsm0gb0oay3qka@wvulqmhjj9tbtc1w.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/hfhnbkkmuo7ue7a3?connectionLimit=100');

exports.getFields = function(tableName, callback) {
  pool.getConnection(function(err, conn) {
    if (err) {
      console.log(err);
      callback(true);
      return;
    }

    conn.query('SHOW columns FROM ??', [tableName], function(err, results) {
      conn.release();
      if (err) {
        console.log(err);
        callback(true);
        return;
      }

      callback(false, results);
    });
  });
}

exports.query = function(queryData, callback) {
  let sql = 'SELECT * FROM ??';

  if (Object.keys(queryData[1]).length !== 0) {
    sql += ' WHERE 1=1';
    
    let vars = [queryData[0]];
    _.forEach(queryData[1], function(value, key) {
      sql += ' AND ' + key + '=?';
      vars.push(value);
    });
    queryData = vars;
  }

  pool.getConnection(function(err, conn) {
    if (err) {
      console.log(err);
      callback(true);
      return;
    }
    console.log(queryData);
    let query = conn.query(sql, queryData, function(err, results) {
      conn.query('UPDATE stats SET ?? = ?? + 1 WHERE ?? = ?', ['value', 'value', 'key', 'QUERY_COUNT'], function(err, results) {
        conn.release();
      });

      if (err) {
        console.log(err);
        callback(true);
        return;
      }

      callback(false, results);
    });

    console.log(query.sql);
  })
}

exports.post = function(sql, vars, callback) {
  pool.getConnection(function(err, conn) {
    if (err) {
      console.log(err);
      callback(true);
      return;
    }
    
    let query = conn.query(sql, queryData, function(err, results) {
      conn.query('UPDATE stats SET ?? = ?? + 1 WHERE ?? = ?', ['value', 'value', 'key', 'QUERY_COUNT'], function(err, results) {
        conn.release();
      });

      if (err) {
        console.log(err);
        callback(true);
        return;
      }

      callback(false, results);
    });

    console.log(query.sql);
  });
}