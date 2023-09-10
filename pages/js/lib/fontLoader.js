function loadFont(name, url) {
    var newFont = new FontFace(name, `url(${url})`);
    newFont.load().then(function (loaded) {
        document.fonts.add(loaded);
    }).catch(function (error) {
        return error;
    });
}