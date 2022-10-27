var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Toast_instances, _a, _Toast_alerts, _Toast_isBusy, _Toast_intervalId, _Toast_body, _Toast_instance, _Toast_handleQueue, _Toast_createAlertDiv, _Toast_destroy;
import ToastMessage from "./ToastMessage.js";
var NotificationType;
(function (NotificationType) {
    NotificationType[NotificationType["INFO"] = 0] = "INFO";
    NotificationType[NotificationType["WARNING"] = 1] = "WARNING";
})(NotificationType || (NotificationType = {}));
export default class Toast {
    constructor() {
        _Toast_instances.add(this);
        _Toast_alerts.set(this, void 0);
        _Toast_isBusy.set(this, void 0);
        _Toast_intervalId.set(this, void 0);
        _Toast_body.set(this, void 0);
        if (__classPrivateFieldGet(Toast, _a, "f", _Toast_instance)) {
            throw new Error("Error: Instantiation failed: Use Toast.Instance.");
        }
        __classPrivateFieldSet(Toast, _a, this, "f", _Toast_instance);
        __classPrivateFieldSet(this, _Toast_alerts, [], "f");
        __classPrivateFieldSet(this, _Toast_isBusy, false, "f");
        __classPrivateFieldSet(this, _Toast_intervalId, 0, "f");
        __classPrivateFieldSet(this, _Toast_body, document.querySelector("body"), "f");
    }
    static get Instance() {
        var _b;
        return (_b = __classPrivateFieldGet(Toast, _a, "f", _Toast_instance)) !== null && _b !== void 0 ? _b : (__classPrivateFieldSet(Toast, _a, new Toast(), "f", _Toast_instance));
    }
    notify(alertType, message) {
        const notification = {
            alertType: alertType,
            message: message
        };
        __classPrivateFieldGet(this, _Toast_alerts, "f").push(notification);
        __classPrivateFieldGet(this, _Toast_instances, "m", _Toast_handleQueue).call(this);
    }
}
_a = Toast, _Toast_alerts = new WeakMap(), _Toast_isBusy = new WeakMap(), _Toast_intervalId = new WeakMap(), _Toast_body = new WeakMap(), _Toast_instances = new WeakSet(), _Toast_handleQueue = function _Toast_handleQueue() {
    if (__classPrivateFieldGet(this, _Toast_intervalId, "f")) {
        return;
    }
    if (__classPrivateFieldGet(this, _Toast_isBusy, "f")) {
        __classPrivateFieldSet(this, _Toast_intervalId, setInterval(() => {
            if (__classPrivateFieldGet(this, _Toast_alerts, "f").length > 0 && !__classPrivateFieldGet(this, _Toast_isBusy, "f")) {
                __classPrivateFieldGet(this, _Toast_instances, "m", _Toast_createAlertDiv).call(this);
            }
            if (__classPrivateFieldGet(this, _Toast_alerts, "f").length === 0 && !__classPrivateFieldGet(this, _Toast_isBusy, "f")) {
                clearInterval(__classPrivateFieldGet(this, _Toast_intervalId, "f"));
                __classPrivateFieldSet(this, _Toast_intervalId, 0, "f");
            }
        }, 500), "f");
    }
    else {
        __classPrivateFieldGet(this, _Toast_instances, "m", _Toast_createAlertDiv).call(this);
    }
}, _Toast_createAlertDiv = function _Toast_createAlertDiv() {
    __classPrivateFieldSet(this, _Toast_isBusy, true, "f");
    const notification_obj = __classPrivateFieldGet(this, _Toast_alerts, "f").shift();
    if (notification_obj == undefined) {
        return;
    }
    const toastMessage = document.createElement("toast-message");
    toastMessage.textContent = notification_obj.message;
    switch (notification_obj === null || notification_obj === void 0 ? void 0 : notification_obj.alertType) {
        case NotificationType.INFO:
            toastMessage.setAttribute("level", "info");
            break;
        case NotificationType.WARNING:
            toastMessage.setAttribute("level", "warning");
            break;
    }
    toastMessage.setAttribute("show", "yes");
    __classPrivateFieldGet(this, _Toast_body, "f").appendChild(toastMessage);
    __classPrivateFieldGet(this, _Toast_instances, "m", _Toast_destroy).call(this, toastMessage);
}, _Toast_destroy = function _Toast_destroy(toastMessage) {
    toastMessage.setAttribute("show", "no");
    setTimeout(() => {
        __classPrivateFieldGet(this, _Toast_body, "f").removeChild(toastMessage);
    }, 1500);
    setTimeout(() => {
        __classPrivateFieldSet(this, _Toast_isBusy, false, "f");
    }, 2000);
};
_Toast_instance = { value: void 0 };
customElements.define("toast-message", ToastMessage);
