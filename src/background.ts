chrome.runtime.onInstalled.addListener(function() {
    let defaults = {
        enabled: true,
        lang: 'ch',
        confidence: 97.0,
        screenRegion: 80.0
    };

    chrome.storage.sync.get(['enabled', 'lang', 'confidence'], function(settings) {
        if (typeof settings.enabled === 'undefined') {
            chrome.storage.sync.set({enabled: defaults.enabled});
        }
        if (typeof settings.lang === 'undefined') {
            chrome.storage.sync.set({lang: defaults.lang});
        }
        if (typeof settings.confidence === 'undefined') {
            chrome.storage.sync.set({confidence: defaults.confidence});
        }
        if (typeof settings.screenRegion === 'undefined') {
            chrome.storage.sync.set({screenRegion: defaults.screenRegion});
        }
        // Repeat for more options
    });
});