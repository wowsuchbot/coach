'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/Toast';
import { AuthGuard } from '@/components/AuthGuard';
import { EmptyState } from '@/components/EmptyState';
import { PriorityBadge } from '@/components/StatusBadge';
import { TypeBadge } from '@/components/TypeBadge';
import { Tasks } from '@/components/Tasks';
import { useFormState } from '@/hooks/useFormState';
import { Globe, FolderKanban, Target, Plus, ArrowLeft, Trash2, Edit } from 'lucide-react';
import { button, input, card } from '@/lib/design-tokens';

interface ChildGoal {
  id: number;
  title: string;
  description: string | null;
  type: string;
  status: string;
  priority: number;
  created_at: string;
}

interface DomainDetailProps {
  params: { id: string };
}

export default function DomainDetail({ params }: DomainDetailProps) {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { showToast } = useToast();
  const [domain, setDomain] = useState<any>(null);
  const [children, setChildren] = useState<ChildGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGoalForm, setShowGoalForm] = useState(false);

  const {
    formData,
    updateField,
    reset,
    handleSubmit,
    isSubmitting,
  } = useFormState({
    title: '',
    description: '',
    type: 'project',
    priority: 2,
    parent_goal_id: params.id
  }, {
    validate: (data) => {
      const errs: Record<string, string> = {};
      if (!data.title.trim()) errs.title = 'Title is required';
      if (data.title.length > 100) errs.title = 'Title must be 100 characters or less';
      return errs;
    }
  });

  const fetchDomain = async () => {
    try {
      const response = await fetch('/api/goals');
      if (response.ok) {
        const goals = await response.json();
        const targetId = parseInt(params.id);
        console.log('Domain page: params.id =', params.id, 'targetId =', targetId);
        console.log('All goals:', goals.map((g: any) => ({id: g.id, type: g.type, title: g.title})));

        const domainData = goals.find((g: any) => g.id === targetId);

        console.log('Found domain:', domainData);

        if (domainData) {
          setDomain(domainData);
          const childGoals = goals.filter((g: any) => g.parent_goal_id === targetId);
          console.log('Child goals:', childGoals);
          setChildren(childGoals);
        } else {
          showToast('Domain not found', 'error');
          router.push('/dashboard');
        }
      }
    } catch (error) {
      console.error('Error fetching domain:', error);
      showToast('Failed to load domain', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchDomain();
    } else {
      setLoading(false);
    }
  }, [isConnected, params.id]);

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

    if (!response.ok) throw new Error('Failed to create item');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(onSubmit, () => {
      setShowGoalForm(false);
      reset();
      fetchDomain();
      showToast('Item added to domain!', 'success');
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
          Loading domain...
        </div>
      ) : !domain ? (
        <EmptyState
          title="Domain not found"
          description="This domain may have been deleted."
        />
      ) : (
        <div>
          {/* Breadcrumb */}
          <nav className="mb-6" aria-label="Breadcrumb">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Back to Dashboard
            </Link>
          </nav>

          {/* Domain Header */}
          <div className={`mb-8 ${card.base} p-6`}>
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {typeIcon(domain.type)}
                  <h1 className="text-2xl font-bold">{domain.title}</h1>
                  <TypeBadge type={domain.type} />
                </div>
                {domain.description && (
                  <p className="text-gray-400">{domain.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <PriorityBadge priority={domain.priority} />
                <button
                  onClick={() => router.push(`/goals/${domain.id}`)}
                  className="p-2 hover:bg-gray-700 rounded transition-colors"
                  aria-label="Edit domain"
                >
                  <Edit className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Add Item Form */}
          <section className="mb-8" aria-labelledby="add-item-heading">
            <h2 id="add-item-heading" className="sr-only">Add item to domain</h2>
            <button
              onClick={() => setShowGoalForm(!showGoalForm)}
              aria-expanded={showGoalForm}
              className={`${button.primary} flex items-center gap-2`}
            >
              {showGoalForm ? 'Cancel' : (
                <>
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  Add to {domain.title}
                </>
              )}
            </button>

            {showGoalForm && (
              <form onSubmit={handleFormSubmit} className={`mt-4 ${card.base} p-4`}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="child-title" className="sr-only">Title</label>
                    <input
                      id="child-title"
                      type="text"
                      value={formData.title}
                      onChange={(e) => updateField('title', e.target.value)}
                      className={input.base}
                      placeholder="Project or practice name"
                      required
                      autoFocus
                    />
                  </div>
                  <div>
                    <label htmlFor="child-description" className="sr-only">Description</label>
                    <textarea
                      id="child-description"
                      value={formData.description}
                      onChange={(e) => updateField('description', e.target.value)}
                      className={input.base}
                      rows={2}
                      placeholder="Optional description"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="child-type" className="sr-only">Type</label>
                      <select
                        id="child-type"
                        value={formData.type}
                        onChange={(e) => updateField('type', e.target.value)}
                        className={input.base}
                      >
                        <option value="project">Project</option>
                        <option value="practice">Practice</option>
                        <option value="experiment">Experiment</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="child-priority" className="sr-only">Priority</label>
                      <select
                        id="child-priority"
                        value={formData.priority}
                        onChange={(e) => updateField('priority', parseInt(e.target.value))}
                        className={input.base}
                      >
                        <option value={1}>High</option>
                        <option value={2}>Medium</option>
                        <option value={3}>Low</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" disabled={isSubmitting} className={button.primary}>
                    {isSubmitting ? 'Adding...' : 'Add Item'}
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* Child Goals */}
          <section aria-labelledby="children-heading">
            <h2 id="children-heading" className="text-xl font-bold mb-4">
              {children.length > 0 ? `Projects & Practices (${children.length})` : 'No items yet'}
            </h2>
            {children.length === 0 ? (
              <EmptyState
                icon={<FolderKanban className="w-8 h-8 text-purple-500" />}
                title="This domain is empty"
                description="Add your first project or practice above."
              />
            ) : (
              <div className="space-y-3">
                {children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => router.push(`/goals/${child.id}`)}
                    className={`w-full text-left ${card.base} hover:border-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {typeIcon(child.type)}
                        <div className="min-w-0">
                          <h3 className="font-medium text-white truncate">{child.title}</h3>
                          {child.description && (
                            <p className="text-sm text-gray-400 truncate">{child.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <TypeBadge type={child.type} />
                        <PriorityBadge priority={child.priority} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Tasks linked to this domain */}
          <section className="mt-8" aria-labelledby="tasks-heading">
            <h2 id="tasks-heading" className="text-xl font-bold mb-4">
              Tasks
            </h2>
            <Tasks domainFilter={parseInt(params.id)} />
          </section>
        </div>
      )}
    </AuthGuard>
  );
}
