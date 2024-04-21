let elementCreator = (tag, attrs)=>{
    let el = document.createElement(tag);
    attrs.forEach(attr => {
        el.setAttribute(attr[0], attr[1])
    });
    document.querySelector("body").append(el)
}

elementCreator("script", [["src", "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/hmac-sha256.js"]])
elementCreator("script", [["src", "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/components/enc-base64-min.js"]])

let loadderevent = null;
const loadCryptoJS = () =>{
    if(typeof CryptoJS === "undefined"){
        return;
    }
    window.CryptoJS = CryptoJS;
    clearInterval(loadderevent);
}
loadderevent = setInterval(loadCryptoJS, 100)