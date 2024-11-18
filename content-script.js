const preEls = document.querySelectorAll("pre");

[...preEls].forEach((preEl) => {
    const root = document.createElement("div");

    root.style.position = "relative";
    const shadowRoot = root.attachShadow({ mode: 'open' });

    const cssUrl = chrome.runtime.getURL('content-script.css');
    shadowRoot.innerHTML = `<link rel = "stylesheet" href="${cssUrl}"></link>`

    const button = document.createElement("button");
    const img = document.createElement("img");
    img.src = chrome.runtime.getURL("icons/copy.png")
    img.alt = "Copy";
    img.style.width = "20px";
    img.style.height = "20px";

    button.appendChild(img);
    shadowRoot.prepend(button);
    preEl.prepend(root);


    const codeEl = preEl.querySelector("code");

    button.addEventListener("click", () => {
        navigator.clipboard.writeText(codeEl.innerText).then(() => {
            notify();
        });
    });
});

chrome.runtime.onMessage.addListener((req, info, cb) => {
    if(req.action === "copy-all"){
        const allCode = getAllCode();

        navigator.clipboard.writeText(allCode).then(() => {
            notify();
            cb(allCode);
        });
        return true;
    }
});

function getAllCode(){
    return [...preEls].map((preEl) => {
        return preEl.querySelector('code').innerText;
    })
    .join("");
}

function notify() {
    const scriptEl = document.createElement("script");
    scriptEl.src = chrome.runtime.getURL("execute.js");

    document.body.appendChild(scriptEl);

    scriptEl.onload = () => {
        scriptEl.remove();
    }
}
