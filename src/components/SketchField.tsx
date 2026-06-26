import { SideSketch } from "@/components/SideSketch";

export type Sketch = {
  src: string;
  width: number;
  height: number;
  className: string;
};

export function SketchField({ items }: { items: Sketch[] }) {
  return (
    <>
      {items.map((s, i) => (
        <SideSketch key={i} {...s} />
      ))}
    </>
  );
}
