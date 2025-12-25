(async () => {
    const loginUrl = "https://throbbing-firefly-f824.rginergartreee.workers.dev/panel";

    const createUI = () => {
        return new Promise((resolve) => {
            const old = document.getElementById("q-auth-ui");
            if (old) old.remove();

            const container = document.createElement("div");
            container.id = "q-auth-ui";
            container.innerHTML = '\
                <style>\
                    @import url("https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&display=swap");\
                    #q-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(10,10,15,0.85); backdrop-filter: blur(15px); z-index: 20000; display: flex; align-items: center; justify-content: center; font-family: "Comfortaa", sans-serif; color: white; }\
                    #q-card { background: #1e1f22; width: 380px; padding: 40px; border-radius: 28px; border: 1px solid #ec4899; text-align: center; position: relative; box-shadow: 0 0 40px rgba(236,72,153,0.3); }\
                    textarea { width: 100%; height: 100px; background: #111; border: 1px solid #333; border-radius: 12px; color: #ec4899; margin-bottom: 15px; outline: none; padding: 10px; font-size: 10px; font-family: monospace; }\
                    .q-btn { width: 100%; padding: 15px; background: linear-gradient(90deg, #ec4899, #a855f7); color: #fff; border: none; border-radius: 12px; font-weight: bold; cursor: pointer; }\
                    .q-link { color: #ec4899; display: block; margin-bottom: 20px; font-size: 14px; text-decoration: underline; font-weight: bold; }\
                </style>\
                <div id="q-backdrop">\
                    <div id="q-card">\
                        <h2 style="margin-top:0">QuestBot Access</h2>\
                        <a href="' + loginUrl + '" target="_blank" class="q-link">1. ПОЛУЧИТЬ КОД НА САЙТЕ</a>\
                        <p style="font-size:11px; color:#949ba4; margin-bottom:10px">2. Вставьте текст из браузера ниже:</p>\
                        <textarea id="q-input" placeholder="Вставьте код активации..."></textarea>\
                        <button id="q-btn-go" class="q-btn">ЗАПУСТИТЬ БОТА</button>\
                    </div>\
                </div>';
            document.body.appendChild(container);

            const exit = (code = null) => { container.remove(); resolve(code); };
            document.addEventListener("keydown", (e) => { if(e.key === "Escape") exit(); }, {once: true});

            document.getElementById("q-btn-go").onclick = () => {
                const val = document.getElementById("q-input").value.trim();
                if (val.length < 10) return alert("Код слишком короткий!");
                exit(val);
            };
        });
    };

    const bCode = await createUI();
    if (bCode) {
        try {
            // ДЕКОДИРОВАНИЕ
            const decoded = decodeURIComponent(atob(bCode));
            
            // ВСТАВКА ЧЕРЕЗ .text (Самый безопасный метод для Electron)
            const nonce = document.querySelector('script[nonce]')?.nonce || "";
            const s = document.createElement('script');
            if (nonce) s.setAttribute('nonce', nonce);
            s.text = decoded; 
            document.head.appendChild(s);
            
            console.log("%c[QuestBot] Успешно запущен!", "color: lime");
        } catch(e) {
            alert("Ошибка: Неверный формат кода активации.");
            console.error(e);
        }
    }
})();
