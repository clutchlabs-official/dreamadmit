import { motion } from "motion/react";
import type { ReactNode } from "react";

interface StaggerListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
  staggerDelay?: number;
}

export default function StaggerList<T>({
  items,
  renderItem,
  className = "",
  staggerDelay = 0.08,
}: StaggerListProps<T>) {
  return (
    <div className={className}>
      {items.map((item, index) => (
        <motion.div
          key={typeof item === "string" ? item : index}
          initial={{ opacity: 0, scale: 0.88, y: 10 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{
            duration: 0.42,
            delay: index * staggerDelay,
            ease: [0.34, 1.4, 0.64, 1],
          }}
        >
          {renderItem(item, index)}
        </motion.div>
      ))}
    </div>
  );
}
