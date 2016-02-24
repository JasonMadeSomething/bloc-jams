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
            getSongNumberCell(currentlyPlayingSongNumber).html(currentlyPlayingSongNumber);
        }
        if (currentlyPlayingSongNumber === songNumber) {
            
            if(currentSoundFile.isPaused()){
                currentSoundFile.play();
                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
            }else{
                currentSoundFile.pause();
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton); 
            }
        } else if (currentlyPlayingSongNumber !== songNumber) {
            $(this).html(pauseButtonTemplate);
            setSong(songNumber);
            updatePlayerBarSong();
            currentSoundFile.play();
        }
        
    };
    
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

var updatePlayerBarSong = function(){
    var $songName = $('.currently-playing .song-name');
    var $artistName = $('.currently-playing .artist-name');
    var $artistMobile = $('.currently-playing .artist-song-mobile');
    var name = currentSongFromAlbum.name;
    var artist = currentAlbum.artist;
    $songName.text(name);
    $artistName.text(currentAlbum.artist);
    $artistMobile.text(name + " - " + artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
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

var setVolume = function(volume){
    if(currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
};

var setSong = function(songNumber) {
    
    if (currentSoundFile) {
        currentSoundFile.stop();
    }
    
    if (songNumber === null){
        currentSongFromAlbum = null;
        currentlyPlayingSongNumber = null;
    }else{
        currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
        currentlyPlayingSongNumber = songNumber;
        currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, { 
            formats: [ 'mp3' ],
            preload: true
        });
        setVolume(currentVolume);
    }
};

var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
};

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};

var nextSong = function(){
    var prev = currentSongFromAlbum;
    var newIndex = 0;
    getSongNumberCell(currentlyPlayingSongNumber).html(currentlyPlayingSongNumber);
    if(trackIndex(currentAlbum, prev) === currentAlbum.songs.length - 1){
       newIndex = 0;
    } else{
        newIndex = trackIndex(currentAlbum, prev) + 1;
    }
    setSong(newIndex + 1);
    currentSoundFile.play();
    getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
    updatePlayerBarSong();
};

var previousSong = function() {
    var next = currentSongFromAlbum;
    var newIndex = 0;
    getSongNumberCell(currentlyPlayingSongNumber).html(currentlyPlayingSongNumber);
    if(trackIndex(currentAlbum, next) === 0 ){
        newIndex = currentAlbum.songs.length - 1;
    } else{
        newIndex = trackIndex(currentAlbum, next) - 1;
    }
    setSong(newIndex + 1);
    currentSoundFile.play();
    getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
    updatePlayerBarSong();
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function(){
    
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
});