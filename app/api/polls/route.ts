import { supabase } from "@/lib/supabase";
import { getPollsPage } from "@/lib/polls";

const PAGE_SIZE = 10;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const offset = Number(searchParams.get("offset") ?? 0);
  const { polls, hasMore } = await getPollsPage(offset, PAGE_SIZE);
  return Response.json({ polls, hasMore });
}

export async function POST(req: Request) {
  const { question, author, options } = await req.json();

  const cleanOptions: string[] = Array.isArray(options)
    ? options.map((o: string) => o?.trim()).filter(Boolean)
    : [];

  if (!question?.trim() || cleanOptions.length < 2) {
    return Response.json(
      { error: "A poll needs a question and at least two options." },
      { status: 400 }
    );
  }

  // 1) create the poll
  const { data: poll, error: pollError } = await supabase
    .from("polls")
    .insert({ question: question.trim(), author: author ?? null })
    .select()
    .single();

  if (pollError)
    return Response.json({ error: pollError.message }, { status: 500 });

  // 2) create its options, preserving order via `position`
  const { data: insertedOptions, error: optionsError } = await supabase
    .from("poll_options")
    .insert(
      cleanOptions.map((label, i) => ({
        poll_id: poll.id,
        label,
        position: i,
      }))
    )
    .select("id, label, position");

  if (optionsError) {
    // roll back the orphaned poll so we never persist a poll with no options
    await supabase.from("polls").delete().eq("id", poll.id);
    return Response.json({ error: optionsError.message }, { status: 500 });
  }

  return Response.json({
    id: poll.id,
    question: poll.question,
    author: poll.author,
    totalVotes: 0,
    options: insertedOptions
      .sort((a, b) => a.position - b.position)
      .map((o) => ({ id: o.id, label: o.label, votes: 0 })),
  });
}
