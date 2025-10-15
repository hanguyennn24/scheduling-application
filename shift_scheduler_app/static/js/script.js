// Use centralized translations (window.translations / window.t) if available.
// Fallbacks are applied so page still works if translations.js isn't loaded.
function _getTranslations() {
    if (window && window.translations) return window.translations;
    // fallback to an empty object to avoid checks elsewhere
    return {};
}

function _getCurrentLang() {
    if (window && window.currentLanguage) return window.currentLanguage;
    // try URL/localStorage fallback similar to translations.js
    try {
        const params = new URLSearchParams(window.location.search);
        const langFromUrl = params.get('lang');
        const stored = (localStorage.getItem && localStorage.getItem('lang')) || null;
        return langFromUrl || stored || 'en';
    } catch (e) {
        return 'en';
    }
}

function updateLanguage(lang) {
    // set global currentLanguage so translations.js and other scripts can read it
    if (window) window.currentLanguage = lang;
    const translations = _getTranslations();
    const t = (window && window.t) ? window.t : function(k) { return (translations[lang] && translations[lang][k]) ? translations[lang][k] : k; };

    document.querySelectorAll('[data-i18n]').forEach(elem => {
        const key = elem.getAttribute('data-i18n');
        if (!key) return;
        try {
            elem.textContent = t(key);
        } catch (e) {}
    });

    // Update day labels in Working Days section
    const dayLabels = document.querySelectorAll('.day-label');
    const dayMapping = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    dayLabels.forEach((label, index) => {
        const dm = dayMapping[index];
        if (dm) {
            const v = (translations[lang] && translations[lang][dm]) ? translations[lang][dm] : label.textContent;
            label.textContent = v;
        }
    });

    // Update shift names in existing default shifts
    document.querySelectorAll('.shift-name').forEach((input, index) => {
        const val = input.value;
        try {
            const en = (translations['en'] && translations['en'].morning) ? translations['en'].morning : 'Morning';
            const fr = (translations['fr'] && translations['fr'].morning) ? translations['fr'].morning : 'Morning';
            const vi = (translations['vi'] && translations['vi'].morning) ? translations['vi'].morning : 'Morning';
            const nl = (translations['nl'] && translations['nl'].morning) ? translations['nl'].morning : 'Morning';
            if (index === 0 && (val === 'Morning' || val === en || val === fr || val === vi || val === nl)) {
                input.value = (translations[lang] && translations[lang].morning) ? translations[lang].morning : input.value;
            } else if (index === 1 && (val === 'Afternoon' || val === ((translations['en'] && translations['en'].afternoon) ? translations['en'].afternoon : 'Afternoon'))) {
                input.value = (translations[lang] && translations[lang].afternoon) ? translations[lang].afternoon : input.value;
            } else if (index === 2 && (val === 'Evening' || val === ((translations['en'] && translations['en'].evening) ? translations['en'].evening : 'Evening'))) {
                input.value = (translations[lang] && translations[lang].evening) ? translations[lang].evening : input.value;
            }
        } catch (e) {}
    });

    // Update "Shift Name" and "Hours" labels in shift configuration
    document.querySelectorAll('.shift-input-group label').forEach(label => {
        try {
            const shiftNameVal = (translations[lang] && translations[lang].shift_name) ? translations[lang].shift_name : 'Shift Name';
            const hoursVal = (translations[lang] && translations[lang].hours) ? translations[lang].hours : 'Hours';
            if (label.textContent.trim() === 'Shift Name' || label.textContent.trim() === shiftNameVal) {
                label.textContent = shiftNameVal;
            } else if (label.textContent.trim() === 'Hours' || label.textContent.trim() === hoursVal) {
                label.textContent = hoursVal;
            }
        } catch (e) {}
    });

    // Update Staffing Requirements checkboxes
    const sameMinMaxAllLabel = document.querySelector('label[for="sameMinMaxForAllShifts"]');
    if (sameMinMaxAllLabel) {
        sameMinMaxAllLabel.textContent = (translations[lang] && translations[lang].apply_same_minmax_all) ? translations[lang].apply_same_minmax_all : sameMinMaxAllLabel.textContent;
    }

    const sameMinMaxPerShiftLabel = document.querySelector('label[for="sameMinMaxPerShiftAllDays"]');
    if (sameMinMaxPerShiftLabel) {
        sameMinMaxPerShiftLabel.textContent = (translations[lang] && translations[lang].apply_same_minmax_per_shift) ? translations[lang].apply_same_minmax_per_shift : sameMinMaxPerShiftLabel.textContent;
    }

    // Update global min/max labels
    const minMaxGlobalLabels = document.querySelectorAll('#minMaxGlobalInput .input-wrapper label');
    if (minMaxGlobalLabels.length >= 2) {
        minMaxGlobalLabels[0].textContent = (translations[lang] && translations[lang].minimum_employees) ? translations[lang].minimum_employees : minMaxGlobalLabels[0].textContent;
        minMaxGlobalLabels[1].textContent = (translations[lang] && translations[lang].maximum_employees) ? translations[lang].maximum_employees : minMaxGlobalLabels[1].textContent;
    }

    const ignoreMinLabel = document.querySelector('label[for="ignoreMinEmpGlobal"]');
    if (ignoreMinLabel) {
        ignoreMinLabel.textContent = (translations[lang] && translations[lang].ignore_min_constraint) ? translations[lang].ignore_min_constraint : ignoreMinLabel.textContent;
    }

    const ignoreMaxLabel = document.querySelector('label[for="ignoreMaxEmpGlobal"]');
    if (ignoreMaxLabel) {
        ignoreMaxLabel.textContent = (translations[lang] && translations[lang].ignore_max_constraint) ? translations[lang].ignore_max_constraint : ignoreMaxLabel.textContent;
    }

    // Update min/max per shift and individual text
    const perShiftText = document.querySelector('#minMaxPerShiftInput p');
    if (perShiftText) {
        perShiftText.textContent = (translations[lang] && translations[lang].set_minmax_per_shift) ? translations[lang].set_minmax_per_shift : perShiftText.textContent;
    }

    const individualText = document.querySelector('#minMaxIndividualInput p');
    if (individualText) {
        individualText.textContent = (translations[lang] && translations[lang].set_minmax_each_shift) ? translations[lang].set_minmax_each_shift : individualText.textContent;
    }

    // Update Additional Settings
    const fullTimeLabel = document.querySelector('label[for="fullTimeHours"]');
    if (fullTimeLabel) {
        fullTimeLabel.textContent = (translations[lang] && translations[lang].fulltime_hours_label) ? translations[lang].fulltime_hours_label : fullTimeLabel.textContent;
    }

    const setZeroText = document.querySelector('#fullTimeHours + small');
    if (setZeroText) {
        setZeroText.textContent = (translations[lang] && translations[lang].set_zero_ignore) ? translations[lang].set_zero_ignore : setZeroText.textContent;
    }

    const responsibleReqLabel = document.querySelector('label[for="responsibleRequiredOverall"]');
    if (responsibleReqLabel) {
        responsibleReqLabel.textContent = (translations[lang] && translations[lang].require_responsible) ? translations[lang].require_responsible : responsibleReqLabel.textContent;
    }

    // Update day names in minmax grid if it exists
    if (typeof populateMinMaxGrid === 'function') {
        populateMinMaxGrid();
    }

    // Update per shift minmax if visible
    if (typeof populatePerShiftMinMax === 'function' && document.getElementById('minMaxPerShiftInput').style.display !== 'none') {
        populatePerShiftMinMax();
    }

    // Update employee name inputs before regenerating grids
    document.querySelectorAll('.employee-section').forEach(section => {
        const employeeId = section.dataset.employeeId;
        const nameInput = section.querySelector(`.employee-name-input[data-employee-id="${employeeId}"]`);
        if (nameInput && nameInput.value) {
            // If the current value matches any language's autogenerated default, replace it.
            const isAuto = Object.keys(translations).some(l => {
                return translations[l] && translations[l].employee && nameInput.value === `${translations[l].employee} ${employeeId}`;
            });
            if (isAuto) {
                nameInput.value = (translations[lang] && translations[lang].employee) ? `${translations[lang].employee} ${employeeId}` : nameInput.value;
            }
        }
    });

    // Update employee section labels
    document.querySelectorAll('.employee-section').forEach(section => {
        const employeeId = section.dataset.employeeId;

        // Update Weekly Hours header
        const weeklyHoursHeader = section.querySelector('.min-max-hours-section h6');
        if (weeklyHoursHeader) {
            weeklyHoursHeader.textContent = (translations[lang] && translations[lang].weekly_hours) ? translations[lang].weekly_hours : weeklyHoursHeader.textContent;
        }

        // Update Min/Max Hours labels
        const labels = section.querySelectorAll('.min-max-hours-section .form-label');
        if (labels.length >= 2) {
            labels[0].textContent = (translations[lang] && translations[lang].min_hours) ? translations[lang].min_hours : labels[0].textContent;
            labels[1].textContent = (translations[lang] && translations[lang].max_hours) ? translations[lang].max_hours : labels[1].textContent;
        }

        // Update Unlimited and Full-time labels
        const unlimitedLabel = section.querySelector(`label[for="unlimitedHours${employeeId}"]`);
        if (unlimitedLabel) {
            unlimitedLabel.textContent = (translations[lang] && translations[lang].unlimited) ? translations[lang].unlimited : unlimitedLabel.textContent;
        }

        const fulltimeLabel = section.querySelector(`label[for="fulltimeHours${employeeId}"]`);
        if (fulltimeLabel) {
            fulltimeLabel.textContent = (translations[lang] && translations[lang].fulltime) ? translations[lang].fulltime : fulltimeLabel.textContent;
        }

        // Update Hourly Wage label
        const wageLabel = section.querySelector('.wage-section > .form-label');
        if (wageLabel) {
            wageLabel.textContent = ((translations[lang] && translations[lang].hourly_wage) ? translations[lang].hourly_wage : wageLabel.textContent) + ' ($)';
        }

        // Update Apply to all label
        const applyAllLabel = section.querySelector(`label[for="sameWage${employeeId}"]`);
        if (applyAllLabel) {
            applyAllLabel.textContent = (translations[lang] && translations[lang].apply_to_all) ? translations[lang].apply_to_all : applyAllLabel.textContent;
        }

        // Update Can be responsible label
        const responsibleLabel = section.querySelector(`label[for="canBeResponsible${employeeId}"]`);
        if (responsibleLabel) {
            responsibleLabel.textContent = (translations[lang] && translations[lang].can_be_responsible) ? translations[lang].can_be_responsible : responsibleLabel.textContent;
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const languageSelector = document.getElementById('languageSelector');

    // respond to global language changes triggered elsewhere
    document.addEventListener('languageChanged', function(e) {
        const newLang = (e && e.detail && e.detail.lang) ? e.detail.lang : (window && window.currentLanguage) ? window.currentLanguage : _getCurrentLang();
        if (languageSelector) languageSelector.value = newLang;
        try { updateLanguage(newLang); } catch(e) {}
    });

    function updateLinksAndForms(lang) {
        // attach lang to internal anchors and forms
        document.querySelectorAll('a[href]').forEach(a => {
            try {
                const href = a.getAttribute('href');
                if (!href) return;
                if (href.startsWith('http') && (new URL(href)).origin !== location.origin) return;
                const url = new URL(href, location.origin);
                url.searchParams.set('lang', lang);
                if (href.startsWith('/')) {
                    a.setAttribute('href', url.pathname + url.search + url.hash);
                } else {
                    a.setAttribute('href', url.toString());
                }
            } catch (e) {}
        });

        document.querySelectorAll('form[action]').forEach(f => {
            try {
                const action = f.getAttribute('action');
                if (!action) return;
                if (action.startsWith('http') && (new URL(action)).origin !== location.origin) return;
                const url = new URL(action, location.origin);
                url.searchParams.set('lang', lang);
                if (action.startsWith('/')) {
                    f.setAttribute('action', url.pathname + url.search + url.hash);
                } else {
                    f.setAttribute('action', url.toString());
                }
            } catch (e) {}
        });
    }

    if (languageSelector) {
        languageSelector.addEventListener('change', function() {
            const lang = this.value;
            // use centralized setter so all pages/scripts receive same event
            try { window.setLanguage(lang); } catch(e) { try { localStorage.setItem('lang', lang); } catch(e) {} }
            // Regenerate dynamic content with new language
            toggleMinMaxInput();
            updatePhase2UI();
            updateLinksAndForms(lang);
        });
    }
    
    const daysCheckboxes = document.querySelectorAll('.day-checkbox');
    const shiftsContainer = document.getElementById('shiftsContainer');
    const addShiftBtn = document.getElementById('addShiftBtn');
    const employeeSectionsContainer = document.getElementById('employeeSections');
    const addEmployeeBtn = document.getElementById('addEmployeeBtn');
    const submitScheduleBtn = document.getElementById('submitScheduleBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultsDiv = document.getElementById('results');
    const scheduleOutput = document.getElementById('scheduleOutput');
    const totalCostOutput = document.getElementById('totalCostOutput');
    const responsibleRequiredOverallCheckbox = document.getElementById('responsibleRequiredOverall');
    const errorDisplay = document.getElementById('errorDisplay');

    const minMaxGrid = document.getElementById('minMaxGrid');
    const sameMinMaxForAllShiftsCheckbox = document.getElementById('sameMinMaxForAllShifts');
    const sameMinMaxPerShiftAllDaysCheckbox = document.getElementById('sameMinMaxPerShiftAllDays');
    const minMaxGlobalInput = document.getElementById('minMaxGlobalInput');
    const minMaxPerShiftInput = document.getElementById('minMaxPerShiftInput');
    const minMaxIndividualInput = document.getElementById('minMaxIndividualInput');
    const perShiftMinMaxContainer = document.getElementById('perShiftMinMaxContainer');
    const globalMinEmpInput = document.getElementById('globalMinEmp');
    const globalMaxEmpInput = document.getElementById('globalMaxEmp');
    const ignoreMinEmpGlobalCheckbox = document.getElementById('ignoreMinEmpGlobal');
    const ignoreMaxEmpGlobalCheckbox = document.getElementById('ignoreMaxEmpGlobal');

    let employeeCounter = 0;
    let selectedDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    let currentShifts = [
        { name: 'Morning', hours: 4 },
        { name: 'Afternoon', hours: 4 },
        { name: 'Evening', hours: 4 }
    ];

    // --- Phase Navigation ---
    window.nextPhase = function() {
        const phase1 = document.getElementById('phase1');
        const phase2 = document.getElementById('phase2');
        const step1Indicator = document.getElementById('step1-indicator');
        const step2Indicator = document.getElementById('step2-indicator');

        phase1.classList.remove('active');
        phase2.classList.add('active');
        
        step1Indicator.classList.remove('active');
        step1Indicator.classList.add('completed');
        step2Indicator.classList.add('active');

        updatePhase2UI();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.prevPhase = function() {
        const phase1 = document.getElementById('phase1');
        const phase2 = document.getElementById('phase2');
        const step1Indicator = document.getElementById('step1-indicator');
        const step2Indicator = document.getElementById('step2-indicator');

        phase2.classList.remove('active');
        phase1.classList.add('active');
        
        step2Indicator.classList.remove('active');
        step1Indicator.classList.remove('completed');
        step1Indicator.classList.add('active');

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- Utility Functions ---
    function getSelectedDays() {
        return Array.from(daysCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
    }

    function getShiftDetails() {
        const shifts = [];
        document.querySelectorAll('.shift-row').forEach(entry => {
            const name = entry.querySelector('.shift-name').value.trim();
            const hours = parseInt(entry.querySelector('.shift-hours').value);
            if (name && !isNaN(hours) && hours > 0) {
                shifts.push({ name: name, hours: hours });
            }
        });
        return shifts;
    }

    function updatePhase2UI() {
        selectedDays = getSelectedDays();
        currentShifts = getShiftDetails();

        document.querySelectorAll('.employee-section').forEach(section => {
            const employeeId = section.dataset.employeeId;
            const employeeNameInput = section.querySelector('.employee-name-input');
            const employeeName = employeeNameInput ? employeeNameInput.value : `Employee ${employeeId}`;

            const oldGrid = section.querySelector('.availability-grid');
            if (oldGrid) {
                oldGrid.remove();
            }
            
            const newGrid = createAvailabilityGrid(employeeId, employeeName);
            const minMaxHoursSection = section.querySelector('.min-max-hours-section');
            if (minMaxHoursSection) {
                minMaxHoursSection.parentNode.insertBefore(newGrid, minMaxHoursSection);
            }

            const canBeResponsibleSection = section.querySelector('.can-be-responsible-section');
            // Always show the per-employee "can be responsible" control so users can mark eligible employees
            if (canBeResponsibleSection) {
                canBeResponsibleSection.style.display = 'block';
            }
        });
    }

    // --- Phase 1: Dynamic UI Generation ---
    function populateMinMaxGrid() {
        minMaxGrid.innerHTML = '';
        const days = getSelectedDays();
        const shifts = getShiftDetails();

        if (days.length === 0 || shifts.length === 0) {
            const lang = (window && window.currentLanguage) ? window.currentLanguage : _getCurrentLang();
            const translationsObj = _getTranslations();
            const t = (window && window.t) ? window.t : function(k) { return (translationsObj[lang] && translationsObj[lang][k]) ? translationsObj[lang][k] : k; };
            minMaxGrid.innerHTML = `<p class="text-muted">${t('please_select_days_shifts') || 'Please select days and define shifts first.'}</p>`;
            return;
        }

        const lang = (window && window.currentLanguage) ? window.currentLanguage : _getCurrentLang();
        const translationsObj = _getTranslations();
        const t = (window && window.t) ? window.t : function(k) { return (translationsObj[lang] && translationsObj[lang][k]) ? translationsObj[lang][k] : k; };
        const dayNames = {
            'Mon': t('monday'),
            'Tue': t('tuesday'),
            'Wed': t('wednesday'),
            'Thu': t('thursday'),
            'Fri': t('friday'),
            'Sat': t('saturday'),
            'Sun': t('sunday')
        };

        days.forEach(day => {
            // Create day group container
            const dayGroup = document.createElement('div');
            dayGroup.classList.add('day-group');

            // Create day header
            const dayHeader = document.createElement('div');
            dayHeader.classList.add('day-group-header');
            dayHeader.textContent = dayNames[day] || day;
            dayGroup.appendChild(dayHeader);

            // Create shift entries for this day
            shifts.forEach(shift => {
                const div = document.createElement('div');
                div.classList.add('min-max-entry');
                div.innerHTML = `
                    <label>${shift.name}:</label>
                    Min: <input type="number" class="form-control min-emp-input" data-day="${day}" data-shift="${shift.name}" value="1" min="0">
                    Max: <input type="number" class="form-control max-emp-input" data-day="${day}" data-shift="${shift.name}" value="5" min="0">
                `;
                dayGroup.appendChild(div);
            });

            minMaxGrid.appendChild(dayGroup);
        });
    }

    function populatePerShiftMinMax() {
        perShiftMinMaxContainer.innerHTML = '';
        const shifts = getShiftDetails();

        if (shifts.length === 0) {
            const lang = (window && window.currentLanguage) ? window.currentLanguage : _getCurrentLang();
            const translationsObj = _getTranslations();
            const t = (window && window.t) ? window.t : function(k) { return (translationsObj[lang] && translationsObj[lang][k]) ? translationsObj[lang][k] : k; };
            perShiftMinMaxContainer.innerHTML = `<p class="text-muted">${t('please_define_shifts') || 'Please define shifts first.'}</p>`;
            return;
        }

        shifts.forEach(shift => {
            const div = document.createElement('div');
            div.classList.add('input-wrapper');
            div.innerHTML = `
                <label>${shift.name}</label>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <span style="font-size: 0.85rem; color: #64748b;">Min:</span>
                    <input type="number" class="form-control per-shift-min-input" data-shift="${shift.name}" value="1" min="0" style="width: 80px;">
                    <span style="font-size: 0.85rem; color: #64748b;">Max:</span>
                    <input type="number" class="form-control per-shift-max-input" data-shift="${shift.name}" value="5" min="0" style="width: 80px;">
                </div>
            `;
            perShiftMinMaxContainer.appendChild(div);
        });
    }

    function toggleMinMaxInput() {
        if (sameMinMaxForAllShiftsCheckbox.checked) {
            minMaxGlobalInput.style.display = 'block';
            minMaxPerShiftInput.style.display = 'none';
            minMaxIndividualInput.style.display = 'none';
            sameMinMaxPerShiftAllDaysCheckbox.checked = false;
            sameMinMaxPerShiftAllDaysCheckbox.disabled = true;
        } else if (sameMinMaxPerShiftAllDaysCheckbox.checked) {
            minMaxGlobalInput.style.display = 'none';
            minMaxPerShiftInput.style.display = 'block';
            minMaxIndividualInput.style.display = 'none';
            populatePerShiftMinMax();
        } else {
            minMaxGlobalInput.style.display = 'none';
            minMaxPerShiftInput.style.display = 'none';
            minMaxIndividualInput.style.display = 'block';
            sameMinMaxPerShiftAllDaysCheckbox.disabled = false;
            populateMinMaxGrid();
        }
    }

    sameMinMaxForAllShiftsCheckbox.addEventListener('change', toggleMinMaxInput);
    sameMinMaxPerShiftAllDaysCheckbox.addEventListener('change', toggleMinMaxInput);
    toggleMinMaxInput();

    // Ensure 'Require responsible person per shift' checkbox is clickable even if surrounding layout layers
    // might intercept pointer events in some themes. Add a label click fallback and ensure pointer-events.
    (function makeResponsibleCheckboxReliable() {
        const label = document.querySelector('label[for="responsibleRequiredOverall"]');
        if (label && responsibleRequiredOverallCheckbox) {
            // ensure label allows pointer events
            label.style.pointerEvents = 'auto';
            // clicking the label should toggle the checkbox (some browsers do this automatically if for/id match,
            // but we add a fallback in case CSS or overlays break it)
            label.addEventListener('click', function(e) {
                e.preventDefault();
                responsibleRequiredOverallCheckbox.checked = !responsibleRequiredOverallCheckbox.checked;
                // trigger change handler behavior
                responsibleRequiredOverallCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
            });
            // Also ensure the checkbox itself accepts clicks
            responsibleRequiredOverallCheckbox.style.pointerEvents = 'auto';
        }
        // Also allow clicking the surrounding toggle-option container to toggle the checkbox
        const toggleContainer = document.querySelector('#responsibleRequiredOverall')?.closest('.toggle-option');
        if (toggleContainer && responsibleRequiredOverallCheckbox) {
            toggleContainer.style.cursor = 'pointer';
            toggleContainer.addEventListener('click', function(e) {
                // prevent double toggles if clicking directly on the checkbox/input
                if (e.target === responsibleRequiredOverallCheckbox) return;
                responsibleRequiredOverallCheckbox.checked = !responsibleRequiredOverallCheckbox.checked;
                responsibleRequiredOverallCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
            });
        }
    })();

    daysCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            populateMinMaxGrid();
            updatePhase2UI();
        });
    });

    shiftsContainer.addEventListener('input', (event) => {
        if (event.target.classList.contains('shift-name') || event.target.classList.contains('shift-hours')) {
            if (sameMinMaxPerShiftAllDaysCheckbox.checked) {
                populatePerShiftMinMax();
            } else {
                populateMinMaxGrid();
            }
            updatePhase2UI();
        }
    });

    addShiftBtn.addEventListener('click', function() {
        const newShiftIndex = shiftsContainer.children.length + 1;
        const div = document.createElement('div');
        div.classList.add('shift-row');
        div.innerHTML = `
            <div class="shift-input-group">
                <label>Shift Name</label>
                <input type="text" class="form-control shift-name" value="Shift ${newShiftIndex}" placeholder="e.g., Night">
            </div>
            <div class="shift-input-group">
                <label>Hours</label>
                <input type="number" class="form-control shift-hours" value="4" min="1">
            </div>
            <button type="button" class="btn btn-remove remove-shift-btn" title="Remove shift">
                <i class="bi bi-trash"></i>
            </button>
        `;
        shiftsContainer.appendChild(div);
        if (sameMinMaxPerShiftAllDaysCheckbox.checked) {
            populatePerShiftMinMax();
        } else {
            populateMinMaxGrid();
        }
        updatePhase2UI();
    });

    shiftsContainer.addEventListener('click', function(event) {
        if (event.target.closest('.remove-shift-btn')) {
            if (shiftsContainer.children.length > 1) {
                event.target.closest('.shift-row').remove();
                if (sameMinMaxPerShiftAllDaysCheckbox.checked) {
                    populatePerShiftMinMax();
                } else {
                    populateMinMaxGrid();
                }
                updatePhase2UI();
            } else {
                const lang = (window && window.currentLanguage) ? window.currentLanguage : _getCurrentLang();
                const translationsObj = _getTranslations();
                const t = (window && window.t) ? window.t : function(k) { return (translationsObj[lang] && translationsObj[lang][k]) ? translationsObj[lang][k] : k; };
                alert(t('must_have_one_shift') || "You must have at least one shift defined.");
            }
        }
    });

    responsibleRequiredOverallCheckbox.addEventListener('change', function() {
        updatePhase2UI();
    });

    // --- Phase 2: Employee Details ---
    function createAvailabilityGrid(employeeId, employeeName) {
        const gridDiv = document.createElement('div');
        gridDiv.classList.add('availability-grid');
        
    const lang = (window && window.currentLanguage) ? window.currentLanguage : _getCurrentLang();
    const translationsObj = _getTranslations();
    const t = (window && window.t) ? window.t : function(k) { return (translationsObj[lang] && translationsObj[lang][k]) ? translationsObj[lang][k] : k; };
    const headerDiv = document.createElement('h6');
    headerDiv.textContent = `${t('availability_for')} ${employeeName}:`;
        gridDiv.appendChild(headerDiv);

        const days = getSelectedDays();
        const shifts = getShiftDetails();

        if (days.length === 0 || shifts.length === 0) {
            gridDiv.innerHTML += `<p class="text-muted">${t('please_select_days_shifts') || 'Please select days and define shifts first.'}</p>`;
            return gridDiv;
        }

        const dayShortNames = {
            'Mon': t('mon'),
            'Tue': t('tue'),
            'Wed': t('wed'),
            'Thu': t('thu'),
            'Fri': t('fri'),
            'Sat': t('sat'),
            'Sun': t('sun')
        };

        // Create tab container
        const tabContainer = document.createElement('div');
        tabContainer.classList.add('availability-tabs-container');

        // Create tab buttons row
        const tabButtonsRow = document.createElement('div');
        tabButtonsRow.classList.add('availability-tabs-row');

        days.forEach((day, index) => {
            const tabButton = document.createElement('button');
            tabButton.type = 'button';
            tabButton.classList.add('availability-tab-btn');
            if (index === 0) tabButton.classList.add('active');
            tabButton.textContent = dayShortNames[day] || day;
            tabButton.dataset.day = day;
            tabButton.dataset.employeeId = employeeId;
            tabButtonsRow.appendChild(tabButton);
        });

        tabContainer.appendChild(tabButtonsRow);

        // Create tab content container
        const tabContentContainer = document.createElement('div');
        tabContentContainer.classList.add('availability-tab-content');

        days.forEach((day, index) => {
            const tabPane = document.createElement('div');
            tabPane.classList.add('availability-tab-pane');
            tabPane.dataset.day = day;
            if (index === 0) tabPane.classList.add('active');

            shifts.forEach(shift => {
                const checkboxWrapper = document.createElement('div');
                checkboxWrapper.classList.add('availability-shift-item');
                checkboxWrapper.innerHTML = `
                    <input class="form-check-input availability-checkbox" type="checkbox"
                           id="emp${employeeId}_${day}_${shift.name.replace(/\s/g, '_')}"
                           data-employee-id="${employeeId}"
                           data-day="${day}"
                           data-shift="${shift.name}" checked>
                    <label class="form-check-label" for="emp${employeeId}_${day}_${shift.name.replace(/\s/g, '_')}">
                        ${shift.name}
                    </label>
                `;
                tabPane.appendChild(checkboxWrapper);
            });

            tabContentContainer.appendChild(tabPane);
        });

        tabContainer.appendChild(tabContentContainer);
        gridDiv.appendChild(tabContainer);

        // Add tab switching functionality
        tabButtonsRow.addEventListener('click', function(e) {
            if (e.target.classList.contains('availability-tab-btn')) {
                const clickedDay = e.target.dataset.day;
                
                // Update active button
                tabButtonsRow.querySelectorAll('.availability-tab-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');

                // Update active content pane
                tabContentContainer.querySelectorAll('.availability-tab-pane').forEach(pane => {
                    pane.classList.remove('active');
                });
                tabContentContainer.querySelector(`.availability-tab-pane[data-day="${clickedDay}"]`).classList.add('active');
            }
        });

        return gridDiv;
    }

    function createEmployeeSection() {
        employeeCounter++;
        const employeeId = employeeCounter;
    const lang = (window && window.currentLanguage) ? window.currentLanguage : _getCurrentLang();
    const translationsObj = _getTranslations();
    const t = (window && window.t) ? window.t : function(k) { return (translationsObj[lang] && translationsObj[lang][k]) ? translationsObj[lang][k] : k; };
    const employeeName = `${t('employee')} ${employeeId}`;

        const div = document.createElement('div');
        div.classList.add('employee-section');
        div.dataset.employeeId = employeeId;
        div.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <input type="text" class="employee-name-input" value="${employeeName}" data-employee-id="${employeeId}">
                <button type="button" class="btn btn-remove remove-employee-btn" data-employee-id="${employeeId}" title="Remove employee">
                    <i class="bi bi-trash"></i>
                </button>
            </div>

            <div class="min-max-hours-section">
                <h6>${t('weekly_hours')}</h6>
                <div class="row g-3">
                    <div class="col-md-3">
                        <label class="form-label">${t('min_hours')}</label>
                        <input type="number" class="form-control min-hours-input" value="8" min="0" data-employee-id="${employeeId}">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">${t('max_hours')}</label>
                        <input type="number" class="form-control max-hours-input" value="40" min="0" data-employee-id="${employeeId}">
                    </div>
                    <div class="col-md-3">
                        <div class="toggle-option">
                            <input class="form-check-input unlimited-hours-checkbox" type="checkbox" id="unlimitedHours${employeeId}" data-employee-id="${employeeId}">
                            <label class="form-check-label" for="unlimitedHours${employeeId}">${t('unlimited')}</label>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="toggle-option">
                            <input class="form-check-input fulltime-hours-checkbox" type="checkbox" id="fulltimeHours${employeeId}" data-employee-id="${employeeId}">
                            <label class="form-check-label" for="fulltimeHours${employeeId}">${t('fulltime')}</label>
                        </div>
                    </div>
                </div>
            </div>

            <div class="wage-section">
                <label for="wageInput${employeeId}" class="form-label">${t('hourly_wage')} ($)</label>
                <input type="number" class="form-control wage-input" id="wageInput${employeeId}" value="15" min="0" data-employee-id="${employeeId}">
                <div class="toggle-option mt-2">
                    <input class="form-check-input same-wage-checkbox" type="checkbox" id="sameWage${employeeId}">
                    <label class="form-check-label" for="sameWage${employeeId}">${t('apply_to_all')}</label>
                </div>
            </div>

            <div class="can-be-responsible-section" style="display: block;">
                <div class="toggle-option">
                    <input class="form-check-input can-be-responsible-checkbox" type="checkbox" id="canBeResponsible${employeeId}" checked data-employee-id="${employeeId}">
                    <label class="form-check-label" for="canBeResponsible${employeeId}">${t('can_be_responsible')}</label>
                </div>
            </div>
        `;
        employeeSectionsContainer.appendChild(div);

        const availabilityGrid = createAvailabilityGrid(employeeId, employeeName);
        const minMaxHoursSection = div.querySelector('.min-max-hours-section');
        minMaxHoursSection.parentNode.insertBefore(availabilityGrid, minMaxHoursSection);

        attachEmployeeSectionListeners(div, employeeId);
    }

    function attachEmployeeSectionListeners(section, employeeId) {
        const minHoursInput = section.querySelector(`.min-hours-input[data-employee-id="${employeeId}"]`);
        const maxHoursInput = section.querySelector(`.max-hours-input[data-employee-id="${employeeId}"]`);
        const unlimitedHoursCheckbox = section.querySelector(`.unlimited-hours-checkbox[data-employee-id="${employeeId}"]`);
        const fulltimeHoursCheckbox = section.querySelector(`.fulltime-hours-checkbox[data-employee-id="${employeeId}"]`);
        const wageInput = section.querySelector(`.wage-input[data-employee-id="${employeeId}"]`);
        const sameWageCheckbox = section.querySelector(`.same-wage-checkbox#sameWage${employeeId}`);

        unlimitedHoursCheckbox.addEventListener('change', function() {
            if (this.checked) {
                minHoursInput.value = 0;
                maxHoursInput.value = 0;
                minHoursInput.disabled = true;
                maxHoursInput.disabled = true;
                fulltimeHoursCheckbox.checked = false;
                fulltimeHoursCheckbox.disabled = true;
                wageInput.disabled = false;
            } else {
                minHoursInput.disabled = false;
                maxHoursInput.disabled = false;
                fulltimeHoursCheckbox.disabled = false;
                minHoursInput.value = minHoursInput.value === '0' ? '8' : minHoursInput.value;
                maxHoursInput.value = maxHoursInput.value === '0' ? '40' : maxHoursInput.value;
            }
        });

        fulltimeHoursCheckbox.addEventListener('change', function() {
            const fullTimeHours = document.getElementById('fullTimeHours').value;
            if (this.checked) {
                minHoursInput.value = fullTimeHours;
                maxHoursInput.value = fullTimeHours;
                minHoursInput.disabled = true;
                maxHoursInput.disabled = true;
                wageInput.value = 0;
                wageInput.disabled = true;
                unlimitedHoursCheckbox.checked = false;
                unlimitedHoursCheckbox.disabled = true;
            } else {
                minHoursInput.disabled = false;
                maxHoursInput.disabled = false;
                wageInput.disabled = false;
                unlimitedHoursCheckbox.disabled = false;
                minHoursInput.value = '8';
                maxHoursInput.value = '40';
                wageInput.value = '15';
            }
        });

        sameWageCheckbox.addEventListener('change', function() {
            if (this.checked) {
                const currentWage = wageInput.value;
                document.querySelectorAll('.wage-input').forEach(otherWageInput => {
                    const otherEmpId = otherWageInput.dataset.employeeId;
                    const otherFulltimeCheckbox = document.getElementById(`fulltimeHours${otherEmpId}`);
                    if (otherWageInput !== wageInput && !otherFulltimeCheckbox.checked) {
                        otherWageInput.value = currentWage;
                    }
                });
                document.querySelectorAll('.same-wage-checkbox').forEach(otherSameWageCheckbox => {
                    if (otherSameWageCheckbox !== sameWageCheckbox) {
                        otherSameWageCheckbox.checked = false;
                    }
                });
            }
        });
    }

    addEmployeeBtn.addEventListener('click', createEmployeeSection);

    employeeSectionsContainer.addEventListener('click', function(event) {
        if (event.target.closest('.remove-employee-btn')) {
            if (employeeSectionsContainer.children.length > 1) {
                event.target.closest('.employee-section').remove();
            } else {
                const lang = (window && window.currentLanguage) ? window.currentLanguage : _getCurrentLang();
                const translationsObj = _getTranslations();
                const t = (window && window.t) ? window.t : function(k) { return (translationsObj[lang] && translationsObj[lang][k]) ? translationsObj[lang][k] : k; };
                alert(t('must_have_one_employee') || "You must have at least one employee.");
            }
        }
    });

    // Load employees from database if user is logged in as manager
    loadEmployeesFromDatabase();
    
    // If no employees loaded from DB, create default employee section
    if (employeeSectionsContainer.children.length === 0) {
        createEmployeeSection();
    }
    
    populateMinMaxGrid();
    updatePhase2UI();
    
    // Function to load employees from database
    async function loadEmployeesFromDatabase() {
        try {
            const response = await fetch('/api/employees');
            const data = await response.json();
            
            if (data.status === 'success' && data.employees.length > 0) {
                // Clear any existing employee sections
                employeeSectionsContainer.innerHTML = '';
                
                // Create sections for each employee from database
                data.employees.forEach(emp => {
                    employeeCounter++;
                    const employeeId = employeeCounter;
                    
                    const div = document.createElement('div');
                    div.classList.add('employee-section');
                    div.dataset.employeeId = employeeId;
                    div.dataset.dbId = emp.id; // Store database ID
                    // ensure translations helper available in this scope
                    const lang = (window && window.currentLanguage) ? window.currentLanguage : _getCurrentLang();
                    const translationsObj = _getTranslations();
                    const t = (window && window.t) ? window.t : function(k) { return (translationsObj[lang] && translationsObj[lang][k]) ? translationsObj[lang][k] : k; };

                    div.innerHTML = `
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                            <input type="text" class="employee-name-input" value="${emp.name}" data-employee-id="${employeeId}">
                            <button type="button" class="btn btn-remove remove-employee-btn" data-employee-id="${employeeId}" title="Remove employee">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>

                        <div class="min-max-hours-section">
                            <h6>${t('weekly_hours')}</h6>
                            <div class="row g-3">
                                <div class="col-md-3">
                                    <label class="form-label">${t('min_hours')}</label>
                                    <input type="number" class="form-control min-hours-input" value="${emp.min_hours}" min="0" data-employee-id="${employeeId}">
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label">${t('max_hours')}</label>
                                    <input type="number" class="form-control max-hours-input" value="${emp.max_hours}" min="0" data-employee-id="${employeeId}">
                                </div>
                                <div class="col-md-3">
                                    <div class="toggle-option">
                                        <input class="form-check-input unlimited-hours-checkbox" type="checkbox" id="unlimitedHours${employeeId}" data-employee-id="${employeeId}" ${emp.min_hours === 0 && emp.max_hours === 0 ? 'checked' : ''}>
                                        <label class="form-check-label" for="unlimitedHours${employeeId}">${t('unlimited')}</label>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="toggle-option">
                                        <input class="form-check-input fulltime-hours-checkbox" type="checkbox" id="fulltimeHours${employeeId}" data-employee-id="${employeeId}" ${emp.is_full_time ? 'checked' : ''}>
                                        <label class="form-check-label" for="fulltimeHours${employeeId}">${t('fulltime')}</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="wage-section">
                            <label for="wageInput${employeeId}" class="form-label">${t('hourly_wage')} ($)</label>
                            <input type="number" class="form-control wage-input" id="wageInput${employeeId}" value="${emp.wage}" min="0" data-employee-id="${employeeId}">
                            <div class="toggle-option mt-2">
                                <input class="form-check-input same-wage-checkbox" type="checkbox" id="sameWage${employeeId}">
                                <label class="form-check-label" for="sameWage${employeeId}">${t('apply_to_all')}</label>
                            </div>
                        </div>

                        <div class="can-be-responsible-section" style="display: block;">
                            <div class="toggle-option">
                                <input class="form-check-input can-be-responsible-checkbox" type="checkbox" id="canBeResponsible${employeeId}" ${emp.can_be_responsible ? 'checked' : ''} data-employee-id="${employeeId}">
                                <label class="form-check-label" for="canBeResponsible${employeeId}">${t('can_be_responsible')}</label>
                            </div>
                        </div>
                    `;
                    employeeSectionsContainer.appendChild(div);

                    const availabilityGrid = createAvailabilityGrid(employeeId, emp.name);
                    const minMaxHoursSection = div.querySelector('.min-max-hours-section');
                    minMaxHoursSection.parentNode.insertBefore(availabilityGrid, minMaxHoursSection);
                    
                    // Pre-fill availability from database
                    if (emp.availability) {
                        Object.keys(emp.availability).forEach(key => {
                            if (emp.availability[key]) {
                                const checkbox = div.querySelector(`.availability-checkbox[data-employee-id="${employeeId}"][data-day="${key.split('_')[1]}"][data-shift="${key.split('_').slice(2).join('_')}"]`);
                                if (checkbox) {
                                    checkbox.checked = true;
                                }
                            } else {
                                const checkbox = div.querySelector(`.availability-checkbox[data-employee-id="${employeeId}"][data-day="${key.split('_')[1]}"][data-shift="${key.split('_').slice(2).join('_')}"]`);
                                if (checkbox) {
                                    checkbox.checked = false;
                                }
                            }
                        });
                    }

                    attachEmployeeSectionListeners(div, employeeId);
                });
            }
        } catch (error) {
            console.log('Not logged in or error loading employees:', error);
            // Continue with manual entry mode
        }
    }

    // Initialize lang from URL param -> localStorage -> default
    (function() {
        const urlParams = new URLSearchParams(window.location.search);
            const langFromUrl = urlParams.get('lang');
            const stored = (localStorage.getItem && localStorage.getItem('lang')) || null;
            const langFromWindow = (window && window.currentLanguage) ? window.currentLanguage : null;
            const lang = langFromWindow || langFromUrl || stored || 'en';
            // set via central setter so all listeners run
            try { window.setLanguage(lang); } catch(e) {
                if (languageSelector) languageSelector.value = lang;
                updateLanguage(lang);
                try { localStorage.setItem('lang', lang); } catch(e) {}
                if (languageSelector) updateLinksAndForms(lang);
            }
        // regenerate dynamic UI translations now that language is set
        toggleMinMaxInput();
        updatePhase2UI();
    })();

    // --- Form Submission ---
    submitScheduleBtn.addEventListener('click', async function(event) {
        event.preventDefault();

        resultsDiv.style.display = 'none';
        errorDisplay.style.display = 'none';
        errorDisplay.innerHTML = '';
        scheduleOutput.innerHTML = '';
        totalCostOutput.innerHTML = '';

        loadingSpinner.style.display = 'flex';

        const days = getSelectedDays();
        const shifts = getShiftDetails();
        const fullTimeHours = parseInt(document.getElementById('fullTimeHours').value) || 0;
        const responsibleRequiredOverall = responsibleRequiredOverallCheckbox.checked;

        const minEmployeesPerShift = {};
        const maxEmployeesPerShift = {};

        if (sameMinMaxForAllShiftsCheckbox.checked) {
            const globalMin = ignoreMinEmpGlobalCheckbox.checked ? 0 : (parseInt(globalMinEmpInput.value) || 0);
            const globalMax = ignoreMaxEmpGlobalCheckbox.checked ? 0 : (parseInt(globalMaxEmpInput.value) || 0);
            days.forEach(day => {
                shifts.forEach(shift => {
                    minEmployeesPerShift[`${day}_${shift.name}`] = globalMin;
                    maxEmployeesPerShift[`${day}_${shift.name}`] = globalMax;
                });
            });
        } else if (sameMinMaxPerShiftAllDaysCheckbox.checked) {
            // Apply same min/max per shift to all days
            const perShiftValues = {};
            document.querySelectorAll('.per-shift-min-input').forEach(input => {
                const shiftName = input.dataset.shift;
                const minVal = parseInt(input.value) || 0;
                if (!perShiftValues[shiftName]) perShiftValues[shiftName] = {};
                perShiftValues[shiftName].min = minVal;
            });
            document.querySelectorAll('.per-shift-max-input').forEach(input => {
                const shiftName = input.dataset.shift;
                const maxVal = parseInt(input.value) || 0;
                if (!perShiftValues[shiftName]) perShiftValues[shiftName] = {};
                perShiftValues[shiftName].max = maxVal;
            });
            days.forEach(day => {
                shifts.forEach(shift => {
                    minEmployeesPerShift[`${day}_${shift.name}`] = perShiftValues[shift.name]?.min || 0;
                    maxEmployeesPerShift[`${day}_${shift.name}`] = perShiftValues[shift.name]?.max || 0;
                });
            });
        } else {
            document.querySelectorAll('#minMaxGrid .min-max-entry').forEach(entry => {
                const minInput = entry.querySelector('.min-emp-input');
                const maxInput = entry.querySelector('.max-emp-input');
                const day = minInput.dataset.day;
                const shift = minInput.dataset.shift;

                minEmployeesPerShift[`${day}_${shift}`] = parseInt(minInput.value) || 0;
                maxEmployeesPerShift[`${day}_${shift}`] = parseInt(maxInput.value) || 0;
            });
        }

        const employeesData = [];
        document.querySelectorAll('.employee-section').forEach(section => {
            const employeeId = section.dataset.employeeId;
            const name = section.querySelector(`.employee-name-input[data-employee-id="${employeeId}"]`).value;
            const minHours = parseInt(section.querySelector(`.min-hours-input[data-employee-id="${employeeId}"]`).value) || 0;
            const maxHours = parseInt(section.querySelector(`.max-hours-input[data-employee-id="${employeeId}"]`).value) || 0;
            const wage = parseInt(section.querySelector(`.wage-input[data-employee-id="${employeeId}"]`).value) || 0;
            const canBeResponsible = section.querySelector(`.can-be-responsible-checkbox[data-employee-id="${employeeId}"]`).checked;
            const isUnlimitedHours = section.querySelector(`.unlimited-hours-checkbox[data-employee-id="${employeeId}"]`).checked;
            const isFulltime = section.querySelector(`.fulltime-hours-checkbox[data-employee-id="${employeeId}"]`).checked;

            const availability = {};
            section.querySelectorAll('.availability-checkbox').forEach(checkbox => {
                const key = `${name}_${checkbox.dataset.day}_${checkbox.dataset.shift}`;
                availability[key] = checkbox.checked;
            });

            let finalMinHours = isUnlimitedHours ? 0 : (isFulltime ? fullTimeHours : minHours);
            let finalMaxHours = isUnlimitedHours ? 0 : (isFulltime ? fullTimeHours : maxHours);
            let finalWage = isFulltime ? 0 : wage;

            employeesData.push({
                name: name,
                availability: availability,
                min_hours: finalMinHours,
                max_hours: finalMaxHours,
                wage: finalWage,
                can_be_responsible: canBeResponsible
            });
        });

        const payload = {
            days: days,
            shifts: shifts,
            min_employees_per_shift: minEmployeesPerShift,
            max_employees_per_shift: maxEmployeesPerShift,
            responsible_required_overall: responsibleRequiredOverall,
            full_time_hours_per_week: fullTimeHours,
            employees: employeesData
        };

        try {
            const response = await fetch('/solve_schedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            loadingSpinner.style.display = 'none';

            if (result.status === 'optimal') {
                resultsDiv.style.display = 'block';
                let scheduleHtml = '';
                for (const day of days) {
                    scheduleHtml += `<h5>${day}:</h5><ul>`;
                    for (const shift of shifts) {
                        const assigned = result.schedule[day][shift.name];
                            if (assigned && assigned.length > 0) {
                            // Wrap each employee name so it can be styled (e.g., bold) via CSS
                            const empHtml = assigned.map(name => `<span class="scheduled-employee">${name}</span>`).join(', ');
                            scheduleHtml += `<li><strong>${shift.name}:</strong> ${empHtml}</li>`;
                        } else {
                            scheduleHtml += `<li><strong>${shift.name}:</strong> ${ (window.t ? window.t('no_employees_assigned') : 'No employees assigned') }</li>`;
                        }
                    }
                    scheduleHtml += `</ul>`;
                }
                scheduleOutput.innerHTML = scheduleHtml;
                // Render parenthetical as a conventional clarification: smaller, italic, normal weight, muted color
                totalCostOutput.innerHTML = `Total Labor Cost <small style="font-size:0.60em; font-style:italic; font-weight:normal; color:white;">(Excl. fixed salary for full-time workers)</small>: $${result.total_cost.toFixed(2)}`;
            } else if (result.status === 'infeasible' || result.status === 'unbounded' || result.status === 'error') {
                errorDisplay.style.display = 'block';
                errorDisplay.textContent = result.message;
            }
        } catch (error) {
            loadingSpinner.style.display = 'none';
            errorDisplay.style.display = 'block';
            errorDisplay.textContent = `An unexpected error occurred: ${error.message}`;
            console.error('Fetch error:', error);
        }
    });
});
