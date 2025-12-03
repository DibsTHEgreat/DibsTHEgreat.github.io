// ===================================
// Timezone Data and Configuration
// ===================================
const MY_TIMEZONE = 'America/Edmonton'; // Calgary, Alberta (Mountain Time)
const BUSINESS_HOURS_START = 9; // 9 AM
const BUSINESS_HOURS_END = 17; // 5 PM

// Popular timezones list
const TIMEZONES = [
    { value: 'America/New_York', label: 'Eastern Time (ET) - New York, Toronto' },
    { value: 'America/Chicago', label: 'Central Time (CT) - Chicago, Houston' },
    { value: 'America/Denver', label: 'Mountain Time (MT) - Denver, Phoenix' },
    { value: 'America/Edmonton', label: 'Mountain Time (MT) - Calgary, Edmonton' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT) - Los Angeles, Seattle, Vancouver' },
    { value: 'America/Anchorage', label: 'Alaska Time (AKT) - Anchorage' },
    { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT) - Honolulu' },
    { value: 'Europe/London', label: 'GMT/BST - London, Dublin' },
    { value: 'Europe/Paris', label: 'CET/CEST - Paris, Berlin, Rome' },
    { value: 'Europe/Helsinki', label: 'EET/EEST - Helsinki, Athens' },
    { value: 'Asia/Dubai', label: 'GST - Dubai, Abu Dhabi' },
    { value: 'Asia/Kolkata', label: 'IST - Mumbai, Delhi, Bangalore' },
    { value: 'Asia/Shanghai', label: 'CST - Beijing, Shanghai, Hong Kong' },
    { value: 'Asia/Tokyo', label: 'JST - Tokyo, Osaka' },
    { value: 'Asia/Seoul', label: 'KST - Seoul' },
    { value: 'Australia/Sydney', label: 'AEDT/AEST - Sydney, Melbourne' },
    { value: 'Pacific/Auckland', label: 'NZDT/NZST - Auckland' },
    { value: 'America/Sao_Paulo', label: 'BRT - São Paulo, Rio de Janeiro' },
    { value: 'America/Mexico_City', label: 'CST - Mexico City' },
];

// ===================================
// Initialize Page
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    populateTimezones();
    updateCurrentTimes();
    setupEventListeners();

    // Update times every second
    setInterval(updateCurrentTimes, 1000);

    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
});

// ===================================
// Populate Timezone Dropdown
// ===================================
function populateTimezones() {
    const select = document.getElementById('timezone-select');

    TIMEZONES.forEach(tz => {
        const option = document.createElement('option');
        option.value = tz.value;
        option.textContent = tz.label;
        select.appendChild(option);
    });

    // Try to detect user's timezone
    try {
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (TIMEZONES.find(tz => tz.value === userTimezone)) {
            select.value = userTimezone;
            onTimezoneChange();
        }
    } catch (e) {
        console.log('Could not auto-detect timezone');
    }
}

// ===================================
// Setup Event Listeners
// ===================================
function setupEventListeners() {
    const timezoneSelect = document.getElementById('timezone-select');
    timezoneSelect.addEventListener('change', onTimezoneChange);

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
}

