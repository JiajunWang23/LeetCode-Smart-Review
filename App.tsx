
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { ProblemCard } from './components/ProblemCard';
import { fetchUserProfileData, generateStructuredPlan } from './services/geminiService';
import { AppStatus, StudyPlan } from './types';
import { Search, Loader2, RefreshCw, AlertCircle, LinkIcon } from 'lucide-react';

const App: React.FC = () => {
  const [username, setUsername] = useState('jiajunw7');
  const [status, setStatus] = useState<AppStatus>('idle');
  const [data, setData] = useState<StudyPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!username.trim()) return;

    setStatus('analyzing_profile');
    setError(null);
    setData(null);

    try {
      // Step 1: Get raw info via Google Search grounding
      const { text: profileContext, sources } = await fetchUserProfileData(username);
      
      setStatus('generating_plan');
      
      // Step 2: Process into JSON
      const plan = await generateStructuredPlan(username, profileContext, sources);
      
      setData(plan);
      setStatus('success');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
      setStatus('error');
    }
  }, [username]);

  return (
    <div className="min-h-screen flex flex-col bg-lc-dark text-white font-sans selection:bg-lc-yellow/30">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {/* Search Section */}
        <div className={`transition-all duration-500 ease-in-out ${status === 'idle' ? 'min-h-[60vh] flex flex-col justify-center' : 'mb-8'}`}>
           <div className={`max-w-2xl mx-auto w-full ${status === 'idle' ? 'text-center' : ''}`}>
              {status === 'idle' && (
                  <div className="mb-8 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                        Master Your LeetCode Journey
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Analyze your history, identify high-failure traps, and get a personalized study plan powered by Gemini.
                    </p>
                  </div>
              )}

              <form onSubmit={handleAnalyze} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-lc-green to-lc-yellow rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex items-center bg-lc-black rounded-xl border border-lc-gray p-2">
                    <Search className="w-6 h-6 text-gray-400 ml-3" />
                    <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter LeetCode Username (e.g., jiajunw7)" 
                        className="w-full bg-transparent border-none focus:ring-0 text-lg text-white px-4 placeholder-gray-600 h-12"
                    />
                    <button 
                        type="submit" 
                        disabled={status === 'analyzing_profile' || status === 'generating_plan'}
                        className="bg-white text-black hover:bg-gray-200 font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {(status === 'analyzing_profile' || status === 'generating_plan') ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            "Analyze"
                        )}
                    </button>
                </div>
              </form>

              {/* Status Messages */}
              <div className="mt-4 text-center h-6">
                  {status === 'analyzing_profile' && (
                      <span className="text-lc-yellow animate-pulse text-sm">Searching public profile data...</span>
                  )}
                  {status === 'generating_plan' && (
                      <span className="text-blue-400 animate-pulse text-sm">Analyzing stats & identifying weak spots...</span>
                  )}
                  {status === 'error' && (
                      <div className="flex items-center justify-center gap-2 text-lc-red text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                      </div>
                  )}
              </div>
           </div>
        </div>

        {/* Results Section */}
        {status === 'success' && data && (
            <div className="animate-fade-in-up space-y-12">
                
                {/* Analysis Blurb */}
                <div className="bg-gradient-to-r from-lc-green/10 to-transparent border-l-4 border-lc-green p-6 rounded-r-xl">
                    <h3 className="text-xl font-bold text-lc-green mb-2 flex items-center gap-2">
                        <Search className="w-5 h-5" /> AI Analysis
                    </h3>
                    <p className="text-gray-300 leading-relaxed">{data.analysis}</p>
                    
                    {/* Sources */}
                    {data.groundingUrls && data.groundingUrls.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-3 text-xs">
                            <span className="text-gray-500">Sources:</span>
                            {data.groundingUrls.slice(0, 3).map((url, idx) => (
                                <a 
                                    key={idx} 
                                    href={url} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="flex items-center gap-1 text-gray-400 hover:text-lc-yellow transition-colors truncate max-w-[200px]"
                                >
                                    <LinkIcon className="w-3 h-3" />
                                    {new URL(url).hostname}
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                <StatsOverview stats={data.stats} />

                {/* Review Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <RefreshCw className="w-6 h-6 text-lc-yellow" />
                                Review Queue
                            </h2>
                            <p className="text-gray-400 text-sm mt-1">Problems you likely solved that need a refresher.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.reviewList.map((problem, idx) => (
                            <ProblemCard key={idx} problem={problem} isReview={true} />
                        ))}
                    </div>
                </section>

                {/* Recommendations Section */}
                <section>
                     <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                </div>
                                Recommended Next Steps
                            </h2>
                            <p className="text-gray-400 text-sm mt-1">New challenges tailored to improve your weak spots.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.recommendations.map((problem, idx) => (
                            <ProblemCard key={idx} problem={problem} isReview={false} />
                        ))}
                    </div>
                </section>
            </div>
        )}
      </main>
    </div>
  );
};

export default App;
