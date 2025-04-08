
import * as React from "react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
}

interface AnimatedTabsProps {
  tabs: TabItem[];
  defaultValue?: string;
  className?: string;
  contentClassName?: string;
  triggerClassName?: string;
  listClassName?: string;
}

export function AnimatedTabs({
  tabs,
  defaultValue,
  className,
  contentClassName,
  triggerClassName,
  listClassName,
}: AnimatedTabsProps) {
  const defaultTab = defaultValue || tabs[0]?.value;

  return (
    <Tabs defaultValue={defaultTab} className={cn("w-full", className)}>
      <TabsList className={cn("mb-6", listClassName)}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={cn("transition-all duration-200", triggerClassName)}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className={cn(
            "mt-6 transition-all duration-300 animate-fade-in",
            contentClassName
          )}
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}

export default AnimatedTabs;
