function tplawesome(e,t){res=e;for(var n=0;n<t.length;n++){res=res.replace(/\{\{(.*?)\}\}/g,function(e,r){return t[n][r]})}return res}

$(function() {
	$("form").on("submit", function(e) {
		e.prevent.default();
		console.log("got here 1");

		var request = gapi.client.youtube.search.list({
			part: "snippet",
			type: "video",
			q: encodeURIComponent($('#search').val()).replace(/%20/g, "+"),
			maxResults: 3,
			order: "viewCount"
		});
		request.execute(function(response) {
			var results = response.result;
			$.each(results.items, function(index, item) {
				$.get("tpl/item.html", function(data) {
					$("#results").append(tplawesome(data, [{"title":item.snippet.title, "videId":item.id.videoId}]));
				});
			});
		});
	});

});

function init() {
	gapi.client.setApiKey("AIzaSyBLT46OdmqPHt6lweLKQ4VtddKUsEFjvK4");
	gapi.client.load("youtube", "v3", function() {

	});
}
