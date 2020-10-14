import * as oracledbWrapper from './oracledbWrapper';
import OracleDB from "oracledb";

describe("Unit Tests", () => {
    describe("Pool Tests", () => {
        it("Should Create Pool If Credentials Are Valid", async () => {
            const config: OracleDB.PoolAttributes = {
                user: 'system',
                password: 'parola',
                connectString: 'localhost/orclpdb1',
                poolMin: 1,
                poolMax: 10,
            };

            const pool = await oracledbWrapper.createPool(config);

            expect(pool).toBeDefined();
        })
    })
})