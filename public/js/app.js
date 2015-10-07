function init() {
	gapi.client.setApiKey('AIzaSyBLT46OdmqPHt6lweLKQ4VtddKUsEFjvK4');
	gapi.client.load("youtube", "v3", function() {

	});
}


$(function() {
	$("form").on("submit", function(e) {
		e.preventDefault();
		console.log("got here 1")		

		var request = gapi.client.youtube.search.list({
			part: "snippet",
			type: "video",
			q: encodeURIComponent( $("#response").val() ).replace(/%20/g, "+"),
			maxResults: 1,
			orderBy: "relevance",
			publishedAfter: "2015-01-01T00:00:00Z",
		});
		request.execute(function(response) {
			//console.log(response)
			var results = response.result;
			$.each(results['items'], function(index, item) {
				// var test= items[0]['id'].videoId
				var test = results['items'][0].id.videoId
				console.log(test)
				$('#results').append('<div class="col-md-5"><iframe class="video w100" width=540 height=360 src="https://www.youtube.com/embed/'+test+ '?autoplay=1" frameborder="0" ></iframe></div>')

			});

		});
	});

});

