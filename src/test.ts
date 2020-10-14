import * as oracledbWrapper from './index';
import OracleDB from 'oracledb';

describe('Unit Tests', () => {
  describe('Pool Tests', () => {
    it('Should Create Pool When Credentials Are Valid', async () => {
      const config: OracleDB.PoolAttributes = {
        user: 'system',
        password: 'parola',
        connectString: 'localhost/orclpdb1',
        poolMin: 1,
        poolMax: 10,
      };

      const pool = await oracledbWrapper.createPool(config);

      expect(pool).toBeDefined();
    });
    it('Should Make Query When Credentials Are Valid', async () => {
      const config: OracleDB.PoolAttributes = {
        user: 'system',
        password: 'parola',
        connectString: 'localhost/orclpdb1',
        poolMin: 1,
        poolMax: 10,
      };

      const pool = await oracledbWrapper.createPool(config);
      const result = await oracledbWrapper.simpleExecute('SELECT 1 FROM DUAL', {}, {});

      expect(pool).toBeDefined();
      expect(result).toBeDefined();
      expect(result.rows).toBeDefined();
      const rows = result.rows ?? [];
      expect(rows[0]).toEqual([1]);
    });
    it('Should Not Create Pool When Credentials Are Invalid', async () => {
      const config: OracleDB.PoolAttributes = {
        user: 'system',
        password: 'parolagresita',
        connectString: 'localhost/orclpdb1',
        poolMin: 1,
        poolMax: 10,
      };

      oracledbWrapper.createPool(config).catch((error) => {
        expect(error).toBeDefined();
      });
    });
    it('Should Not Return A Connection When The Pool Is Terminated', async () => {
      const config: OracleDB.PoolAttributes = {
        user: 'system',
        password: 'parola',
        connectString: 'localhost/orclpdb1',
        poolMin: 1,
        poolMax: 10,
      };

      await oracledbWrapper.createPool(config);
      await oracledbWrapper.terminatePool();

      oracledbWrapper.getConnection().catch((error) => {
        expect(error).toBeDefined();
      });
    });
    it('Should Not Make Query When The Pool Is Terminated', async () => {
      const config: OracleDB.PoolAttributes = {
        user: 'system',
        password: 'parola',
        connectString: 'localhost/orclpdb1',
        poolMin: 1,
        poolMax: 10,
      };

      await oracledbWrapper.createPool(config);
      await oracledbWrapper.terminatePool();
      oracledbWrapper.simpleExecute('SELECT 1 FROM DUAL', {}, {}).catch((error) => {
        expect(error).toBeDefined();
      });
    });
  });
});
