console.log("Lets write JavaSacript")
let currentSong = new Audio();
let songs;
let currfolder;
function secondsToMinutesSeconds(second) {
    if (isNaN(second) || second < 0) {
        return "00:00";
    }
    const minutes = Math.floor(second / 60);
    const remainingSecond = Math.floor(second % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSecond).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;

}
async function getsongs(folder) {
    currfolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text();

    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    
//Show all the song in the playlist
songUL = document.querySelector(".songslist").getElementsByTagName("ul")[0]
songUL.innerHTML = ""
for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML + `<li> <img class="invert" src="img/playlist.svg" alt="">
        <div class="info">
          <span class="songname"> ${song.replaceAll("%20", " ")}   </span>
          <span class="songartist">Ambuj</span>
        </div>
        <div class="playnow">
          <span>Play Now</span>
        <img class="invert" src="img/play.svg" alt="">
        </div>  
 </li>`;
}
//attech an eventlistner to each song
Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {

      
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })
})
return songs

}
const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track)
    currentSong.src = `/${currfolder}/` + track;
    if (!pause) {

        currentSong.play()
        play.src = "img/pause.svg"
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"



}

 
async function displayalbums() {
    let a = await fetch(`/songs/`)
    let response = await a.text();

    let div = document.createElement("div")
    div.innerHTML = response;
    let ancor = div.getElementsByTagName("a")
    // let folder = []
        let cardContainer = document.querySelector(".cardContainer")
       let array = Array.from(ancor)
     //use for loop
     for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
    //  }

        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = (e.href.split("/").slice(-2)[0])
            //Get the metaData of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json();
            // console.log(response)
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card ">
            <div class="play">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000"
                fill="#000">
                <path
                  d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                  stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
              </svg>
            </div>
            <img src="/songs/${folder}/cover.jpeg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
          </div>`


        }
    }
   


              //Loade the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
// console.log(e)
        e.addEventListener("click", async item => {
            // console.log("fetchnig song")
            // console.log(item.target, item.currentTarget.dataset)
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
playMusic(songs[0])
        })
    })
}





async function main() {

    //get the list of the all song
    // let currentSong;


    //Gat the list of all the song
    await getsongs("songs/ncs")
    playMusic(songs[0], true)
    // currentSong.src = songs[0]

    // console.log(songs);

    //display all the albums on the page

    await displayalbums()


    //Attech an event listner to play, next and previus
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"

        }
        else {

            currentSong.pause()
            play.src = "img/play.svg"
        }
    })



    //Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}:/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";

    })
    //Add an event listner to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let parcent = ((e.offsetX / e.target.getBoundingClientRect().width) * 100)
        document.querySelector(".circle").style.left = parcent + "%";
        currentSong.currentTime = (currentSong.duration) * parcent / 100

    })

    //Add an event listner for hameburger
    document.querySelector(".hamebager").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })
    //Add an event listner for closeButton
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })

    //Add to event listner previus  
    previus.addEventListener("click", () => {
        // console.log("previus clicked")
        // console.log(currentSong)

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

        if ((index - 1) >= 0) {

            playMusic(songs[index - 1])
        }

    })
    //Add to event listner  next
    next.addEventListener("click", () => {
        currentSong.pause()
        // console.log("next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

        if ((index + 1) < songs.length) {

            playMusic(songs[index + 1])
        }

    })
    //add event to volume
    document.querySelector(".rang").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        // console.log("seting value to", e.target.value)
        currentSong.volume = parseInt(e.target.value) / 100
    })

//Add event listner to mute the track
document.querySelector(".volume > img").addEventListener("click", e=>{
    
    if(e.target.src.includes("volume.svg")){
    e.target.src =   e.target.src.replace("volume.svg", "mute.svg")
       currentSong.volume = 0;
       document.querySelector(".rang").getElementsByTagName("input")[0].value = 0;
    }
    else{
        e.target.src = e.target.src.replace("mute.svg", "volume.svg")

        currentSong.volume = .10;
        document.querySelector(".rang").getElementsByTagName("input")[0].value = 10;
    }
    
})


}
main()