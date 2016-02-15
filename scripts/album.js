var createSongRow = function (songNumber, songName, songLength) {
    var template =
        '<tr class="album-view-song-item">'
        + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
        + '  <td class="song-item-title">' + songName + '</td>'
        + '  <td class="song-item-duration">' + songLength + '</td>'
        + '</tr>';
    var $row = $(template);
    
    var clickHandler = function() {
        var songNumber = $(this).data('song-number');
        
        if(currentlyPlayingSongNumber !== null) {
            var playingSongCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
            playingSongCell.html(currentlyPlayingSongNumber);
        }
        if (currentlyPlayingSongNumber === songNumber) {
            $(this).html(playButtonTemplate);
            currentlyPlayingSongNumber = null;
            currentSongFromAlbum = null;
        } else if (currentlyPlayingSongNumber !== songNumber) {
            $(this).html(pauseButtonTemplate);
            currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
            currentlyPlayingSongNumber = songNumber;
        }
    }
    
    var onHover = function(event){
        var songItem = $(this).find(".song-item-number");
        var songItemNumber = songItem.data('song-number');
        
        if ( songItemNumber !== currentlyPlayingSongNumber){
            songItem.html(playButtonTemplate);
        }
    };
    
    var offHover = function(event){
        var songItem = $(this).find(".song-item-number");
        var songItemNumber = songItem.data('song-number');
        
        if(songItemNumber !== currentlyPlayingSongNumber){
            songItem.html(songItemNumber);
        }
    };
    
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};


var setCurrentAlbum = function (album) {
    currentAlbum = album;
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');
    

    $albumTitle.text(album.name);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);
    
    $albumSongList.empty();
    
    for (var i = 0; i < album.songs.length; i++){
        var $newRow = createSongRow(i + 1, album.songs[i].name, album.songs[i].length);
        $albumSongList.append($newRow);
    }
};


var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';


var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

$(document).ready(function(){
    
    setCurrentAlbum(albumPicasso);

});