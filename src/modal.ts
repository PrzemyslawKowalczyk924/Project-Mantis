/* function for closingModal */
const modalElem = document.getElementById('modal');
const modalButtonOk = document.getElementById('modal-button');
const modalButtonX = document.getElementById('modal-button-negative');
const maps = document.getElementById('gogleMap');
const alternativeMap = document.getElementById('alternative__map');

function modal() {
    if (modalButtonOk) {
        modalButtonOk.addEventListener('click', () => {
            setCookie('coockieAgreed', true, 365);
            checkCookie();
        })
    }

    if (modalButtonX) {
        modalButtonX.addEventListener('click', () => {
            modalElem!.style.display = 'none';
            maps!.style.display = 'none';
            alternativeMap!.style.display = 'block';
        })
    }
}

function setCookie(cname: string, cvalue: string | boolean, exdays: number) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/" + ";secure";
}

function getCookie(cname: string) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    if(modalElem) {
        const isCookieTrue = getCookie('coockieAgreed');
        
        if(!isCookieTrue) {
            modalElem.style.display = 'flex';
        } else {
            modalElem.style.display = 'none';
        }
    }
}

checkCookie();
modal();