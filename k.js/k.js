console.log("hello this is js");


let currentSong=new Audio;
let currFolder;
let songs=[];
let folder="ncs";
function secondsToMinutesSecond(seconds){

if(isNaN(seconds) || seconds<0){
return "00:00"

}


const minutes =Math.floor(seconds/60);
const remainingSeconds = Math.floor(seconds%60)

const formattedMinutes=String(minutes).padStart(2, '0');
const formattedSeconds=String(remainingSeconds).padStart(2,0);

return `${formattedMinutes}:${formattedSeconds}`;





}





async function getSongs(fold) {
    try { currFolder=folder;

       // let response = await fetch("http://127.0.0.1:5500/songs/");

        let response = await fetch(`http://127.0.0.1:5500/${fold}/`);
        // Check if the fetch was successful
        if (!response.ok) {
            console.error("Network response was not ok:", response.statusText);
            return [];
        }
        
        let html = await response.text();
        
        let div = document.createElement("div");
        div.innerHTML = html;

        let as = div.getElementsByTagName("a");
        let songs = [];

        for (let i = 0; i < as.length; i++) {   
            if (as[i].href !== "#" && i > 3) { 
                let span = as[i].querySelector("span");
                
                // Ensure span is not null before accessing innerHTML
                if (span) {
                    songs.push({"name": span.innerHTML, "link": as[i].href});
                }
            }
        }



        let songUL = document.querySelector(".song-list").getElementsByTagName("ul")[0]
        songUL.innerHTML=""
        if (songUL) {
            
            
            
            for (const song of songs) {
    
                
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
        } else {
            console.error("No <ul> element found inside .song-list.");
        }



       
     




        return songs;
    } catch (error) {
        console.error("An error occurred:", error);
        return [];
    }
}


const playMusic=(track1,pause=false)=>{
    
    console.log(track1)
    console.log("above is track")
    currentSong.src=track1;
     if(!pause){
        currentSong.play();
        play.src="svg/pause.svg"
     }
   
    
    document.querySelector(".song-info").innerHTML = track1.split(`/${folder}/`)[1].replaceAll("%20"," ")
   
}



async function main(){

    

    

    
    
    
  
    // var audio = new Audio(songs[0]);
    // audio.play();
    

      

   
    let li=Array.from(document.querySelector(".song-list").getElementsByTagName("li"));

    li.forEach(e=>{
      e.addEventListener("click",element=>{

         console.log(e.querySelector(".info").firstElementChild.innerHTML)
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            
      })
})

playMusic(songs[0].link,pause=true);

    
};







// now add a event listenener for time update 

currentSong.addEventListener("timeupdate",()=>{

console.log(currentSong.currentTime,currentSong.duration);

document.querySelector(".song-time").innerHTML=`${secondsToMinutesSecond(currentSong.currentTime)}/${secondsToMinutesSecond(currentSong.duration)}`;

document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100+"%";


})

//event listenenr for seekbar clicks 

document.querySelector(".seek-bar").addEventListener("click",(e)=>{


    console.log(e)

    //below line confusion ....need practice and saearch
    let percent =(e.offsetX/e.target.getBoundingClientRect().width)*100;
    document.querySelector(".circle").style.left=percent+"%";
    currentSong.currentTime=(currentSong.duration)*percent/100;

})


//event listener for hamburger 

document.querySelector(".hamburger").addEventListener("click",()=>{

document.querySelector(".left").style.left="0";    
})




    


document.querySelector(".close").addEventListener("click",()=>{

    document.querySelector(".left").style.left="-100%";    
    })



    //async function for next button
    async function nextsong(folder){

      //  let songs=await getSongs("songs/ncs");
     for (let index = 0; index <songs.length; index++) {
        console.log("hi from next song name")
         console.log(currentSong)
        // console.log(songs[1].link)
        
         if(songs[index].name===currentSong.src.split(`/${folder}/`)[1].replaceAll("%20"," ")){
      playMusic(songs[index+1].link,pause=false);
       
      break;
      }
        
    }}




    async function previoussong(){

    //async function for previous button
//songs is globally defined
 //let songs=await getSongs("songs/ncs");
    for (let index = 0; index <songs.length; index++) {
        if(songs[index].name===currentSong.src.split(`/${folder}/`)[1].replaceAll("%20"," ")){
    if(index>0){
    playMusic(songs[index-1].link,pause=false);
}break;
    
}}}



previous.addEventListener("click",()=>{
    previoussong(folder);
})




next.addEventListener("click",()=>{
nextsong(folder);
})



 document.querySelector(".volume").addEventListener("mouseenter",()=>{
     
    document.querySelector(".range").style.display="block";
    
    })
    
 document.querySelector(".volume").addEventListener("mouseleave",()=>{

    document.querySelector(".range").style.display="none";
    
    })


    //addd an ebevtn for volume

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{

       currentSong.volume=parseInt(e.target.value)/100
 
    })




//load playlist whenever card is clicked 

Array.from(document.getElementsByClassName("card")).forEach(e=>{


e.addEventListener("click",async item=>{

console.log("jjkj");



songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);


main();

})


})


