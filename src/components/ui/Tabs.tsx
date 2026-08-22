export interface TabItem {
  key: string;
  label: string;
  /** Small count badge after the label. */
  count?: number;
}

interface TabsProps {
  tabs: TabItem[];
  active: string;
  onChange: (key: string) => void;
  className?: string;
}

/**
 * Underlined tab strip — active tab gets a tinted panel and a brand-coloured underline that
 * meets the hairline running the full width. Chat, Environment, Elections, Account.
 *
 * On a phone the strip scrolls sideways, bleeding to both screen edges so the cut-off tab
 * at the right reads as "there is more" rather than as a clipped layout. The scrollbar is
 * hidden: a grey track sitting under a tab row looks like a broken border.
 */
export const Tabs = ({ tabs, active, onChange, className = "" }: TabsProps) => (
  <div className={`flex items-end border-b border-hairline mb-6 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 ${className}`}>
    {tabs.map(tab => {
      const isActive = tab.key === active;
      return (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`px-6 py-3.5 text-[15px] whitespace-nowrap rounded-t-lg border-b-2 -mb-px transition-colors ${isActive ? "bg-org-tint text-org-primary border-org-primary font-medium" : "text-muted border-transparent hover:text-org-primary"}`}
        >
          {tab.label}
          {typeof tab.count === "number" && <span className="ml-2 text-xs bg-org-primary text-white rounded-full px-2 py-0.5">{tab.count}</span>}
        </button>
      );
    })}
  </div>
);

interface SubNavProps {
  items: TabItem[];
  active: string;
  onChange: (key: string) => void;
  className?: string;
}

/**
 * The secondary rail between the sidebar and the content (My Account, Support). Active item
 * is a tinted block with a brand left edge.
 */
export const SubNav = ({ items, active, onChange, className = "" }: SubNavProps) => (
  <nav className={`w-full lg:w-56 flex-shrink-0 lg:border-r border-hairline lg:pr-4 lg:min-h-[70vh] ${className}`}>
    <ul className="flex lg:flex-col gap-1 overflow-x-auto scrollbar-none -mx-4 px-4 lg:mx-0 lg:px-0">
      {items.map(item => {
        const isActive = item.key === active;
        return (
          <li key={item.key}>
            <button
              type="button"
              onClick={() => onChange(item.key)}
              className={`w-full text-left whitespace-nowrap px-4 py-3 rounded-lg text-[15px] transition-colors ${isActive ? "bg-org-tint text-org-primary font-medium border-l-4 border-org-primary" : "text-ink hover:bg-org-tint/60"}`}
            >
              {item.label}
            </button>
          </li>
        );
      })}
    </ul>
  </nav>
);

export default Tabs;
