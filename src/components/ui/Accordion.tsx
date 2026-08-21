import { ReactNode, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

export interface AccordionItem {
  id: string;
  question: string;
  answer: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  /** Item open on first render. Omit to start collapsed. */
  defaultOpenId?: string;
  /** Leave several open at once. */
  multiple?: boolean;
  className?: string;
}

/** Tinted question bar, white answer body beneath it. The FAQ page. */
const Accordion = ({ items, defaultOpenId, multiple = false, className = "" }: AccordionProps) => {
  const [open, setOpen] = useState<string[]>(defaultOpenId ? [defaultOpenId] : []);

  const toggle = (id: string) => {
    setOpen(current => {
      if (current.includes(id)) return current.filter(entry => entry !== id);
      return multiple ? [...current, id] : [id];
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map(item => {
        const isOpen = open.includes(item.id);
        return (
          <div key={item.id} className="rounded-lg overflow-hidden border border-hairline">
            <button type="button" onClick={() => toggle(item.id)} aria-expanded={isOpen} className="w-full flex items-center justify-between gap-4 text-left px-5 py-3.5 bg-org-tint text-org-primary font-medium">
              <span className="min-w-0">{item.question}</span>
              <FiChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && <div className="px-5 py-3.5 bg-white text-sm text-ink">{item.answer}</div>}
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
