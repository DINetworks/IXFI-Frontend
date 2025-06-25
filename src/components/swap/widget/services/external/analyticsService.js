export class AnalyticsService {
    
    static pushEvent(eventData) {
        if (window) {
            const dataLayer = window.dataLayer || [];
            const domain = window.location.hostname;
            if (dataLayer && domain.includes("squidrouter.com")) {
                dataLayer.push(eventData);
            }
        }
    }

    static submitButtonPushed() {
        this.pushEvent({ event: "submitswap_cta_clicked" });
    }

    static givePermissionToUseTokenButton() {
        this.pushEvent({ event: "permissiontoken_cta_clicked" });
    }

    static settingClicked() {
        this.pushEvent({ event: "settings_clicked" });
    }

    static historyClicked() {
        this.pushEvent({ event: "history_clicked" });
    }

    static expressClicked() {
        this.pushEvent({ event: "expressTx_clicked" });
    }

    static regularClicked() {
        this.pushEvent({ event: "regularTx_clicked" });
    }
}
