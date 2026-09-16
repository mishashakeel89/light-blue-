import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Message = {
  id: string;
  name: string;
  message: string;
  created_at: string;
};

const PAGE_SIZE = 10;
const MAX_MESSAGES = 50;
const MAX_CHARS = 250;

export function Guestbook({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFull = total >= MAX_MESSAGES;

  const loadPage = async (nextPage: number, replace = false) => {
    setLoading(true);
    const from = nextPage * PAGE_SIZE;
    const { data, count, error: err } = await supabase
      .from("guestbook_messages")
      .select("id,name,message,created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, from + PAGE_SIZE - 1);

    if (err) {
      setError("We could not load the messages right now.");
      setLoading(false);
      return;
    }
    const rows = (data ?? []) as Message[];
    setTotal(count ?? 0);
    setMessages((prev) => (replace ? rows : [...prev, ...rows]));
    setPage(nextPage);
    setLoading(false);
  };

  const hasMore = messages.length < total;

  useEffect(() => {
    void loadPage(0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !note.trim() || sending) return;
    setSending(true);
    setError(null);

    const { count } = await supabase
      .from("guestbook_messages")
      .select("id", { count: "exact", head: true });
    if ((count ?? 0) >= MAX_MESSAGES) {
      setTotal(count ?? MAX_MESSAGES);
      setSending(false);
      setError("The guestbook is currently full");
      return;
    }

    const { error: err } = await supabase.from("guestbook_messages").insert({
      name: name.trim().slice(0, 80),
      message: note.trim().slice(0, MAX_CHARS),
    });
    setSending(false);
    if (err) {
      setError("Your message could not be saved. Please try again.");
      return;
    }
    setName("");
    setNote("");
    await loadPage(0, true);
  };

  return (
    <div
      data-no-sparks
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-3 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative mx-auto flex max-h-[88vh] w-full max-w-[92%] flex-col overflow-hidden rounded-2xl border border-[#B8860B]/60 bg-black/90 shadow-2xl backdrop-blur-xl sm:max-w-lg"
      >
        <button
          onClick={onClose}
          aria-label="Close guestbook"
          className="absolute right-3 top-3 rounded-full border border-[#B8860B]/60 p-1.5 text-[#F4F4F4] transition-colors hover:bg-[#B8860B]/10"
        >
          <X className="h-4 w-4" strokeWidth={2.5} />
        </button>

        <div className="px-6 pb-4 pt-7 text-center">
          <h2 className="font-script text-3xl text-[#F4F4F4]">Guestbook</h2>
          <p className="mt-1 font-body text-sm text-[#F4F4F4]/70">
            Leave your blessings for the couple
          </p>
        </div>

        <form onSubmit={submit} className="space-y-3 px-6">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            placeholder="Your name"
            className="w-full rounded-lg border border-[#B8860B]/50 bg-black/20 px-3 py-2 font-body text-sm text-[#F4F4F4] outline-none placeholder:text-[#F4F4F4]/60 focus:border-[#B8860B]"
          />
          <div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={MAX_CHARS}
              rows={3}
              placeholder="Your Blessing"
              className="w-full resize-none rounded-lg border border-[#B8860B]/50 bg-black/20 px-3 py-2 font-body text-sm text-[#F4F4F4] outline-none placeholder:text-[#F4F4F4]/60 focus:border-[#B8860B]"
            />
            <p className="mt-1 text-right font-body text-xs text-[#F4F4F4]/50">
              {note.length}/{MAX_CHARS}
            </p>
          </div>
          <button
            type="submit"
            disabled={sending || isFull}
            className="w-full rounded-lg bg-[#F4F4F4] px-4 py-2 font-body text-sm font-medium tracking-wide text-black transition-colors hover:bg-[#F4F4F4]/90 disabled:opacity-50"
          >
            {isFull ? "Guestbook Full" : sending ? "Sending" : "Send Blessing"}
          </button>
          {isFull ? (
            <p className="text-center font-body text-xs text-[#F4F4F4]/70">
              The guestbook is currently full
            </p>
          ) : null}
          {error ? (
            <p className="text-center font-body text-xs text-red-300">{error}</p>
          ) : null}
        </form>
<div className="mt-5 flex-1 space-y-3 overflow-y-auto px-6 pb-6">
          {messages.map((m) => (
            <div
              key={m.id}
              // FIXED: changed from #d29d98 to #B8860B below
              className="animate-in fade-in rounded-lg border border-[#B8860B]/40 bg-black/20 px-4 py-3 duration-700"
            >
              <p className="font-script text-xl text-[#F4F4F4]">{m.name}</p>
              <p className="mt-1 font-body text-sm leading-relaxed text-[#F4F4F4]/85">
                {m.message}
              </p>
            </div>
          ))}
          {!loading && messages.length === 0 ? (
            <p className="text-center font-body text-sm text-[#F4F4F4]/60">
              Be the first to leave a message
            </p>
          ) : null}
          {hasMore ? (
            <button
              onClick={() => void loadPage(page + 1)}
              disabled={loading}
              // FIXED: changed from #d29d98 to #B8860B below
              className="mx-auto block rounded-full border border-[#B8860B]/50 px-5 py-1.5 font-body text-xs tracking-widest text-[#F4F4F4] uppercase transition-colors hover:bg-[#B8860B]/10 disabled:opacity-50"
            >
              {loading ? "Loading" : "View More Blessings"}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
