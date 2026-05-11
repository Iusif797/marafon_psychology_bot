import { Topbar } from "@/components/layout/topbar";
import { EmptyState } from "@/components/participants/empty-state";
import { Filters } from "@/components/participants/filters";
import { ParticipantRow } from "@/components/participants/participant-row";
import { StatsRow } from "@/components/participants/stats-row";
import {
  listParticipants,
  participantStats,
  participantsByStep,
  type ParticipantsFilters,
} from "@/lib/db/queries/participants";

export const dynamic = "force-dynamic";

type SearchParams = { q?: string; step?: string; status?: string };

function parseFilters(sp: SearchParams): ParticipantsFilters {
  const filters: ParticipantsFilters = {};
  if (sp.q) filters.search = sp.q;
  if (sp.step && sp.step !== "all") {
    const n = Number(sp.step);
    if (!Number.isNaN(n)) filters.step = n;
  }
  if (sp.status === "active" || sp.status === "completed") filters.status = sp.status;
  return filters;
}

export default async function ParticipantsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const filters = parseFilters(sp);
  const [participants, stats, stepsBreakdown] = await Promise.all([
    listParticipants(filters),
    participantStats(),
    participantsByStep(),
  ]);
  const hasFilter = Boolean(sp.q || sp.step || sp.status);
  return (
    <>
      <Topbar title="Участники" description="Кто пришёл на марафон, кто где идёт" />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        <StatsRow stats={stats} />
        <Filters steps={stepsBreakdown} />
        {participants.length === 0 ? (
          <EmptyState query={hasFilter} />
        ) : (
          <div className="space-y-2">
            {participants.map((p) => (
              <ParticipantRow key={p.id} participant={p} totalSteps={stepsBreakdown.length} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
