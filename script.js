/**
 * Created by Cezary on 2015-11-03.
 */

(function() {
    "use strict";
    var spotifySearch = {};

    spotifySearch.doRequest = function(object) {
        var xmlhttp = new XMLHttpRequest();
        var urlBase = "https://api.spotify.com/v1/search?q=";
        var urlType = "*&type=artist&limit=50";

        var url;

        var searchBox = document.querySelector("#searchBox");
        var searchValue = searchBox.value;
        url = urlBase + searchValue + urlType;

        if (searchValue) {
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    var resultsObject = JSON.parse(xmlhttp.responseText);
                    object.showResults(resultsObject);
                }
            };

            xmlhttp.open("GET", url, true);
            xmlhttp.send();
        } else {
            var resultList = document.querySelector("#resultList");

            resultList.innerHTML = "";
        }

    };

    spotifySearch.showResults = function (object) {
        var artistsArray = object.artists.items;
        var i;
        var artistsLength = artistsArray.length;
        var resultList = document.querySelector("#resultList");

        resultList.innerHTML = "";

        for (i = 0; i < artistsLength; i++) {
            var artistLi = this.createArtistListElement(artistsArray[i]);
            resultList.appendChild(artistLi);
        }
    };

    spotifySearch.createArtistListElement = function (artistObject) {
        var imageURL;
        var that = this;

        var name = artistObject.name;
        var imagesArray = artistObject.images;
        var spotifyLinkBase = "https://open.spotify.com/artist/";
        var ArtistID = artistObject.id;
        var spotifyLink = spotifyLinkBase + ArtistID;

        if (imagesArray.length !== 0) {
            imageURL = imagesArray[0].url;
        } else {
            imageURL = "https://d1luk0418egahw.cloudfront.net/static/images/guide/NoImage_592x444.jpg";
        }

        var artistLi = document.createElement("li");
        var artistNameSpan = document.createElement("a");
        artistNameSpan.setAttribute("href", spotifyLink);
        artistNameSpan.textContent = name;
        var artistImage = document.createElement("img");
        artistImage.setAttribute("src", imageURL);
        artistImage.addEventListener("click", function() {
            that.openAlbumList(this, that);
        });

        artistLi.appendChild(artistImage);
        artistLi.appendChild(artistNameSpan);

        artistLi.setAttribute("data-id", ArtistID);

        return artistLi;
    };

    spotifySearch.openAlbumList = function (listenedImage, parentObject) {
        var artistID = listenedImage.parentElement.getAttribute("data-id");

        var xmlhttp = new XMLHttpRequest();
        var urlBase = "https://api.spotify.com/v1/artists/";
        var urlType = "/albums?album_type=album&limit=50";

        var url = urlBase + artistID + urlType;


        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var resultsObject = JSON.parse(xmlhttp.responseText);
                parentObject.showAlbums(resultsObject);
            }
        };

        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    };

    spotifySearch.showAlbums = function (albumsObject) {
        var i;
        var albumsArray = albumsObject.items;
        var albumsLength = albumsArray.length;

        var albumBox = document.querySelector("#albumBox");
        var albumList = document.querySelector("#albumList");

        albumBox.classList.remove("hidden");
        albumList.innerHTML = "";

        for (i = 0; i < albumsLength; i++) {
            var oneAlbum = albumsArray[i];
            var albumLi = this.createAlbumListElement(oneAlbum);
            albumList.appendChild(albumLi);
        }
        this.scrollTop();
    };

    spotifySearch.createAlbumListElement = function (albumObject) {
        var imageURL;
        var that = this;

        var name = albumObject.name;
        var imagesArray = albumObject.images;
        var spotifyLinkBase = "https://open.spotify.com/album/";
        var AlbumID = albumObject.id;
        var spotifyLink = spotifyLinkBase + AlbumID;

        if (imagesArray.length !== 0) {
            imageURL = imagesArray[0].url;
        } else {
            imageURL = "https://d1luk0418egahw.cloudfront.net/static/images/guide/NoImage_592x444.jpg";
        }

        var artistLi = document.createElement("li");
        var artistNameSpan = document.createElement("a");
        artistNameSpan.setAttribute("href", spotifyLink);
        artistNameSpan.textContent = name;
        var artistImage = document.createElement("img");
        artistImage.setAttribute("src", imageURL);
        artistImage.addEventListener("click", function() {
            that.openTrackList(this, that);
        });

        artistLi.appendChild(artistImage);
        artistLi.appendChild(artistNameSpan);

        artistLi.setAttribute("data-id", AlbumID);

        return artistLi;
    };

    spotifySearch.openTrackList = function (listenedImage, parentObject) {
        var albumID = listenedImage.parentElement.getAttribute("data-id");

        var xmlhttp = new XMLHttpRequest();
        var urlBase = "https://api.spotify.com/v1/albums/";
        var urlType = "/tracks?limit=50";

        var url = urlBase + albumID + urlType;


        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var resultsObject = JSON.parse(xmlhttp.responseText);
                parentObject.showTracks(resultsObject);
            }
        };

        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    };

    spotifySearch.showTracks = function (tracksObject) {
        var i;
        var tracksArray = tracksObject.items;
        var tracksLength = tracksArray.length;

        var trackBox = document.querySelector("#trackBox");
        var trackList = document.querySelector("#trackList");

        trackBox.classList.remove("hidden");
        trackList.innerHTML = "";

        for (i = 0; i < tracksLength; i++) {
            var oneTrack = tracksArray[i];
            var trackLi = this.createTrackListElement(oneTrack);
            trackList.appendChild(trackLi);
        }
        this.scrollTop();
    };

    spotifySearch.createTrackListElement = function (trackObject) {
        var name = trackObject.name;
        var albumLi = document.createElement("li");

        albumLi.textContent = name;
        return albumLi;
    };

    spotifySearch.closeAlbumList = function () {
        var albumBox = document.querySelector("#albumBox");

        albumBox.classList.add("hidden");
    };

    spotifySearch.closeTrackList = function () {
        var trackBox = document.querySelector("#trackBox");

        trackBox.classList.add("hidden");
    };

    spotifySearch.scrollTop = function () {
        window.scrollTo(0, 0);
    };

    spotifySearch.setupListeners = function () {
        var that = this;

        var searchButton = document.querySelector("#searchButton");
        var closeAlbumListButton = document.querySelector("#closeAlbumList");
        var closeTrackListButton = document.querySelector("#closeTrackList");
        var searchBox = document.querySelector("#searchBox");

        searchButton.addEventListener("click", function() {
            that.doRequest(that);
        });
        closeAlbumListButton.addEventListener("click", this.closeAlbumList);
        closeTrackListButton.addEventListener("click", this.closeTrackList);
        searchBox.addEventListener("keyup", function() {
            that.doRequest(that);
        });
    };

    spotifySearch.setupListeners();
})();
