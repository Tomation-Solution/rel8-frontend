import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { FiPlus, FiX, FiPaperclip, FiLifeBuoy } from "react-icons/fi";

import { fetchMyTickets, createTicket, SUPPORT_TYPES, TICKET_CATEGORIES, STATUS_LABEL, type Ticket, type SupportType, type TicketStatus } from "../../../api/tickets/tickets-api";
import { Button, Card, EmptyState, IconInput, Pagination, SearchFilterBar, StatusPill, Table, TableColumn } from "../../../components/ui";
import { IconTextarea } from "../../../components/ui/Field";
import CircleLoader from "../../../components/loaders/CircleLoader";
import Toast from "../../../components/toast/Toast";
import { formatDateTime, relativeTime } from "../../../utils/dates";

const PER_PAGE = 10;

/**
 * `Ticket.status` is its own enum — not a payment status — so it gets its own tones rather
 * than going through `statusTone()`, which knows nothing about IN_PROGRESS.
 */
const STATUS_TONE: Record<TicketStatus, "brand" | "warning" | "success" | "past"> = {
  OPEN: "brand",
  IN_PROGRESS: "warning",
  RESOLVED: "success",
  CLOSED: "past",
};

const FILTERS = [
  { value: "all", label: "All Tickets" },
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
];

/**
 * The member's own support tickets — the other half of the Admin/Technical Support forms.
 *
 * Those forms have always created tickets; there was no way to see what became of one.
 * Mirrors the admin's ticket screen, minus the things a member must not do: no status
 * change, no delete, and `getMyTickets` scopes the list to them server-side.
 */
