import { PageHeader } from "../../../components/ui";
import DuesPanel from "./DuesPanel";

/**
 * `Dues.png` titles this screen "Elections" — that is a copy error in the mockup, not a
 * spec. The page is Dues.
 */
const DuesPage = () => (
  <>
    <PageHeader title="Dues" subtitle="Here's how things are going for you." />
    <DuesPanel />
  </>
);

export default DuesPage;
