interface INotification {
    alertType: NotificationType,
    message: string
}

enum NotificationType {
    INFO,
    WARNING
}

class Toast {
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

        const toastDiv = document.createElement("div");
        toastDiv.classList.add("toaster", "show-toast");

        const toastContent = document.createElement("div");
        toastContent.classList.add("toast-content");

        const toastContentMsg = document.createElement("div");
        toastContentMsg.classList.add("toast-content-msg");
        toastContentMsg.textContent = notification_obj.message

        switch (notification_obj?.alertType) {
            case NotificationType.INFO:
                toastDiv.classList.add("toast-info")
                break;
            case NotificationType.WARNING:
                toastDiv.classList.add("toast-warning")
                break;
        }

        toastContent.appendChild(toastContentMsg);
        toastDiv.appendChild(toastContent);

        this.#body.appendChild(toastDiv);
        this.#destroy(toastDiv);
    }

    #destroy(div: HTMLDivElement): void {
        div.classList.remove("show-toast");
        div.classList.add("hide-toast");

        setTimeout(() => {
            this.#body.removeChild(div);
        }, 1500);

        // wait a bit to avoid rapid firing of notifications
        setTimeout(() => {
            this.#isBusy = false;
        }, 2000);
    }
}
