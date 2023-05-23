
const gameInput = { gameName: 'ShogiGame', publisherName: 'ParodyStudios', surface: "test"};
//loading scripts
$.getScript(


    "https://g.glance-cdn.com/public/content/games/xiaomi/gamesAd.js",

    "gpid.js"

)
    .done(function (script, textStatus) {
        console.log(textStatus);
        window.GlanceGamingAdInterface.setupLibrary(gameInput, successCb, failCb);
    })
    .fail(function (jqxhr, settings, exception) {
        console.log("MLIB load failed, reason : ", exception);
    });


var LPBannerInstance, LBBannerInstance, StickyBannerInstance, replayInstance, GlanceGamingAdInstance, rewardInstance, _triggerReason;
var is_replay_noFill = false
var is_rewarded_noFill = false
var isRewardGranted = false
var isRewardedAdClosedByUser = false

// Objects for different ad format.
const LPMercObj = {
    adUnitName: "ParodyStudios_ShogiGame_Gameload_Bottom",
    pageName: 'ParodyStudios_ShogiGame',               //Game Name
    categoryName: 'ParodyStudios',           //Publisher Name
    placementName: 'Gameload',
    containerID: "div-gpt-ad-2",            //Div Id for banner
    height: 250,
    width: 300,
    xc: '12.0',
    yc: '3.0',
    gpid: gpID,
}
const StickyObj = {
    adUnitName: "ParodyStudios_ShogiGame_Ingame_Bottom",
    pageName: 'ParodyStudios_ShogiGame',               //Game Name
    categoryName: 'ParodyStudios',           //Publisher Name
    placementName: 'Ingame',
    containerID: "banner-ad",            //Div Id for banner
    height: 50,
    width: 320,
    xc: '12.0',
    yc: '3.0',
    gpid: gpID,
}

const LBBannerObj = {
    adUnitName: "ParodyStudios_ShogiGame_Leaderboard_Top",
    pageName: 'ParodyStudios_ShogiGame',               //Game Name
    categoryName: 'ParodyStudios',           //Publisher Name
    placementName: 'leaderboard',
    containerID: "div-gpt-ad-1",            //Div Id for banner
    height: 250,
    width: 300,
    xc: '12.0',
    yc: '3.0',
    gpid: gpID,
}
const replayObj = {
    adUnitName: "ParodyStudios_ShogiGame_FsReplay_Replay",
    placementName: "FsReplay",
    pageName: 'ParodyStudios_ShogiGame',
    categoryName: 'ParodyStudios',
    containerID: '',
    height: '',
    width: '',
    xc: '',
    yc: '',
    gpid: gpID,
}
// const rewardObj = {
//     adUnitName: "ParodyStudios_ShogiGame_FsRewarded_Reward",
//     placementName: "FsRewarded",
//     pageName: 'ParodyStudios_ShogiGame',
//     categoryName: 'ParodyStudios',
//     containerID: '',
//     height: '',
//     width: '',
//     xc: '',
//     yc: '',
//     gpid: gpID,
// }

function successCb() {
    console.log("set up lib success")
    showBumperAd();

}
function failCb(reason) { }


//banner ads callbacks 
function bannerCallbacks(obj) {


    obj.adInstance?.registerCallback('onAdLoadSucceed', (data) => {
        console.log('onAdLoadSucceeded CALLBACK', data);

        // For Start Ads

        if (obj.adUnitName === LBBannerObj.adUnitName) {
            $("#div-gpt-ad-1").css("display", "flex")
            $(".gameOverDiv").css("margin-top", "0px");
        }

        if (obj.adUnitName === StickyObj.adUnitName) {
            console.log("Sticky Loaded");
            $("#div-gpt-ad-1").css("display", "flex")
            $(".gameOverDiv").css("margin-top", "0px");
        }

    });

    obj.adInstance?.registerCallback('onAdLoadFailed', (data) => {
        console.log('onAdLoadFailed  CALLBACK', data);


        if (obj.adUnitName === LBBannerObj.adUnitName) {
            $("#div-gpt-ad-1").css("display", "none")
            $(".gameOverDiv").css("margin-top", "100px");
        }

        if (obj.adUnitName === StickyObj.adUnitName) {
            console.log("Sticky failed");
            $("#div-gpt-ad-1").css("display", "none")
            $(".gameOverDiv").css("margin-top", "100px");
        }
    });

    obj.adInstance?.registerCallback('onAdDisplayed', (data) => {
        console.log('onAdDisplayed  CALLBACK', data);

        if (obj.adUnitName === StickyObj.adUnitName) 
        {
            console.log("Sticky shown");
        }
    });


}

