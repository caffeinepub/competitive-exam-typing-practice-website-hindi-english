import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Languages, Info } from 'lucide-react';
import { Language } from '../../backend';
import { usePassage } from './usePassage';
import { useTypingEngine } from './useTypingEngine';
import { DurationSelector } from './components/DurationSelector';
import { PassageDisplay } from './components/PassageDisplay';
import { StatsBar } from './components/StatsBar';
import { ResultsSummary } from './components/ResultsSummary';
import { HistoryPanel } from '../history/HistoryPanel';
import { useHistory } from '../history/useHistory';
import { recordSession } from '../../services/sessions';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function TypingPractice() {
  const [language, setLanguage] = useState<Language>(Language.english);
  const [duration, setDuration] = useState<number>(1);
  
  const { passage, isLoading, error, refetch } = usePassage(language);
  const { addResult } = useHistory();
  
  const {
    status,
    typedText,
    timeRemaining,
    stats,
    handleInput,
    start,
    reset,
    retry,
  } = useTypingEngine(passage?.text || '', duration * 60);

  // Handle language change
  const handleLanguageChange = (newLang: string) => {
    const lang = newLang === 'hindi' ? Language.hindi : Language.english;
    setLanguage(lang);
    reset();
  };

  // Handle new passage
  const handleNewPassage = () => {
    refetch();
    reset();
  };

  // Handle test completion
  useEffect(() => {
    if (status === 'finished' && passage) {
      const result = {
        language,
        duration,
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        errors: stats.errors,
        timestamp: Date.now(),
      };
      
      // Add to local history
      addResult(result);
      
      // Try to record on backend (non-blocking)
      recordSession({
        passage,
        result: {
          timeTaken: BigInt(duration * 60),
          accuracy: stats.accuracy,
        },
      }).catch(err => console.warn('Failed to record session:', err));
    }
  }, [status, passage, language, duration, stats, addResult]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load passage. Please refresh the page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-lg">
        <img
          src="/assets/generated/typing-hero.dim_1600x600.png"
          alt="Typing Practice"
          className="w-full h-32 md:h-48 object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/40 flex items-center">
          <div className="container px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Master Your Typing Skills
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              Practice typing in English and Hindi for competitive exams
            </p>
          </div>
        </div>
      </div>

      {/* Main Practice Area */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Languages className="w-5 h-5 text-primary" />
              Typing Test
            </CardTitle>
            
            {/* Language Selector */}
            <Tabs value={language} onValueChange={handleLanguageChange}>
              <TabsList>
                <TabsTrigger value={Language.english}>English</TabsTrigger>
                <TabsTrigger value={Language.hindi}>हिंदी (Hindi)</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Hindi Input Help */}
          {language === Language.hindi && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                To type in Hindi, please enable a Devanagari keyboard/IME on your device. 
                On Windows: Press Win+Space to switch keyboards. On Mac: Use Control+Space.
              </AlertDescription>
            </Alert>
          )}

          {/* Duration Selector (only when ready) */}
          {status === 'ready' && (
            <DurationSelector value={duration} onChange={setDuration} />
          )}

          {/* Stats Bar */}
          {status !== 'ready' && (
            <StatsBar
              timeRemaining={timeRemaining}
              wpm={stats.wpm}
              accuracy={stats.accuracy}
              errors={stats.errors}
            />
          )}

          {/* Passage Display */}
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : passage ? (
            <PassageDisplay
              passage={passage.text}
              typedText={typedText}
              language={language}
            />
          ) : null}

          {/* Input Area */}
          {status !== 'finished' && passage && (
            <div className="space-y-2">
              <textarea
                value={typedText}
                onChange={(e) => handleInput(e.target.value)}
                disabled={status === 'ready'}
                placeholder={
                  status === 'ready'
                    ? 'Click Start to begin typing...'
                    : 'Type the passage above...'
                }
                className="w-full min-h-[120px] p-4 rounded-md border bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
                autoFocus={status === 'running'}
              />
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex flex-wrap gap-3">
            {status === 'ready' && (
              <Button onClick={start} size="lg" className="font-semibold">
                Start Test
              </Button>
            )}
            
            {status === 'running' && (
              <Button onClick={reset} variant="outline">
                Reset
              </Button>
            )}

            {status === 'finished' && (
              <>
                <Button onClick={retry} size="lg">
                  Retry Same Passage
                </Button>
                <Button onClick={handleNewPassage} variant="outline">
                  New Passage
                </Button>
              </>
            )}
          </div>

          {/* Results Summary */}
          {status === 'finished' && (
            <ResultsSummary
              wpm={stats.wpm}
              accuracy={stats.accuracy}
              errors={stats.errors}
              language={language}
              duration={duration}
              onRetry={retry}
              onNewPassage={handleNewPassage}
            />
          )}
        </CardContent>
      </Card>

      {/* History Panel */}
      <HistoryPanel />
    </div>
  );
}
