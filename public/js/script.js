let currentSong = new Audio();
let cfolder;

function secondsToMinutesSecond(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, 0);

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    try {
        // let response = await fetch("/songs/");

        let response = await fetch(`/songs/${folder}/info.json`);

        // Check if the fetch was successful
        if (!response.ok) {
            console.error("Network response was not ok:", response.statusText);
            return [];
        }

        const data = await response.json();

        // Extract categories into an array
        const namelist = data.songs;
        // let html = await response.text();

        // let div = document.createElement("div");
        // div.innerHTML = html;

        
        let songs = [];

        document.querySelector(".lib-heading>h4").innerHTML = folder;

        for (let i = 1; i <namelist.length; i++) {
            if (namelist[i].href !== "#") {
                let fileName =namelist[i]; // Get the text inside the <a> tag
                // let fileLink = as[i].href; 
                let fileLink =namelist[i];

                if (fileName.endsWith(".mp3")) {
                    // Filter for .mp3 files
                    songs.push({ name: fileName, link: fileLink });
                }

                console.log(songs[i])
            }
        }

        let songUL = document
            .querySelector(".song-list")
            .getElementsByTagName("ul")[0];
        songUL.innerHTML = "";
        if (songUL) {
            for (const song of songs) {
                if (song.name.includes(".mp3")) {
                    // Append each song as an <li> element with the song's name
                    songUL.innerHTML += `
    
                <li>
    
                   
                    <img class="invert "src="svg/music.svg" alt="music">
                    <div class="info">
                     <div class="link" style=display:none>${song.link}</div>
                      <div class="name"> ${song.name.split("/mp3/")[0]}</div>
                     
                     <div class="artist">abs</div>
                     </div>
                     <div class="playnow">
                     <span class="">play now</span>
                     <img src="svg/play.svg" alt="" class="invert">
                     </div> </li>`;
                }
            }
        } else {
            console.error("No <ul> element found inside .song-list.");
        }

        return songs;
    } catch (error) {
        console.error("An error occurred:", error);
        return [];
    }
}
const playMusic = (track1, pause = false) => {
    try {
        let track = track1; // Ensure there are no leading/trailing spaces
        console.log("track")
        console.log(track)

        // Assign the track URL to the audio element
        currentSong.src = track;

        if (!pause) {
            currentSong.play();
            console.log("Playing...");
            play.src = "svg/pause.svg";
        }

        // Extract and display song information
        let songName = decodeURIComponent(currentSong.src.split("/").pop()); // Get the last part of the URL
        document.querySelector(".song-info").innerHTML = songName
            .replace(".mp3", "")
            .replaceAll("%20", " ");
    } catch (error) {
        console.error("An error occurred in playMusic:", error);
    }
};

// now add a event listenener for time update

currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime, currentSong.duration);

    document.querySelector(".song-time").innerHTML = `${secondsToMinutesSecond(
        currentSong.currentTime
    )}/${secondsToMinutesSecond(currentSong.duration)}`;

    document.querySelector(".circle").style.left =
        (currentSong.currentTime / currentSong.duration) * 100 + "%";
});

//event listenenr for seekbar clicks

document.querySelector(".seek-bar").addEventListener("click", (e) => {
    //below line confusion ....need practice and saearch
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
});

//event listener for hamburger

document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
});

document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
});

//event listener for play pause button 3play

play.addEventListener("click", () => {
    if (currentSong.src) {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "svg/pause.svg";
        } else {
            currentSong.pause();
            play.src = "svg/play2.svg";
        }
    }
});

async function previoussong() {
    //async function for previous button
    //songs is globally defined
    //let song
    for (let index = 0; index < songs.length; index++) {
        if (songs[index].name === currentSong.src.split("/")[5]) {
            if (index > 0) {
                // playMusic(songs[index - 1].link, pause = false);

                if (!songs[index - 1].name.includes(".mp3")) {
                    playMusic(
                        `/songs/${cfolder}/${songs[index - 2].name}`,
                        (pause = false)
                    );
                    break;
                } else {
                    playMusic(
                        `/songs/${cfolder}/${songs[index - 1].name}`,
                        (pause = false)
                    );
                    break;
                }
            }
        }
    }
}