function callForStickyAds()
{
    refreshStickyBannerAd();
    StickyBannerInstance =  window.GlanceGamingAdInterface.showStickyBannerAd(StickyObj,bannerCallbacks);   

    replayInstance = window.GlanceGamingAdInterface.loadRewardedAd(replayObj, rewardedCallbacks);
//    rewardInstance = window.GlanceGamingAdInterface.loadRewardedAd(rewardObj, rewardedCallbacks);
}

// rewarded ad callbacks
function rewardedCallbacks(obj) {
        
    obj.adInstance?.registerCallback('onAdLoadSucceed', (data) => {
        console.log('onAdLoadSucceeded Rewarded CALLBACK', data);
        if (obj.adUnitName === replayObj.adUnitName) {
            is_replay_noFill = false
        }
        // if (obj.adUnitName === rewardObj.adUnitName) {
        //     is_rewarded_noFill = false
        // }

        unityInstanceMain.SendMessage("JSToUnityBridge", "ReciveCallBack", "rewardedLoadSuccess");

    });

    obj.adInstance?.registerCallback('onAdLoadFailed', (data) => {
        console.log('onAdLoadFailed Rewarded CALLBACK', data);
        if (obj.adUnitName === replayObj.adUnitName) {
            is_replay_noFill = true
        }
        // if (obj.adUnitName === rewardObj.adUnitName) {
        //     is_rewarded_noFill = true
        // }

        unityInstanceMain.SendMessage("JSToUnityBridge", "ReciveCallBack", "rewardedLoadFailed");


    });

    obj.adInstance?.registerCallback('onAdDisplayed', (data) => {
        console.log('onAdDisplayed Rewarded CALLBACK', data);

        unityInstanceMain.SendMessage("JSToUnityBridge", "ReciveCallBack", "rewardedShowSuccess");

    });



    obj.adInstance?.registerCallback('onAdClosed', (data) => {
        console.log('onAdClosed Rewarded CALLBACK', data);

        unityInstanceMain.SendMessage("JSToUnityBridge", "ReciveCallBack", "rewardedCompleted");


        // if (obj.adUnitName == rewardObj.adUnitName) {
        //     isRewardedAdClosedByUser = true
        // }
        runOnAdClosed();
        isRewardGranted = false
        isRewardedAdClosedByUser = false
    });

    obj.adInstance?.registerCallback('onAdClicked', (data) => {
        console.log('onAdClicked Rewarded CALLBACK', data);
    });

    obj.adInstance?.registerCallback('onRewardsUnlocked', (data) => 
    {
        console.log('onRewardsUnlocked Rewarded CALLBACK', data);

        // if (obj.adUnitName === rewardObj.adUnitName) {
        //     isRewardGranted = true
        // }

    });

}
// function to be called after ad closes
function runOnAdClosed() {
    if (_triggerReason === 'replay') {

        // call game function for replay
        _triggerReason = ''
        showGame();

        replayInstance = window.GlanceGamingAdInterface.loadRewardedAd(replayObj, rewardedCallbacks);
    

     }
}

// function called on replay button (leaderboard) clicked
function replayEvent() {
    console.log("replay event called");
    _triggerReason = 'replay'
    if (!is_replay_noFill) {
        window.GlanceGamingAdInterface.showRewarededAd(replayInstance);
    } else {
        runOnAdClosed();
    }

}

function getCurrentFunctionCaller() {
    // Create a new Error object
    const error = new Error();
  
    // Extract the call stack from the Error object
    const stackTrace = error.stack;
  
    // Split the call stack into individual lines
    const stackLines = stackTrace.split('\n');
  
    // Get the caller function name from the second line
    const callerLine = stackLines[2];
    const callerFunctionName = callerLine.match(/at\s+(.*)\s+\(/)[1];
  
    // Return the caller function name
    return callerFunctionName;
  }
  
  function foo() {
    const caller = getCurrentFunctionCaller();
    console.log('Caller:', caller);
  }

function showGame() {
    if (recUI === 'true') {
        window.PwaGameCenterInterface.hideRecommendedSection();
        showcanvas();
    }

    else {
        $('#playMore').css("display", "none");
        LBBannerInstance.destroyAd();
        $("#div-gpt-ad-1").html("");
    }
}
