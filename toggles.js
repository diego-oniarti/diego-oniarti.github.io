const toggles = [
    ()=>{
        document.getElementById('main').classList.toggle('dark');
        document.getElementById('darkToggle').classList.toggle('on');
    },
    ()=>{
        document.getElementById('main').classList.toggle('en');
        document.getElementById('languageToggle').classList.toggle('on');
    }
]




let i = 0;
for (let toggle of document.getElementsByClassName("toggle")) {
    toggle.addEventListener('click', toggles[i]);
    ++i;
}