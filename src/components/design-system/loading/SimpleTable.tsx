
import React from "react";
import { cn } from "@/lib/utils";

export const Table = ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
  <div className="w-full overflow-auto">
    <table className={cn("w-full caption-bottom text-sm", className)} {...props} />
  </div>
);

export const TableHead = (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead {...props} />
);

export const TableBody = (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody {...props} />
);

export const TR = (props: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted" {...props} />
);

export const TH = (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground" {...props} />
);

export const TD = (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0" {...props} />
);