const MyTicketsTab = () => {
  const queryClient = useQueryClient();
  const { notifyUser } = Toast();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [composing, setComposing] = useState(false);

  const [form, setForm] = useState({ subject: "", category: "GENERAL", supportType: "TECHNICAL" as SupportType, description: "" });
  const [files, setFiles] = useState<File[]>([]);
  const [formError, setFormError] = useState("");

  const { data, isLoading, isError } = useQuery("myTickets", fetchMyTickets, { staleTime: 60 * 1000 });

  const tickets = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return tickets.filter(ticket => {
      if (filter !== "all" && ticket.status !== filter) return false;
      if (!needle) return true;
      return `${ticket.subject} ${ticket.ticketId} ${ticket.category}`.toLowerCase().includes(needle);
    });
  }, [tickets, search, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const visible = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const mutation = useMutation(createTicket, {
    onSuccess: ticket => {
      notifyUser(`Ticket ${ticket.ticketId} raised. We'll be in touch.`, "success");
      queryClient.invalidateQueries("myTickets");
      setComposing(false);
      setForm({ subject: "", category: "GENERAL", supportType: "TECHNICAL", description: "" });
      setFiles([]);
    },
    onError: (error: any) => {
      setFormError(error?.response?.data?.message || "Could not raise your ticket. Please try again.");
    },
  });

  const submit = () => {
    setFormError("");
    if (!form.subject.trim() || !form.description.trim()) {
      setFormError("A subject and a description are both required.");
      return;
    }
    mutation.mutate({ ...form, attachments: files });
  };

  const columns: TableColumn<Ticket>[] = [
    { key: "ticketId", label: "Ticket ID", render: ticket => <span className="font-medium">{ticket.ticketId}</span> },
    { key: "subject", label: "Subject", render: ticket => <span className="text-ink">{ticket.subject}</span> },
    { key: "category", label: "Category", render: ticket => <span className="text-muted capitalize">{String(ticket.category ?? "").toLowerCase()}</span> },
    { key: "status", label: "Status", render: ticket => <StatusPill label={STATUS_LABEL[ticket.status] ?? ticket.status} tone={STATUS_TONE[ticket.status] ?? "neutral"} /> },
    { key: "createdAt", label: "Raised", render: ticket => <span className="text-muted">{relativeTime(ticket.createdAt)}</span> },
  ];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <p className="text-sm text-muted">Everything you&rsquo;ve raised with your association, and where each stands.</p>
        <Button icon={FiPlus} onClick={() => setComposing(true)}>
          New Ticket
        </Button>
      </div>

      <SearchFilterBar
        search={search}
        onSearchChange={value => {
          setSearch(value);
          setPage(1);
        }}
        searchPlaceholder="Search by subject or ticket ID"
        filter={filter}
        onFilterChange={value => {
          setFilter(value);
          setPage(1);
        }}
        filterOptions={FILTERS}
        className="mb-6"
      />

      {isLoading ? (
        <CircleLoader />
      ) : isError ? (
        <EmptyState icon={FiLifeBuoy} title="Couldn't load your tickets" description="Something went wrong reaching the server. Try again in a moment." />
      ) : (
        <>
          <Table
            columns={columns}
            rows={visible}
            rowKey={ticket => ticket._id}
            onRowClick={ticket => setSelected(ticket)}
            empty={
              <EmptyState
                icon={FiLifeBuoy}
                title={tickets.length === 0 ? "No tickets yet" : "Nothing matches that"}
                description={tickets.length === 0 ? "Raise one and you'll be able to follow it here." : "Try a different search or filter."}
                action={tickets.length === 0 ? <Button icon={FiPlus} onClick={() => setComposing(true)}>New Ticket</Button> : undefined}
              />
            }
          />
          <Pagination page={current} totalPages={totalPages} onChange={setPage} />
        </>
      )}

      {/* ------------------------------------------------------------ detail -- */}
      {selected && (
        <div className="fixed inset-0 bg-ink/50 grid place-items-center z-50 p-4" role="dialog" aria-modal="true">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="min-w-0">
                <h3 className="text-[18px] font-semibold text-ink">{selected.subject}</h3>
                <p className="text-sm text-muted mt-0.5">{selected.ticketId}</p>
              </div>
              <button type="button" aria-label="Close" onClick={() => setSelected(null)} className="text-muted hover:text-ink">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <dl className="flex flex-col gap-4">
              <div>
                <dt className="text-sm text-muted">Status</dt>
                <dd className="mt-1">
                  <StatusPill label={STATUS_LABEL[selected.status] ?? selected.status} tone={STATUS_TONE[selected.status] ?? "neutral"} />
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Category</dt>
                <dd className="text-[15px] text-ink capitalize">{String(selected.category ?? "").toLowerCase()}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Description</dt>
                <dd className="text-[15px] text-ink whitespace-pre-line">{selected.description}</dd>
              </div>
              {selected.attachments && selected.attachments.length > 0 && (
                <div>
                  <dt className="text-sm text-muted">Attachments</dt>
                  <dd className="flex flex-col gap-1 mt-1">
                    {selected.attachments.map((url, index) => (
                      <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-org-primary underline">
                        <FiPaperclip className="w-4 h-4" />
                        Attachment {index + 1}
                      </a>
                    ))}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-sm text-muted">Raised</dt>
                <dd className="text-[15px] text-ink">{formatDateTime(selected.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Last updated</dt>
                <dd className="text-[15px] text-ink">{formatDateTime(selected.updatedAt)}</dd>
              </div>
            </dl>

            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => setSelected(null)}>
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ------------------------------------------------------------ compose -- */}
      {composing && (
        <div className="fixed inset-0 bg-ink/50 grid place-items-center z-50 p-4" role="dialog" aria-modal="true">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-start justify-between gap-4 mb-5">
              <h3 className="text-[18px] font-semibold text-ink">Raise a ticket</h3>
              <button type="button" aria-label="Close" onClick={() => setComposing(false)} className="text-muted hover:text-ink">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <IconInput label="Subject" placeholder="A short summary" value={form.subject} onChange={event => setForm(f => ({ ...f, subject: event.target.value }))} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-ink mb-1.5">Type</label>
                  <select
                    value={form.supportType}
                    onChange={event => setForm(f => ({ ...f, supportType: event.target.value as SupportType }))}
                    className="w-full h-[46px] px-3 rounded-lg border border-hairline bg-white text-sm text-ink outline-none focus:border-org-primary"
                  >
                    {SUPPORT_TYPES.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-ink mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={event => setForm(f => ({ ...f, category: event.target.value }))}
                    className="w-full h-[46px] px-3 rounded-lg border border-hairline bg-white text-sm text-ink outline-none focus:border-org-primary"
                  >
                    {TICKET_CATEGORIES.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <IconTextarea label="Description" rows={5} placeholder="What happened, and what you expected" value={form.description} onChange={event => setForm(f => ({ ...f, description: event.target.value }))} />

              <div>
                <label className="block text-sm text-ink mb-1.5">
                  Attachments <span className="text-muted">(optional, up to 10)</span>
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*,application/pdf"
                  onChange={event => setFiles(Array.from(event.target.files ?? []).slice(0, 10))}
                  className="block w-full text-xs text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-org-tint file:px-3 file:py-2 file:text-xs file:font-medium file:text-org-primary"
                />
                {files.length > 0 && (
                  <p className="mt-1.5 text-xs text-muted">
                    {files.length} file{files.length === 1 ? "" : "s"} selected
                  </p>
                )}
              </div>

              {formError && <p className="text-sm text-status-danger">{formError}</p>}

              <div className="flex justify-end gap-3 pt-1">
                <Button variant="outline" onClick={() => setComposing(false)} disabled={mutation.isLoading}>
                  Cancel
                </Button>
                <Button isLoading={mutation.isLoading} onClick={submit}>
                  Submit ticket
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default MyTicketsTab;
