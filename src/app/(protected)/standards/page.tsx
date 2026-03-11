'use client';

import { Plus, Search, Trash2, X } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import {
  type Difficulty,
  type IJazzStandard,
  JAZZ_STANDARDS,
  type JazzFeel,
} from '@/data/standards';
import {
  addCustomStandard,
  deleteCustomStandard,
  getCustomStandards,
} from '@/services/customStandards';
import * as Dialog from '@radix-ui/react-dialog';

const FEEL_LABELS: Record<JazzFeel, string> = {
  swing: 'Swing',
  bossa: 'Bossa Nova',
  ballad: 'Ballad',
  latin: 'Latin',
  waltz: 'Waltz',
  funk: 'Funk',
};

const ALL_FEELS: JazzFeel[] = ['swing', 'bossa', 'ballad', 'latin', 'waltz', 'funk'];
const DIFFICULTIES: Difficulty[] = ['beginner', 'intermediate', 'advanced'];

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  beginner: 'text-emerald-400',
  intermediate: 'text-amber-400',
  advanced: 'text-rose-400',
};

const EMPTY_FORM = {
  title: '',
  composer: '',
  year: new Date().getFullYear(),
  key: '',
  feel: [] as JazzFeel[],
  tempoMin: 80,
  tempoMax: 200,
  difficulty: 'intermediate' as Difficulty,
  progression: '',
  tags: '',
};

