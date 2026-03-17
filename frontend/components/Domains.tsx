'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/Toast';
import { AuthGuard } from '@/components/AuthGuard';
import { EmptyState } from '@/components/EmptyState';
import { PriorityBadge } from '@/components/StatusBadge';
import { TypeBadge } from '@/components/TypeBadge';
import { useFormState } from '@/hooks/useFormState';
import { Globe, FolderKanban, Target, Plus, Flag, ChevronRight } from 'lucide-react';
import { button, input, card } from '@/lib/design-tokens';

interface Domain {
  id: number;
  title: string;
  description: string | null;
  type: string;
  status: string;
  priority: number;
  child_count: number;
}

interface StandaloneItem {
  id: number;
  title: string;
  type: string;
  description: string | null;
  priority: number;
  status: string;
}

export function Domains() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { showToast } = useToast();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [standaloneItems, setStandaloneItems] = useState<StandaloneItem[]>([]);
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
    type: 'domain',
    priority: 1
  }, {
    validate: (data) => {
      const errs: Record<string, string> = {};
      if (!data.title.trim()) errs.title = 'Title is required';
      if (data.title.length > 100) errs.title = 'Title must be 100 characters or less';
      return errs;
    }
  });

  const fetchDomains = async () => {
    try {
      const [goalsRes, tasksRes] = await Promise.all([
        fetch('/api/goals'),
        fetch('/api/tasks')
      ]);

      if (goalsRes.ok) {
        const goals = await goalsRes.json();
        const tasks = tasksRes.ok ? await tasksRes.json() : [];

        // Domains (type = 'domain' and no parent)
        const domainGoals = goals.filter((g: any) =>
          g.type === 'domain' && !g.parent_goal_id
        );

        // Count children for each domain
        const domainsWithCounts = domainGoals.map((domain: any) => ({
          ...domain,
          child_count: goals.filter((g: any) => g.parent_goal_id === domain.id).length +
                        tasks.filter((t: any) => t.goal_id === domain.id).length
        }));

        setDomains(domainsWithCounts);

        // Standalone items (no parent, not domain type)
        const standalone = goals.filter((g: any) =>
          !g.parent_goal_id && g.type !== 'domain' && g.type !== 'inbox'
        );
        setStandaloneItems(standalone);
      }
    } catch (error) {
      console.error('Error fetching domains:', error);
      showToast('Failed to load domains', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchDomains();
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
        category: 'projects',
        status: 'active'
      }),
    });

    if (!response.ok) throw new Error('Failed to create domain');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(onSubmit, () => {
      setShowForm(false);
      reset();
      fetchDomains();
      showToast('Domain created!', 'success');
    });
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case 'domain': return <Globe className="w-5 h-5 text-blue-400" />;
      case 'project': return <FolderKanban className="w-5 h-5 text-purple-400" />;
      case 'practice': return <Target className="w-5 h-5 text-green-400" />;
      default: return <Target className="w-5 h-5 text-gray-400" />;
    }
  };

  if (!isConnected) {
    return null;
  }

  return (
    <AuthGuard loading={<div className="text-center text-gray-400">Loading...</div>}>
      {loading ? (
        <div className="text-center text-gray-400" role="status" aria-live="polite">
          Loading domains...
        </div>
      ) : (
        <>
          {/* Domains Section */}
          <section className="mb-8" aria-labelledby="domains-heading">
            <div className="flex items-center justify-between mb-4">
              <h2 id="domains-heading" className="text-xl font-bold flex items-center gap-2">
                <Globe className="w-6 h-6 text-blue-400" aria-hidden="true" />
                Your Domains
              </h2>
              <button
                onClick={() => setShowForm(!showForm)}
                aria-expanded={showForm}
                className={`${button.primary} flex items-center gap-2`}
              >
                {showForm ? 'Cancel' : (
                  <>
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    New Domain
                  </>
                )}
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleFormSubmit} className={`mb-6 ${card.base} p-4`}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="domain-title" className="sr-only">Domain name</label>
                    <input
                      id="domain-title"
                      type="text"
                      value={formData.title}
                      onChange={(e) => updateField('title', e.target.value)}
                      className={input.base}
                      placeholder="Domain name (e.g., cryptoart.social)"
                      required
                      autoFocus
                    />
                  </div>
                  <div>
                    <label htmlFor="domain-description" className="sr-only">Description</label>
                    <textarea
                      id="domain-description"
                      value={formData.description}
                      onChange={(e) => updateField('description', e.target.value)}
                      className={input.base}
                      rows={2}
                      placeholder="Optional description"
                    />
                  </div>
                  <button type="submit" disabled={isSubmitting} className={button.primary}>
                    {isSubmitting ? 'Creating...' : 'Create Domain'}
                  </button>
                </div>
              </form>
            )}

            {domains.length === 0 ? (
              <EmptyState
                icon={<Globe className="w-8 h-8 text-blue-500" />}
                title="No domains yet"
                description="Create your first domain to organize your work."
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {domains.map((domain) => (
                  <button
                    key={domain.id}
                    onClick={() => router.push(`/domains/${domain.id}`)}
                    className={`text-left ${card.base} hover:border-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {typeIcon(domain.type)}
                          <h3 className="font-semibold text-white truncate">{domain.title}</h3>
                        </div>
                        {domain.description && (
                          <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                            {domain.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-400">
                            {domain.child_count} {domain.child_count === 1 ? 'item' : 'items'}
                          </span>
                          <PriorityBadge priority={domain.priority} />
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" aria-hidden="true" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Standalone Items Section */}
          {standaloneItems.length > 0 && (
            <section aria-labelledby="standalone-heading">
              <h2 id="standalone-heading" className="text-xl font-bold mb-4">
                Standalone Items
              </h2>
              <div className="space-y-3">
                {standaloneItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => router.push(`/goals/${item.id}`)}
                    className={`w-full text-left ${card.base} hover:border-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {typeIcon(item.type)}
                        <div className="min-w-0">
                          <h3 className="font-medium text-white truncate">{item.title}</h3>
                          {item.description && (
                            <p className="text-sm text-gray-400 truncate">{item.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <TypeBadge type={item.type} />
                        <PriorityBadge priority={item.priority} />
                        <ChevronRight className="w-5 h-5 text-gray-500" aria-hidden="true" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </AuthGuard>
  );
}
