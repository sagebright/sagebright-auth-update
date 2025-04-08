
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ColorSwatchProps {
  name: string;
  variable: string;
  className?: string;
  textClass?: string;
}

const ColorSwatch = ({ name, variable, className, textClass = "text-white" }: ColorSwatchProps) => (
  <Card className="overflow-hidden">
    <div className={cn("h-24 flex items-end p-3", className)}>
      <div className={cn("text-sm font-medium", textClass)}>{name}</div>
    </div>
    <CardContent className="p-3 bg-background text-xs space-y-1">
      <p><span className="font-mono text-muted-foreground">CSS:</span> var({variable})</p>
      <p><span className="font-mono text-muted-foreground">Tailwind:</span> {name.replace("var(--", "").replace(")", "")}</p>
    </CardContent>
  </Card>
);

const ColorReference = () => {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-heading-sm mb-6">Brand Colors</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <ColorSwatch name="Primary" variable="--primary" className="bg-primary" />
          <ColorSwatch name="Primary Foreground" variable="--primary-foreground" className="bg-primary-foreground" textClass="text-primary" />
          <ColorSwatch name="Secondary" variable="--secondary" className="bg-secondary" textClass="text-secondary-foreground" />
          <ColorSwatch name="Secondary Foreground" variable="--secondary-foreground" className="bg-secondary-foreground" />
          <ColorSwatch name="Accent1" variable="--accent1" className="bg-accent1" />
          <ColorSwatch name="Accent1 Foreground" variable="--accent1-foreground" className="bg-accent1-foreground" textClass="text-accent1" />
          <ColorSwatch name="Accent2" variable="--accent2" className="bg-accent2" textClass="text-accent2-foreground" />
          <ColorSwatch name="Accent2 Foreground" variable="--accent2-foreground" className="bg-accent2-foreground" />
          <ColorSwatch name="Charcoal" variable="--charcoal" className="bg-charcoal" />
          <ColorSwatch name="Charcoal Foreground" variable="--charcoal-foreground" className="bg-charcoal-foreground" textClass="text-charcoal" />
        </div>
      </section>

      <section>
        <h2 className="text-heading-sm mb-6">UI Colors</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <ColorSwatch name="Background" variable="--background" className="bg-background" textClass="text-foreground" />
          <ColorSwatch name="Foreground" variable="--foreground" className="bg-foreground" />
          
          <ColorSwatch name="Card" variable="--card" className="bg-card" textClass="text-card-foreground" />
          <ColorSwatch name="Card Foreground" variable="--card-foreground" className="bg-card-foreground" />
          
          <ColorSwatch name="Popover" variable="--popover" className="bg-popover" textClass="text-popover-foreground" />
          <ColorSwatch name="Popover Foreground" variable="--popover-foreground" className="bg-popover-foreground" />
          
          <ColorSwatch name="Muted" variable="--muted" className="bg-muted" textClass="text-muted-foreground" />
          <ColorSwatch name="Muted Foreground" variable="--muted-foreground" className="bg-muted-foreground" />
          
          <ColorSwatch name="Accent" variable="--accent" className="bg-accent" textClass="text-accent-foreground" />
          <ColorSwatch name="Accent Foreground" variable="--accent-foreground" className="bg-accent-foreground" />
          
          <ColorSwatch name="Destructive" variable="--destructive" className="bg-destructive" />
          <ColorSwatch name="Destructive Foreground" variable="--destructive-foreground" className="bg-destructive-foreground" textClass="text-destructive" />
          
          <ColorSwatch name="Border" variable="--border" className="bg-border" textClass="text-foreground" />
          <ColorSwatch name="Input" variable="--input" className="bg-input" textClass="text-foreground" />
          <ColorSwatch name="Ring" variable="--ring" className="bg-ring" textClass="text-foreground" />
        </div>
      </section>

      <section>
        <h2 className="text-heading-sm mb-6">Usage Guidelines</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-subheading-sm mb-4">Do</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Use semantic color names rather than literal colors (e.g., <code>primary</code> not <code>persianGreen</code>)</li>
                <li>Pair foreground colors with their matching backgrounds</li>
                <li>Follow accessible contrast ratios (minimum 4.5:1 for text)</li>
                <li>Test design in both light and dark modes</li>
                <li>Use CSS variables for custom components that need dynamic theme changing</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-subheading-sm mb-4">Don't</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Use raw hex values or RGB values in components</li>
                <li>Create new colors without consulting the design system</li>
                <li>Override theme colors with inline styles</li>
                <li>Mix different semantic colors incorrectly (e.g., don't use <code>destructive</code> for primary actions)</li>
                <li>Use legacy color names like <code>sagebright-green</code></li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default ColorReference;
