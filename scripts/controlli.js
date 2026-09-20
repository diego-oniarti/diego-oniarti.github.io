/// THEME 
function toggleTheme() {
    const root = document.documentElement;
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
}

document.getElementById('themeButton').addEventListener('click',e=>{
    toggleTheme();
    if (localStorage.getItem('theme')==='dark') {
        document.getElementById('themeButton').innerHTML='◐';
    }else{
        document.getElementById('themeButton').innerHTML='◑';
    }
});

document.documentElement.classList.add('no-theme-transition');
const saved = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', saved);
window.addEventListener('load', ()=>{
    document.documentElement.classList.remove('no-theme-transition');
})


/// LANGUAGE
function getLanguage() {
    return localStorage.getItem('language') || 'it';
}
function setLanguage(lang) {
    document.documentElement.setAttribute('data-language', lang);
    localStorage.setItem('language', lang);
    resizeCollapsable();
}

const saved_language = getLanguage();
setLanguage(saved_language);
document.addEventListener('DOMContentLoaded', ()=>{
    if (getLanguage()=="it") {
        document.getElementById("languageButton").innerText = "🇬🇧";
    }
});

const language_elements = new Map();
document.getElementById('languageButton').addEventListener('click',()=>{
    const current = getLanguage();
    const next = current == 'en' ? 'it' : 'en';
    const flag = document.getElementById("languageButton");
    if (next=='en') {
        flag.innerText = "🇮🇹";
    }else{
        flag.innerText = "🇬🇧";
    }
    setLanguage(next);
    for ([el, {param, it, en}] of language_elements) {
        if (next=='en') {
            el[param] = en;
        }else{
            el[param] = it;
        }
    }
});

function register_string(el, it, en, param="innerText") {
    language_elements.set(el, {"param": param, "it": it, "en": en, });
    if (getLanguage()=="en") {
        el[param] = en;
    }else{
        el[param] = it;
    }
}

/// COLLAPSE
document.getElementById('navCollapse').addEventListener('click',e=>{
    for (element of document.getElementsByClassName('navCollapsible')) {
        if (element.style.maxHeight){
            element.style.maxHeight = null;
        } else {
            element.style.maxHeight = element.scrollHeight + "px";
        }
    }
});

function resizeCollapsable () {
    for (element of document.getElementsByClassName('section')) {
        if (element.style.maxHeight!='0px')
            element.style.maxHeight = element.scrollHeight + "px";
    }
}
resizeCollapsable();
window.addEventListener('resize', ()=>{
    resizeCollapsable();
})

for (let bottone of document.getElementsByClassName('collapseButton')) {    
    bottone.addEventListener('click',()=>{
        bottone.children[1].classList.toggle('flipped')
        for (element of bottone.parentElement.children) {
            if (element.style.backgroundColor=='transparent') 
                element.style.backgroundColor=''
                else
                element.style.backgroundColor='transparent'

            if (element.classList.contains('section')) {
                if (element.style.maxHeight!='0px'){
                    element.style.maxHeight = '0px';
                } else {
                    element.style.maxHeight = element.scrollHeight + "px";
                }
            }
        }
    });
}
