"use strict";
var NotificationType;
(function (NotificationType) {
    NotificationType[NotificationType["INFO"] = 0] = "INFO";
    NotificationType[NotificationType["WARNING"] = 1] = "WARNING";
})(NotificationType || (NotificationType = {}));
class Toast {
    constructor() {
        if (Toast._instance) {
            throw new Error("Error: Instantiation failed: Use Toast.Instance.");
        }
        Toast._instance = this;
        this.alerts = [];
        this.isBusy = false;
        this.intervalId = 0;
        this.body = document.querySelector("body");
    }
    static get Instance() {
        var _a;
        return (_a = Toast._instance) !== null && _a !== void 0 ? _a : (Toast._instance = new Toast());
    }
    notify(alertType, message) {
        const notification = {
            alertType: alertType,
            message: message
        };
        this.alerts.push(notification);
        this.handleQueue();
    }
    handleQueue() {
        if (this.intervalId) {
            return;
        }
        if (this.isBusy) {
            this.intervalId = setInterval(() => {
                if (this.alerts.length > 0 && !this.isBusy) {
                    this.createAlertDiv();
                }
                if (this.alerts.length === 0 && !this.isBusy) {
                    clearInterval(this.intervalId);
                    this.intervalId = 0;
                }
            }, 500);
        }
        else {
            this.createAlertDiv();
        }
    }
    createAlertDiv() {
        this.isBusy = true;
        const notification_obj = this.alerts.shift();
        if (notification_obj == undefined) {
            return;
        }
        const toastDiv = document.createElement("div");
        toastDiv.classList.add("toaster", "show-toast");
        const toastContent = document.createElement("div");
        toastContent.classList.add("toast-content");
        const toastContentMsg = document.createElement("div");
        toastContentMsg.classList.add("toast-content-msg");
        toastContentMsg.textContent = notification_obj.message;
        switch (notification_obj === null || notification_obj === void 0 ? void 0 : notification_obj.alertType) {
            case NotificationType.INFO:
                toastDiv.classList.add("toast-info");
                break;
            case NotificationType.WARNING:
                toastDiv.classList.add("toast-warning");
                break;
        }
        toastContent.appendChild(toastContentMsg);
        toastDiv.appendChild(toastContent);
        this.body.appendChild(toastDiv);
        this.destroy(toastDiv);
    }
    destroy(div) {
        div.classList.remove("show-toast");
        div.classList.add("hide-toast");
        setTimeout(() => {
            this.body.removeChild(div);
        }, 1500);
        setTimeout(() => {
            this.isBusy = false;
        }, 2000);
    }
}
