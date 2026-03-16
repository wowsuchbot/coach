'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useToast } from '@/components/Toast';
import { AuthGuard } from '@/components/AuthGuard';
import { EmptyState } from '@/components/EmptyState';
import { useFormState } from '@/hooks/useFormState';
import { Plus, MessageCircle, Smile, Meh, Frown, Laugh } from 'lucide-react';
import { button, input, card } from '@/lib/design-tokens';

type Mood = 'great' | 'good' | 'okay' | 'struggling';

interface CheckIn {
  id: number;
  checkin_type: string;
  time: string;
  questions: string;
  responses: string;
  notes: string;
  created_at: string;
}

interface Question {
  id: number;
  question: string;
}

export function CheckIns() {
  const { isConnected } = useAccount();
  const { showToast } = useToast();
  const [checkins, setCheckins] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const questions: Question[] = [
    { id: 1, question: 'How are you feeling today?' },
    { id: 2, question: 'What did you accomplish?' },
    { id: 3, question: 'What are you working on?' },
    { id: 4, question: "What&apos;s blocking you?" },
    { id: 5, question: 'How can I help?' }
  ];

  const {
    formData,
    updateField,
    setMultipleFields,
    handleSubmit,
    isSubmitting,
    errors,
  } = useFormState({
    checkin_type: 'general',
    mood: 'good' as Mood,
    notes: '',
    responses: {} as Record<number, string>
  });

  const fetchCheckins = async () => {
    try {
      const response = await fetch('/api/checkins');
      if (response.ok) {
        const data = await response.json();
        setCheckins(data);
      }
    } catch (error) {
      console.error('Error fetching check-ins:', error);
      showToast('Failed to load check-ins', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchCheckins();
    } else {
      setLoading(false);
    }
  }, [isConnected]);

  const onSubmit = async (data: typeof formData) => {
    const response = await fetch('/api/checkins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        checkin_type: data.checkin_type,
        time: new Date().toISOString(),
        questions: questions,
        responses: data.responses,
        notes: `${data.mood} mood. ${data.notes}`
      }),
    });

    if (!response.ok) throw new Error('Failed to create check-in');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSubmit(onSubmit, () => {
      setShowForm(false);
      setMultipleFields({ checkin_type: 'general', mood: 'good', notes: '', responses: {} });
      fetchCheckins();
      showToast('Check-in submitted successfully', 'success');
    });
    if (!success && errors._form) {
      showToast(errors._form, 'error');
    }
  };

  const moodConfig: Record<Mood, { icon: React.ReactNode; color: string; label: string }> = {
    great: { icon: <Laugh className="w-6 h-6" />, color: 'text-green-400', label: 'Great' },
    good: { icon: <Smile className="w-6 h-6" />, color: 'text-blue-400', label: 'Good' },
    okay: { icon: <Meh className="w-6 h-6" />, color: 'text-yellow-400', label: 'Okay' },
    struggling: { icon: <Frown className="w-6 h-6" />, color: 'text-red-400', label: 'Struggling' },
  };

  return (
    <section className={card.base} aria-labelledby="checkins-heading">
      <div className="mb-4 flex items-center justify-between">
        <h2 id="checkins-heading" className="text-xl font-semibold text-white">Recent Check-ins</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          aria-expanded={showForm}
          aria-controls="checkin-form"
          aria-label={showForm ? 'Cancel check-in' : 'Start new check-in'}
          className={`${button.primary} flex items-center gap-2`}
        >
          {showForm ? 'Cancel' : (
            <>
              <Plus className="w-4 h-4" aria-hidden="true" />
              Check In
            </>
          )}
        </button>
      </div>

      {showForm && (
        <form 
          id="checkin-form"
          onSubmit={handleFormSubmit} 
          className="mb-6 rounded-lg border border-gray-800 bg-gray-900 p-4"
          aria-label="New check-in"
        >
          <fieldset className="mb-4">
            <legend className="mb-2 block text-sm font-medium text-gray-300">
              How are you feeling?
            </legend>
            <div className="flex gap-2 flex-wrap" role="radiogroup" aria-label="Mood selection">
              {(Object.keys(moodConfig) as Mood[]).map((mood) => {
                const config = moodConfig[mood];
                return (
                  <button
                    key={mood}
                    type="button"
                    onClick={() => updateField('mood', mood)}
                    aria-checked={formData.mood === mood}
                    role="radio"
                    className={`flex-1 min-w-[80px] rounded-lg border px-3 py-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formData.mood === mood
                        ? 'border-blue-600 bg-blue-600/20 ring-2 ring-blue-500'
                        : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <span className={`flex justify-center ${config.color}`} aria-hidden="true">
                      {config.icon}
                    </span>
                    <div className={`text-xs capitalize mt-1 ${config.color}`}>{config.label}</div>
                    <span className="sr-only">{config.label}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="mb-4 space-y-3">
            {questions.map((q) => (
              <div key={q.id}>
                <label htmlFor={`question-${q.id}`} className="mb-1 block text-sm font-medium text-gray-300">
                  {q.question}
                </label>
                <textarea
                  id={`question-${q.id}`}
                  value={formData.responses[q.id] || ''}
                  onChange={(e) => updateField('responses', { ...formData.responses, [q.id]: e.target.value })}
                  className={input.base}
                  rows={2}
                />
              </div>
            ))}
          </div>

          <div className="mb-4">
            <label htmlFor="checkin-notes" className="mb-1 block text-sm font-medium text-gray-300">
              Additional Notes
            </label>
            <textarea
              id="checkin-notes"
              value={formData.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              className={input.base}
              rows={2}
              placeholder="Anything else on your mind?"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={button.primary}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Check-in'}
            </button>
          </div>
        </form>
      )}

      <AuthGuard
        loading={<div className="text-center text-gray-400">Loading...</div>}
        fallback={<p className="text-gray-400">Connect your wallet to view your check-ins</p>}
      >
        {loading ? (
          <div className="text-center text-gray-400" role="status" aria-live="polite">
            Loading check-ins...
          </div>
        ) : checkins.length === 0 ? (
          <EmptyState
            icon={<MessageCircle className="w-8 h-8 text-gray-500" />}
            title="No check-ins yet"
            description="Start tracking your progress with regular check-ins. They help you stay accountable and reflect on your journey."
            action={{
              label: 'Start your first check-in',
              onClick: () => setShowForm(true),
            }}
          />
        ) : (
          <ul className="space-y-3" role="list" aria-label="Check-ins list">
            {checkins.map((checkin) => {
              const moodMatch = checkin.notes.match(/(great|good|okay|struggling) mood/);
              const mood = (moodMatch?.[1] || 'okay') as Mood;
              const config = moodConfig[mood];
              
              return (
                <li key={checkin.id}>
                  <article className="rounded-lg border border-gray-800 bg-gray-900 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={config.color} aria-hidden="true">
                            {config.icon}
                          </span>
                          <span className={`text-sm font-medium capitalize ${config.color}`}>
                            {config.label}
                          </span>
                          <span className="rounded bg-gray-800 px-2 py-0.5 text-xs text-gray-300">
                            {checkin.checkin_type}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-400">{checkin.notes}</p>
                        <p className="mt-2 text-xs text-gray-500">
                          <time dateTime={checkin.created_at}>
                            {new Date(checkin.created_at).toLocaleString()}
                          </time>
                        </p>
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </AuthGuard>
    </section>
  );
}
