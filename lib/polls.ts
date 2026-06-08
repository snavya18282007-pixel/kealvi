import { supabase } from "@/lib/supabase";

export type PollOption = {
  id: string;
  label: string;
  votes: number;
};

export type Poll = {
  id: string;
  question: string;
  author: string | null;
  totalVotes: number;
  options: PollOption[];
};

// Fetch a page of polls, newest first, with each option's vote count.
// We count poll_votes per option the same way questions count their votes:
// let Postgres aggregate the related rows instead of pulling them all down.
export async function getPollsPage(offset: number, limit: number) {
  const { data, error } = await supabase
    .from("polls")
    .select(
      "id, question, author, created_at, poll_options(id, label, position, poll_votes(count))"
    )
    .order("created_at", { ascending: false })
    .order("position", { foreignTable: "poll_options", ascending: true })
    .range(offset, offset + limit); // inclusive → asks for limit + 1 rows

  if (error) throw new Error(error.message);

  const rows = (data ?? []).map(mapPoll);

  const hasMore = rows.length > limit; // got the extra row? there's a next page
  return { polls: rows.slice(0, limit), hasMore };
}

export async function getPoll(id: string): Promise<Poll | null> {
  const { data, error } = await supabase
    .from("polls")
    .select(
      "id, question, author, created_at, poll_options(id, label, position, poll_votes(count))"
    )
    .order("position", { foreignTable: "poll_options", ascending: true })
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapPoll(data) : null;
}

// Shape the nested Supabase response into a flat, UI-friendly Poll.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPoll(p: any): Poll {
  const options: PollOption[] = (p.poll_options ?? [])
    .slice()
    .sort((a: any, b: any) => a.position - b.position)
    .map((o: any) => ({
      id: o.id,
      label: o.label,
      votes: o.poll_votes?.[0]?.count ?? 0,
    }));

  return {
    id: p.id,
    question: p.question,
    author: p.author,
    totalVotes: options.reduce((sum, o) => sum + o.votes, 0),
    options,
  };
}
