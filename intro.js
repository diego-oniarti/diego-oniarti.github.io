const tag = document.getElementById("nome");

const animazioni = [
    //slide in
    async (nome)=>{
        const p = document.getElementById('nome');
        p.innerHTML="";
        for (let lettera of nome){
            p.innerHTML+=lettera
            if (!lettera.match(/\s/))
                await sleep(750/nome.length);
        }
    },
    //bruteforce
    async (nome)=>{
        const alfabeto = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const randomChar = ()=>{return alfabeto[Math.floor(Math.random()*alfabeto.length)]}
        const p = document.getElementById('nome');
        const n = 120;
        let max = 0;
        let indici = [];
        for (i=0; i<nome.length;i++) indici.push(i);
        //turn into name
        const lettere = [];
         for (let lettera of nome) {
            const seq = [lettera]
            const r = Math.floor(Math.random()*n);
            max = Math.max(max,r)
            for (let i=0; i<r; i++){
                seq.unshift(randomChar())
            }
            lettere.push(seq);
        }
        let t=0;
        for (let i=0; i<=max; i++){
            for (let j=0; j<nome.length; j++){
                if (lettere[j][i])
                    p.innerHTML = p.innerHTML.substring(0,j)+lettere[j][i]+p.innerHTML.substring(j+1);
            }
            t+=(t<20)?1:2;
            await sleep(Math.max(2,40-t));
        }
    },
    // _s
    async (nome)=>{
        const alfabeto = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const randomChar = ()=>{return alfabeto[Math.floor(Math.random()*alfabeto.length)]};
        const p = document.getElementById('nome');
        let indici = [];
        for (i=0; i<nome.length;i++) indici.push(i);
        
        indici.sort(a=>{return Math.random()-0.5});
        //turn into _
        for (let indice of indici) {
            p.innerHTML = p.innerHTML.substring(0,indice)+"_"+p.innerHTML.substring(indice+1);
            await sleep(500/nome.length);
        }
        //turn into name
        indici.sort(a=>{return Math.random()-0.5});
        const lettere = [];
        for (let i=0; i<nome.length; i++){
            lettere.push([nome[i]]);
            for (let j=0; j<=indici[i]; j++){
                lettere[i].push(randomChar());
            }
        }
        for (let i=nome.length+1; i>=0; i--) {
            for (let j=0; j<nome.length; j++){
                if (lettere[j][i])
                    p.innerHTML = p.innerHTML.substring(0,j)+lettere[j][i]+p.innerHTML.substring(j+1);
            }
            await sleep(80);
        }
    }
];

const main = async ()=>{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);    
    const hideAnimation = urlParams.get('hideAnimation');
    if (!hideAnimation || hideAnimation=="false"){
        const nome = document.getElementById("nome").innerHTML;

        document.getElementById("main").classList.add('anima');

        for (let scheda of document.getElementsByClassName('scheda')){
            scheda.classList.add('nascondi');
        }
        for (let toggle of document.getElementsByClassName('toggle')){
            toggle.classList.add('nascondi');
        }

        await animazioni[Math.floor(Math.random()*animazioni.length)](nome);
        await sleep(500);

        document.getElementById("main").classList.remove('anima');

        setTimeout(()=>{
            document.addEventListener('scroll', (eve)=>{
                checkScroll(10);
            }, {
                passive: true
            });
            checkScroll(-10);
        }, 600*3);
        
        setTimeout(async ()=>{
            for (let toggle of document.getElementsByClassName('toggle')){
                toggle.classList.remove('nascondi');
                await sleep(100);
            }
        },3000);
    }

}
main();