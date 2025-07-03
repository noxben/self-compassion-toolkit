document.addEventListener('DOMContentLoaded', function() {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').catch(function(error) {
            console.log('Service worker registration failed:', error);
        });
    }

    // Initialize local storage
    if (!localStorage.getItem('bookmarkedAffirmations')) {
        localStorage.setItem('bookmarkedAffirmations', JSON.stringify([]));
    }
    if (!localStorage.getItem('customAffirmations')) {
        localStorage.setItem('customAffirmations', JSON.stringify([]));
    }
    if (!localStorage.getItem('inControlItems')) {
        localStorage.setItem('inControlItems', JSON.stringify([
            'My responses to situations',
            'How I spend my time',
            'My self-care practices'
        ]));
    }
    if (!localStorage.getItem('notControlItems')) {
        localStorage.setItem('notControlItems', JSON.stringify([
            'Other people\'s actions',
            'Past events',
            'Global circumstances'
        ]));
    }
    if (!localStorage.getItem('tinyWins')) {
        localStorage.setItem('tinyWins', JSON.stringify([]));
    }

    // Navigation between home and sections
    const homeScreen = document.getElementById('home-screen');
    const sections = document.querySelectorAll('.section');
    const homeButtons = document.querySelectorAll('.home-button');
    const backToHomeBtn = document.getElementById('back-to-home');
    
    function showSection(sectionId) {
        homeScreen.classList.add('hidden');
        sections.forEach(section => section.classList.add('hidden'));
        document.getElementById(`${sectionId}-section`).classList.remove('hidden');
        backToHomeBtn.classList.remove('hidden');
        
        // Initialize the section
        if (sectionId === 'affirmations') {
            const initialAffirmation = getRandomAffirmation();
            displayAffirmation(initialAffirmation);
            renderBookmarkedAffirmations();
        } else if (sectionId === 'control') {
            renderControlLists();
        } else if (sectionId === 'wins') {
            renderTinyWins();
        }
    }
    
    function showHome() {
        homeScreen.classList.remove('hidden');
        sections.forEach(section => section.classList.add('hidden'));
        backToHomeBtn.classList.add('hidden');
    }
    
    homeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = button.getAttribute('data-section');
            showSection(sectionId);
        });
    });
    
    backToHomeBtn.addEventListener('click', showHome);

    // Modal functionality
    const modals = document.querySelectorAll('.modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    
    function openModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }
    
    function closeAllModals() {
        modals.forEach(modal => modal.classList.remove('active'));
    }
    
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeAllModals();
            }
        });
    });

    // Affirmations functionality
    const defaultAffirmations = [
        {
            en: "I am allowed to feel tired — it doesn't mean I've failed.",
            zh: "我可以感到疲倦，这并不意味着我失败了。",
            isCustom: false
        },
        {
            en: "I am learning, not failing.",
            zh: "我在学习，而不是在失败。",
            isCustom: false
        },
        {
            en: "My worth is not measured by my productivity.",
            zh: "我的价值不是由我的生产力来衡量的。",
            isCustom: false
        },
        {
            en: "I am enough just as I am right now.",
            zh: "我现在的样子已经足够好了。",
            isCustom: false
        },
        {
            en: "It's okay to take things one step at a time.",
            zh: "一步一步慢慢来是可以的。",
            isCustom: false
        },
        {
            en: "I deserve kindness, especially from myself.",
            zh: "我值得被善待，尤其是来自我自己的善待。",
            isCustom: false
        },
        {
            en: "My feelings are valid, even when they're difficult.",
            zh: "我的感受是有效的，即使它们很困难。",
            isCustom: false
        },
        {
            en: "I can be both a work in progress and worthy of love.",
            zh: "我可以是一个正在进步的人，同时也值得被爱。",
            isCustom: false
        }
    ];

    let currentAffirmation = null;
    const affirmationDisplay = document.getElementById('affirmation-display');
    const newAffirmationBtn = document.getElementById('new-affirmation-btn');
    const addAffirmationBtn = document.getElementById('add-affirmation-btn');
    const exportAffirmationsBtn = document.getElementById('export-affirmations-btn');
    const bookmarkedAffirmationsContainer = document.getElementById('bookmarked-affirmations');
    const filterAllBtn = document.getElementById('filter-all-btn');
    const filterCustomBtn = document.getElementById('filter-custom-btn');
    
    let currentFilter = 'all';

    function getAllAffirmations() {
        const customAffirmations = JSON.parse(localStorage.getItem('customAffirmations')) || [];
        return [...defaultAffirmations, ...customAffirmations];
    }

    function getRandomAffirmation() {
        const allAffirmations = getAllAffirmations();
        const randomIndex = Math.floor(Math.random() * allAffirmations.length);
        return allAffirmations[randomIndex];
    }

    function displayAffirmation(affirmation) {
        currentAffirmation = affirmation;
        affirmationDisplay.innerHTML = `
            <div class="text-center">
                <div class="bilingual-display">
                    <p class="text-indigo-800 text-xl mb-2 en">${affirmation.en}</p>
                    <p class="text-indigo-700 text-lg chinese-text zh">${affirmation.zh || ''}</p>
                </div>
                <div class="flex justify-center mt-4 space-x-2">
                    <button class="bookmark-btn text-indigo-600 hover:text-indigo-800 focus:outline-none p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 bookmark-icon ${isAffirmationBookmarked(affirmation) ? 'active' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                    </button>
                    ${affirmation.isCustom ? `
                    <button class="edit-affirmation-btn text-indigo-600 hover:text-indigo-800 focus:outline-none p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    ` : ''}
                </div>
            </div>
        `;

        const bookmarkBtn = affirmationDisplay.querySelector('.bookmark-btn');
        bookmarkBtn.addEventListener('click', () => toggleBookmark(affirmation));
        
        const editBtn = affirmationDisplay.querySelector('.edit-affirmation-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => openEditAffirmationModal(affirmation));
        }
    }

    function isAffirmationBookmarked(affirmation) {
        const bookmarked = JSON.parse(localStorage.getItem('bookmarkedAffirmations'));
        return bookmarked.some(item => item.en === affirmation.en);
    }

    function toggleBookmark(affirmation) {
        const bookmarked = JSON.parse(localStorage.getItem('bookmarkedAffirmations'));
        const index = bookmarked.findIndex(item => item.en === affirmation.en);
        
        if (index === -1) {
            bookmarked.push(affirmation);
            affirmationDisplay.querySelector('.bookmark-icon').classList.add('active');
        } else {
            bookmarked.splice(index, 1);
            affirmationDisplay.querySelector('.bookmark-icon').classList.remove('active');
        }
        
        localStorage.setItem('bookmarkedAffirmations', JSON.stringify(bookmarked));
        renderBookmarkedAffirmations();
    }

    function renderBookmarkedAffirmations() {
        let bookmarked = JSON.parse(localStorage.getItem('bookmarkedAffirmations'));
        
        // Apply filter if needed
        if (currentFilter === 'custom') {
            bookmarked = bookmarked.filter(item => item.isCustom);
        }
        
        if (bookmarked.length === 0) {
            bookmarkedAffirmationsContainer.innerHTML = `
                <p class="text-gray-500 text-center py-4">Your bookmarked affirmations will appear here</p>
            `;
            return;
        }
        
        bookmarkedAffirmationsContainer.innerHTML = '';
        bookmarked.forEach(affirmation => {
            const affirmationCard = document.createElement('div');
            affirmationCard.className = 'affirmation-card bg-indigo-50 rounded-lg p-4 relative';
            affirmationCard.innerHTML = `
                <div class="bilingual-display">
                    <p class="text-indigo-800 mb-1 en">${affirmation.en}</p>
                    <p class="text-indigo-700 text-sm chinese-text zh">${affirmation.zh || ''}</p>
                </div>
                <div class="absolute top-2 right-2 flex space-x-1">
                    ${affirmation.isCustom ? `
                    <button class="edit-affirmation-btn text-indigo-400 hover:text-indigo-600 p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    ` : ''}
                    <button class="remove-bookmark text-indigo-400 hover:text-indigo-600 p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            `;
            
            const removeBtn = affirmationCard.querySelector('.remove-bookmark');
            removeBtn.addEventListener('click', () => {
                const updatedBookmarks = JSON.parse(localStorage.getItem('bookmarkedAffirmations')).filter(item => item.en !== affirmation.en);
                localStorage.setItem('bookmarkedAffirmations', JSON.stringify(updatedBookmarks));
                renderBookmarkedAffirmations();
                
                // Update current affirmation bookmark icon if displayed
                if (currentAffirmation && currentAffirmation.en === affirmation.en) {
                    affirmationDisplay.querySelector('.bookmark-icon').classList.remove('active');
                }
            });
            
            const editBtn = affirmationCard.querySelector('.edit-affirmation-btn');
            if (editBtn) {
                editBtn.addEventListener('click', () => openEditAffirmationModal(affirmation));
            }
            
            bookmarkedAffirmationsContainer.appendChild(affirmationCard);
        });
    }

    // Add custom affirmation functionality
    addAffirmationBtn.addEventListener('click', () => {
        openModal('add-affirmation-modal');
    });
    
    document.getElementById('add-affirmation-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const enText = document.getElementById('new-affirmation-en').value.trim();
        const zhText = document.getElementById('new-affirmation-zh').value.trim();
        
        if (enText) {
            const customAffirmations = JSON.parse(localStorage.getItem('customAffirmations')) || [];
            const newAffirmation = {
                en: enText,
                zh: zhText || enText, // If no translation, use English text
                isCustom: true
            };
            
            customAffirmations.push(newAffirmation);
            localStorage.setItem('customAffirmations', JSON.stringify(customAffirmations));
            
            // Clear form and close modal
            document.getElementById('new-affirmation-en').value = '';
            document.getElementById('new-affirmation-zh').value = '';
            closeAllModals();
            
            // Display the new affirmation
            displayAffirmation(newAffirmation);
            
            // Update bookmarked list if filter is set to custom
            if (currentFilter === 'custom') {
                renderBookmarkedAffirmations();
            }
        }
    });
    
    // Edit custom affirmation functionality
    function openEditAffirmationModal(affirmation) {
        document.getElementById('edit-affirmation-id').value = affirmation.en; // Use English text as ID
        document.getElementById('edit-affirmation-en').value = affirmation.en;
        document.getElementById('edit-affirmation-zh').value = affirmation.zh || '';
        openModal('edit-affirmation-modal');
    }
    
    document.getElementById('edit-affirmation-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const originalEn = document.getElementById('edit-affirmation-id').value;
        const newEn = document.getElementById('edit-affirmation-en').value.trim();
        const newZh = document.getElementById('edit-affirmation-zh').value.trim();
        
        if (newEn) {
            // Update in custom affirmations
            const customAffirmations = JSON.parse(localStorage.getItem('customAffirmations')) || [];
            const index = customAffirmations.findIndex(item => item.en === originalEn);
            
            if (index !== -1) {
                customAffirmations[index] = {
                    en: newEn,
                    zh: newZh || newEn,
                    isCustom: true
                };
                localStorage.setItem('customAffirmations', JSON.stringify(customAffirmations));
            }
            
            // Update in bookmarked affirmations if present
            const bookmarked = JSON.parse(localStorage.getItem('bookmarkedAffirmations'));
            const bookmarkIndex = bookmarked.findIndex(item => item.en === originalEn);
            
            if (bookmarkIndex !== -1) {
                bookmarked[bookmarkIndex] = {
                    en: newEn,
                    zh: newZh || newEn,
                    isCustom: true
                };
                localStorage.setItem('bookmarkedAffirmations', JSON.stringify(bookmarked));
            }
            
            // Update current affirmation if it's the one being edited
            if (currentAffirmation && currentAffirmation.en === originalEn) {
                currentAffirmation = {
                    en: newEn,
                    zh: newZh || newEn,
                    isCustom: true
                };
                displayAffirmation(currentAffirmation);
            }
            
            closeAllModals();
            renderBookmarkedAffirmations();
        }
    });
    
    // Filter functionality
    filterAllBtn.addEventListener('click', () => {
        currentFilter = 'all';
        filterAllBtn.classList.add('bg-indigo-100', 'active-filter');
        filterAllBtn.classList.remove('bg-indigo-50');
        filterCustomBtn.classList.add('bg-indigo-50');
        filterCustomBtn.classList.remove('bg-indigo-100', 'active-filter');
        renderBookmarkedAffirmations();
    });
    
    filterCustomBtn.addEventListener('click', () => {
        currentFilter = 'custom';
        filterCustomBtn.classList.add('bg-indigo-100', 'active-filter');
        filterCustomBtn.classList.remove('bg-indigo-50');
        filterAllBtn.classList.add('bg-indigo-50');
        filterAllBtn.classList.remove('bg-indigo-100', 'active-filter');
        renderBookmarkedAffirmations();
    });
    
    // Export affirmations functionality
    exportAffirmationsBtn.addEventListener('click', () => {
        const bookmarked = JSON.parse(localStorage.getItem('bookmarkedAffirmations'));
        if (bookmarked.length === 0) {
            alert('No bookmarked affirmations to export.');
            return;
        }
        
        let exportText = "My Affirmations\n\n";
        bookmarked.forEach(affirmation => {
            exportText += `${affirmation.en}\n${affirmation.zh || ''}\n\n`;
        });
        
        const blob = new Blob([exportText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my-affirmations.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    newAffirmationBtn.addEventListener('click', () => {
        const affirmation = getRandomAffirmation();
        displayAffirmation(affirmation);
    });

    // Control List functionality
    const inControlList = document.getElementById('in-control-list');
    const notControlList = document.getElementById('not-control-list');
    const inControlInput = document.getElementById('in-control-input');
    const notControlInput = document.getElementById('not-control-input');
    const addInControlBtn = document.getElementById('add-in-control-btn');
    const addNotControlBtn = document.getElementById('add-not-control-btn');
    const exportControlBtn = document.getElementById('export-control-btn');

    function renderControlLists() {
        const inControlItems = JSON.parse(localStorage.getItem('inControlItems'));
        const notControlItems = JSON.parse(localStorage.getItem('notControlItems'));
        
        inControlList.innerHTML = '';
        inControlItems.forEach(item => {
            const li = document.createElement('li');
            li.className = 'flex items-center justify-between bg-green-50 p-3 rounded-md';
            li.innerHTML = `
                <span class="text-green-800">${item}</span>
                <button class="remove-in-control text-green-600 hover:text-green-800 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            `;
            
            const removeBtn = li.querySelector('.remove-in-control');
            removeBtn.addEventListener('click', () => {
                const updatedItems = inControlItems.filter(i => i !== item);
                localStorage.setItem('inControlItems', JSON.stringify(updatedItems));
                renderControlLists();
            });
            
            inControlList.appendChild(li);
        });
        
        notControlList.innerHTML = '';
        notControlItems.forEach(item => {
            const li = document.createElement('li');
            li.className = 'flex items-center justify-between bg-red-50 p-3 rounded-md';
            li.innerHTML = `
                <span class="text-red-800">${item}</span>
                <button class="remove-not-control text-red-600 hover:text-red-800 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            `;
            
            const removeBtn = li.querySelector('.remove-not-control');
            removeBtn.addEventListener('click', () => {
                const updatedItems = notControlItems.filter(i => i !== item);
                localStorage.setItem('notControlItems', JSON.stringify(updatedItems));
                renderControlLists();
            });
            
            notControlList.appendChild(li);
        });
    }

    addInControlBtn.addEventListener('click', () => {
        const newItem = inControlInput.value.trim();
        if (newItem) {
            const inControlItems = JSON.parse(localStorage.getItem('inControlItems'));
            inControlItems.push(newItem);
            localStorage.setItem('inControlItems', JSON.stringify(inControlItems));
            inControlInput.value = '';
            renderControlLists();
        }
    });

    addNotControlBtn.addEventListener('click', () => {
        const newItem = notControlInput.value.trim();
        if (newItem) {
            const notControlItems = JSON.parse(localStorage.getItem('notControlItems'));
            notControlItems.push(newItem);
            localStorage.setItem('notControlItems', JSON.stringify(notControlItems));
            notControlInput.value = '';
            renderControlLists();
        }
    });
    
    // Export control lists
    exportControlBtn.addEventListener('click', () => {
        const inControlItems = JSON.parse(localStorage.getItem('inControlItems'));
        const notControlItems = JSON.parse(localStorage.getItem('notControlItems'));
        
        let exportText = "What's In My Control\n\n";
        exportText += "✅ In My Control:\n";
        inControlItems.forEach(item => {
            exportText += `- ${item}\n`;
        });
        
        exportText += "\n❌ Not In My Control:\n";
        notControlItems.forEach(item => {
            exportText += `- ${item}\n`;
        });
        
        const blob = new Blob([exportText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my-control-list.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Self-Talk functionality
    const selfTalkScripts = [
        {
            title: "When Feeling Overwhelmed",
            en: "I don't have to solve everything today — just one small thing.",
            zh: "我不需要今天就解决所有问题，只要做一件小事就好。"
        },
        {
            title: "When Feeling Anxious",
            en: "I feel scared right now — that's okay. It means I care.",
            zh: "我现在感到害怕 — 这没关系。这表示我在乎。"
        },
        {
            title: "When Feeling Inadequate",
            en: "I am doing my best with what I have right now, and that is enough.",
            zh: "我正在尽我所能，用我现有的资源做到最好，这已经足够了。"
        },
        {
            title: "When Feeling Stuck",
            en: "This is just a moment in time. I've moved through difficult moments before.",
            zh: "这只是时间中的一个时刻。我以前也曾度过困难的时刻。"
        }
    ];

    const selfTalkDisplay = document.getElementById('self-talk-display');
    const selfTalkBtns = document.querySelectorAll('.self-talk-btn');

    selfTalkBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const scriptId = parseInt(btn.getAttribute('data-id'));
            const script = selfTalkScripts[scriptId];
            
            selfTalkDisplay.innerHTML = `
                <h3 class="text-lg font-semibold text-teal-800 mb-3">${script.title}</h3>
                <div class="bilingual-display">
                    <p class="text-teal-800 text-xl mb-3 en">${script.en}</p>
                    <p class="text-teal-700 text-lg chinese-text zh">${script.zh}</p>
                </div>
            `;
        });
    });

    // Tiny Wins functionality
    const tinyWinsForm = document.getElementById('tiny-wins-form');
    const survivedInput = document.getElementById('survived-input');
    const actionInput = document.getElementById('action-input');
    const selfcareInput = document.getElementById('selfcare-input');
    const winsHistory = document.getElementById('wins-history');
    const exportWinsBtn = document.getElementById('export-wins-btn');
    const winsViewAll = document.getElementById('wins-view-all');
    const winsViewWeek = document.getElementById('wins-view-week');
    
    let winsFilter = 'all';

    function renderTinyWins() {
        let wins = JSON.parse(localStorage.getItem('tinyWins'));
        
        // Apply filter if needed
        if (winsFilter === 'week') {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            wins = wins.filter(win => new Date(win.date) >= oneWeekAgo);
        }
        
        if (wins.length === 0) {
            winsHistory.innerHTML = `
                <p class="text-gray-500 text-center py-4">Your tiny wins will appear here</p>
            `;
            return;
        }
        
        winsHistory.innerHTML = '';
        wins.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(win => {
            const winItem = document.createElement('div');
            winItem.className = 'tiny-win-item bg-amber-50 rounded-lg p-4';
            
            const date = new Date(win.date);
            const formattedDate = `${date.toLocaleDateString()}`;
            
            winItem.innerHTML = `
                <div class="flex justify-between items-center mb-2">
                    <h4 class="font-semibold text-amber-900">${formattedDate}</h4>
                    <button class="remove-win text-amber-400 hover:text-amber-600 p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <p class="text-amber-800 mb-1"><span class="font-medium">I survived:</span> ${win.survived}</p>
                <p class="text-amber-800 mb-1"><span class="font-medium">I took action by:</span> ${win.action}</p>
                <p class="text-amber-800"><span class="font-medium">Self-care:</span> ${win.selfcare}</p>
            `;
            
            const removeBtn = winItem.querySelector('.remove-win');
            removeBtn.addEventListener('click', () => {
                const updatedWins = JSON.parse(localStorage.getItem('tinyWins')).filter(item => item.date !== win.date);
                localStorage.setItem('tinyWins', JSON.stringify(updatedWins));
                renderTinyWins();
            });
            
            winsHistory.appendChild(winItem);
        });
    }

    tinyWinsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const survived = survivedInput.value.trim();
        const action = actionInput.value.trim();
        const selfcare = selfcareInput.value.trim();
        
        if (survived || action || selfcare) {
            const wins = JSON.parse(localStorage.getItem('tinyWins'));
            const today = new Date().toISOString().split('T')[0];
            
            // Check if there's already an entry for today
            const todayIndex = wins.findIndex(win => win.date.startsWith(today));
            
            if (todayIndex !== -1) {
                // Update today's entry
                wins[todayIndex] = {
                    date: today,
                    survived: survived || wins[todayIndex].survived,
                    action: action || wins[todayIndex].action,
                    selfcare: selfcare || wins[todayIndex].selfcare
                };
            } else {
                // Add new entry
                wins.push({
                    date: today,
                    survived: survived || "—",
                    action: action || "—",
                    selfcare: selfcare || "—"
                });
            }
            
            localStorage.setItem('tinyWins', JSON.stringify(wins));
            
            // Clear form
            survivedInput.value = '';
            actionInput.value = '';
            selfcareInput.value = '';
            
            renderTinyWins();
        }
    });
    
    // Wins filter functionality
    winsViewAll.addEventListener('click', () => {
        winsFilter = 'all';
        winsViewAll.classList.add('bg-amber-100', 'active-filter');
        winsViewAll.classList.remove('bg-amber-50');
        winsViewWeek.classList.add('bg-amber-50');
        winsViewWeek.classList.remove('bg-amber-100', 'active-filter');
        renderTinyWins();
    });
    
    winsViewWeek.addEventListener('click', () => {
        winsFilter = 'week';
        winsViewWeek.classList.add('bg-amber-100', 'active-filter');
        winsViewWeek.classList.remove('bg-amber-50');
        winsViewAll.classList.add('bg-amber-50');
        winsViewAll.classList.remove('bg-amber-100', 'active-filter');
        renderTinyWins();
    });
    
    // Export wins functionality
    exportWinsBtn.addEventListener('click', () => {
        const wins = JSON.parse(localStorage.getItem('tinyWins'));
        if (wins.length === 0) {
            alert('No tiny wins to export.');
            return;
        }
        
        let exportText = "My Tiny Wins Journal\n\n";
        wins.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(win => {
            const date = new Date(win.date);
            const formattedDate = date.toLocaleDateString();
            
            exportText += `Date: ${formattedDate}\n`;
            exportText += `I survived: ${win.survived}\n`;
            exportText += `I took action by: ${win.action}\n`;
            exportText += `Self-care: ${win.selfcare}\n\n`;
        });
        
        const blob = new Blob([exportText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my-tiny-wins.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    
    // Set up daily reminder notification (if browser supports it)
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                // Check if we should show a notification (once per day)
                const lastNotification = localStorage.getItem('lastNotification');
                const today = new Date().toDateString();
                
                if (lastNotification !== today) {
                    setTimeout(() => {
                        new Notification('Self-Compassion Reminder', {
                            body: "You've done enough today — be kind to yourself.",
                            icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234c1d95"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>'
                        });
                        localStorage.setItem('lastNotification', today);
                    }, 10000); // Show after 10 seconds of using the app
                }
            }
        });
    }
    
    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
            if (document.getElementById('home-screen').classList.contains('hidden')) {
                showHome();
            }
        }
    });
    
    // Add touch feedback for mobile
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('touchstart', () => {
            button.style.transform = 'scale(0.95)';
        });
        button.addEventListener('touchend', () => {
            button.style.transform = 'scale(1)';
        });
    });
});