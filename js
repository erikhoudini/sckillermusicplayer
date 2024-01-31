<script>
document.addEventListener('DOMContentLoaded', () => {
    // Selects various elements from the document for manipulation
    const playPauseButton = document.querySelector('.play-pause');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    const shareButton = document.querySelector('.share-button');
    const musicPlayer = document.querySelector('#music-player');
    const songTitle = document.querySelector('#song-title');
    const albumArt = document.querySelector('#album-art');
    const playlistItems = document.querySelectorAll('.playlist-item');

    // Initializes WaveSurfer for displaying audio waveform
    const waveform = WaveSurfer.create({
        container: '#waveform',
        waveColor: '#7B1ACB', // Color of the waveform
        progressColor: 'rgba(123,26,203,0.5)', // Color of the played part of the waveform
        cursorColor: 'grey', // Color of the cursor in the waveform
        cursorWidth: 1, // Width of the cursor
        height: 100, // Height of the waveform
        responsive: true, // Makes the waveform responsive
        backend: 'MediaElement' // Allows WaveSurfer to work with dynamically loaded tracks
    });

    let currentTrackIndex = null; // Variable to keep track of the current playing song index

    // Function to change the current track
    const changeTrack = (newIndex) => {
        // Pauses and resets the current track if one is playing
        if (currentTrackIndex !== null) {
            musicPlayer.pause();
            musicPlayer.currentTime = 0;
            waveform.pause();
            waveform.seekTo(0);
        }

        // Sets the new track as the current track and updates the player and waveform
        currentTrackIndex = newIndex;
        const newTrack = playlistItems[newIndex];
        musicPlayer.src = newTrack.dataset.src; // Sets the source for the music player
        albumArt.src = newTrack.dataset.art; // Sets the album art
        songTitle.textContent = newTrack.dataset.title; // Sets the song title
        waveform.load(musicPlayer.src); // Loads the new track into the waveform

        // Plays the new track
        musicPlayer.play();
        waveform.play();
    };

    // Event listeners for the control buttons
    playPauseButton.onclick = () => {
        // Toggles play/pause for the current track
        if (currentTrackIndex === null) return; // Does nothing if no track is selected

        if (musicPlayer.paused) {
            musicPlayer.play();
            waveform.play();
            playPauseButton.textContent = 'Pause';
        } else {
            musicPlayer.pause();
            waveform.pause();
            playPauseButton.textContent = 'Play';
        }
    };

    prevButton.onclick = () => {
        // Changes to the previous track
        if (currentTrackIndex > 0) {
            const newIndex = currentTrackIndex - 1;
            changeTrack(newIndex);
        }
    };

    nextButton.onclick = () => {
        // Changes to the next track
        if (currentTrackIndex !== null && currentTrackIndex < playlistItems.length - 1) {
            const newIndex = currentTrackIndex + 1;
            changeTrack(newIndex);
        }
    };

    shareButton.onclick = () => {
        // Shares the current track if the browser supports it
        if (navigator.share && currentTrackIndex !== null) {
            navigator.share({
                title: songTitle.textContent,
                url: window.location.href,
            }).catch(console.error);
        } else {
            alert('Sharing is not supported on this browser, or no track is selected.');
        }
    };

    // Sets up click events for each playlist item
    playlistItems.forEach((item, index) => {
        item.onclick = () => {
            changeTrack(index);
        };
    });
});
</script>
</body>
</html>
