"use client";

import { useState } from "react";
import { use } from "react";
import useSWR, { mutate } from "swr";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Code, Eye as EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { CardPreview } from "@/components/card-preview";
import type { Tutorial } from "@/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function TutorialDetailPage({
  params,
}: {
  params: Promise<{ tutorialId: string }>;
}) {
  const { tutorialId } = use(params);
  const { data: tutorial, error } = useSWR<Tutorial>(
    `/api/tutorials/${tutorialId}`,
    fetcher
  );

  const [mode, setMode] = useState<"preview" | "json">("preview");
  const [jsonText, setJsonText] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  function switchToJson() {
    if (tutorial) {
      setJsonText(JSON.stringify(tutorial, null, 2));
    }
    setMode("json");
  }

  async function handleSave() {
    setSaving(true);
    setSaveMsg(null);
    try {
      const parsed = JSON.parse(jsonText);
      const res = await fetch(`/api/tutorials/${tutorialId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: jsonText,
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Save failed");
      }
      setSaveMsg("Saved");
      mutate(`/api/tutorials/${tutorialId}`, parsed, false);
      setTimeout(() => setSaveMsg(null), 2000);
    } catch (err) {
      setSaveMsg(
        err instanceof Error ? err.message : "Invalid JSON"
      );
    } finally {
      setSaving(false);
    }
  }

  if (error) {
    return (
      <div>
        <Link
          href="/tutorials"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to tutorials
        </Link>
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Tutorial not found or failed to load.
        </div>
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/tutorials"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to tutorials
      </Link>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{tutorial.title}</h1>
          {tutorial.description && (
            <p className="mt-1 text-muted-foreground">
              {tutorial.description}
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge>{tutorial.difficulty}</Badge>
            <Badge variant="secondary">{tutorial.tool}</Badge>
            {tutorial.estimatedMinutes && (
              <Badge variant="outline">
                ~{tutorial.estimatedMinutes} min
              </Badge>
            )}
            <span className="text-sm text-muted-foreground">
              {tutorial.cards.length} cards
            </span>
          </div>
          {tutorial.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {tutorial.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {mode === "preview" ? (
            <Button variant="outline" size="sm" onClick={switchToJson}>
              <Code className="mr-1 h-3 w-3" />
              Edit JSON
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMode("preview")}
              >
                <EyeIcon className="mr-1 h-3 w-3" />
                Preview
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                ) : (
                  <Save className="mr-1 h-3 w-3" />
                )}
                Save
              </Button>
            </>
          )}
        </div>
      </div>

      {saveMsg && (
        <div
          className={`mb-4 rounded-lg border p-2 text-sm ${
            saveMsg === "Saved"
              ? "border-green-500/50 bg-green-500/10 text-green-400"
              : "border-destructive/50 bg-destructive/10 text-destructive"
          }`}
        >
          {saveMsg}
        </div>
      )}

      {mode === "preview" ? (
        <CardPreview cards={tutorial.cards} />
      ) : (
        <Textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          className="min-h-[600px] font-mono text-xs"
        />
      )}

      {/* Source info */}
      {tutorial.source && (
        <div className="mt-8 rounded-lg border border-border bg-card p-4">
          <h3 className="mb-2 text-sm font-medium">Source</h3>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            {tutorial.source.author && (
              <>
                <dt className="text-muted-foreground">Author</dt>
                <dd>{tutorial.source.author}</dd>
              </>
            )}
            {tutorial.source.airtableRecordId && (
              <>
                <dt className="text-muted-foreground">Airtable ID</dt>
                <dd className="font-mono text-xs">
                  {tutorial.source.airtableRecordId}
                </dd>
              </>
            )}
            {tutorial.source.sourceUrl && (
              <>
                <dt className="text-muted-foreground">Source URL</dt>
                <dd>
                  <a
                    href={tutorial.source.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Link
                  </a>
                </dd>
              </>
            )}
          </dl>
        </div>
      )}
    </div>
  );
}
