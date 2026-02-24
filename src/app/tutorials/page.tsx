"use client";

import useSWR from "swr";
import Link from "next/link";
import { FileJson, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { TutorialListItem } from "@/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function TutorialsPage() {
  const { data: tutorials, error, isLoading } = useSWR<TutorialListItem[]>(
    "/api/tutorials",
    fetcher
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Saved Tutorials</h1>
        <p className="mt-1 text-muted-foreground">
          Generated tutorial card sequences saved as JSON
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load tutorials.
        </div>
      )}

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      )}

      {!isLoading && tutorials && tutorials.length === 0 && (
        <div className="py-12 text-center">
          <FileJson className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">No tutorials saved yet.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse records and generate your first tutorial.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-sm text-primary hover:underline"
          >
            Browse records
          </Link>
        </div>
      )}

      {tutorials && tutorials.length > 0 && (
        <div className="space-y-3">
          {tutorials.map((t) => (
            <Link
              key={t.id}
              href={`/tutorials/${t.id}`}
              className="group block rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium group-hover:text-primary">
                    {t.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{t.tool}</Badge>
                    <Badge variant="outline" className="capitalize">
                      {t.difficulty}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {t.cardCount} cards
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {new Date(t.createdAt).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
