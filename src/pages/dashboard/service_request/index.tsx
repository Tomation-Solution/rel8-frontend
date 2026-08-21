import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { FiBriefcase } from "react-icons/fi";

import { getActiveServices } from "../../../api/serviceRequestApi";
import { Button, EmptyState, PageHeader, Pagination, SearchFilterBar, Table, TableColumn } from "../../../components/ui";
import CircleLoader from "../../../components/loaders/CircleLoader";
import { formatMoney, useCurrencySymbol } from "../../../utils/currency";

const PER_PAGE = 12;

const ServiceRequest = () => {
  const navigate = useNavigate();
  const currencySymbol = useCurrencySymbol();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { isLoading, data, error } = useQuery("getActiveServices", getActiveServices, { retry: 1 });

  const services = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return services.filter(service => !needle || `${service.name ?? ""} ${service.description ?? ""}`.toLowerCase().includes(needle));
  }, [services, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const visible = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const columns: TableColumn<any>[] = [
    { key: "name", label: "Service Name", render: service => <span className="font-medium">{service.name}</span> },
    { key: "description", label: "Descriptions", render: service => <span className="text-muted">{service.description || "—"}</span> },
    {
      // The mockup labels this "Price (Naira)". The symbol comes from the org's own
      // currency setting — this page used to hardcode `en-NG` / NGN.
      key: "price",
      label: `Price (${currencySymbol})`,
      render: service => <span className="text-org-primary font-semibold">{formatMoney(service.price, "")}</span>,
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: service => (
        <Button size="sm" onClick={() => navigate(`/service-requests/${service._id}`)}>
          Request Service
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Service Request" subtitle="See the details of the service request here..." />

      <SearchFilterBar
        search={search}
        onSearchChange={value => {
          setSearch(value);
          setPage(1);
        }}
        searchPlaceholder="Search service by name"
        className="mb-6"
      />

      {isLoading ? (
        <div className="py-20 grid place-items-center">
          <CircleLoader />
        </div>
      ) : error ? (
        <EmptyState icon={FiBriefcase} title="Couldn't load services" description="Something went wrong reaching the server. Try again in a moment." />
      ) : (
        <>
          <Table
            columns={columns}
            rows={visible}
            rowKey={service => service._id}
            onRowClick={service => navigate(`/service-requests/${service._id}`)}
            empty={<EmptyState icon={FiBriefcase} title={services.length === 0 ? "No services" : "Nothing matches that"} description={services.length === 0 ? "Services your association offers will appear here." : "Try a different search."} />}
          />
          <Pagination page={current} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </>
  );
};

export default ServiceRequest;
