"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import useSWR from "swr";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Loader2,
  Sparkles,
  Save,
  Clock,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CardPreview } from "@/components/card-preview";
import type { AirtableRecord, Tutorial } from "@/types";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Fetch failed");
  if (!data.fields) throw new Error("Invalid record response");
  return data;
};

function formatDuration(seconds?: number) {
  if (!seconds) return null;
  const m = Math.floor(seconds / 60);
  return `${m} min`;
}

export default function RecordDetailPage({
  params,
}: {
  params: Promise<{ recordId: string }>;
}) {
  const { recordId } = use(params);
  const { data: record, error } = useSWR<AirtableRecord>(
    `/api/airtable/records/${recordId}`,
    fetcher
  );

  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Check if a tutorial was already saved for this record
  useEffect(() => {
    fetch(`/api/tutorials?recordId=${recordId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.tutorial) {
          setTutorial(data.tutorial);
          setSaved(true);
        }
      })
      .catch(() => {});
  }, [recordId]);

  async function handleGenerate() {
    setGenerating(true);
    setGenError(null);
    setTutorial(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recordId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setTutorial(data);
    } catch (err) {
      setGenError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setGenerating(false);
    }
  }

  async function handleSave() {
    if (!tutorial) return;
    setSaving(true);
    try {
      const res = await fetch("/api/tutorials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tutorial),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Save failed");
      }
      setSaved(true);
    } catch (err) {
      setGenError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        Failed to load record: {error.message || "Unknown error"}
      </div>
    );
  }

  if (!record) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const f = record.fields;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to browse
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              {f.ai_editor_title || f.title || "Untitled"}
            </h1>
            <p className="mt-1 text-muted-foreground">
              {f.author || "Unknown creator"}
            </p>
          </div>
          {f.source_url && (
            <a
              href={f.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
            >
              <Button variant="outline" size="sm">
                <ExternalLink className="mr-1 h-3 w-3" />
                YouTube
              </Button>
            </a>
          )}
        </div>

        {/* Meta */}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {f.difficulty_level && (
            <Badge variant="outline" className="capitalize">
              {f.difficulty_level}
            </Badge>
          )}
          {f.video_duration_s && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {formatDuration(f.video_duration_s)}
            </span>
          )}
          {f.view_count && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Eye className="h-3.5 w-3.5" />
              {f.view_count.toLocaleString()} views
            </span>
          )}
        </div>

        {/* Tags */}
        {f.ai_editor_tags && f.ai_editor_tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {f.ai_editor_tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Content sections */}
      <div className="space-y-6">
        {/* Summary */}
        {f.ai_editor_summary && (
          <section>
            <h2 className="mb-2 text-lg font-semibold">Summary</h2>
            <div className="rounded-lg border border-border bg-card p-4 text-sm leading-relaxed text-muted-foreground">
              {f.ai_editor_summary}
            </div>
          </section>
        )}

        {/* Practical Steps */}
        {f.ai_editor_practical_steps && (
          <section>
            <h2 className="mb-2 text-lg font-semibold">Practical Steps</h2>
            <pre className="max-h-64 overflow-auto rounded-lg border border-border bg-card p-4 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {f.ai_editor_practical_steps}
            </pre>
          </section>
        )}

        {/* Transcript excerpt */}
        {f.raw_content && (
          <section>
            <h2 className="mb-2 text-lg font-semibold">
              Transcript{" "}
              <span className="text-sm font-normal text-muted-foreground">
                ({f.raw_content.length.toLocaleString()} chars)
              </span>
            </h2>
            <pre className="max-h-48 overflow-auto rounded-lg border border-border bg-card p-4 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {f.raw_content.slice(0, 2000)}
              {f.raw_content.length > 2000 && "\n\n...truncated for preview"}
            </pre>
          </section>
        )}

        {/* Generate Tutorial */}
        <section className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-6">
          <h2 className="mb-2 text-lg font-semibold">Generate Tutorial</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Send this record's data to Claude to generate a structured tutorial
            card sequence.
          </p>

          <div className="flex gap-3">
            <Button onClick={handleGenerate} disabled={generating}>
              {generating ? (
                <>
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-1 h-4 w-4" />
                  Generate Tutorial
                </>
              )}
            </Button>

            {tutorial && !saved && (
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-1 h-4 w-4" />
                    Save Tutorial
                  </>
                )}
              </Button>
            )}

            {saved && (
              <Link href={`/tutorials/${tutorial?.id}`}>
                <Button variant="outline">View Saved Tutorial</Button>
              </Link>
            )}
          </div>

          {genError && (
            <div className="mt-4 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {genError}
            </div>
          )}
        </section>

        {/* Tutorial Preview */}
        {tutorial && (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Tutorial Preview: {tutorial.title}
              </h2>
              <span className="text-sm text-muted-foreground">
                {tutorial.cards.length} cards
              </span>
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge>{tutorial.difficulty}</Badge>
              <Badge variant="secondary">{tutorial.tool}</Badge>
              {tutorial.estimatedMinutes && (
                <Badge variant="outline">
                  ~{tutorial.estimatedMinutes} min
                </Badge>
              )}
            </div>
            {tutorial.description && (
              <p className="mb-4 text-sm text-muted-foreground">
                {tutorial.description}
              </p>
            )}
            <CardPreview cards={tutorial.cards} />
          </section>
        )}
      </div>
    </div>
  );
}
