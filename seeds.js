var mongoose = require("mongoose");
var Item = require("./models/item");
var Comment = require("./models/comment");

var data = [{
		name: "Motorola RAZR v4",
    price: "199.99",
		image: "http://coalcut.com/wp-content/uploads/2019/01/feature-1-800x445.jpg",
	},
	{
		name: "Book of Shadows",
    price: "176.24",
		image: "data:image/webp;base64,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",
	},
	{
		name: "Written Cookie",
    price: "13.99",
		image: "https://www.skiptomylou.org/wp-content/uploads/2010/01/DIY-Fortune-cookies-500x500.jpg",
	}
]

function seedDB() {
	// Remove all items
	Item.remove({}, function(err) {
		if (err) {
			console.log(err);
		}
		console.log("Removed items.");
		Comment.remove({}, function(err) {
			if (err) {
				console.log(err);
			}
			console.log("Removed comments.");

			// Add a few items
			data.forEach(function(seed) {
				Item.create(seed, function(err, item) {
					if (err) {
						console.log(err)
					} else {
						console.log("Added an item.");

						// // Create a comment
						// Comment.create({
						// 	text: "This place is great, but I wish there was internet",
						// 	author: "Homer"
						// }, function(err, comment) {
						// 	if (err) {
						// 		console.log(err);
						// 	} else {
						// 		item.comments.push(comment);
						// 		item.save();
						// 		console.log("Created new comment.");
						// 	}
						// });
					}
				});
			});
		});
	});
}

module.exports = seedDB;
