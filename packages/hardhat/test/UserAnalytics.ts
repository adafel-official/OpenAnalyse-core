import { expect } from "chai";
import { ethers } from "hardhat";
import { UserAnalytics } from "../typechain-types";
import { encodeBytes32String } from "ethers";

describe("UserAnalytics", function () {
  // We define a fixture to reuse the same setup in every test.

  let UserAnalytics: UserAnalytics;

  // const [owner, dapp1, dapp2, dapp3, dapp4, dapp5, user1, user2, user3, user4, user5] = await ethers.getSigners();

  beforeEach(async () => {
    const userAnalyticsFactory = await ethers.getContractFactory("UserAnalytics");
    UserAnalytics = (await userAnalyticsFactory.deploy()) as UserAnalytics;
    await UserAnalytics.waitForDeployment();
  });

  describe("Schema", function () {
    it("Should be able to create a new schema", async function () {
      const schemaName = encodeBytes32String("schema1Test1");
      const column1 = encodeBytes32String("col1");
      const column2 = encodeBytes32String("col2");
      const column3 = encodeBytes32String("col3");

      await UserAnalytics.addSchema(schemaName, [column1, column2, column3], 0n);

      const schemaIndex = await UserAnalytics.schemaIndex(schemaName);

      expect(await UserAnalytics.dappAnalytics(schemaIndex)).to.deep.equal([schemaName, 0n]);
      expect(await UserAnalytics.getColumnsOfSchema(schemaName)).to.deep.equal([column1, column2, column3]);
    });
  });

  describe("AddAnalytics", function () {
    it("Should be able to add new user's analytics", async function () {
      const schemaName = encodeBytes32String("schema1Test2");
      const column1 = encodeBytes32String("col1");
      const column2 = encodeBytes32String("col2");
      const column3 = encodeBytes32String("col3");

      const [owner, dapp1, user1] = await ethers.getSigners();

      const initialUserBalance = await ethers.provider.getBalance(user1);

      await UserAnalytics.connect(owner).addSchema(schemaName, [column1, column2, column3], 0n);

      await UserAnalytics.connect(dapp1).addAnalytics(user1.address, schemaName, [column1], [1n], {
        value: 10000000000000000n,
      });

      const userId = await UserAnalytics.addressToId(user1.address);

      expect(await UserAnalytics.userActivityMatrix(userId, 0n)).to.deep.equal(1n);
      expect(await UserAnalytics.getAnalyticsDataBySchemaName(schemaName)).to.deep.equal([
        [0, 0, 0],
        [1, 0, 0],
      ]);

      const finalUserBalance = await ethers.provider.getBalance(user1);

      expect(finalUserBalance - initialUserBalance).to.equal(10000000000000000n);

      expect(await UserAnalytics.consumerCredits(dapp1.address)).to.equal(1);

      expect(await UserAnalytics.getSchemaAddressToId(schemaName, user1.address)).to.equal(1);

      expect(await UserAnalytics.getSchemaIdToAddress(schemaName, 1)).to.equal(user1.address);
    });
  });

  describe("Recommendations", function () {
    it("Should return recommended users", async function () {
      const schemaName1 = encodeBytes32String("schema1");
      const schema1Column1 = encodeBytes32String("s1col1");
      const schema1Column2 = encodeBytes32String("s1col2");
      const schema1Column3 = encodeBytes32String("s1col3");

      const schemaName2 = encodeBytes32String("schema2");
      const schema2Column1 = encodeBytes32String("s2col1");
      const schema2Column2 = encodeBytes32String("s2col2");
      const schema2Column3 = encodeBytes32String("s2col3");

      const schemaName3 = encodeBytes32String("schema3");
      const schema3Column1 = encodeBytes32String("s3col1");
      const schema3Column2 = encodeBytes32String("s3col2");
      const schema3Column3 = encodeBytes32String("s3col3");

      const schemaName4 = encodeBytes32String("schema4");
      const schema4Column1 = encodeBytes32String("s4col1");
      const schema4Column2 = encodeBytes32String("s4col2");
      const schema4Column3 = encodeBytes32String("s4col3");

      const [dapp1, dapp2, dapp3, dapp4, user1, user2, user3, user4] = await ethers.getSigners();

      await UserAnalytics.connect(dapp1).addSchema(schemaName1, [schema1Column1, schema1Column2, schema1Column3], 0n);

      await UserAnalytics.connect(dapp2).addSchema(schemaName2, [schema2Column1, schema2Column2, schema2Column3], 1n);

      await UserAnalytics.connect(dapp3).addSchema(schemaName3, [schema3Column1, schema3Column2, schema3Column3], 0n);

      await UserAnalytics.connect(dapp4).addSchema(schemaName4, [schema4Column1, schema4Column2, schema4Column3], 1n);

      await UserAnalytics.connect(dapp1).addAnalytics(user1.address, schemaName1, [schema1Column1], [1n], {
        value: 10000000000000000n,
      });

      await UserAnalytics.connect(dapp2).addAnalytics(user2.address, schemaName2, [schema2Column1], [1n], {
        value: 10000000000000000n,
      });

      await UserAnalytics.connect(dapp3).addAnalytics(user3.address, schemaName3, [schema3Column1], [1n], {
        value: 10000000000000000n,
      });

      await UserAnalytics.connect(dapp4).addAnalytics(user4.address, schemaName4, [schema4Column1], [1n], {
        value: 10000000000000000n,
      });

      expect(await UserAnalytics.getAllSchemas()).to.deep.equal([
        [schemaName1, [schema1Column1, schema1Column2, schema1Column3], 0n, 2n],
        [schemaName2, [schema2Column1, schema2Column2, schema2Column3], 1, 2],
        [schemaName3, [schema3Column1, schema3Column2, schema3Column3], 0n, 2n],
        [schemaName4, [schema4Column1, schema4Column2, schema4Column3], 1n, 2n],
      ]);

      expect(await UserAnalytics.getRecommendedFollowers(user1.address, 1)).to.deep.equal([
        ["0x0000000000000000000000000000000000000000"],
        [user2.address],
        ["0x0000000000000000000000000000000000000000"],
        ["0x0000000000000000000000000000000000000000"],
        ["0x0000000000000000000000000000000000000000"],
        ["0x0000000000000000000000000000000000000000"],
        ["0x0000000000000000000000000000000000000000"],
      ]);
    });
  });
});
