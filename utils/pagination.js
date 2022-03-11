const config = require("../constants")();

const paginate = async (page, limit, name, model, api = "") => {
	let totalRecords = await model.count();
	//const limit = 10;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const result = {};

	// pagination for getAllItems api
	if (api === "getAllItems") {
		// for counting page no.
		const allDocs = await model.find({
			name: { $regex: ".*" + name + ".*", $options: "i" },
		});
		totalRecords = allDocs.length;

		// paginated result
		result.data = await model
			.find({ name: { $regex: ".*" + name + ".*", $options: "i" } })
			.collation({ locale: "en" })
			.limit(limit)
			.skip(startIndex)
			.sort({ name: 1 })
			.exec();

		if (result.data.length > 0) {
			result.data.forEach((element) => {
				if (element.image !== "") {
					element.image = config.s3BucketUrl + element.image;
				} else {
					element.image = config.noimageurl;
				}
			});
		}
	}
	// any other data pagination
	else {
		result.data = await model.find().limit(limit).skip(startIndex).exec();
	}

	if (endIndex < totalRecords) {
		result.nextPage = page + 1;
	}
	if (startIndex > 0) {
		result.previousPage = page - 1;
	}

	const totalPageCount = Math.ceil(totalRecords / limit);
	result.totalPageCount = totalPageCount;

	return result;
};

module.exports = paginate;
