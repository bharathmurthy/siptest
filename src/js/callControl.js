/**
 * Created by kumar on 14/01/2016.
 */
var oRingTone, oRingbackTone;

function startRingTone() {
    try { ringtone.play(); }
    catch (e) { }
}

function stopRingTone() {
    try { ringtone.pause(); }
    catch (e) { }
}

function startRingbackTone() {
    try { ringbacktone.play(); }
    catch (e) { }
}

function stopRingbackTone() {
    try { ringbacktone.pause(); }
    catch (e) { }
}

var readyCallBack = function(e){
    createSipStack();
};
var errorCallBack = function(e){
    console.log("error while initialising the sipml5 stack");
}
SIPml.init(readyCallBack, errorCallBack);

var sipStack;

function eventsListener(e){
    if (e.type == 'started'){
        //successfully started the stack.

    }else if (e.type == 'i_new_call'){

    }else if (e.type == 'i_ao_request'){
        if (e.session == callSession) {
            var iSipResponseCode = e.getSipResponseCode();
            if (iSipResponseCode == 180 || iSipResponseCode == 183) {
                //startRingbackTone();
                startRingTone()
            }
        }
    }else if (e.type == 'connected'){
        stopRingbackTone();
        stopRingTone()
    }else if (e.type == 'connecting'){
        //startRingTone()
        startRingbackTone()
    }

}

function createSipStack(){
    sipStack = new SIPml.Stack({
        realm: 'bwas2.inferencecommunications.com',
        impi: '0370103192',
        impu: 'sip:0370103192@bwas2.inferencecommunications.com',
        password: 'inference',
        display_name: 'kumar',
        websocket_proxy_url: 'ws://10.203.1.236:10061',
        outbound_proxy_url: 'udp://10.216.235.37:5060',
        enable_rtcweb_breaker: true,
        events_listener: {events:'*', listener: eventsListener},
        ice_servers: []
    })
}
sipStack.start();
var callSession;

function makeCall(){
    callSession = sipStack.newSession('call-audiovideo', {
        video_local: document.getElementById('video_local'),
        audio_remote: document.getElementById('audio_remote'),
        events_listener: { events: '*', listener: eventsListener}
    });
    callSession.call('sip:0370103241@bwas2.inferencecommunications.com')
//                callSession.call('sip:0370103193@bwas2.inferencecommunications.com')
//        callSession.call('sip:0370103241@10.216.235.113:5188')
}

function sipSendDTMF(c) {
    if (callSession && c) {
        if (callSession.dtmf(c) == 0) {
            try { document.getElementById("dtmfTone").play(); } catch (e) { }
        }
    }
}
function sipHangUp() {
    if (callSession) {
        callSession.hangup({ events_listener: { events: '*', listener: eventsListener } });
    }
}
