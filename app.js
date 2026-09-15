/**
 * app.js — 「動作」担当ファイル
 * 画面描画（ホーム／問題一覧／問題詳細／用語集）や
 * 状態管理・イベントハンドラなど、アプリの挙動を制御するロジック一式。
 *
 * ★元コードのロジックは変更していません（data.js / style.css への
 *   分割に伴い、変数・関数の中身はそのまま移設しています）。
 *
 * 依存関係: このファイルより先に data.js を読み込んでください
 * （quizData / categoryMeta を参照するため）。
 */

function updateClock() {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            document.getElementById('current-time').innerText = `${hours}:${minutes}`;
        }
        setInterval(updateClock, 1000);
        updateClock();

        // 厳選120問データ（各分野30問）
        
        let currentCategory = null;
        let currentQuestions = [];
        let currentIndex = 0;
        let currentFilterFreq = 'ALL';

        
        function renderHome() {
            const container = document.getElementById('app-container');
            container.innerHTML = `
                <div class="flex-1 flex flex-col justify-between p-5 sm:p-6 animate-fadeIn pb-8">
                    <div class="text-center mt-2 mb-4">
                        <div class="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-indigo-600/20 text-indigo-400 rounded-2xl mb-2 border border-indigo-500/30 shadow-lg">
                            <i class="fa-solid fa-graduation-cap text-2xl"></i>
                        </div>
                        <h1 class="text-lg sm:text-xl font-bold text-white tracking-wide">DS検定 120問完全マスター</h1>
                        <p class="text-[11px] sm:text-xs text-emerald-400 font-semibold mt-1">合格率90%レベル達成・最新シラバス全対応</p>
                    </div>

                    <div class="space-y-3 my-auto w-full">
                        <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 px-1">学習ジャンルを選択</p>
                        
                        <button onclick="initCategory('business')" class="w-full flex items-center p-3 sm:p-3.5 bg-slate-800/80 active:bg-slate-700 hover:bg-slate-700 border border-slate-700/80 rounded-2xl transition group shadow-md outline-none">
                            <div class="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-lg mr-3">
                                <i class="fa-solid fa-briefcase"></i>
                            </div>
                            <div class="text-left flex-1">
                                <h3 class="text-white font-bold text-sm">ビジネス</h3>
                                <p class="text-[10px] sm:text-xs text-slate-400">課題定義・倫理・法律・戦略 (30問)</p>
                            </div>
                            <i class="fa-solid fa-chevron-right text-slate-500 text-xs mr-1"></i>
                        </button>

                        <button onclick="initCategory('math')" class="w-full flex items-center p-3 sm:p-3.5 bg-slate-800/80 active:bg-slate-700 hover:bg-slate-700 border border-slate-700/80 rounded-2xl transition group shadow-md outline-none">
                            <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg mr-3">
                                <i class="fa-solid fa-calculator"></i>
                            </div>
                            <div class="text-left flex-1">
                                <h3 class="text-white font-bold text-sm">数理・統計</h3>
                                <p class="text-[10px] sm:text-xs text-slate-400">仮説検定・線形代数・機械学習 (30問)</p>
                            </div>
                            <i class="fa-solid fa-chevron-right text-slate-500 text-xs mr-1"></i>
                        </button>

                        <button onclick="initCategory('programming')" class="w-full flex items-center p-3 sm:p-3.5 bg-slate-800/80 active:bg-slate-700 hover:bg-slate-700 border border-slate-700/80 rounded-2xl transition group shadow-md outline-none">
                            <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg mr-3">
                                <i class="fa-solid fa-code"></i>
                            </div>
                            <div class="text-left flex-1">
                                <h3 class="text-white font-bold text-sm">プログラミング</h3>
                                <p class="text-[10px] sm:text-xs text-slate-400">Python・Pandas・DL前処理 (30問)</p>
                            </div>
                            <i class="fa-solid fa-chevron-right text-slate-500 text-xs mr-1"></i>
                        </button>

                        <button onclick="initCategory('engineering')" class="w-full flex items-center p-3 sm:p-3.5 bg-slate-800/80 active:bg-slate-700 hover:bg-slate-700 border border-slate-700/80 rounded-2xl transition group shadow-md outline-none">
                            <div class="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-lg mr-3">
                                <i class="fa-solid fa-database"></i>
                            </div>
                            <div class="text-left flex-1">
                                <h3 class="text-white font-bold text-sm">データエンジニアリング</h3>
                                <p class="text-[10px] sm:text-xs text-slate-400">SQL応用・DWH・パイプライン (30問)</p>
                            </div>
                            <i class="fa-solid fa-chevron-right text-slate-500 text-xs mr-1"></i>
                        </button>

                        <div class="pt-4 mt-4 border-t border-slate-800/80">
                            <button onclick="renderGlossary()" class="w-full flex items-center p-3 sm:p-3.5 bg-slate-800/40 active:bg-slate-700 hover:bg-slate-700 border border-slate-700/80 rounded-2xl transition group shadow-md outline-none">
                                <div class="w-10 h-10 rounded-xl bg-slate-700/60 text-slate-300 flex items-center justify-center text-lg mr-3">
                                    <i class="fa-solid fa-book-open"></i>
                                </div>
                                <div class="text-left flex-1">
                                    <h3 class="text-white font-bold text-sm">用語一覧・解説辞書 (120語)</h3>
                                    <p class="text-[10px] sm:text-xs text-slate-400">直感的な「ひとこと」解説つき</p>
                                </div>
                                <i class="fa-solid fa-chevron-right text-slate-500 text-xs mr-1"></i>
                            </button>
                        </div>
                    </div>

                    <div class="text-center text-[10px] text-slate-500 mt-6">
                        <p>© 2026 DS Certification 120 Master</p>
                    </div>
                </div>
            `;
        }

        function initCategory(category) {
            currentCategory = category;
            currentFilterFreq = 'ALL';
            
            currentQuestions = quizData[category].map((q, idx) => {
                let optionsWithIndex = q.options.map((opt, i) => ({ text: opt, originalIndex: i }));
                optionsWithIndex.sort(() => Math.random() - 0.5);
                
                let newOptions = optionsWithIndex.map(item => item.text);
                let newAnswer = optionsWithIndex.findIndex(item => item.originalIndex === q.answer);
                
                return {
                    ...q,
                    originalId: idx,
                    options: newOptions,
                    answer: newAnswer,
                    isAnswered: false,
                    isCorrect: null,
                    userSelectedIdx: null
                };
            });

            renderQuestionList();
        }

        function renderQuestionList(filterFreq = currentFilterFreq) {
            currentFilterFreq = filterFreq;
            const container = document.getElementById('app-container');
            const meta = categoryMeta[currentCategory];

            const filteredQuestions = currentQuestions
                .map((q, originalIdx) => ({ ...q, _originalIndex: originalIdx }))
                .filter((q) => {
                    if (filterFreq === 'ALL') return true;
                    return q.frequency === filterFreq;
                });

            const answeredCount = currentQuestions.filter(q => q.isAnswered).length;
            const correctCount = currentQuestions.filter(q => q.isCorrect).length;

            const listHtml = filteredQuestions.map((q) => {
                let statusIcon = '<div class="w-2 h-2 rounded-full bg-slate-600"></div>';
                let statusBg = 'bg-slate-800/80 border-slate-700';
                
                if (q.isAnswered) {
                    if (q.isCorrect) {
                        statusIcon = '<i class="fa-solid fa-circle-check text-emerald-400"></i>';
                        statusBg = 'bg-emerald-900/20 border-emerald-500/30';
                    } else {
                        statusIcon = '<i class="fa-solid fa-circle-xmark text-rose-400"></i>';
                        statusBg = 'bg-rose-900/20 border-rose-500/30';
                    }
                }

                const cleanQuestion = q.question.replace(/<[^>]*>?/gm, '');
                const previewText = q.term ? q.term : cleanQuestion.substring(0, 15) + '...';
                
                const freqBadge = q.frequency 
                    ? `<span class="text-[10px] text-amber-400 font-bold ml-2 border border-amber-400/30 px-1.5 py-0.5 rounded bg-amber-400/10 flex-shrink-0">出題率: ${q.frequency}</span>`
                    : '';

                return `
                    <button onclick="goToQuestion(${q._originalIndex})" class="w-full text-left p-3.5 ${statusBg} active:bg-slate-700 hover:bg-slate-700 rounded-xl mb-2.5 transition flex items-center justify-between group outline-none shadow-sm">
                        <div class="flex items-center flex-1 overflow-hidden pr-2">
                            <span class="w-14 text-[11px] sm:text-xs font-bold text-slate-400 text-left mr-1 flex-shrink-0">第${q._originalIndex + 1}問</span>
                            <span class="text-[13px] sm:text-sm font-bold text-slate-200 truncate">${previewText}</span>
                            ${freqBadge}
                        </div>
                        <div class="flex items-center space-x-3 ml-2">
                            ${statusIcon}
                            <i class="fa-solid fa-chevron-right text-slate-500 text-xs transition-transform group-hover:translate-x-1"></i>
                        </div>
                    </button>
                `;
            }).join('');

            container.innerHTML = `
                <div class="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center shadow-sm z-20 sticky top-0">
                    <button onclick="renderHome()" class="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-700 text-slate-300 flex items-center justify-center transition mr-3 shadow-sm outline-none">
                        <i class="fa-solid fa-arrow-left text-sm"></i>
                    </button>
                    <div class="flex items-center space-x-2 flex-1">
                        <i class="fa-solid ${meta.icon} text-indigo-400 text-sm"></i>
                        <h2 class="text-sm font-bold text-white">${meta.title} 問題一覧</h2>
                    </div>
                </div>

                <div class="sticky top-[61px] z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 shadow-sm">
                    <div class="flex px-3 py-2.5 space-x-2 overflow-x-auto hide-scrollbar">
                        <button onclick="renderQuestionList('ALL')" class="px-3.5 py-1.5 text-[11px] font-bold rounded-full transition outline-none ${filterFreq === 'ALL' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'} whitespace-nowrap">すべて (${currentQuestions.length})</button>
                        <button onclick="renderQuestionList('★★★')" class="px-3.5 py-1.5 text-[11px] font-bold rounded-full transition outline-none ${filterFreq === '★★★' ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-md' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'} whitespace-nowrap">★★★ 頻出</button>
                        <button onclick="renderQuestionList('★★')" class="px-3.5 py-1.5 text-[11px] font-bold rounded-full transition outline-none ${filterFreq === '★★' ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-md' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'} whitespace-nowrap">★★ 重要</button>
                        <button onclick="renderQuestionList('★')" class="px-3.5 py-1.5 text-[11px] font-bold rounded-full transition outline-none ${filterFreq === '★' ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-md' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'} whitespace-nowrap">★ 基本</button>
                    </div>
                </div>

                <div class="flex-1 p-3 sm:p-4 overflow-y-auto smooth-scroll relative bg-gradient-to-b from-slate-900 to-slate-950 pb-12 animate-fadeIn">
                    <div class="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 mb-4 flex justify-between items-center shadow-inner">
                        <div>
                            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Progress</p>
                            <p class="text-sm font-bold text-white tracking-wide">
                                ${answeredCount} <span class="text-xs text-slate-500 font-normal">/ ${currentQuestions.length}問 完了</span>
                                <span class="ml-2 text-emerald-400 text-xs"><i class="fa-solid fa-check mr-0.5"></i>${correctCount}問 正解</span>
                            </p>
                        </div>
                        <button onclick="resetCategoryProgress()" class="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-[10px] font-bold text-slate-300 transition outline-none border border-slate-600 shadow-sm">
                            <i class="fa-solid fa-rotate-right mr-1"></i>リセット
                        </button>
                    </div>

                    <div class="space-y-0.5">
                        ${listHtml}
                    </div>
                    ${filteredQuestions.length === 0 ? '<div class="text-center text-slate-500 text-xs py-10">該当する問題がありません。</div>' : ''}
                </div>
            `;
        }

        function resetCategoryProgress() {
            initCategory(currentCategory);
        }

        function goToQuestion(idx) {
            currentIndex = idx;
            renderQuestion();
        }

        function renderQuestion() {
            const container = document.getElementById('app-container');
            const q = currentQuestions[currentIndex];
            const meta = categoryMeta[currentCategory];
            const progressPercent = ((currentIndex + 1) / currentQuestions.length) * 100;

            const freqBadge = q.frequency 
                ? `<span class="text-[10px] text-amber-400 font-bold ml-1 border border-amber-400/30 px-1 py-0.5 rounded bg-amber-400/10 whitespace-nowrap">出題率: ${q.frequency}</span>`
                : '';

            let optionsHtml = q.options.map((opt, idx) => {
                let btnClass = "w-full text-left p-3.5 bg-slate-800/80 active:bg-slate-700 hover:bg-slate-700 border-2 border-transparent rounded-xl text-xs sm:text-[13px] text-slate-300 transition-all flex items-start outline-none shadow-sm group";
                let badgeClass = "w-6 h-6 rounded-lg bg-slate-700 text-slate-400 flex items-center justify-center text-[10px] font-bold mr-3 mt-0.5 flex-shrink-0 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-colors";
                
                if (q.isAnswered) {
                    if (idx === q.answer) {
                        btnClass = "w-full text-left p-3.5 bg-emerald-500/20 border-2 border-emerald-500 rounded-xl text-xs sm:text-[13px] text-emerald-100 flex items-start outline-none shadow-md";
                        badgeClass = "w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold mr-3 mt-0.5 flex-shrink-0 shadow-inner";
                    } else if (idx === q.userSelectedIdx && !q.isCorrect) {
                        btnClass = "w-full text-left p-3.5 bg-rose-500/10 border-2 border-rose-500/50 rounded-xl text-xs sm:text-[13px] text-rose-200 flex items-start outline-none opacity-90 shadow-md";
                        badgeClass = "w-6 h-6 rounded-lg bg-rose-500 text-white flex items-center justify-center text-[10px] font-bold mr-3 mt-0.5 flex-shrink-0 shadow-inner";
                    } else {
                        btnClass = "w-full text-left p-3.5 bg-slate-800/40 border-2 border-transparent rounded-xl text-xs sm:text-[13px] text-slate-500 flex items-start outline-none opacity-50";
                        badgeClass = "w-6 h-6 rounded-lg bg-slate-800 text-slate-600 flex items-center justify-center text-[10px] font-bold mr-3 mt-0.5 flex-shrink-0";
                    }
                } else {
                    if (q.userSelectedIdx === idx) {
                        btnClass = "w-full text-left p-3.5 bg-indigo-600/20 border-2 border-indigo-500 rounded-xl text-xs sm:text-[13px] text-white transition-all flex items-start shadow-md outline-none group";
                        badgeClass = "w-6 h-6 rounded-lg bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold mr-3 mt-0.5 flex-shrink-0 shadow-inner";
                    }
                }

                return `
                    <button onclick="selectOption(${idx})" id="opt-${idx}" class="${btnClass}" ${q.isAnswered ? 'disabled' : ''}>
                        <span class="${badgeClass}">${String.fromCharCode(65 + idx)}</span>
                        <span class="leading-relaxed pt-0.5">${opt}</span>
                    </button>
                `;
            }).join('');

            let actionAreaHtml = '';
            if (q.isAnswered) {
                actionAreaHtml = `
                    <div class="mb-4 p-4 rounded-xl bg-slate-800 border border-slate-700 animate-fadeIn space-y-3 shadow-md">
                        <div class="flex items-center text-sm font-extrabold ${q.isCorrect ? 'text-emerald-400' : 'text-rose-400'}">
                            <i class="${q.isCorrect ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'} mr-2 text-lg"></i>
                            ${q.isCorrect ? '正解！' : '不正解...'}
                        </div>
                        <div class="bg-slate-900/50 p-3 rounded-lg border border-slate-800/50">
                            <span class="font-bold text-indigo-300 block mb-1 text-[10px] uppercase tracking-wider">Hint</span>
                            <p class="text-slate-200 text-xs leading-relaxed">${q.hint}</p>
                        </div>
                        <div>
                            <span class="font-bold text-emerald-400 block mb-1 text-[10px] uppercase tracking-wider">Explanation</span>
                            <p class="text-slate-300 text-[11px] sm:text-xs leading-relaxed">${q.explanation}</p>
                        </div>
                    </div>
                `;
            } else {
                actionAreaHtml = `
                    <button id="submit-btn" onclick="checkAnswer()" ${q.userSelectedIdx === null ? 'disabled' : ''} class="w-full py-3.5 ${q.userSelectedIdx === null ? 'bg-slate-800 text-slate-500 border border-slate-700' : 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30'} font-bold rounded-xl transition text-sm outline-none">
                        ${q.userSelectedIdx === null ? '選択してください' : '回答する'}
                    </button>
                `;
            }

            const prevBtn = currentIndex > 0 
                ? `<button onclick="goToQuestion(${currentIndex - 1})" class="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition outline-none mr-2 border border-slate-700 shadow-sm"><i class="fa-solid fa-chevron-left mr-1.5"></i>前の問題</button>` 
                : `<div class="flex-1 mr-2 opacity-30 pointer-events-none py-3 bg-slate-800 text-slate-500 text-xs font-bold rounded-xl border border-slate-700 text-center"><i class="fa-solid fa-chevron-left mr-1.5"></i>前の問題</div>`;
            
            const nextBtn = currentIndex < currentQuestions.length - 1 
                ? `<button onclick="goToQuestion(${currentIndex + 1})" class="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition outline-none ml-2 border border-slate-700 shadow-sm">次の問題<i class="fa-solid fa-chevron-right ml-1.5"></i></button>`
                : `<div class="flex-1 ml-2 opacity-30 pointer-events-none py-3 bg-slate-800 text-slate-500 text-xs font-bold rounded-xl border border-slate-700 text-center">次の問題<i class="fa-solid fa-chevron-right ml-1.5"></i></div>`;

            container.innerHTML = `
                <div class="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                    <button onclick="renderQuestionList(currentFilterFreq)" class="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-700 text-slate-300 flex items-center justify-center transition outline-none shadow-sm">
                        <i class="fa-solid fa-list text-sm"></i>
                    </button>
                    <div class="flex items-center space-x-2 truncate px-2">
                        <span class="text-xs font-bold text-slate-200 truncate">${meta.title} (第${currentIndex + 1}問)</span>
                        ${freqBadge}
                    </div>
                    <span class="text-[11px] font-bold px-2.5 py-1 bg-slate-800 rounded-lg text-slate-300 border border-slate-700 flex-shrink-0">
                        ${currentIndex + 1} <span class="text-slate-500 font-normal">/ ${currentQuestions.length}</span>
                    </span>
                </div>

                <div class="w-full bg-slate-800 h-1.5 sticky top-[61px] z-10">
                    <div class="bg-indigo-500 h-1.5 transition-all duration-300 rounded-r-full shadow-[0_0_8px_rgba(99,102,241,0.5)]" style="width: ${progressPercent}%"></div>
                </div>

                <div class="flex-1 p-4 flex flex-col overflow-y-auto smooth-scroll pb-6 animate-fadeIn">
                    <div class="mb-4">
                        <div class="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 shadow-sm">
                            <p class="text-[13px] sm:text-sm font-medium text-slate-100 leading-relaxed whitespace-pre-wrap">${q.question}</p>
                        </div>
                    </div>

                    <div class="space-y-2.5 mb-6" id="options-container">
                        ${optionsHtml}
                    </div>

                    <div id="action-area" class="mt-auto pt-2">
                        ${actionAreaHtml}
                    </div>

                    <div class="flex justify-between items-center mt-6 pt-5 border-t border-slate-800/80">
                        ${prevBtn}
                        <button onclick="renderQuestionList(currentFilterFreq)" class="w-14 py-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-300 text-sm font-bold rounded-xl transition outline-none border border-slate-700 shadow-sm flex items-center justify-center">
                            <i class="fa-solid fa-list-ul"></i>
                        </button>
                        ${nextBtn}
                    </div>
                </div>
            `;
        }

        function selectOption(idx) {
            const q = currentQuestions[currentIndex];
            if (q.isAnswered) return;
            
            q.userSelectedIdx = idx;

            currentQuestions[currentIndex].options.forEach((_, i) => {
                const btn = document.getElementById(`opt-${i}`);
                if (!btn) return;
                const badge = btn.firstElementChild;
                
                if (i === idx) {
                    btn.className = "w-full text-left p-3.5 bg-indigo-600/20 border-2 border-indigo-500 rounded-xl text-xs sm:text-[13px] text-white transition-all flex items-start shadow-md outline-none group";
                    badge.className = "w-6 h-6 rounded-lg bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold mr-3 mt-0.5 flex-shrink-0 shadow-inner";
                } else {
                    btn.className = "w-full text-left p-3.5 bg-slate-800/80 active:bg-slate-700 hover:bg-slate-700 border-2 border-transparent rounded-xl text-xs sm:text-[13px] text-slate-300 transition-all flex items-start outline-none shadow-sm group";
                    badge.className = "w-6 h-6 rounded-lg bg-slate-700 text-slate-400 flex items-center justify-center text-[10px] font-bold mr-3 mt-0.5 flex-shrink-0 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-colors";
                }
            });

            const submitBtn = document.getElementById('submit-btn');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = "回答する";
                submitBtn.className = "w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold rounded-xl transition text-sm shadow-lg shadow-indigo-600/30 outline-none";
            }
        }

        function checkAnswer() {
            const q = currentQuestions[currentIndex];
            if (q.userSelectedIdx === null || q.isAnswered) return;

            q.isCorrect = (q.userSelectedIdx === q.answer);
            q.isAnswered = true;

            renderQuestion();

            setTimeout(() => {
                const actionArea = document.getElementById('action-area');
                if(actionArea) {
                    actionArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 50);
        }

        function renderGlossary(category = 'business', filterFreq = 'ALL') {
            const container = document.getElementById('app-container');
            const categories = [
                { id: 'business', title: 'ビジネス' },
                { id: 'math', title: '数理・統計' },
                { id: 'programming', title: 'プログラム' },
                { id: 'engineering', title: 'エンジニア' }
            ];

            const uniqueTerms = [];
            const termSet = new Set();
            
            quizData[category].forEach((q, originalIdx) => {
                const termName = q.term || q.options[q.answer];
                if (!termSet.has(termName)) {
                    termSet.add(termName);
                    
                    uniqueTerms.push({
                        term: termName,
                        summary: q.summary || "DS検定で頻出の重要キーワード",
                        frequency: q.frequency || "★★",
                        question: q.question,
                        explanation: q.explanation,
                        hint: q.hint,
                        id: originalIdx
                    });
                }
            });

            const filteredTerms = uniqueTerms.filter(item => {
                if (filterFreq === 'ALL') return true;
                return item.frequency === filterFreq;
            });

            const termsHtml = filteredTerms.map(item => {
                const freqBadge = `<span class="text-[10px] text-amber-400 font-bold ml-2 border border-amber-400/30 px-1.5 py-0.5 rounded bg-amber-400/10 whitespace-nowrap">出題率: ${item.frequency}</span>`;
                
                return `
                    <div class="bg-slate-800/60 border border-slate-700/80 rounded-xl mb-2.5 overflow-hidden shadow-sm">
                        <button onclick="toggleTerm(${item.id})" class="w-full text-left p-3.5 flex justify-between items-center active:bg-slate-700 hover:bg-slate-700 transition outline-none">
                            <div class="pr-2 flex-1">
                                <div class="flex items-center mb-1">
                                    <span class="text-[13px] sm:text-sm font-bold text-slate-200 leading-tight">${item.term}</span>
                                    ${freqBadge}
                                </div>
                                <span class="text-[10px] text-indigo-300/90 font-medium block">${item.summary}</span>
                            </div>
                            <div class="w-6 h-6 rounded-full bg-slate-900/50 flex items-center justify-center flex-shrink-0 ml-2">
                                <i id="icon-term-${item.id}" class="fa-solid fa-chevron-down text-slate-400 text-[10px] transition-transform duration-300"></i>
                            </div>
                        </button>
                        <div id="term-${item.id}" class="hidden p-4 border-t border-slate-700/50 bg-slate-900/40 text-xs text-slate-300 space-y-3">
                            <div>
                                <span class="text-indigo-400 font-bold block mb-1 text-[10px] tracking-wider uppercase">Definition / Question</span>
                                <p class="leading-relaxed text-slate-200 bg-slate-900/60 p-2.5 rounded border border-slate-800 whitespace-pre-wrap">${item.question}</p>
                            </div>
                            <div class="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                                <span class="text-emerald-400 font-bold block mb-1 text-[10px] tracking-wider uppercase">Explanation</span>
                                <p class="leading-relaxed mb-1">${item.explanation}</p>
                                <p class="text-slate-400 leading-relaxed text-[11px]"><i class="fa-regular fa-lightbulb mr-1 text-amber-400"></i>${item.hint}</p>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            const tabsHtml = categories.map(c => `
                <button onclick="renderGlossary('${c.id}', '${filterFreq}')" class="flex-1 min-w-[80px] py-3 text-xs font-bold text-center border-b-2 transition outline-none ${c.id === category ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-400'} whitespace-nowrap px-2">
                    ${c.title}
                </button>
            `).join('');

            container.innerHTML = `
                <div class="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center shadow-sm z-20 sticky top-0">
                    <button onclick="renderHome()" class="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-700 text-slate-300 flex items-center justify-center transition mr-3 shadow-sm outline-none">
                        <i class="fa-solid fa-arrow-left text-sm"></i>
                    </button>
                    <h2 class="text-sm font-bold text-white flex-1">用語一覧・解説辞書 (全120語)</h2>
                    <div class="w-9 h-9 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-400">
                        <i class="fa-solid fa-book text-sm"></i>
                    </div>
                </div>

                <div class="sticky top-[61px] z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 shadow-sm">
                    <div class="flex overflow-x-auto hide-scrollbar px-2 border-b border-slate-800/50">
                        ${tabsHtml}
                    </div>
                    <div class="flex px-3 py-2.5 space-x-2 overflow-x-auto hide-scrollbar">
                        <button onclick="renderGlossary('${category}', 'ALL')" class="px-3.5 py-1.5 text-[11px] font-bold rounded-full transition outline-none ${filterFreq === 'ALL' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'} whitespace-nowrap">すべて</button>
                        <button onclick="renderGlossary('${category}', '★★★')" class="px-3.5 py-1.5 text-[11px] font-bold rounded-full transition outline-none ${filterFreq === '★★★' ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-md' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'} whitespace-nowrap">★★★ 頻出</button>
                        <button onclick="renderGlossary('${category}', '★★')" class="px-3.5 py-1.5 text-[11px] font-bold rounded-full transition outline-none ${filterFreq === '★★' ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-md' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'} whitespace-nowrap">★★ 重要</button>
                        <button onclick="renderGlossary('${category}', '★')" class="px-3.5 py-1.5 text-[11px] font-bold rounded-full transition outline-none ${filterFreq === '★' ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-md' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'} whitespace-nowrap">★ 基本</button>
                    </div>
                </div>

                <div class="flex-1 p-3 sm:p-4 overflow-y-auto smooth-scroll relative bg-gradient-to-b from-slate-900 to-slate-950 pb-12 animate-fadeIn">
                    <div class="text-xs text-slate-500 mb-4 px-1 flex items-center">
                        <i class="fa-solid fa-circle-info mr-1.5"></i>
                        該当用語: ${filteredTerms.length} 語 (全 ${uniqueTerms.length} 語中)
                    </div>
                    ${termsHtml}
                    ${filteredTerms.length === 0 ? '<div class="text-center text-slate-500 text-xs py-10">該当する用語がありません。</div>' : ''}
                </div>
            `;
        }

        function toggleTerm(idx) {
            const content = document.getElementById(`term-${idx}`);
            const icon = document.getElementById(`icon-term-${idx}`);
            if (content && content.classList.contains('hidden')) {
                content.classList.remove('hidden');
                if(icon) icon.classList.add('rotate-180');
            } else if (content) {
                content.classList.add('hidden');
                if(icon) icon.classList.remove('rotate-180');
            }
        }

        renderHome();
