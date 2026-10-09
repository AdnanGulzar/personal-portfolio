"use client";
import { useMemo, useState } from "react";
import DemoFrame, { Slider, Toggle } from "./DemoFrame";

// Sample API data. Byte counts below are the real lengths of these objects as JSON (before gzip).
const post = {
  id: 42, slug: "how-https-works", title: "How HTTPS works", authorId: 7,
  body: "You see a padlock and assume the connection is safe. ".repeat(8).trim(),
  tags: ["Security", "Networking"], createdAt: "2026-10-08T09:00:00Z", updatedAt: "2026-10-08T09:00:00Z", status: "published",
};
const author = {
  id: 7, name: "Adnan Gul", handle: "adnan", avatarUrl: "https://example.com/a/7.png",
  bio: "Software engineer writing about how the web works.", location: "UK", createdAt: "2024-01-15T10:00:00Z", followers: 1280,
};
const comments = [1, 2, 3].map((i) => ({
  id: 900 + i, postId: 42, authorId: 20 + i, body: `Comment number ${i}: this finally made TLS click for me.`,
  createdAt: "2026-10-08T12:00:00Z", likes: 3 * i, edited: false,
}));

type Need = { body: boolean; avatar: boolean; comments: boolean };
const size = (x: unknown) => new TextEncoder().encode(JSON.stringify(x)).length;

function plan(n: Need) {
  // REST, one endpoint per resource: the author's id is only known after the post arrives
  const rest = { trips: 2, calls: ["GET /posts/42", "GET /users/7", ...(n.comments ? ["GET /posts/42/comments"] : [])], bytes: size(post) + size(author) + (n.comments ? size(comments) : 0) };
  // REST with a purpose-built endpoint (or a backend-for-frontend)
  const embed = { trips: 1, calls: [`GET /posts/42?include=author${n.comments ? ",comments" : ""}`], bytes: size({ ...post, author, ...(n.comments ? { comments } : {}) }) };
  // GraphQL: one request that names exactly the fields the screen shows
  const query = `{post(id:42){title${n.body ? " body" : ""} author{name${n.avatar ? " avatarUrl" : ""}}${n.comments ? " comments{body}" : ""}}}`;
  const data = {
    data: {
      post: {
        title: post.title, ...(n.body ? { body: post.body } : {}),
        author: { name: author.name, ...(n.avatar ? { avatarUrl: author.avatarUrl } : {}) },
        ...(n.comments ? { comments: comments.map((c) => ({ body: c.body })) } : {}),
      },
    },
  };
  const gql = { trips: 1, calls: ["POST /graphql"], bytes: size(data), query, up: size({ query }) };
  return { rest, embed, gql };
}

export default function FetchShapeDemo() {
  const [need, setNeed] = useState<Need>({ body: false, avatar: true, comments: true });
  const [rtt, setRtt] = useState(150);
  const p = useMemo(() => plan(need), [need]);
  const rows = [
    { name: "REST, one resource per call", ...p.rest },
    { name: "REST, endpoint built for the screen", ...p.embed },
    { name: "GraphQL", ...p.gql },
  ];
  const maxBytes = Math.max(...rows.map((r) => r.bytes));

  return (
    <DemoFrame title="Fetching one screen: a post with its author and comments" hint="Bytes are real">
      <p className="text-xs text-muted">The screen shows the post title and the author&apos;s name, plus:</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <Toggle label="Post body" on={need.body} onChange={(v) => setNeed({ ...need, body: v })} />
        <Toggle label="Author avatar" on={need.avatar} onChange={(v) => setNeed({ ...need, avatar: v })} />
        <Toggle label="Comments" on={need.comments} onChange={(v) => setNeed({ ...need, comments: v })} />
      </div>
      <div className="mt-4 max-w-sm">
        <Slider label="Round trip to the API (mobile can be 150 ms+)" value={rtt} min={20} max={400} step={10} format={(v) => `${v} ms`} onChange={setRtt} />
      </div>

      <div className="mt-6 space-y-4">
        {rows.map((r) => (
          <div key={r.name}>
            <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
              <span className="text-fg">{r.name}</span>
              <span className="font-mono text-xs text-muted">
                {r.trips} round {r.trips === 1 ? "trip" : "trips"} ≈ <span className="text-fg">{r.trips * rtt} ms</span> · {r.bytes.toLocaleString("en-GB")} B down
              </span>
            </div>
            <div className="mt-1.5 h-2 rounded-full bg-white/[0.04]">
              <div className="h-full rounded-full transition-all" style={{ width: `${(r.bytes / maxBytes) * 100}%`, background: r.name === "GraphQL" ? "#10b981" : "#3b82f6" }} />
            </div>
            <p className="mt-1.5 break-all font-mono text-[11px] text-subtle">{r.calls.join("  ·  ")}</p>
          </div>
        ))}
      </div>
      <pre className="mt-4 overflow-x-auto rounded-xl bg-white/[0.04] p-3 font-mono text-[11px] text-muted">{p.gql.query}</pre>

      <p className="mt-4 text-sm leading-relaxed text-muted">
        Plain REST makes {p.rest.calls.length} calls in 2 rounds (it can&apos;t ask for the author until the post says who that is) and downloads
        every field of every object. GraphQL sends one request listing exactly the fields on screen, so it downloads{" "}
        {Math.round((1 - p.gql.bytes / p.rest.bytes) * 100)}% less, but it uploads its {p.gql.up}-byte query and the server
        now has to resolve the shape you asked for. A REST endpoint built for this screen gets the single round trip too, at the cost of one endpoint per screen.
      </p>
    </DemoFrame>
  );
}
