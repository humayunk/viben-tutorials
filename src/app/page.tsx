"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { Search, Clock, Eye, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { AirtableRecord, AirtableListResponse } from "@/types";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Fetch failed");
  return data;
};

const TOP_TAGS = [
  "agents",
  "claude",
  "workflow",
  "prompting",
  "claude-code",
  "cursor",
  "gemini",
  "automation",
  "mcp",
  "chatgpt",
  "openclaw",
  "tutorial",
  "n8n",
  "bolt",
  "no-code",
];

function formatDuration(seconds?: number) {
  if (!seconds) return null;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function RecordCard({ record }: { record: AirtableRecord }) {
  const f = record.fields;
  return (
    <Link
      href={`/records/${record.id}`}
      className="group block rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50"
    >
      <div className="flex gap-4">
        {f.thumbnail_image && (
          <img
            src={f.thumbnail_image}
            alt=""
            className="h-20 w-36 shrink-0 rounded-lg object-cover"
          />
        )}
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-medium text-foreground group-hover:text-primary">
            {f.ai_editor_title || f.title || "Untitled"}
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {f.author || "Unknown creator"}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {f.difficulty_level && (
              <Badge variant="outline" className="text-xs capitalize">
                {f.difficulty_level}
              </Badge>
            )}
            {f.video_duration_s && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatDuration(f.video_duration_s)}
              </span>
            )}
            {f.view_count && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Eye className="h-3 w-3" />
                {f.view_count.toLocaleString()}
              </span>
            )}
          </div>
          {f.ai_editor_tags && f.ai_editor_tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {f.ai_editor_tags.slice(0, 4).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {f.ai_editor_tags.length > 4 && (
                <span className="text-xs text-muted-foreground">
                  +{f.ai_editor_tags.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </Link>
  );
}

function RecordSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex gap-4">
        <Skeleton className="h-20 w-36 shrink-0 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [offset, setOffset] = useState<string | undefined>();
  const [allRecords, setAllRecords] = useState<AirtableRecord[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (tag) params.set("tag", tag);
  if (difficulty) params.set("difficulty", difficulty);
  params.set("pageSize", "20");

  const { data, error, isLoading } = useSWR<AirtableListResponse>(
    `/api/airtable/records?${params}`,
    fetcher,
    {
      onSuccess: (data) => {
        if (!offset) {
          setAllRecords(data.records);
        }
      },
    }
  );

  const records = allRecords.length > 0 ? allRecords : data?.records ?? [];
  const nextOffset = isLoadingMore ? undefined : data?.offset;

  async function loadMore() {
    if (!data?.offset) return;
    setIsLoadingMore(true);
    const moreParams = new URLSearchParams(params);
    moreParams.set("offset", data.offset);
    try {
      const res = await fetch(`/api/airtable/records?${moreParams}`);
      const more: AirtableListResponse = await res.json();
      setAllRecords((prev) => [...prev, ...more.records]);
      setOffset(more.offset);
    } finally {
      setIsLoadingMore(false);
    }
  }

  function resetFilters() {
    setSearch("");
    setTag("");
    setDifficulty("");
    setOffset(undefined);
    setAllRecords([]);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Browse YouTube Records</h1>
        <p className="mt-1 text-muted-foreground">
          1,017 YouTube records with transcripts, AI summaries, and practical
          steps
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title or creator..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOffset(undefined);
              setAllRecords([]);
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={tag}
          onChange={(e) => {
            setTag(e.target.value);
            setOffset(undefined);
            setAllRecords([]);
          }}
        >
          <option value="">All tags</option>
          {TOP_TAGS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
        <Select
          value={difficulty}
          onChange={(e) => {
            setDifficulty(e.target.value);
            setOffset(undefined);
            setAllRecords([]);
          }}
        >
          <option value="">All levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="expert">Expert</option>
        </Select>
        {(search || tag || difficulty) && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Clear
          </Button>
        )}
      </div>

      {/* Results */}
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load records. Check that AIRTABLE_PAT is set in .env.local.
        </div>
      )}

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <RecordSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && !error && records.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">
          No records found. Try different filters.
        </p>
      )}

      {!isLoading && records.length > 0 && (
        <>
          <div className="space-y-3">
            {records.map((record) => (
              <RecordCard key={record.id} record={record} />
            ))}
          </div>

          {(data?.offset || isLoadingMore) && (
            <div className="mt-6 flex justify-center">
              <Button
                variant="outline"
                onClick={loadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? "Loading..." : "Load more"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
