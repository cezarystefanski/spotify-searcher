/**
 * Created by Cezary on 2015-11-03.
 */

(function() {
    "use strict";
    var spotifySearch = {};

    /**
     * A shorthand for making new promises
     * @param url for querying the api
     * @returns {Promise}
     */
    spotifySearch.get = function(url) {
        return new Promise(function(resolve, reject) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", url, true);

            xmlhttp.onload = function() {
                if (xmlhttp.status === 200) {
                    resolve(xmlhttp.response);
                } else {
                    reject(Error(xmlhttp.statusText));
                }
            };

            xmlhttp.onerror = function() {
                reject(Error("Network Error!"));
            };

            xmlhttp.send();
        })
    };

    /**
     * Creates a request for the artist list based on the input
     * @param ParentObject the spotifySearch object for accessing methods
     */
    spotifySearch.doRequest = function(ParentObject) {
        var urlBase = "https://api.spotify.com/v1/search?q=";
        var urlType = "*&type=artist&limit=50";

        var url;

        var searchBox = document.querySelector("#searchBox");
        var searchValue = searchBox.value;
        url = urlBase + searchValue + urlType;

        if (searchValue) {
            this.get(url).then(function(response) {
                var resultsObject = JSON.parse(response);
                ParentObject.showResults(resultsObject);
            }, function(error) {
                console.error(error);
            });
        } else {
            var resultList = document.querySelector("#resultList");

            resultList.innerHTML = "";
        }

    };

    /**
     * Prepares the list and iterates over the results and appends the newly made LIs to the list
     * @param artistsObject converted from the JSON response
     */
    spotifySearch.showResults = function (artistsObject) {
        var artistsArray = artistsObject.artists.items;
        var i;
        var artistsLength = artistsArray.length;
        var resultList = document.querySelector("#resultList");

        resultList.innerHTML = "";

        for (i = 0; i < artistsLength; i++) {
            var artistLi = this.createArtistListElement(artistsArray[i]);
            resultList.appendChild(artistLi);
        }
    };

    /**
     * Creates a list element with the artist image and the link to spotify
     * and also sets up a click listener to each
     * @param artistObject a single artist object
     * @returns {Element} a ready li for appending to the list
     */
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

    /**
     * Creates a request for the album list based on the artist ID taken from the data-id attribute
     * @param listenedImage clicked image of the artist
     * @param parentObject the spotifySearch object for accessing methods
     */
    spotifySearch.openAlbumList = function (listenedImage, parentObject) {
        var artistID = listenedImage.parentElement.getAttribute("data-id");

        var urlBase = "https://api.spotify.com/v1/artists/";
        var urlType = "/albums?album_type=album&limit=50";

        var url = urlBase + artistID + urlType;

        this.get(url).then(function(response) {
            var resultsObject = JSON.parse(response);
            parentObject.showAlbums(resultsObject);
        }, function(error) {
            console.error(error);
        });
    };

    /**
     * Opens up the album list modal and iterates over the results to append the list elements
     * @param albumsObject converted from the JSON response
     */
    spotifySearch.showAlbums = function (albumsObject) {
        var i;
        var albumsArray = albumsObject.items;
        var albumsLength = albumsArray.length;

        var albumBox = document.querySelector("#albumBox");
        var albumBoxMask = document.querySelector("#albumBoxMask");
        var albumList = document.querySelector("#albumList");

        albumBox.classList.remove("hidden");
        albumBoxMask.classList.remove("hidden");
        albumList.innerHTML = "";

        for (i = 0; i < albumsLength; i++) {
            var oneAlbum = albumsArray[i];
            var albumLi = this.createAlbumListElement(oneAlbum);
            albumList.appendChild(albumLi);
        }
        this.scrollToTop();
    };

    /**
     * Creates a list element with an image of the album and the link to spotify
     * and also adds a click listener to each
     * @param albumObject a single album object
     * @returns {Element} a ready li for appending to the list
     */
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

    /**
     * Creates a request for the track list based on the album ID taken from the data-id attribute
     * @param listenedImage clicked image of the album
     * @param parentObject the spotifySearch object for accessing methods
     */
    spotifySearch.openTrackList = function (listenedImage, parentObject) {
        var albumID = listenedImage.parentElement.getAttribute("data-id");

        var urlBase = "https://api.spotify.com/v1/albums/";
        var urlType = "/tracks?limit=50";

        var url = urlBase + albumID + urlType;

        this.get(url).then(function(response) {
            var resultsObject = JSON.parse(response);
            parentObject.showTracks(resultsObject);
        }, function(error) {
            console.error(error);
        });
    };

    /**
     * Opens up the album list modal and iterates over the results to append the list elements
     * @param tracksObject converted from the JSON response
     */
    spotifySearch.showTracks = function (tracksObject) {
        var i;
        var tracksArray = tracksObject.items;
        var tracksLength = tracksArray.length;

        var trackBox = document.querySelector("#trackBox");
        var trackBoxMask = document.querySelector("#trackBoxMask");
        var trackList = document.querySelector("#trackList");

        trackBox.classList.remove("hidden");
        trackBoxMask.classList.remove("hidden");
        trackList.innerHTML = "";

        for (i = 0; i < tracksLength; i++) {
            var oneTrack = tracksArray[i];
            var trackLi = this.createTrackListElement(oneTrack);
            trackList.appendChild(trackLi);
        }
        this.scrollToTop();
    };

    /**
     * Creates a list element with a link to spotify
     * @param trackObject a single track object
     * @returns {Element} a ready li element to append to the list
     */
    spotifySearch.createTrackListElement = function (trackObject) {
        var name = trackObject.name;
        var spotifyLinkBase = "https://open.spotify.com/track/";
        var trackID = trackObject.id;
        var spotifyLink = spotifyLinkBase + trackID;
        var trackLi = document.createElement("li");
        var trackLink = document.createElement("a");

        trackLink.setAttribute("href", spotifyLink);
        trackLink.textContent = name;
        trackLi.appendChild(trackLink);
        return trackLi;
    };

    /**
     * Helper function for opening the album list modal
     */
    spotifySearch.closeAlbumList = function () {
        var albumBox = document.querySelector("#albumBox");
        var albumBoxMask = document.querySelector("#albumBoxMask");

        albumBox.classList.add("hidden");
        albumBoxMask.classList.add("hidden");
    };

    /**
     * Helper function for opening the track list modal
     */
    spotifySearch.closeTrackList = function () {
        var trackBox = document.querySelector("#trackBox");
        var trackBoxMask = document.querySelector("#trackBoxMask");

        trackBox.classList.add("hidden");
        trackBoxMask.classList.add("hidden");
    };

    /**
     * Helper function for jumping to the very top of the app
     */
    spotifySearch.scrollToTop = function () {
        window.scrollTo(0, 0);
    };

    /**
     * Shows and hides the floating back to top button depending on the distance from the top of the app
     */
    spotifySearch.showScrollToTopButton = function() {
        var scrolledAmount = 300;
        var backToTop = document.querySelector("#backToTop");

        if (window.scrollY > scrolledAmount) {
            backToTop.classList.remove("hidden");
        } else {
            backToTop.classList.add("hidden");
        }
    };

    /**
     * Helper function for setting up the main listeners on the app
     */
    spotifySearch.setupListeners = function () {
        var that = this;

        var searchButton = document.querySelector("#searchButton");
        var closeAlbumListButton = document.querySelector("#closeAlbumList");
        var closeTrackListButton = document.querySelector("#closeTrackList");
        var searchBox = document.querySelector("#searchBox");
        var backToTop = document.querySelector("#backToTop");

        searchButton.addEventListener("click", function() {
            that.doRequest(that);
        });
        closeAlbumListButton.addEventListener("click", this.closeAlbumList);
        closeTrackListButton.addEventListener("click", this.closeTrackList);
        searchBox.addEventListener("keyup", function() {
            that.doRequest(that);
        });
        backToTop.addEventListener("click", this.scrollToTop);
        window.addEventListener("scroll", this.showScrollToTopButton);
        searchBox.focus();
    };

    spotifySearch.setupListeners();
})();
