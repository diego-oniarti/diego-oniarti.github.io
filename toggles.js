const toggles = [
    ()=>{
        document.getElementById('main').classList.toggle('dark');
    },
    ()=>{
        document.getElementById('main').classList.toggle('en');
    }
]




let i = 0;
for (let toggle of document.getElementsByClassName("toggle")) {
    toggle.addEventListener('click', toggles[i]);
    ++i;
}