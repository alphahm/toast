const template = document.createElement("template");
template.innerHTML = `
    <style>
        .toaster {
            box-sizing: border-box;
            position: fixed;
            top: 10px;
            right: 0px;
            padding-left: 20px;
            min-width: 300px;
            max-width: 300px;
            height: 60px;
            max-height: 60px;
            border-radius: 4px;
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.65);
            z-index: 2;
        }

        .toast-info {
            border-left: 10px solid #2789bd;
            background-color: #6aa9d1;
        }

        .toast-warning {
            border-left: 10px solid #f79c0a;
            background-color: #ffc15e;
        }

        .toast-content {
            box-sizing: inherit;
            display: flex;
            height: 60px;
            max-height: 60px;
            justify-content: center;
            flex-direction: column;
        }

        .toast-content-msg {
            box-sizing: inherit;
            overflow: hidden;
            max-height: 40px;
            line-height: 20px;
        }

        .toaster.show-toast {
            animation: show-slide-animation 1.5s ease forwards;
        }

        @keyframes show-slide-animation {
            0% {
                transform: translateX(100%);
            }
            40% {
                transform: translateX(-10px);
            }
            80% {
                transform: translateX(0%);
            }
            100% {
                transform: translateX(-10px);     
            }
        }

        .toaster.hide-toast {
            animation: hide-slide-animation 1.5s ease forwards;
        }

        @keyframes hide-slide-animation {
            0% {
                transform: translateX(-10px);
            }
            40% {
                transform: translateX(0%);
            }
            80% {
                transform: translateX(-10px);
            }
            100% {
                transform: translateX(100%);
            }
        }
    </style>

    <div class="toaster show-toast">
        <div class="toast-content">
            <div class="toast-content-message">
                This is a test message!
            </div>
        </div>
    </div>`;
export default class ToastMessage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        if (this.shadowRoot == null) {
            throw "ShadowRoot is null";
        }
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    static get observedAttributes() {
        return ["show"];
    }
    connectedCallback() {
        const level = this.getAttribute("level");
        if (level == null) {
            throw "Level attribute is required";
        }
        this.setLevelStyle(level);
        const divContentMsg = this.shadowRoot.querySelector('.toast-content-message');
        divContentMsg.textContent = this.textContent;
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "show" && newValue == "no") {
            const wrapperDiv = this.shadowRoot.querySelector('.toaster');
            wrapperDiv.classList.remove("show-toast");
            wrapperDiv.classList.add("hide-toast");
        }
    }
    setLevelStyle(level) {
        if (this.shadowRoot == null) {
            throw "ShadowRoot is null";
        }
        const toastDiv = this.shadowRoot.querySelector('.toaster');
        switch (level) {
            case "info":
                toastDiv.classList.add("toast-info");
                break;
            case "warning":
                toastDiv.classList.add("toast-warning");
                break;
        }
    }
}
