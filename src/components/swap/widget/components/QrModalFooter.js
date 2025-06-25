import { CaptionText } from "@0xsquid/ui";
import { squidSupportLink } from "../core/externalLinks";

export function QrModalFooter({ isError, description }) {
    return (
        <CaptionText>
            {isError ? (
                <>
                    There was an error while generating the QR code. Please try again or{" "}
                    <a
                        className="tw-text-grey-100"
                        href={squidSupportLink}
                        target="_blank"
                        rel="noreferrer"
                    >
                        contact support
                    </a>{" "}
                    if the problem persists.
                </>
            ) : (
                description
            )}
        </CaptionText>
    );
}