/**
 * Created by Cezary on 2015-11-04.
 */

(function() {
    var spotifySearcher = {};

    spotifySearcher.main = function () {
        $("#searchBox").on("keyup", function () {
            var searchText = $(this).val();
            if (searchText) {
                spotifySearcher.doRequest(searchText);
            } else {
                $("#resultList").html("");
            }
        });
        $("#resultList").on("click", "img", function () {
            var id = $(this).parent().data("id");
            spotifySearcher.createCookie(id);
            window.location = "jqartists.html";
        });
    };

    spotifySearcher.doRequest = function (searchedText) {
        var self = this;
        var urlBase = "https://api.spotify.com/v1/search?q=";
        var urlType = "*&type=artist&limit=50";
        var url = urlBase + searchedText + urlType;

        $.get(url).done(function (data) {
            var artistsArray = data.artists.items;
            self.showResults(artistsArray);
        });
    };

    spotifySearcher.showResults = function (artistsArray) {
        var self = this;
        $("#resultList").html("");

        $.each(artistsArray, function (index, artistObject) {
            var element = self.createArtistListElement(artistObject);
            $(element).appendTo($("#resultList"));
        });
    };

    spotifySearcher.createArtistListElement = function (artistObject) {
        var name = artistObject.name;
        var imagesArray = artistObject.images;
        var spotifyLinkBase = "https://open.spotify.com/artist/";
        var artistID = artistObject.id;
        var spotifyLink = spotifyLinkBase + artistID;
        var imageURL;

        if (imagesArray.length !== 0) {
            imageURL = imagesArray[0].url;
        } else {
            imageURL = "https://d1luk0418egahw.cloudfront.net/static/images/guide/NoImage_592x444.jpg";
        }

        var artistLi = $("<li></li>").data("id", artistID);
        $("<img>").attr("src", imageURL).appendTo(artistLi);
        $("<a></a>").attr("href", spotifyLink).text(name).appendTo(artistLi);

        return artistLi;
    };

    spotifySearcher.createCookie = function(id) {
        var date = new Date();
        date.setTime(date.getTime() + 60 * 1000);
        var expires = "; expires=" + date.toUTCString();
        document.cookie = "artistId=" + id + expires + "; path=/"
    };

    $(document).ready(spotifySearcher.main);
})();
