// import AgoraRTC from "agora-rtc-sdk-ng"
// const TOKEN='006f7516bda7e2e48adb82ba5b076f263d4IAAMO5duOy+gHgZoSNKTLisX/OwWypNvzS/cbBxI06aIgmeUCi4AAAAAEAAfRG5qDp4eYgEAAQAOnh5i';
// 836361870d954e4f85023cec5afac1ff

const APP_ID='1591626e875e43ea94767febcd4a1956';
const CHANNEL_NAME='project_one';
const TOKEN='0061591626e875e43ea94767febcd4a1956IAC6+12OaP1Eh325aG54fxxyfB2FFmhkcs7WMetLLQz47hJcF+gAAAAAEAAfRG5qpqUeYgEAAQClpR5i'
const EXPIRATION="Token expires on March 1, 2022 9:22 PM UTC"

 /* OBJ FOR AGORA, userdata, and datastream.  */
const client = AgoraRTC.createClient({mode:'rtc', codec:'vp8'})
let local_data = [] /* audio track storage, will be used to retrive A/V [0],. [1] idx*/
let new_user = {} /* connected users */

//listener 
/* 
 - function for web conference--> calls agoraRTC for Mic/Camera method. 
 - creates a container to display and store stream . 
*/

let web_conferance = async () => {
            try{ 
            const UID = await client.join(APP_ID, CHANNEL_NAME, TOKEN, null)
            client.on('user-published',  handle_newUser)

            local_data = await  AgoraRTC.createMicrophoneAndCameraTracks() 

            let player = `<div class="video-container" id="user-container-${UID}">
            <div class="video-player" id="user-${UID}"></div>
            </div>`

            document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)
            
            local_data[1].play(`user-${UID}`) /* reflects AV stream for end-user [they can see themselves] */
            await client.publish([local_data[0], local_data[1]]) /* AV from from corrospinding array idx */

}catch(err){
            console.error(err);
}}

// call above funcion asynchously, return !doc id's upon satifcation. 
let join_conferance = async () => {
            try{
            await web_conferance () 
            document.getElementById('join-btn').style.display='none'
            document.getElementById('stream-controls').style.display='flex'
            }
            catch(err){
            console.log('join_stream');
            console.error(err);
}}


/* trigger video relay-->  */ 

// this function handles new users, and will fire everytime a new user joins stream 
// sets unique key val to incoming users (*internal note- .subscribe() is a promise (.then) fo objects)
let handle_newUser = async(user, data_type) => { 
            new_user[user.UID] = user // set uid 
            await client.subscribe(user, data_type) 
               if (data_type === 'video'){
                        let player = document.getElementById(`user-container-${user.UID}`)
                        if (player != null){
                                    player.remove()
                        }

                        player = `<div class="video-container" id="user-container-${user.UID}">
                                    <div class="video-player" id="user-${user.UID}"></div>
                                   </div>`
                        
                        document.getElementById('video-streams').insertAdjacentElement('beforeend', player)
                        user.videoTrack.play(`user-${user.UID}`)
                        
                        if(mediaType === 'audio'){
                                    user.audioTrack.play()
                        }

}}

let handle_userLeft = async(user) =>{
            
            delete new_user[user.UID]
            document.getElementById(`user-container-${user.UID}`).remove()
}

let kill_stream = async() =>{
            for(let i = 0; localTracks.length > i; i ++){
                        local_data[i].stop()
                        local_data[i].close()
            }
            await client.leave()
            document.getElementById('join-btn').style.display = 'block'
            document.getElementById('stream-controls').style.display = 'none'
            document.getElementById('video-streams').style.display = ''
}

let mic_toggle = async(e) =>{
            if(local_data[0].muted){
                        await local_data[0].setMuted(true)
                        e.target.innerText='Mic\'s on'
                        e.target.style.backgroundColor='cadetBlue'
            }else{
                        await local_data[0].setMuted(true)
                        e.target.innerText='Mic\'s off'
                        e.target.style.backgroundColor ='#EE4B2B' 
            }
}

let cam_toggle = async(e) =>{
            if (local_data[1].muted){
                        await local_data[1].setMuted(false)
                        e.target.innerText='Camera\'s on'
                        e.target.style.backgroundColor='cadetBlue'
            }else{
                        await local_data[1].setMuted(true)
                        e.target.innerText='Camera\'s off'
                        e.target.style.backgroundColor ='#EE4B2B'            
            }

}
document.getElementById('join-btn').addEventListener('click', join_conferance) // join stream 
document.getElementById('leave-btn').addEventListener('click', kill_stream) //kill io after exit
document.getElementById('mic-btn').addEventListener('click', mic_toggle) //mic btn
document.getElementById('camera-btn').addEventListener('click', cam_toggle) //camera btn