// ===================================
// Update Current Times Display
// ===================================
function updateCurrentTimes() {
    const myTimeElement = document.getElementById('my-time');
    const visitorTimeElement = document.getElementById('visitor-time');
    const timezoneSelect = document.getElementById('timezone-select');

    // Update my time (Calgary)
    const myTime = new Date().toLocaleTimeString('en-US', {
        timeZone: MY_TIMEZONE,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    myTimeElement.textContent = myTime;

    // Update visitor time if timezone selected
    if (timezoneSelect.value) {
        const visitorTime = new Date().toLocaleTimeString('en-US', {
            timeZone: timezoneSelect.value,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
        visitorTimeElement.textContent = visitorTime;

        const selectedTz = TIMEZONES.find(tz => tz.value === timezoneSelect.value);
        document.getElementById('visitor-timezone').textContent = selectedTz ? selectedTz.label : timezoneSelect.value;
    }
}

// ===================================
// Handle Timezone Change
// ===================================
function onTimezoneChange() {
    const timezoneSelect = document.getElementById('timezone-select');
    const selectedTimezone = timezoneSelect.value;

    if (!selectedTimezone) {
        return;
    }

    updateCurrentTimes();
    generateMeetingTimes(selectedTimezone);
    generateTimeChart(selectedTimezone);
}

// ===================================
// Generate Meeting Time Suggestions
// ===================================
function generateMeetingTimes(visitorTimezone) {
    const container = document.getElementById('meeting-times-container');
    const meetingTimes = findOptimalMeetingTimes(visitorTimezone);

    if (meetingTimes.length === 0) {
        container.innerHTML = `
            <div class="placeholder-message">
                <div class="placeholder-icon">😔</div>
                <p>No overlapping daytime hours found. Please reach out via email to find an alternative time!</p>
            </div>
        `;
        return;
    }

    const grid = document.createElement('div');
    grid.className = 'meeting-times-grid';

    meetingTimes.forEach((time, index) => {
        const slot = document.createElement('div');
        slot.className = 'meeting-time-slot';
        if (index === 0) {
            slot.classList.add('recommended');
        }

        slot.innerHTML = `
            <div class="time-slot-info">
                <div class="time-slot-label">Your Time</div>
                <div class="time-slot-value">${time.visitorTime}</div>
            </div>
            <div class="time-slot-arrow">⟷</div>
            <div class="time-slot-info">
                <div class="time-slot-label">My Time (Calgary)</div>
                <div class="time-slot-value">${time.myTime}</div>
            </div>
        `;

        grid.appendChild(slot);
    });

    container.innerHTML = '';

    if (meetingTimes.length > 0) {
        const infoBox = document.createElement('div');
        infoBox.className = 'info-box';
        infoBox.innerHTML = `
            <p><strong>💡 Tip:</strong> These times represent overlapping business hours (9 AM - 5 PM) in both timezones. The first option is typically the most convenient.</p>
        `;
        container.appendChild(infoBox);
    }

    container.appendChild(grid);
}

// ===================================
// Find Optimal Meeting Times
// ===================================
function findOptimalMeetingTimes(visitorTimezone) {
    const meetingTimes = [];
    const today = new Date();

    // Check each hour of the day
    for (let hour = 0; hour < 24; hour++) {
        const testDate = new Date(today);
        testDate.setHours(hour, 0, 0, 0);

        // Get hour in my timezone
        const myHour = parseInt(testDate.toLocaleTimeString('en-US', {
            timeZone: MY_TIMEZONE,
            hour: '2-digit',
            hour12: false
        }));

        // Get hour in visitor's timezone
        const visitorHour = parseInt(testDate.toLocaleTimeString('en-US', {
            timeZone: visitorTimezone,
            hour: '2-digit',
            hour12: false
        }));

        // Check if both are within business hours
        if (myHour >= BUSINESS_HOURS_START && myHour < BUSINESS_HOURS_END &&
            visitorHour >= BUSINESS_HOURS_START && visitorHour < BUSINESS_HOURS_END) {

            const myTime = testDate.toLocaleTimeString('en-US', {
                timeZone: MY_TIMEZONE,
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });

            const visitorTime = testDate.toLocaleTimeString('en-US', {
                timeZone: visitorTimezone,
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });

            meetingTimes.push({
                hour,
                myHour,
                visitorHour,
                myTime,
                visitorTime
            });
        }
    }

    return meetingTimes;
}

// ===================================
// Generate Time Comparison Chart
// ===================================
function generateTimeChart(visitorTimezone) {
    const container = document.getElementById('time-chart-container');
    const today = new Date();

    // Create chart structure
    const chart = document.createElement('div');
    chart.className = 'time-chart';

    // My timezone row
    const myRow = createTimelineRow('My Time (Calgary)', MY_TIMEZONE, visitorTimezone, today);
    chart.appendChild(myRow);

    // Visitor timezone row
    const visitorRow = createTimelineRow('Your Time', visitorTimezone, MY_TIMEZONE, today);
    chart.appendChild(visitorRow);

    // Legend
    const legend = document.createElement('div');
    legend.className = 'chart-legend';
    legend.innerHTML = `
        <div class="legend-item">
            <div class="legend-color daytime"></div>
            <span>Daytime (9 AM - 5 PM)</span>
        </div>
        <div class="legend-item">
            <div class="legend-color overlap"></div>
            <span>Overlapping Business Hours</span>
        </div>
        <div class="legend-item">
            <div class="legend-color nighttime"></div>
            <span>Outside Business Hours</span>
        </div>
    `;
    chart.appendChild(legend);

    container.innerHTML = '';
    container.appendChild(chart);
}

// ===================================
// Create Timeline Row for Chart
// ===================================
function createTimelineRow(label, timezone, otherTimezone, baseDate) {
    const row = document.createElement('div');
    row.className = 'chart-row';

    const labelDiv = document.createElement('div');
    labelDiv.className = 'chart-label';
    labelDiv.textContent = label;

    const timeline = document.createElement('div');
    timeline.className = 'chart-timeline';

    const overlappingHours = findOptimalMeetingTimes(otherTimezone === MY_TIMEZONE ? timezone : otherTimezone);
    const overlappingSet = new Set(overlappingHours.map(t =>
        otherTimezone === MY_TIMEZONE ? t.visitorHour : t.myHour
    ));

    for (let hour = 0; hour < 24; hour++) {
        const testDate = new Date(baseDate);
        testDate.setHours(hour, 0, 0, 0);

        const localHour = parseInt(testDate.toLocaleTimeString('en-US', {
            timeZone: timezone,
            hour: '2-digit',
            hour12: false
        }));

        const hourDiv = document.createElement('div');
        hourDiv.className = 'chart-hour';

        const isDaytime = localHour >= BUSINESS_HOURS_START && localHour < BUSINESS_HOURS_END;
        const isOverlap = overlappingSet.has(localHour);

        if (isOverlap) {
            hourDiv.classList.add('overlap');
        } else if (isDaytime) {
            hourDiv.classList.add('daytime');
        } else {
            hourDiv.classList.add('nighttime');
        }

        const time12h = testDate.toLocaleTimeString('en-US', {
            timeZone: timezone,
            hour: 'numeric',
            hour12: true
        });

        const tooltip = document.createElement('div');
        tooltip.className = 'chart-hour-tooltip';
        tooltip.textContent = time12h;
        hourDiv.appendChild(tooltip);

        timeline.appendChild(hourDiv);
    }

    row.appendChild(labelDiv);
    row.appendChild(timeline);

    return row;
}
