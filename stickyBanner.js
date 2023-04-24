

//This function will ad the stickyBanner UI
function addStickyBanner() {
    var stickyBannerDiv = `<div id="bannerOverlay">
                            <div id="banner-ad">
            
                            </div>
                        </div>`;

    $("body").append($(stickyBannerDiv));
    console.log("stickyBannerDiv added...");
}

function refreshStickyBannerAd() {
    console.log("refreshStickyBannerAd")
    addStickyBanner();
    showStickyBannerAd();
    var timesRun = 0;
    const runInterval = setInterval(()=> {
       
        if(StickyBannerInstance){
			console.log( StickyBannerInstance,"if in interval")
			StickyBannerInstance.destroyAd();
		}
		
const testSticky = {
    adUnitName: "",
    pageName: 'PublisherName_GameName',               //Game Name
    categoryName: 'google',           //Publisher Name
    placementName: 'Test_Banner',
    containerID: "div-gpt-ad-2",            //Div Id for banner
    height: 50,
    width: 320,
    xc: '12.0',
    yc: '3.0',
    gpid: gpID,
}
        
		StickyBannerInstance =  window.GlanceGamingAdInterface.showStickyBannerAd(testSticky,bannerCallbacks);
    }, 30000);
}

function showStickyBannerAd(){
    $("#bannerOverlay").css("display","flex");
}