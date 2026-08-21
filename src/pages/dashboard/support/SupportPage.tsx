import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { FiHelpCircle } from "react-icons/fi";

import { fetchAllFAQ, FAQItem } from "../../../api/faq/api-faq";
import { useAdminSupport, useTechnicalSupport } from "../../../hooks/contactUsHook";
import { Accordion, AccordionItem, ContactForm, ContactFormValues, EmptyState, PageHeader, SubNav, TabItem } from "../../../components/ui";
import CircleLoader from "../../../components/loaders/CircleLoader";
import MyTicketsTab from "./MyTicketsTab";
import Toast from "../../../components/toast/Toast";
import { useAppContext } from "../../../context/authContext";

/**
 * Support — `Support.png`, `Support-1.png`, `Support-2.png`.
 *
 * One page with a `SubNav`, replacing four: `SupportPage` (a list of three links),
 * `FAQPage`, `AdminSupportPage` and `TechnicalSupportPage`. The last two were the same
 * form twice, differing only in which mutation they called; both now render the shared
 * `ContactForm`.
 */
type Section = "faq" | "admin" | "technical" | "tickets";

const SECTIONS: TabItem[] = [
  { key: "faq", label: "FAQs" },
  { key: "admin", label: "Admin Support" },
  { key: "technical", label: "Technical Support" },
  // Not in the mockup: the two forms above have always created tickets, and until now
  // there was no way to see what became of one.
  { key: "tickets", label: "My Tickets" },
];

const SupportPage = () => {
  const [section, setSection] = useState<Section>("faq");
  const { notifyUser } = Toast();
  const { user } = useAppContext();

  const { data, isLoading, isError } = useQuery("faqs", fetchAllFAQ, { staleTime: 10 * 60 * 1000 });

  const faqs: AccordionItem[] = useMemo(() => {
    const rows: FAQItem[] = Array.isArray(data) ? data : [];
    return [...rows].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map(item => ({ id: item._id, question: item.question, answer: item.answer }));
  }, [data]);

  const adminSupport = useAdminSupport();
  const technicalSupport = useTechnicalSupport();

  const defaults = { name: (user as any)?.name ?? "", email: (user as any)?.email ?? "" };

  const submit = (kind: Section) => (values: ContactFormValues) => {
    const mutation = kind === "admin" ? adminSupport : technicalSupport;
    mutation.mutate(values, {
      onSuccess: (result: any) => {
        notifyUser(result?.ticketId ? `Thanks — that's ticket ${result.ticketId}. Track it under My Tickets.` : result?.message || "Thanks — we've received your message.", "success");
      },
      onError: (error: any) => {
        notifyUser(error?.response?.data?.message || "Could not send your message. Please try again.", "error");
      },
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
      <SubNav items={SECTIONS} active={section} onChange={key => setSection(key as Section)} />

      <div className="flex-1 min-w-0">
        {section === "faq" && (
          <>
            <PageHeader title="Support" subtitle="See some frequently asked questions here and answers..." />

            {isLoading ? (
              <div className="py-20 grid place-items-center">
                <CircleLoader />
              </div>
            ) : isError ? (
              <EmptyState icon={FiHelpCircle} title="Couldn't load the FAQs" description="Something went wrong reaching the server. Try again in a moment." />
            ) : faqs.length === 0 ? (
              <EmptyState icon={FiHelpCircle} title="No questions yet" description="Your association hasn't published any FAQs. Try one of the support forms." />
            ) : (
              <Accordion items={faqs} defaultOpenId={faqs[0]?.id} className="max-w-3xl" />
            )}
          </>
        )}

        {section === "admin" && (
          <>
            <PageHeader title="Admin Support" subtitle="Message your association's administrators." />
            <ContactForm title="Contact your association" description="Questions about membership, dues, events or anything the association handles." submitLabel="Send to admin" isLoading={adminSupport.isLoading} onSubmit={submit("admin")} defaults={defaults} />
          </>
        )}

        {section === "tickets" && (
          <>
            <PageHeader title="My Tickets" subtitle="Follow anything you've raised with your association." />
            <MyTicketsTab />
          </>
        )}

        {section === "technical" && (
          <>
            <PageHeader title="Technical Support" subtitle="Something not working? Tell us what happened." />
            <ContactForm
              title="Report a technical problem"
              description="Include what you were doing and what you expected to happen — it helps us find it faster."
              submitLabel="Send to support"
              isLoading={technicalSupport.isLoading}
              onSubmit={submit("technical")}
              defaults={defaults}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SupportPage;
