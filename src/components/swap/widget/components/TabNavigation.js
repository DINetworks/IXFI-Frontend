import { Tabs } from "@0xsquid/ui";
import { useLabels } from "../hooks/useLabels";
import { useTabStore } from "../store/useTabStore";

export const TabNavigation = ({ isDisabled = false }) => {
    const { enabledTabs, currentTab, setCurrentTab } = useTabStore();
    const { labels } = useLabels();
    const tabs = enabledTabs.map((tab) => ({
        id: tab,
        label: labels.tabs[tab],
        isDisabled: false,
    }));

    return (
        <div className="tw-px-squid-l">
            <Tabs
                tabs={tabs}
                activeTab={enabledTabs.indexOf(currentTab)}
                isDisabled={isDisabled}
                onTabChange={(tabIndex) => {
                    const newTab = enabledTabs[tabIndex];
                    if (newTab != null) {
                        setCurrentTab(newTab);
                    }
                }}
            />
        </div>
    );
};