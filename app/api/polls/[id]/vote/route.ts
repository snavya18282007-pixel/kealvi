import { supabase } from "@/lib/supabase";

// One vote per voter per poll. We don't check-then-insert (that races); we
// insert and let the unique(poll_id, voter_id) constraint be the referee.
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: pollId } = await params;
  const { voterId, optionId } = await req.json();

  if (!voterId || !optionId) {
    return Response.json(
      { error: "voterId and optionId are required" },
      { status: 400 }
    );
  }

  // Guard: the option must actually belong to this poll.
  const { data: option, error: optionError } = await supabase
    .from("poll_options")
    .select("id")
    .eq("id", optionId)
    .eq("poll_id", pollId)
    .maybeSingle();

  if (optionError)
    return Response.json({ error: optionError.message }, { status: 500 });
  if (!option)
    return Response.json(
      { error: "option does not belong to this poll" },
      { status: 400 }
    );

  const { error } = await supabase
    .from("poll_votes")
    .insert({ poll_id: pollId, option_id: optionId, voter_id: voterId });

  if (error) {
    if (error.code === "23505") {
      // unique violation → this voter already voted on this poll
      return Response.json({ error: "already voted" }, { status: 409 });
    }
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}
