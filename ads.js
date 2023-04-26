
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
    adUnitName: "",
    pageName: 'ParodyStudios_ShogiGame',               //Game Name
    categoryName: 'google',           //Publisher Name
    placementName: 'Test_Banner',
    containerID: "div-gpt-ad-2",            //Div Id for banner
    height: 250,
    width: 300,
    xc: '12.0',
    yc: '3.0',
    gpid: gpID,
}
const StickyObj = {
    adUnitName: "",
    pageName: 'ParodyStudios_ShogiGame',               //Game Name
    categoryName: 'google',           //Publisher Name
    placementName: 'Test_Banner',
    containerID: "banner-ad",            //Div Id for banner
    height: 50,
    width: 320,
    xc: '12.0',
    yc: '3.0',
    gpid: gpID,
}

const LBBannerObj = {
    adUnitName: "",
    pageName: '',               //Game Name
    categoryName: '',           //Publisher Name
    placementName: 'leaderboard',
    containerID: "div-gpt-ad-1",            //Div Id for banner
    height: 250,
    width: 300,
    xc: '12.0',
    yc: '3.0',
    gpid: gpID,
}

function successCb() {
    console.log("set up lib success")
    showBumperAd();

}
function failCb(reason) { }


const replayObj = {
    adUnitName: "",
    placementName: "FsReplay",
    pageName: '',
    categoryName: '',
    containerID: '',
    height: '',
    width: '',
    xc: '',
    yc: '',
    gpid: gpID,
}
const rewardObj = {
    adUnitName: "",
    placementName: "Test_Rewarded",
    pageName: 'PublisherName_GameName',
    categoryName: 'google',
    containerID: '',
    height: '',
    width: '',
    xc: '',
    yc: '',
    gpid: gpID,
}

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
            $(".gameOverDiv").css("margin-down", "0px");
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
            $(".gameOverDiv").css("margin-down", "100px");
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
    StickyBannerInstance=window?.GlanceGamingAdInterface?.showStickyBannerAd(StickyObj, bannerCallbacks);
}

// rewarded ad callbacks
function rewardedCallbacks(obj) {

        // var gameObjectName = "MyGameObject";
        // var methodName = "MyMethod";
        // var message = "Hello from JavaScript!";

        // unityInstance.SendMessage(gameObjectName, methodName, message);
        
    obj.adInstance?.registerCallback('onAdLoadSucceed', (data) => {
        console.log('onAdLoadSucceeded Rewarded CALLBACK', data);
        if (obj.adUnitName === replayObj.adUnitName) {
            is_replay_noFill = false
        }
        if (obj.adUnitName === rewardObj.adUnitName) {
            is_rewarded_noFill = false
        }


    });

    obj.adInstance?.registerCallback('onAdLoadFailed', (data) => {
        console.log('onAdLoadFailed Rewarded CALLBACK', data);
        if (obj.adUnitName === replayObj.adUnitName) {
            is_replay_noFill = true
        }
        if (obj.adUnitName === rewardObj.adUnitName) {
            is_rewarded_noFill = true
        }


    });

    obj.adInstance?.registerCallback('onAdDisplayed', (data) => {
        console.log('onAdDisplayed Rewarded CALLBACK', data);


    });



    obj.adInstance?.registerCallback('onAdClosed', (data) => {
        console.log('onAdClosed Rewarded CALLBACK', data);

        if (obj.adUnitName == rewardObj.adUnitName) {
            isRewardedAdClosedByUser = true
        }
        runOnAdClosed();
        isRewardGranted = false
        isRewardedAdClosedByUser = false



    });

    obj.adInstance?.registerCallback('onAdClicked', (data) => {
        console.log('onAdClicked Rewarded CALLBACK', data);
    });

    obj.adInstance?.registerCallback('onRewardsUnlocked', (data) => {
        console.log('onRewardsUnlocked Rewarded CALLBACK', data);

        if (obj.adUnitName === rewardObj.adUnitName) {
            isRewardGranted = true
        }

    });

}
// function to be called after ad closes
function runOnAdClosed() {
    if (_triggerReason === 'replay') {

        // call game function for replay
        _triggerReason = ''
        showGame();

        replayInstance = window.GlanceGamingAdInterface.loadRewardedAd(replayObj, rewardedCallbacks);

    } else if (_triggerReason === 'reward') {

        // If user close ad before reward
        if (!isRewardGranted && isRewardedAdClosedByUser) {
            // call game function for not earning reward (failure case)

        } else {

            // call game function for earned reward  (success case)
        }
        _triggerReason = ''
        rewardInstance = window.GlanceGamingAdInterface.loadRewardedAd(rewardObj, rewardedCallbacks);

    }


}

// function called on replay button (leaderboard) clicked
function replayEvent() {
    _triggerReason = 'replay'
    if (!is_replay_noFill) {
        window.GlanceGamingAdInterface.showRewarededAd(replayInstance);
    } else {
        runOnAdClosed();
    }

}

function rewardEvent() {
    _triggerReason = 'reward'
    if (!is_rewarded_noFill) {
        window.GlanceGamingAdInterface.showRewarededAd(rewardInstance);
    } else {
        runOnAdClosed();
    }

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

