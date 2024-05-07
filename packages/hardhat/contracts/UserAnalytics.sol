//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract UserAnalytics is Ownable {
	uint256[][] public userActivityMatrix;
	mapping(address => uint256) public addressToId;
	mapping(uint256 => address) public idToAddress;
	mapping(address => uint256) public consumerCredits;
	mapping(bytes32 => uint256) public schemaIndex;
	uint256 public latestIndex;
	uint256 public totalCategories;
  uint256 public userRewardPerDatapoint;

	enum Category {
		Gaming,
		Marketplace,
		Defi,
		Dao,
		Web3Social,
		Identity,
		Certificates
	}

	struct Analytics {
		bytes32 schemaName;
		bytes32[] columns;
		Category schemaCategory;
		uint256[][] data;
		mapping(address => uint256) addressToId;
		mapping(uint256 => address) idToAddress;
		mapping(bytes32 => uint256) columnToIndex;
	}

	struct similarityPair {
		uint256 index;
		uint256 similarity;
	}

	Analytics[] public dappAnalytics;

	constructor() Ownable() {
		uint256[] memory initialMatrix;
		userActivityMatrix.push(initialMatrix);
		latestIndex = 0;
		totalCategories = 7;
		dappAnalytics.push();
    userRewardPerDatapoint = 10000000000000000;
	}

	event NewAnalytics(address user, address provider, uint256 category);

	function addUser(address userAddress) external {
		// get the total length of current activity matrix
		latestIndex = latestIndex + 1;
		uint256[] memory initialMatrix;
		userActivityMatrix.push(initialMatrix);

		// add the new user details
		for (uint256 i = 0; i < totalCategories; i++) {
			userActivityMatrix[latestIndex].push(0);
		}

		// add user id to address mapping
		addressToId[userAddress] = latestIndex;
		idToAddress[latestIndex] = userAddress;
	}

	function addSchema(
		bytes32 schemaName,
		bytes32[] calldata columns,
		Category category
	) external {
		// Cannot have two schema with same name
    require(schemaIndex[schemaName] == 0, "SCHEMA NAME EXISTS");

    // initializing schema with defaults
		Analytics storage analytics = dappAnalytics.push();
		analytics.schemaName = schemaName;
		analytics.schemaCategory = category;
		
    uint256[] memory initialUser;
		analytics.data.push(initialUser);
		
    for (uint256 i = 0; i < columns.length; i++) {
			analytics.data[0].push(0);
			analytics.columns.push(columns[i]);
			analytics.columnToIndex[columns[i]] = i;
		}

		// adding to schema index map
		schemaIndex[schemaName] = dappAnalytics.length - 1;
	}

	function addAnalytics(
		address payable userAddress,
		bytes32 schemaName,
		bytes32[] calldata columns,
		uint256[] calldata data
	) public payable {
		require(schemaIndex[schemaName] != 0, "SCHEMA NOT PRESENT");

		// add user if not already present
		if (addressToId[userAddress] == 0) {
			this.addUser(userAddress);
		}

		// retrieve storage instance
		Analytics storage schemaAnalytics = dappAnalytics[
			schemaIndex[schemaName]
		];

		// push new user if not already present
		if (schemaAnalytics.addressToId[userAddress] == 0) {
			schemaAnalytics.data.push();
			for (uint256 i = 0; i < schemaAnalytics.columns.length; i++) {
				schemaAnalytics.data[schemaAnalytics.data.length - 1].push(0);
			}

			schemaAnalytics.addressToId[userAddress] =
				schemaAnalytics.data.length -
				1;
			schemaAnalytics.idToAddress[
				schemaAnalytics.data.length - 1
			] = userAddress;
		}

		// add to the existing data
		for (uint256 i = 0; i < columns.length; i++) {
			schemaAnalytics.data[schemaAnalytics.addressToId[userAddress]][
				schemaAnalytics.columnToIndex[columns[i]]
			] += data[i];
		}

		userActivityMatrix[addressToId[userAddress]][
			uint256(schemaAnalytics.schemaCategory)
		] += 1;

		// rewarding the users for sharing data
		bool sent = userAddress.send(userRewardPerDatapoint);
		require(sent, "Failed to reward user");

		// increasing credit limit for provider
		consumerCredits[msg.sender] = consumerCredits[msg.sender] + 1;

		emit NewAnalytics(
			userAddress,
			msg.sender,
			uint256(schemaAnalytics.schemaCategory)
		);
	}

	function updateAnalytics(
		address payable userAddress,
		bytes32 schemaName,
		bytes32[] calldata columns,
		uint256[] calldata data
	) public payable {
		// add user if not already present
		if (addressToId[userAddress] == 0) {
			this.addUser(userAddress);
		}

		// retrieve storage instance
		Analytics storage schemaAnalytics = dappAnalytics[
			schemaIndex[schemaName]
		];

		// push new user if not already present
		if (schemaAnalytics.addressToId[userAddress] == 0) {
			schemaAnalytics.data.push();
			for (uint256 i = 0; i < schemaAnalytics.columns.length; i++) {
				schemaAnalytics.data[schemaAnalytics.data.length - 1].push(0);
			}

			schemaAnalytics.addressToId[userAddress] =
				schemaAnalytics.data.length -
				1;
			schemaAnalytics.idToAddress[
				schemaAnalytics.data.length - 1
			] = userAddress;
		}

		// replace the existing user data with new one
		for (uint256 i = 0; i < columns.length; i++) {
			schemaAnalytics.data[schemaAnalytics.addressToId[userAddress]][
				schemaAnalytics.columnToIndex[columns[i]]
			] = data[i];
		}

		userActivityMatrix[addressToId[userAddress]][
			uint256(schemaAnalytics.schemaCategory)
		] += 1;

		// rewarding the users for sharing data
		bool sent = userAddress.send(userRewardPerDatapoint);
		require(sent, "Failed to reward user");

		// increasing credit limit for provider
		consumerCredits[msg.sender] = consumerCredits[msg.sender] + 1;

		emit NewAnalytics(
			userAddress,
			msg.sender,
			uint256(schemaAnalytics.schemaCategory)
		);
	}

  function updateUserReward(uint256 newReward) external onlyOwner {
    userRewardPerDatapoint = newReward;
  }

	function getUserActivityMatrix()
		external
		view
		returns (uint256[][] memory)
	{
		return userActivityMatrix;
	}

	function getAnalyticsDataBySchemaName(
		bytes32 schemaName
	) external view returns (uint256[][] memory) {
		return dappAnalytics[schemaIndex[schemaName]].data;
	}

	function getColumnsOfSchema(
		bytes32 schemaName
	) external view returns (bytes32[] memory) {
		return dappAnalytics[schemaIndex[schemaName]].columns;
	}

	function getRecommendedFollowers(
		address userAddress,
		uint64 k
	) external view returns (address[][] memory) {
		uint256[][] memory similarityMatrix = computeSimilarityMatrix();

		address[][] memory recommendedFollowers = recommendFollowers(
			addressToId[userAddress],
			similarityMatrix,
			k
		);

		return recommendedFollowers;
	}

	// Function to calculate cosine similarity between two users
	function cosineSimilarity(
		uint256[] memory user1,
		uint256[] memory user2
	) internal pure returns (uint256) {
		uint256 dotProduct = dot(user1, user2);
		uint256 normUser1 = sqrt(dot(user1, user1));
		uint256 normUser2 = sqrt(dot(user2, user2));
		return ((dotProduct * 100) / normUser1) * normUser2;
	}

	// Function to compute user-user similarity matrix
	function computeSimilarityMatrix()
		internal
		view
		returns (uint256[][] memory)
	{
		uint256 numUsers = userActivityMatrix.length;
		uint256[][] memory similarityMatrix = new uint256[][](numUsers);

		// similarityMatrix.push();
		for (uint256 i = 1; i < numUsers; i++) {
			uint256[] memory row = new uint256[](numUsers);
			similarityMatrix[i] = row;

			for (uint64 j = 1; j < numUsers; j++) {
				uint256[] memory user1 = userActivityMatrix[i];
				uint256[] memory user2 = userActivityMatrix[j];
				similarityMatrix[i][j] = cosineSimilarity(user1, user2);
			}
		}

		return similarityMatrix;
	}

	// Function to recommend followers for a given user
	function recommendFollowers(
		uint256 userIndex,
		uint256[][] memory similarityMatrix,
		uint64 k
	) public view returns (address[][] memory) {
		similarityPair[] memory similarUsers = new similarityPair[](
			similarityMatrix[userIndex].length - 1
		);
		uint256 idx = 0;

		// Find k most similar users to the target user
		for (uint256 j = 1; j < similarityMatrix[userIndex].length; j++) {
			if (j != userIndex) {
				similarityPair memory row;
				row.index = j;
				row.similarity = similarityMatrix[userIndex][j];
				similarUsers[idx] = row;
				idx += 1;
			}
		}

		// Sort similar users by descending similarity
		similarUsers = bubbleSort(similarUsers);

		// Recommend followers from the top k similar users
		address[][] memory recommendedFollowers = new address[][](
			totalCategories
		);
		for (uint64 i = 0; i < k; i++) {
			uint64 _idx = 0;
			for (uint256 j = 0; j < totalCategories; j++) {
				address[] memory followerRow = new address[](k);
				recommendedFollowers[j] = followerRow;
				if (userActivityMatrix[similarUsers[i].index][j] > 0) {
					recommendedFollowers[j][_idx] = idToAddress[
						similarUsers[i].index
					];
					_idx = _idx + 1;
				}
			}
		}

		return recommendedFollowers;
	}

	/**
	 * @dev Bubble sort.
	 */
	function bubbleSort(
		similarityPair[] memory similarUsers
	) internal pure returns (similarityPair[] memory) {
		uint256 n = similarUsers.length;
		for (uint256 i = 0; i < n - 1; i++) {
			for (uint256 j = 0; j < n - i - 1; j++) {
				if (
					similarUsers[j].similarity > similarUsers[j + 1].similarity
				) {
					(similarUsers[j], similarUsers[j + 1]) = (
						similarUsers[j + 1],
						similarUsers[j]
					);
				}
			}
		}
		return similarUsers;
	}

	/**
	 * @dev Returns the square root of a number.
	 */
	function sqrt(uint256 x) internal pure returns (uint256) {
		uint256 z = (x + 1) / 2;
		uint256 y = x;
		while (z < y) {
			y = z;
			z = ((x / z) + z) / 2;
		}
		return y;
	}

	/**
	 * @dev Returns the dot product of two vectors.
	 */
	function dot(
		uint256[] memory x,
		uint256[] memory y
	) internal pure returns (uint256) {
		require(x.length == y.length);

		uint256 output;
		for (uint256 i = 0; i < x.length; i++) {
			output = (x[i] * y[i]) + output;
		}

		return output;
	}

	receive() external payable {}
}