export default function StandardsPage() {
  const { user } = useAuth();

  const [customStandards, setCustomStandards] = useState<IJazzStandard[]>([]);
  const [loadingCustom, setLoadingCustom] = useState(true);

  const [search, setSearch] = useState('');
  const [feelFilter, setFeelFilter] = useState<JazzFeel | 'all'>('all');
  const [diffFilter, setDiffFilter] = useState<Difficulty | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'builtin' | 'custom'>('all');
  const [selected, setSelected] = useState<IJazzStandard | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [isPending, startTransition] = useTransition();

  // Load custom standards
  useEffect(() => {
    async function load() {
      try {
        if (user) {
          const standards = await getCustomStandards(user.uid);
          setCustomStandards(standards);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCustom(false);
      }
    }
    void load();
  }, [user]);

  // Merge built-ins + custom
  const allStandards: IJazzStandard[] = [
    ...JAZZ_STANDARDS.map((s) => ({ ...s, source: 'builtin' as const })),
    ...customStandards,
  ];

  const filtered = allStandards.filter((s) => {
    const matchSearch =
      !search ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.composer.toLowerCase().includes(search.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchFeel = feelFilter === 'all' || s.feel.includes(feelFilter);
    const matchDiff = diffFilter === 'all' || s.difficulty === diffFilter;
    const matchSource = sourceFilter === 'all' || s.source === sourceFilter;
    return matchSearch && matchFeel && matchDiff && matchSource;
  });

  function toggleFeel(feel: JazzFeel) {
    setForm((f) => ({
      ...f,
      feel: f.feel.includes(feel) ? f.feel.filter((x) => x !== feel) : [...f.feel, feel],
    }));
  }

  function handleAddStandard() {
    if (!user) return;
    if (!form.title.trim()) {
      setFormError('Title is required.');
      return;
    }
    if (!form.key.trim()) {
      setFormError('Key is required.');
      return;
    }
    if (form.feel.length === 0) {
      setFormError('Select at least one feel.');
      return;
    }

    startTransition(async () => {
      try {
        const newId = await addCustomStandard(user.uid, {
          title: form.title.trim(),
          composer: form.composer.trim() || 'Unknown',
          year: form.year,
          key: form.key.trim(),
          feel: form.feel,
          tempoRange: [form.tempoMin, form.tempoMax],
          difficulty: form.difficulty,
          progression: form.progression.trim(),
          tags: form.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
        });
        const newStandard: IJazzStandard = {
          id: newId,
          title: form.title.trim(),
          composer: form.composer.trim() || 'Unknown',
          year: form.year,
          key: form.key.trim(),
          feel: form.feel,
          tempoRange: [form.tempoMin, form.tempoMax],
          difficulty: form.difficulty,
          progression: form.progression.trim(),
          tags: form.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
          source: 'custom',
        };
        setCustomStandards((prev) => [newStandard, ...prev]);
        setDialogOpen(false);
        setForm(EMPTY_FORM);
        setFormError('');
      } catch (err) {
        console.error(err);
        setFormError('Failed to save. Please try again.');
      }
    });
  }

  function handleDelete(standard: IJazzStandard) {
    if (!user || standard.source !== 'custom') return;
    startTransition(async () => {
      try {
        await deleteCustomStandard(user.uid, standard.id);
        setCustomStandards((prev) => prev.filter((s) => s.id !== standard.id));
        if (selected?.id === standard.id) setSelected(null);
      } catch (err) {
        console.error(err);
      }
    });
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Jazz Standards Library</h1>
          <p className="text-[var(--muted-foreground)] mt-1 text-sm">
            {JAZZ_STANDARDS.length} built-in · {customStandards.length} custom
          </p>
        </div>

        {user && (
          <Dialog.Root
            open={dialogOpen}
            onOpenChange={(o) => {
              setDialogOpen(o);
              if (!o) {
                setForm(EMPTY_FORM);
                setFormError('');
              }
            }}
          >
            <Dialog.Trigger asChild>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--accent)] text-[var(--accent-foreground)] text-sm font-medium hover:opacity-90 transition-opacity flex-shrink-0">
                <Plus className="w-4 h-4" /> Add Standard
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/60 z-50" />
              <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6 shadow-xl">
                <div className="flex items-center justify-between mb-5">
                  <Dialog.Title className="text-lg font-bold text-[var(--foreground)]">
                    Add Custom Standard
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide block mb-1.5">
                      Title *
                    </label>
                    <input
                      value={form.title}
                      onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                      placeholder="e.g. My Favourite Things"
                      className="w-full px-3 py-2.5 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--accent)] placeholder:text-[var(--muted-foreground)]"
                    />
                  </div>

                  {/* Composer + Year */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide block mb-1.5">
                        Composer
                      </label>
                      <input
                        value={form.composer}
                        onChange={(e) => setForm((f) => ({ ...f, composer: e.target.value }))}
                        placeholder="e.g. Coltrane"
                        className="w-full px-3 py-2.5 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--accent)] placeholder:text-[var(--muted-foreground)]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide block mb-1.5">
                        Year
                      </label>
                      <input
                        type="number"
                        value={form.year}
                        onChange={(e) => setForm((f) => ({ ...f, year: Number(e.target.value) }))}
                        className="w-full px-3 py-2.5 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--accent)]"
                      />
                    </div>
                  </div>

                  {/* Key */}
                  <div>
                    <label className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide block mb-1.5">
                      Key *
                    </label>
                    <input
                      value={form.key}
                      onChange={(e) => setForm((f) => ({ ...f, key: e.target.value }))}
                      placeholder="e.g. F major"
                      className="w-full px-3 py-2.5 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--accent)] placeholder:text-[var(--muted-foreground)]"
                    />
                  </div>

                  {/* Feel */}
                  <div>
                    <label className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide block mb-1.5">
                      Feel * <span className="normal-case font-normal">(pick one or more)</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {ALL_FEELS.map((feel) => (
                        <button
                          key={feel}
                          type="button"
                          onClick={() => toggleFeel(feel)}
                          className={`px-3 py-1 rounded-full text-xs capitalize transition-colors ${
                            form.feel.includes(feel)
                              ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
                              : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]'
                          }`}
                        >
                          {FEEL_LABELS[feel]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide block mb-1.5">
                      Difficulty
                    </label>
                    <div className="flex gap-2">
                      {DIFFICULTIES.map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, difficulty: d }))}
                          className={`flex-1 py-2 rounded-lg text-xs capitalize transition-colors ${
                            form.difficulty === d
                              ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
                              : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tempo */}
                  <div>
                    <label className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide block mb-1.5">
                      Tempo Range (BPM)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted-foreground)]">
                          Min
                        </span>
                        <input
                          type="number"
                          value={form.tempoMin}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, tempoMin: Number(e.target.value) }))
                          }
                          className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--accent)]"
                        />
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted-foreground)]">
                          Max
                        </span>
                        <input
                          type="number"
                          value={form.tempoMax}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, tempoMax: Number(e.target.value) }))
                          }
                          className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--accent)]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Chord progression */}
                  <div>
                    <label className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide block mb-1.5">
                      Chord Progression
                    </label>
                    <textarea
                      value={form.progression}
                      onChange={(e) => setForm((f) => ({ ...f, progression: e.target.value }))}
                      placeholder="e.g. FΔ7 | Am7 | Dm7 | G7 …"
                      rows={3}
                      className="w-full px-3 py-2.5 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] text-sm font-mono focus:outline-none focus:border-[var(--accent)] placeholder:text-[var(--muted-foreground)] resize-none"
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide block mb-1.5">
                      Tags <span className="normal-case font-normal">(comma-separated)</span>
                    </label>
                    <input
                      value={form.tags}
                      onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                      placeholder="e.g. ii-V-I, modal, Coltrane"
                      className="w-full px-3 py-2.5 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--accent)] placeholder:text-[var(--muted-foreground)]"
                    />
                  </div>

                  {formError && <p className="text-sm text-[var(--destructive)]">{formError}</p>}

                  <div className="flex gap-3 pt-1">
                    <Dialog.Close asChild>
                      <button className="flex-1 py-2.5 rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] text-sm hover:border-[var(--muted-foreground)] transition-colors">
                        Cancel
                      </button>
                    </Dialog.Close>
                    <button
                      onClick={handleAddStandard}
                      disabled={isPending}
                      className="flex-1 py-2.5 rounded-lg bg-[var(--accent)] text-[var(--accent-foreground)] text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
                    >
                      {isPending ? 'Saving…' : 'Save Standard'}
                    </button>
                  </div>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        )}
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-5 mt-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, composer, tag…"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--accent)] placeholder:text-[var(--muted-foreground)]"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-2">
        <span className="text-xs text-[var(--muted-foreground)] self-center mr-1">Feel:</span>
        {(['all', 'swing', 'bossa', 'ballad', 'latin', 'waltz'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFeelFilter(f)}
            className={`px-3 py-1 rounded-full text-xs capitalize transition-colors ${
              feelFilter === f
                ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
                : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]'
            }`}
          >
            {f === 'all' ? 'All' : FEEL_LABELS[f]}
          </button>
        ))}
        <span className="text-xs text-[var(--muted-foreground)] self-center ml-2 mr-1">Level:</span>
        {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((d) => (
          <button
            key={d}
            onClick={() => setDiffFilter(d)}
            className={`px-3 py-1 rounded-full text-xs capitalize transition-colors ${
              diffFilter === d
                ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
                : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]'
            }`}
          >
            {d === 'all' ? 'All' : d}
          </button>
        ))}
        {customStandards.length > 0 && (
          <>
            <span className="text-xs text-[var(--muted-foreground)] self-center ml-2 mr-1">
              Source:
            </span>
            {(['all', 'builtin', 'custom'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSourceFilter(s)}
                className={`px-3 py-1 rounded-full text-xs capitalize transition-colors ${
                  sourceFilter === s
                    ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
                    : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]'
                }`}
              >
                {s === 'all' ? 'All' : s === 'builtin' ? 'Built-in' : 'My Standards'}
              </button>
            ))}
          </>
        )}
      </div>

      <p className="text-xs text-[var(--muted-foreground)] mb-4">
        {loadingCustom ? 'Loading…' : `${filtered.length} results`}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((standard) => (
          <div
            key={standard.id}
            className={`relative group rounded-xl border transition-colors ${
              selected?.id === standard.id
                ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted-foreground)]'
            }`}
          >
            <button
              className="w-full text-left p-5"
              onClick={() => setSelected(selected?.id === standard.id ? null : standard)}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <h3 className="font-semibold text-[var(--foreground)] text-sm truncate">
                    {standard.title}
                  </h3>
                  {standard.source === 'custom' && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--accent)]/20 text-[var(--accent)] font-medium flex-shrink-0">
                      Mine
                    </span>
                  )}
                </div>
                <span
                  className={`text-xs font-medium capitalize flex-shrink-0 ${DIFFICULTY_COLORS[standard.difficulty]}`}
                >
                  {standard.difficulty}
                </span>
              </div>
              <p className="text-xs text-[var(--muted-foreground)] mb-2">
                {standard.composer} · {standard.year} ·{' '}
                <strong className="text-[var(--foreground)]">{standard.key}</strong>
              </p>
              <div className="flex flex-wrap gap-1 mb-1">
                {standard.feel.map((f) => (
                  <span
                    key={f}
                    className="text-xs px-2 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]"
                  >
                    {FEEL_LABELS[f]}
                  </span>
                ))}
                <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">
                  {standard.tempoRange[0]}–{standard.tempoRange[1]} BPM
                </span>
              </div>

              {selected?.id === standard.id && (
                <div className="mt-3 pt-3 border-t border-[var(--border)]">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">
                    Chord Progression
                  </p>
                  {standard.progression ? (
                    <p className="font-mono text-sm text-[var(--foreground)] bg-[var(--muted)] rounded-lg p-3 leading-relaxed">
                      {standard.progression}
                    </p>
                  ) : (
                    <p className="text-xs text-[var(--muted-foreground)] italic">
                      No progression added.
                    </p>
                  )}
                  {standard.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {standard.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded bg-[var(--muted)] text-[var(--muted-foreground)]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </button>

            {/* Delete button — only for custom standards */}
            {standard.source === 'custom' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(standard);
                }}
                disabled={isPending}
                title="Delete this standard"
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-[var(--muted-foreground)] hover:text-[var(--destructive)] hover:bg-[var(--muted)] transition-all disabled:opacity-30"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && !loadingCustom && (
        <div className="text-center py-16 text-[var(--muted-foreground)]">
          <p className="text-sm">No standards match your filters.</p>
          {user && (
            <p className="text-xs mt-2">
              Can&apos;t find what you need?{' '}
              <button
                onClick={() => setDialogOpen(true)}
                className="text-[var(--accent)] hover:underline"
              >
                Add your own
              </button>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
