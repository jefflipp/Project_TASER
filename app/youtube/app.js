function tplawesome(template, data) {
	// initiate the result to the basic template
	res = template;
	// for each data key, replace the content of the brackets with the data
	for(var i = 0; i < data.length; i++) {
		res = res.replace(/\{\{(.*?)\}\}/g, function(match, j) { // some magic regex
			return data[i][j];
		})
	}
	return res;
}
console.log("tplawesome loaded")

$(function() {
	$("form").on("submit", function(e) {
		e.prevent.default();
console.log("got here 1")		

		var request = gapi.client.youtube.search.list({
			part: "snippet",
			type: "video",
			q: encodeURIComponent($("#search").val()).replace(/%20/g, "+"),
			maxResults: 3,
			order: "viewCount",
			publishedAfter: "2010-01-01T00:00:00Z"
		});
		request.execute(function(response) {
			var results = response.result;
			$("#results").html("");
			$.each(results.items, function(index, item) {
				$.get("tpl/item.html", function(data) {
					$("#results").append(tplawesome(data, [{"title":item.snippet.title, "videId":item.id.videoId}]));
				});
			});
			resetVideoHeight();
		});
	});

});

function resetVideoHeight() {
	$(".video").css("height", $("#results").width() * 9/16);
}

function init() {
	gapi.client.setApiKey('AIzaSyBLT46OdmqPHt6lweLKQ4VtddKUsEFjvK4');
	gapi.client.load("youtube", "v3", function() {

	});
}
