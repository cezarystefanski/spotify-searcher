/**
 * Created by Cezary on 2015-11-04.
 */

(function() {
    var spotifySearcher = {};

    spotifySearcher.main = function() {
        var artistID = spotifySearcher.readCookie();
        spotifySearcher.deleteCookie();
        spotifySearcher.doRequest(artistID);

        $("#resultList").on("click", "img", function () {
            var id = $(this).parent().data("id");
            spotifySearcher.createCookie(id);
            window.location = "jqalbums.html";
        });
    };

    spotifySearcher.readCookie = function() {
        var cookieArray = document.cookie.split(";");
        var c = cookieArray[0];
        while (c.charAt(0)==" ") {
            c = c.substring(1);
        }
        if (c.indexOf("artistId=") == 0) {
            return c.substring("artistId=".length,c.length);
        }
        return "";
    };

    spotifySearcher.deleteCookie = function() {
        document.cookie = "artistId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    };

    spotifySearcher.doRequest = function (searchedText) {
        var self = this;
        var urlBase = "https://api.spotify.com/v1/artists/";
        var urlType = "/albums?album_type=album&limit=50";
        var url = urlBase + searchedText + urlType;

        $.get(url).done(function (data) {
            var albumsArray = data.items;
            self.showResults(albumsArray);
        });
    };

    spotifySearcher.showResults = function (albumsArray) {
        var self = this;
        $("#resultList").html("");

        $.each(albumsArray, function (index, albumObject) {
            var element = self.createAlbumListElement(albumObject);
            $(element).appendTo($("#resultList"));
        });
    };

    spotifySearcher.createAlbumListElement = function (albumObject) {
        var name = albumObject.name;
        var imagesArray = albumObject.images;
        var spotifyLinkBase = "https://open.spotify.com/album/";
        var albumID = albumObject.id;
        var spotifyLink = spotifyLinkBase + albumID;
        var imageURL;

        if (imagesArray.length !== 0) {
            imageURL = imagesArray[0].url;
        } else {
            imageURL = "https://d1luk0418egahw.cloudfront.net/static/images/guide/NoImage_592x444.jpg";
        }

        var albumLi = $("<li></li>").data("id", albumID);
        $("<img>").attr("src", imageURL).appendTo(albumLi);
        $("<a></a>").attr("href", spotifyLink).text(name).appendTo(albumLi);

        return albumLi;
    };

    spotifySearcher.createCookie = function(id) {
        var date = new Date();
        date.setTime(date.getTime() + 60 * 1000);
        var expires = "; expires=" + date.toUTCString();
        document.cookie = "albumId=" + id + expires + "; path=/"
    };

    $(document).ready(spotifySearcher.main);
})();