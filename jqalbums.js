/**
 * Created by Cezary on 2015-11-04.
 */

(function() {
    var spotifySearcher = {};

    spotifySearcher.main = function() {
        var albumID = spotifySearcher.readCookie();
        spotifySearcher.deleteCookie();
        spotifySearcher.doRequest(albumID);
    };

    spotifySearcher.readCookie = function() {
        var cookieArray = document.cookie.split(";");
        var c = cookieArray[0];
        while (c.charAt(0)==" ") {
            c = c.substring(1);
        }
        if (c.indexOf("albumId=") == 0) {
            return c.substring("albumId=".length,c.length);
        }
        return "";
    };

    spotifySearcher.deleteCookie = function() {
        document.cookie = "albumId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    };

    spotifySearcher.doRequest = function (searchedText) {
        var self = this;
        var urlBase = "https://api.spotify.com/v1/albums/";
        var urlType = "/tracks?limit=50";
        var url = urlBase + searchedText + urlType;

        $.get(url).done(function (data) {
            var tracksArray = data.items;
            self.showResults(tracksArray);
        });
    };

    spotifySearcher.showResults = function (tracksArray) {
        var self = this;
        $("#resultList").html("");

        $.each(tracksArray, function (index, trackObject) {
            var element = self.createTrackListElement(trackObject);
            $(element).appendTo($("#resultList"));
        });
    };

    spotifySearcher.createTrackListElement = function (trackObject) {
        var name = trackObject.name;
        var spotifyLinkBase = "https://open.spotify.com/track/";
        var trackID = trackObject.id;
        var spotifyLink = spotifyLinkBase + trackID;

        var trackLi = $("<li></li>").data("id", trackID);
        $("<a></a>").attr("href", spotifyLink).text(name).appendTo(trackLi);

        return trackLi;
    };

    $(document).ready(spotifySearcher.main);
})();