//async function for next button
async function nextsong(folder) {
    //  let songs=await getSongs("songs/ncs");
    for (let index = 0; index < songs.length; index++) {
        //if(songs[index].name===currentSong.src.split(`/${folder}/`)[1].replaceAll("%20"," "))
        if (songs[index].name === currentSong.src.split("/")[5]) {
            if (index < songs.length) {
                if (!songs[index + 1].name.includes(".mp3")) {
                    playMusic(
                        `/songs/${cfolder}/${songs[index + 2].name}`,
                        (pause = false)
                    );
                    break;
                } else {
                    playMusic(
                        `/songs/${cfolder}/${songs[index + 1].name}`,
                        (pause = false)
                    );
                    break;
                }
            }
        }
    }
}

previous.addEventListener("click", () => {
    previoussong();
});

next.addEventListener("click", () => {
    nextsong();
});

document.querySelector(".volume").addEventListener("mouseenter", () => {
    document.querySelector(".range").style.display = "block";
});

document.querySelector(".volume").addEventListener("mouseleave", () => {
    document.querySelector(".range").style.display = "none";
});

//addd an ebevtn for volume

document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
    });

//load playlist whenever card is clicked

// let baseURL = window.location.origin;

async function displayAlbums(folder0) {
    // Fetch the content of the folder

    console.log(`${folder0}`); // Output the URL to debug

    let response = await fetch(`/${folder0}/songs.json`);

    // Check if the fetch was successful
    if (!response.ok) {
        console.error("Network response was not ok:", response.statusText);
        return [];
    }

    const data = await response.json();

    // Extract categories into an array
    const categories = data.categories;



    // let html = await response.text();
    // let div = document.createElement("div");
    // div.innerHTML = html;

    // let anchors = div.getElementsByTagName("a");

    let arr = categories;

    for (let i = 1; i < arr.length; i++) {
        // e = arr[i]

        // folder1 = arr[i].href.split("/")[3];
        
        folder1 = categories[i];

        // Fetch the JSON data correctly

        let a = await fetch(`${folder0}/${folder1}/info.json`);
        
            
        let response = await a.json(); // Correctly parse the JSON data

        // Check if cardcontainer is defined and then update its innerHTML
        cardcontainer = document.querySelector(".cardcontainer");
        if (typeof cardcontainer !== "undefined") {
            cardcontainer.innerHTML += `
                    <div data-folder=${folder1} class="card">
                        <div class="play-button-svg">
                            <img src="svg/play-button.svg" alt="nn" />
                        </div>
                        <img class="articleimg" src="/songs/${folder1}/cover.jpeg" alt="" />
                        <div class="text">
                            <h2>${response.title}</h2>
                            <p>${response.description}</p>
                        </div>
                    </div>`;

            Array.from(document.getElementsByClassName("card")).forEach(async (e) => {
                e.addEventListener("click", async (item) => {
                    let fname = item.currentTarget.dataset.folder; // Grabs the folder name from the data attribute
                    cfolder = fname;
                    songs = await getSongs(fname); // Passes the folder name to the function

                    //loop to make sure only first song of file is played
                    let i = 0;
                    while (!songs[i].name.includes(".mp3")) {
                        i++;
                    }
                    playMusic(`/songs/${fname}/${songs[i].name}`, false);

                    //to liste click event is playlist

                    let li = Array.from(
                        document.querySelector(".song-list").getElementsByTagName("li")
                    );

                    li.forEach((e) => {
                        e.addEventListener("click", (element) => {
                            //console.log(e.querySelector(".info").firstElementChild.innerHTML)
                           
                            
                            let songname = e.querySelector(".info").firstElementChild.innerText;
                            console.log("e")
                            console.log(songname)
                            playMusic(`/songs/${cfolder}/${songname}`);
                        });
                    });
                });
            });
        } else {
            console.error("cardcontainer is not defined.");
        }
    }
}

//event listner for volume img click to mute song

document.querySelector(".volume>img").addEventListener("click", (e) => {
    if (e.target.src.includes("svg/volume.svg")) {
        e.target.src = e.target.src.replace("volume.svg", "mute.svg");
        currentSong.volume = 0;

        document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    } else {
        e.target.src = e.target.src.replace("mute.svg", "volume.svg");

        currentSong.volume = 0.5;
        document
            .querySelector(".range")
            .getElementsByTagName("input")[0].value = 10;
    }
});

async function main() {
    displayAlbums("songs");
}

main();
