import ToastMessage from "./ToastMessage.js";

interface INotification {
    alertType: NotificationType,
    message: string
}

enum NotificationType {
    INFO,
    WARNING
}

export default class Toast {
    #alerts: Array<INotification>;
    #isBusy: boolean;
    #intervalId: number;
    #body: HTMLBodyElement;

    static #instance: Toast;

    private constructor() {
        // this is necessary for when the class is called in a context where
        // a private constructor is not enforced
        if (Toast.#instance) {
            throw new Error("Error: Instantiation failed: Use Toast.Instance.");
        }
        Toast.#instance = this;
        this.#alerts = [];
        this.#isBusy = false;
        this.#intervalId = 0;
        this.#body = document.querySelector("body")!;
    }

    public static get Instance(): Toast {
        return Toast.#instance ?? (Toast.#instance = new Toast());
    }

    public notify(alertType: NotificationType, message: string): void {
        const notification: INotification = {
            alertType: alertType,
            message: message
        }

        this.#alerts.push(notification);
        this.#handleQueue();
    }

    #handleQueue(): void {
        // if there's already an interval, we don't need to create a new one
        // because we're already checking for new elements in the alerts queue
        if (this.#intervalId) {
            return;
        }

        // if we're already showing a notification, we have to wait
        if (this.#isBusy) {
            this.#intervalId = setInterval(() => {
                if (this.#alerts.length > 0 && !this.#isBusy) {
                    this.#createAlertDiv();
                }

                // no more alerts in the queue, can clear the interval
                if (this.#alerts.length === 0 && !this.#isBusy) {
                    clearInterval(this.#intervalId);
                    this.#intervalId = 0;
                }
            }, 500);
        }
        else {
            this.#createAlertDiv();
        }
    }

    #createAlertDiv(): void {
        this.#isBusy = true;

        const notification_obj = this.#alerts.shift()

        if (notification_obj == undefined) {
            return;
        }

        const toastMessage = document.createElement("toast-message");
        toastMessage.textContent = notification_obj.message

        switch (notification_obj?.alertType) {
            case NotificationType.INFO:
                toastMessage.setAttribute("level", "info")
                break;
            case NotificationType.WARNING:
                toastMessage.setAttribute("level", "warning")
                break;
        }

        toastMessage.setAttribute("show", "yes")

        this.#body.appendChild(toastMessage);
        this.#destroy(toastMessage);
    }

    #destroy(toastMessage: HTMLElement): void {
        toastMessage.setAttribute("show", "no")

        setTimeout(() => {
            this.#body.removeChild(toastMessage);
        }, 1500);

        // wait a bit to avoid rapid firing of notifications
        setTimeout(() => {
            this.#isBusy = false;
        }, 2000);
    }
}

customElements.define("toast-message", ToastMessage);
