import oracledb from 'oracledb';

let pool: oracledb.Pool;

export const createPool = (config: oracledb.PoolAttributes): Promise<oracledb.Pool> => {
  return new Promise((resolve, reject) => {
    oracledb.createPool(config, (err, p) => {
      if (err) return reject(err);

      pool = p;

      resolve(pool);
    });
  });
};

export const terminatePool = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (pool) {
      pool.terminate((err) => {
        if (err) return reject(err);

        resolve();
      });
    } else {
      resolve();
    }
  });
};

export const getPool = () => pool;

export const getConnection = (): Promise<oracledb.Connection> => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) return reject(err);

      resolve(connection);
    });
  });
};

export const execute = <T>(
  sql: string,
  bindParams: oracledb.BindParameters,
  options: oracledb.ExecuteOptions,
  connection: oracledb.Connection,
): Promise<oracledb.Result<T>> => {
  return new Promise((resolve, reject) => {
    connection.execute<T>(sql, bindParams, options, (err, results) => {
      if (err) return reject(err);

      resolve(results);
    });
  });
};

export const releaseConnection = (connection: oracledb.Connection) => {
  connection.release((err) => {
    // tslint:disable-next-line: no-console
    if (err) console.error(err);
  });
};

export const simpleExecute = <T>(
  sql: string,
  bindParams: oracledb.BindParameters,
  options: oracledb.ExecuteOptions,
): Promise<oracledb.Result<T>> => {
  return new Promise((resolve, reject) => {
    getConnection()
      .then((connection: oracledb.Connection) => {
        execute<T>(sql, bindParams, options, connection)
          .then((results) => {
            resolve(results);

            process.nextTick(() => releaseConnection(connection));
          })
          .catch((err) => {
            reject(err);

            process.nextTick(() => releaseConnection(connection));
          });
      })
      .catch(reject);
  });
};