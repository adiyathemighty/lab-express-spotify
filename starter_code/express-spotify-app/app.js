const express = require("express");
const app = express();
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");
const path = require("path");
let searchTerm = "";

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Remember to paste here your credentials
const clientId = "4cb8f09435db497f9d5bd78ab73ee1f1", // TO CHANGE
  clientSecret = "777a7ba944df4bacbddcf2a230eef3a1"; // TO CHANGE

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    spotifyApi.setAccessToken(data.body["access_token"]);
  },
  function(err) {
    console.log("Something went wrong when retrieving an access token", err);
  }
);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/artist", (req, res) => {
  const { artist } = req.query;
  searchTerm = artist;
  spotifyApi
    .searchArtists(artist)
    .then(data => {
      res.render("artist", {
        data: data.body.artists.items,
        searchParam: searchTerm
      });
    })
    .catch(err => {
      console.error(err);
    });
});

app.get("/tracks/:albumId", (req, res) => {
  const albumId = req.params.albumId;
  spotifyApi
    .getAlbumTracks(albumId)
    .then(data => {
      res.render("tracks", { data: data.body.items });
    })
    .catch(err => {
      console.error(err);
    });
});

app.get("/albums/:artistId", (req, res) => {
  const artistId = req.params.artistId;
  spotifyApi
    .getArtistAlbums(artistId)
    .then(data => {
      res.render("albums", { data: data.body.items, searchParam: searchTerm });
    })
    .catch(err => {
      console.error(err);
    });
});

app.listen(3000);
