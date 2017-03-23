(function () {
    var audio = new Audio();

    function PreviewTrack(query) {
        $.ajax({
            url: 'https://api.spotify.com/v1/search',
            data: {
                q: query,
                type: 'track'
            },
            success: function (response) {
                if (response.tracks.items.length) {
                    var track = response.tracks.items[0];
                    audio.src = track.preview_url;
                    audio.play();
                    communicateAction('<div>Playing ' + track.name + ' by ' + track.artists[0].name + '</div><img width="150" src="' + track.album.images[1].url + '"><br/>' + 'Popularity: ' + track.popularity + '/100' + '<br/><a href="http://open.spotify.com/track/' + track.id +'" class="button" target="_blank">Play full track</a>');
                }
                else {
                    communicateAction('Sorry, no such song available for preview');
                }
            }
        });
    }

    function PlayFullTracks(query) {
        $.ajax({
            url: 'https://api.spotify.com/v1/search',
            data: {
                q: query,
                type: 'track'
            },
            success: function (response) {
                if (response.tracks.items.length) {
                    var track = response.tracks.items[0];
                    communicateAction('<div>Launching app for ' + track.name + ' by ' + track.artists[0].name + '</div><img width="150" src="' + track.album.images[1].url + '">');
                    window.open('http://open.spotify.com/track/' + track.id);

                }
                else {
                    communicateAction('Sorry, no such song found');
                }
            }
        });
    }

    function searchAlbum(query) {
        $.ajax({
            url: 'https://api.spotify.com/v1/search',
            data: {
                q: query,
                type: 'track'
            },
            success: function (response) {
                if (response.tracks.items.length) {
                    var track = response.tracks.items[0];
                    communicateAction('<div>Album name is ' + '<strong>'+track.album.name+'</strong>' + ' by ' + track.artists[0].name + '</div><img width="150" src="' + track.album.images[1].url + '">');
                }
                else {
                    communicateAction('Sorry, no album found');
                }
            }
        });
    }


    function getAlbums(query) {
        $.ajax({
        url: 'https://api.spotify.com/v1/search',
        data: {
            q: query,
            type: 'album',
            limit: 5
        },
            success: function (response) {
                if (response.albums.items.length) {
                        for(var i = 0; i < query.length; i++) {
                        var albums = response.albums.items[i];
                        // console.log(response);
                        communicateAction("<div>" + albums.name + '</div><br/><img width="150" src="' + albums.images[0].url +'">');
                        // console.log(response.albums.items.length);
                        // console.log(response.albums.items[i]);
                        }
                } 
                else {
                    communicateAction('Sorry, no albums found');
                }             
            }
        });
    }


    function PreviewSong(songName, artistName) {
        var query = songName;
        if (artistName) {
            query += ' artist:' + artistName;
        }

        PreviewTrack(query);
    }
        function PlaySong(songName, artistName) {
        var query = songName;
        if (artistName) {
            query += ' artist:' + artistName;
        }

        PlayFullTracks(query);
    }
    function albumName(songName, artistName) {
        var query = songName;
        if (artistName) {
            query += ' artist:' + artistName;
        }

        searchAlbum(query);
    }
    function getAllAlbums(albumName, artistName) {
        var query = albumName;
        if (artistName) {
            query += ' artist:' + artistName;
        }

        getAlbums(query);
    }

    function communicateAction(text) {
        var rec = document.getElementById('conversation');
        rec.innerHTML += '<div class="action">' + text + '</div>';
    }

    function recognized(text) {
        var rec = document.getElementById('conversation');
        rec.innerHTML += '<div class="recognized"><div>' + text + '</div></div>';
    }


    if (annyang) {
        // voice commands
        var commands = {
            'stop': function () {
                audio.pause();
            },
            'pause': function () {
                audio.pause();
            },
                'play track *song': function (song) {
                recognized('play track ' + song);
                PlaySong(song);
            },
                'play *song by *artist': function (song, artist) {
                recognized('Play song ' + song + ' by ' + artist);
                PlaySong(song, artist);
            },
                'play song *song': function (song) {
                recognized('Play song ' + song);
                PlaySong(song);
            },
                'play *song': function (song) {
                recognized('play ' + song);
                PlaySong(song);
            },
                'preview *song by *artist': function (song, artist) {
                recognized('preview song ' + song + ' by ' + artist);
                PreviewSong(song, artist);
            },
                'preview song *song': function (song) {
                recognized('preview song ' + song);
                PreviewSong(song);
            },
                'preview *song': function (song) {
                recognized('preview ' + song);
                PreviewSong(song);
            },
                'which album is *song from': function (song) {
                recognized('which album is ' +song+ ' from ');
                albumName(song);
            },

                'which album is *song by *artist from': function (song, artist) {
                recognized('which album is ' +song+ ' by ' +artist+ ' from ');
                albumName(song, artist);
            },
                'show albums by *artist': function (artist) {
                recognized('show albums by ' + artist);
                getAlbums(artist);
            },

                ':nomatch': function (message) {
                recognized(message);
                communicateAction('Sorry, try again');
            }
        };
        

        // Add commands to annyang
        annyang.addCommands(commands);


        
        // Start listening
        annyang.start();
    }

    annyang.addCallback('error', function () {
        communicateAction('error');
    });
})();