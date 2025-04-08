
import React from "react";
import SkeletonLoadersTab from "./loading/SkeletonLoadersTab";
import ButtonStatesTab from "./loading/ButtonStatesTab";
import PageLoadingTab from "./loading/PageLoadingTab";
import BestPracticesTab from "./loading/BestPracticesTab";
import AnimatedTabs from "./AnimatedTabs";

const LoadingStateGuidelines = () => {
  const tabs = [
    {
      value: "skeleton",
      label: "Skeleton Loaders",
      content: <SkeletonLoadersTab />
    },
    {
      value: "button",
      label: "Button States",
      content: <ButtonStatesTab />
    },
    {
      value: "page",
      label: "Page Loading",
      content: <PageLoadingTab />
    },
    {
      value: "best-practices",
      label: "Best Practices",
      content: <BestPracticesTab />
    }
  ];

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-heading-sm mb-6">Loading State Guidelines</h2>
        <p className="text-body mb-4">
          Consistent loading states help provide a better user experience by reducing perceived wait times and providing feedback.
        </p>
      </section>

      <AnimatedTabs tabs={tabs} defaultValue="skeleton" />
    </div>
  );
};

export default LoadingStateGuidelines;
