import { ApplePayIcon, cn, CreditCardIcon, GooglePayIcon } from "@0xsquid/ui";
import React from "react";

const isCreditCard = (methodId) =>
    methodId.toLowerCase().includes("credit") ||
    methodId.toLowerCase().includes("card");

export function PaymentMethodIcon({ method, size = "large", className }) {
    const methodIdLower = method.id.toLowerCase();
    const containerStyles = cn(
        "tw-flex tw-items-center tw-justify-center",
        {
            "tw-w-6 tw-h-6": size === "tiny",
            "tw-w-8 tw-h-8": size === "small",
            "tw-w-10 tw-h-10": size === "large",
        },
        size === "tiny" ? "tw-rounded-lg" : "tw-rounded-squid-xs",
        size === "tiny" && isCreditCard(method.id)
            ? "tw-border tw-border-material-light-thin"
            : "",
        className
    );
    const iconSize = {
        tiny: "16",
        small: "24",
        large: "32",
    }[size];

    if (methodIdLower.includes("apple")) {
        return (
            <div className={cn(containerStyles, "tw-bg-black")}>
                <ApplePayIcon size={iconSize} />
            </div>
        );
    }
    if (methodIdLower.includes("google")) {
        return (
            <div className={cn(containerStyles, "tw-bg-white")}>
                <GooglePayIcon size={iconSize} />
            </div>
        );
    }
    if (isCreditCard(method.id)) {
        return (
            <div className={cn(containerStyles, "tw-bg-royal-500")}>
                <CreditCardIcon size={iconSize} className="tw-text-grey-300" />
            </div>
        );
    }
    // Default case for other payment methods
    return (
        <div className={cn(containerStyles, "tw-bg-white")}>
            <img
                src={method.icon}
                alt="Payment method"
                className="tw-w-full tw-h-full tw-object-contain"
            />
        </div>
    );
}