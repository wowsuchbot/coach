'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { useToast } from '@/components/Toast';
import { AuthGuard } from '@/components/AuthGuard';
import { EmptyState } from '@/components/EmptyState';
import { useFormState } from '@/hooks/useFormState';
import { 
  Inbox, 
  FolderKanban, 
  Target, 
  Clock, 
  Plus, 
  ArrowRight,
  Lightbulb,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { button, input, card } from '@/lib/design-tokens';

interface InboxItem {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  status: string;
  created_at: string;
}

export default function InboxPage() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { showToast } = useToast();
  const [items, setItems] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const {
    formData,
    updateField,
    reset,
    handleSubmit,
    isSubmitting,
  } = useFormState({
    title: '',
    description: '',
    category: ''
  }, {
    validate: (data) => {
      const errs: Record<string, string> = {};
      if (!data.title.trim()) errs.title = 'Title is required';
      return errs;
    }
  });

  const fetchInbox = async () => {
    try {
      const response = await fetch('/api/goals');
      if (response.ok) {
        const data = await response.json();
        const inboxItems = data.filter((g: InboxItem) => 
          !g.category || g.category === 'inbox' || g.status === 'inbox'
        );
        setItems(inboxItems);
      }
    } catch (error) {
      console.error('Error fetching inbox:', error);
      showToast('Failed to load inbox', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchInbox();
    } else {
      setLoading(false);
    }
  }, [isConnected]);

  const onSubmit = async (data: typeof formData) => {
    const response = await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        status: 'inbox',
        priority: 3
      }),
    });

    if (!response.ok) throw new Error('Failed to capture item');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(onSubmit, () => {
      setShowForm(false);
      reset();
      fetchInbox();
      showToast('Item captured!', 'success');
    });
  };

  const categorizeItem = async (id: number, category: string) => {
    try {
      const response = await fetch(`/api/goals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          category, 
          status: 'active' 
        }),
      });

      if (response.ok) {
        fetchInbox();
        showToast(`Moved to ${category}`, 'success');
      }
    } catch (error) {
      console.error('Error categorizing item:', error);
      showToast('Failed to categorize item', 'error');
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center max-w-md">
              <h1 className="mb-4 text-2xl sm:text-4xl font-bold">Connect Your Wallet</h1>
              <p className="mb-8 text-lg text-gray-400">
                Use the Connect button to access your inbox
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <Inbox className="w-8 h-8 text-blue-400" aria-hidden="true" />
            GTD Inbox
          </h1>
          <p className="mt-2 text-gray-400">
            Capture everything here first. Categorize later.
          </p>
        </div>

        {/* Quick Add Form */}
        <section className={`mb-8 ${card.base}`} aria-labelledby="capture-heading">
          <h2 id="capture-heading" className="sr-only">Quick Capture</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            aria-expanded={showForm}
            aria-controls="capture-form"
            aria-label={showForm ? 'Cancel capture' : 'Quick capture new item'}
            className={`${button.primary} flex items-center gap-2`}
          >
            {showForm ? 'Cancel' : (
              <>
                <Plus className="w-4 h-4" aria-hidden="true" />
                Quick Capture
              </>
            )}
          </button>

          {showForm && (
            <form 
              id="capture-form"
              onSubmit={handleFormSubmit} 
              className="mt-4 space-y-4"
              aria-label="Capture new item"
            >
              <div>
                <label htmlFor="inbox-title" className="sr-only">What&apos;s on your mind?</label>
                <input
                  id="inbox-title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  className={input.base}
                  placeholder="What&apos;s on your mind?"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label htmlFor="inbox-description" className="sr-only">Optional notes</label>
                <textarea
                  id="inbox-description"
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  className={input.base}
                  rows={2}
                  placeholder="Optional notes"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`${button.primary} bg-green-600 hover:bg-green-700`}
              >
                {isSubmitting ? 'Capturing...' : 'Capture to Inbox'}
              </button>
            </form>
          )}
        </section>

        {/* Inbox Items */}
        <AuthGuard
          loading={<div className="text-center text-gray-400">Loading...</div>}
        >
          {loading ? (
            <div className="text-center text-gray-400" role="status" aria-live="polite">
              Loading inbox...
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              icon={<CheckCircle className="w-8 h-8 text-green-500" />}
              title="Inbox zero!"
              description="You've processed everything. Capture anything on your mind using the button above."
            />
          ) : (
            <ul className="space-y-4" role="list" aria-label="Inbox items">
              {items.map((item) => (
                <li key={item.id}>
                  <article className="rounded-lg border border-gray-800 bg-gray-900 p-4">
                    <div className="mb-3">
                      <h3 className="font-medium text-white">{item.title}</h3>
                      {item.description && (
                        <p className="mt-1 text-sm text-gray-400">{item.description}</p>
                      )}
                      <p className="mt-2 text-xs text-gray-500">
                        <time dateTime={item.created_at}>
                          Captured: {new Date(item.created_at).toLocaleDateString()}
                        </time>
                      </p>
                    </div>

                    {/* Quick Categorize Buttons */}
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-xs text-gray-400 self-center mr-1">Categorize as:</span>
                      <button
                        onClick={() => categorizeItem(item.id, 'projects')}
                        className="rounded bg-purple-900/50 px-3 py-1.5 text-xs text-purple-300 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center gap-1.5"
                        aria-label="Move to Projects"
                      >
                        <FolderKanban className="w-3.5 h-3.5" aria-hidden="true" />
                        Project
                      </button>
                      <button
                        onClick={() => categorizeItem(item.id, 'personal')}
                        className="rounded bg-green-900/50 px-3 py-1.5 text-xs text-green-300 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center gap-1.5"
                        aria-label="Move to Personal"
                      >
                        <Target className="w-3.5 h-3.5" aria-hidden="true" />
                        Personal
                      </button>
                      <button
                        onClick={() => categorizeItem(item.id, 'timebound')}
                        className="rounded bg-orange-900/50 px-3 py-1.5 text-xs text-orange-300 hover:bg-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-500 flex items-center gap-1.5"
                        aria-label="Move to Time-Bound"
                      >
                        <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                        Time-Bound
                      </button>
                      <button
                        onClick={() => router.push(`/goals/${item.id}`)}
                        className="rounded bg-gray-700 px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        aria-label={`Edit ${item.title}`}
                      >
                        Edit →
                      </button>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </AuthGuard>

        {/* GTD Flow Info */}
        <aside className="mt-8 rounded-lg border border-gray-800 bg-gray-900/30 p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" aria-hidden="true" />
            Getting Things Done Flow
          </h2>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Inbox className="w-4 h-4 text-blue-400" aria-hidden="true" />
              <span>Inbox</span>
            </div>
            <ArrowRight className="w-4 h-4 hidden sm:block" aria-hidden="true" />
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-400" aria-hidden="true" />
              <span>Thought</span>
            </div>
            <ArrowRight className="w-4 h-4 hidden sm:block" aria-hidden="true" />
            <div className="flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-purple-400" aria-hidden="true" />
              <span>Project</span>
            </div>
            <ArrowRight className="w-4 h-4 hidden sm:block" aria-hidden="true" />
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" aria-hidden="true" />
              <span>Task</span>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            The act of categorizing IS the clarity. Everything starts in inbox.
          </p>
        </aside>
      </main>
    </div>
  );
}
