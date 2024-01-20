interface IYMetrika {
    innerHTML?: string
    async?: boolean
}
const headScripts: IYMetrika[] = [
    // Ya.Metrika
    process.env.YM !== 'False'
        ? <IYMetrika>{
            innerHTML: ` (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                       m[i].l=1*new Date();
                       for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                       k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                       (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
                    
                       ym(95202040, "init", {
                            clickmap:true,
                            trackLinks:true,
                            accurateTrackBounce:true
                       });  `,
            async: true,
        }
        : {},
];

const headNoScripts: IYMetrika[] = [
    // Yandex
    process.env.YM !== 'False'
        ? <IYMetrika>{
            innerHTML: '<div><img src="https://mc.yandex.ru/watch/95202040" style="position:absolute; left:-9999px;" alt="" /></div>',
            body: true,
        }
        : {},
];

export {headScripts, headNoScripts};
