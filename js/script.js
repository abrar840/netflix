


let baseURL = window.location.origin;
let currentSong = new Audio;


function secondsToMinutesSecond(seconds) {

    if (isNaN(seconds) || seconds < 0) {
        return "00:00"

    }


    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60)

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, 0);

    return `${formattedMinutes}:${formattedSeconds}`;





}





async function getSongs(folder) {
    try {

        // let response = await fetch("http://127.0.0.1:5500/songs/");

        let response = await fetch(`http://127.0.0.1:5500/${folder}/`);
        // Check if the fetch was successful
        if (!response.ok) {
            console.error("Network response was not ok:", response.statusText);
            return [];
        }

        let html = await response.text();
        console.log(response)
        let div = document.createElement("div");
        div.innerHTML = html;

        let as = div.getElementsByTagName("a");
        let songs = [];

        document.querySelector(".lib-heading>h4").innerHTML = folder.split("/")[1];

        for (let i = 0; i < as.length; i++) {
            if (as[i].href !== "#" && i > 3) {
                let span = as[i].querySelector("span");

                // Ensure span is not null before accessing innerHTML
                if (span) {
                    songs.push({ "name": span.innerHTML, "link": as[i].href });
                }
            }
        }



        let songUL = document.querySelector(".song-list").getElementsByTagName("ul")[0]
        songUL.innerHTML = ""
        if (songUL) {


            console.log(".........................ff.")
            console.log(folder)
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
                     </div> </li>`
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
    let track = track1;
    console.log(track)
    console.log("above is track")
    currentSong.src = track;
    if (!pause) {
        currentSong.play();
        play.src = "svg/pause.svg"
    }


    console.log("index")




    document.querySelector(".song-info").innerHTML = currentSong.src.split("/")[5].replaceAll("%20", " ")

}










// now add a event listenener for time update 

currentSong.addEventListener("timeupdate", () => {

    console.log(currentSong.currentTime, currentSong.duration);

    document.querySelector(".song-time").innerHTML = `${secondsToMinutesSecond(currentSong.currentTime)}/${secondsToMinutesSecond(currentSong.duration)}`;

    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";


})

//event listenenr for seekbar clicks 

document.querySelector(".seek-bar").addEventListener("click", (e) => {


    console.log(e)

    //below line confusion ....need practice and saearch
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration) * percent / 100;

})


//event listener for hamburger 

document.querySelector(".hamburger").addEventListener("click", () => {

    document.querySelector(".left").style.left = "0";
})







document.querySelector(".close").addEventListener("click", () => {

    document.querySelector(".left").style.left = "-100%";
})





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
})



//async function for next button
async function nextsong(folder) {

    //  let songs=await getSongs("songs/ncs");
    for (let index = 0; index < songs.length; index++) {
        console.log("hi from next song name")
        console.log(currentSong)
        // console.log(songs[1].link)
        // if(songs[index].name===currentSong.src.split(`/${folder}/`)[1].replaceAll("%20"," "))
        if (songs[index].link === currentSong.src) {

            if (!songs[index + 1].name.includes(".mp3")) {


                playMusic(songs[index + 2].link, pause = false); break;
            }
            else {
                playMusic(songs[index + 1].link, pause = false); break;
            }
        }
    }
}




async function previoussong() {

    //async function for previous button
    //songs is globally defined
    //let songs=await getSongs("songs/ncs");
    for (let index = 0; index < songs.length; index++) {
        if (songs[index].link === currentSong.src) {
            if (index > 0) {
                // playMusic(songs[index - 1].link, pause = false);

                if (!songs[index - 1].name.includes(".mp3")) {


                    playMusic(songs[index - 2].link, pause = false); break;
                }
                else {
                    playMusic(songs[index - 1].link, pause = false); break;
                }




            }

        }
    }
}



previous.addEventListener("click", () => {
    previoussong();
})



next.addEventListener("click", () => {
    nextsong();
})


document.querySelector(".volume").addEventListener("mouseenter", () => {

    document.querySelector(".range").style.display = "block";

})

document.querySelector(".volume").addEventListener("mouseleave", () => {

    document.querySelector(".range").style.display = "none";

})


//addd an ebevtn for volume

document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {

    currentSong.volume = parseInt(e.target.value) / 100

})




//load playlist whenever card is clicked 



async function displayAlbums(folder0) {
    // Fetch the content of the folder
    let response = await fetch(`${baseURL}/${folder0}/`);
    console.log(`${baseURL}/${folder}/`); // Output the URL to debug


    // Check if the fetch was successful
    if (!response.ok) {
        console.error("Network response was not ok:", response.statusText);
        return [];
    }

    let html = await response.text();
    let div = document.createElement("div");
    div.innerHTML = html;

    let anchors = div.getElementsByTagName("a");

    let arr = Array.from(anchors);

    console.log("arr length" + arr.length)

    for (let i = 0; i <= arr.length; i++) {
        // e = arr[i]

        console.log(arr[4].href)


        if (arr[i + 3].href.includes("/songs")) {

            folder1 = arr[i + 3].href.split("/").slice(-2)[0]

            // Fetch the JSON data correctly

            let a = await fetch(`http://127.0.0.1:5500/${folder0}/${folder1}/info.json`);
            let response = await a.json(); // Correctly parse the JSON data
            console.log(response)

            // Check if cardcontainer is defined and then update its innerHTML
            cardcontainer = document.querySelector(".cardcontainer");
            if (typeof cardcontainer !== 'undefined') {
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

                    e.addEventListener("click", async item => {

                        songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);

                        //loop to make sure only first song of file is played 
                        let i = 0;
                        while (!songs[i].name.includes(".mp3")) {
                            i++;

                        } playMusic(songs[i].link, pause = false);




                        //to liste click event is playlist

                        let li = Array.from(document.querySelector(".song-list").getElementsByTagName("li"));

                        li.forEach(e => {
                            e.addEventListener("click", element => {

                                //console.log(e.querySelector(".info").firstElementChild.innerHTML)
                                playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

                            })
                        })
                    })

                })

            } else {
                console.error("cardcontainer is not defined.");
            };
        };
    };
}



//event listner for volume img click to mute song

document.querySelector(".volume>img").addEventListener("click", e => {




    if (e.target.src.includes("svg/volume.svg")) {

        e.target.src = e.target.src.replace("volume.svg", "mute.svg")
        currentSong.volume = 0;

        document.querySelector(".range").getElementsByTagName("input")[0].value = 0;

    }
    else {
        e.target.src = e.target.src.replace("mute.svg", "volume.svg")

        currentSong.volume = 0.50
        document.querySelector(".range").getElementsByTagName("input")[0].value = 10;

    }


})


async function main() {


    displayAlbums("/songs/");

}

main();






