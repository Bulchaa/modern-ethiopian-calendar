<?php
/**
 * Modern Calendar System - PHP Implementation
 * Supports multiple calendar types with modern functionality
 */

class ModernCalendar {
    private $calendarType;
    private $language;
    private $currentDate;
    
    public function __construct($calendarType = 'gregorian', $language = 'en') {
        $this->calendarType = $calendarType;
        $this->language = $language;
        $this->currentDate = new DateTime();
    }
    
    /**
     * Get today's date
     */
    public function today() {
        return new DateTime();
    }
    
    /**
     * Format a date according to current calendar and language
     */
    public function formatDate($date, $formatType = 'full') {
        switch ($this->calendarType) {
            case 'ethiopian':
                return $this->formatEthiopianDate($date, $formatType);
            case 'islamic':
                return $this->formatIslamicDate($date, $formatType);
            default:
                return $this->formatGregorianDate($date, $formatType);
        }
    }
    
    /**
     * Format Gregorian date
     */
    private function formatGregorianDate($date, $formatType) {
        $locale = $this->getLocale();
        
        switch ($formatType) {
            case 'full':
                $dayName = $locale['dayNames'][$date->format('w')];
                $monthName = $locale['monthNames'][$date->format('n') - 1];
                return $dayName . ', ' . $monthName . ' ' . $date->format('j, Y');
            case 'short':
                return $date->format('n/j/Y');
            default:
                $monthName = $locale['monthNames'][$date->format('n') - 1];
                return $monthName . ' ' . $date->format('j, Y');
        }
    }
    
    /**
     * Convert Gregorian to Julian Day
     */
    private function gregorianToJD($date) {
        $year = (int)$date->format('Y');
        $month = (int)$date->format('n');
        $day = (int)$date->format('j');
        
        if ($year < 0) $year++;
        if ($month < 3) {
            $month += 12;
            $year--;
        }
        
        $a = floor($year / 100);
        $b = 2 - $a + floor($a / 4);
        
        return floor(365.25 * ($year + 4716)) + floor(30.6001 * ($month + 1)) + $day + $b - 1524.5;
    }
    
    /**
     * Convert Gregorian date to Ethiopian date
     */
    private function gregorianToEthiopian($date) {
        $jdEpoch = 1724220.5;
        $jd = $this->gregorianToJD($date);
        $c = floor($jd) + 0.5 - $jdEpoch;
        $year = floor(($c - floor(($c + 366) / 1461)) / 365) + 1;
        if ($year <= 0) $year--;
        
        $yearStart = $this->ethiopianToJD($year, 1, 1);
        $dayOfYear = floor($jd) + 0.5 - $yearStart + 1;
        $month = floor(($dayOfYear - 1) / 30) + 1;
        $day = $dayOfYear - ($month - 1) * 30;
        
        return ['year' => $year, 'month' => $month, 'day' => $day];
    }
    
    /**
     * Convert Ethiopian date to Julian Day
     */
    private function ethiopianToJD($year, $month, $day) {
        $jdEpoch = 1724220.5;
        if ($year < 0) $year++;
        return $day + ($month - 1) * 30 + ($year - 1) * 365 + floor($year / 4) + $jdEpoch - 1;
    }
    
    /**
     * Format Ethiopian date
     */
    private function formatEthiopianDate($date, $formatType) {
        $ethiopianMonths = [
            'መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሳስ', 'ጥር', 'የካቲት',
            'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜ'
        ];
        
        $ethiopianDays = ['እሑድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ'];
        
        $ethDate = $this->gregorianToEthiopian($date);
        $weekday = $date->format('w');
        
        switch ($formatType) {
            case 'full':
                return $ethiopianDays[$weekday] . ', ' . $ethDate['day'] . ' ' . $ethiopianMonths[$ethDate['month'] - 1] . ' ' . $ethDate['year'];
            case 'short':
                return $ethDate['month'] . '/' . $ethDate['day'] . '/' . $ethDate['year'];
            default:
                return $ethDate['day'] . ' ' . $ethiopianMonths[$ethDate['month'] - 1] . ' ' . $ethDate['year'];
        }
    }
    
    /**
     * Format Islamic date (simplified)
     */
    private function formatIslamicDate($date, $formatType) {
        // Simplified Islamic date formatting
        $islamicYear = $date->format('Y') - 579; // Approximate conversion
        $locale = $this->getLocale();
        
        switch ($formatType) {
            case 'full':
                return $date->format('j') . ' ' . $locale['monthNames'][$date->format('n') - 1] . ' ' . $islamicYear . ' هـ';
            case 'short':
                return $date->format('n/j/') . $islamicYear;
            default:
                return $date->format('j') . ' ' . $locale['monthNames'][$date->format('n') - 1] . ' ' . $islamicYear;
        }
    }
    
    /**
     * Get locale data
     */
    private function getLocale() {
        $locales = [
            'en' => [
                'monthNames' => [
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                ],
                'dayNames' => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                'dayNamesShort' => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            ],
            'am' => [
                'monthNames' => [
                    'መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሳስ', 'ጥር', 'የካቲት',
                    'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜ'
                ],
                'dayNames' => ['እሑድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ'],
                'dayNamesShort' => ['እሑድ', 'ሰኞ', 'ማክሰ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ']
            ],
            'oro' => [
                'monthNames' => [
                    'Fuulbaana', 'Onkolooleessaa', 'Sadaasaa', 'Muddee', 'Ammajjii', 'Gurraandhala',
                    'Bitooteessaa', 'Ebla', 'Caamsaa', 'Waxabajjii', 'Adoolessa', 'Hagayya', 'Qaamee'
                ],
                'dayNames' => ['Wiixata', 'Kibxata', 'Roobii', 'Khamisa', 'Jimaata', 'Sanbata', 'Dilbata'],
                'dayNamesShort' => ['Wi', 'Kib', 'Ro', 'Ka', 'Ji', 'Sa', 'Di']
            ],
            'ar' => [
                'monthNames' => [
                    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
                    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
                ],
                'dayNames' => ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
                'dayNamesShort' => ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت']
            ]
        ];
        
        return $locales[$this->language] ?? $locales['en'];
    }
    
    /**
     * Get month calendar grid
     */
    public function getMonthCalendar($year, $month) {
        if ($this->calendarType === 'ethiopian') {
            return $this->getEthiopianMonthCalendar($year, $month);
        }
        
        $firstDay = new DateTime("$year-$month-01");
        $lastDay = new DateTime($firstDay->format('Y-m-t'));
        
        $calendar = [];
        $week = [];
        
        // Fill in days before month starts
        $startDayOfWeek = $firstDay->format('w');
        for ($i = 0; $i < $startDayOfWeek; $i++) {
            $week[] = 0;
        }
        
        // Fill in days of the month
        for ($day = 1; $day <= $lastDay->format('j'); $day++) {
            $week[] = $day;
            
            if (count($week) == 7) {
                $calendar[] = $week;
                $week = [];
            }
        }
        
        // Fill in remaining days
        while (count($week) < 7 && count($week) > 0) {
            $week[] = 0;
        }
        
        if (!empty($week)) {
            $calendar[] = $week;
        }
        
        return $calendar;
    }
    
    /**
     * Get Ethiopian month calendar grid
     */
    private function getEthiopianMonthCalendar($year, $month) {
        $daysInMonth = ($month == 13) ? ($this->isEthiopianLeapYear($year) ? 6 : 5) : 30;
        $firstDayJD = $this->ethiopianToJD($year, $month, 1);
        $firstDayGregorian = $this->jdToGregorian($firstDayJD);
        $firstDay = new DateTime($firstDayGregorian['year'] . '-' . $firstDayGregorian['month'] . '-' . $firstDayGregorian['day']);
        
        $calendar = [];
        $week = [];
        
        // Fill in days before month starts
        $startDayOfWeek = $firstDay->format('w');
        for ($i = 0; $i < $startDayOfWeek; $i++) {
            $week[] = 0;
        }
        
        // Fill in days of the month
        for ($day = 1; $day <= $daysInMonth; $day++) {
            $week[] = $day;
            
            if (count($week) == 7) {
                $calendar[] = $week;
                $week = [];
            }
        }
        
        // Fill in remaining days
        while (count($week) < 7 && count($week) > 0) {
            $week[] = 0;
        }
        
        if (!empty($week)) {
            $calendar[] = $week;
        }
        
        return $calendar;
    }
    
    /**
     * Check if Ethiopian year is leap year
     */
    private function isEthiopianLeapYear($year) {
        return $year % 4 == 3;
    }
    
    /**
     * Convert Julian Day to Gregorian
     */
    private function jdToGregorian($jd) {
        $z = floor($jd + 0.5);
        $a = floor(($z - 1867216.25) / 36524.25);
        $aa = $z + 1 + $a - floor($a / 4);
        $b = $aa + 1524;
        $c = floor(($b - 122.1) / 365.25);
        $d = floor(365.25 * $c);
        $e = floor(($b - $d) / 30.6001);
        $day = $b - $d - floor($e * 30.6001);
        $month = $e - ($e > 13.5 ? 13 : 1);
        $year = $c - ($month > 2.5 ? 4716 : 4715);
        if ($year <= 0) $year--;
        return ['year' => $year, 'month' => $month, 'day' => $day];
    }
    
    /**
     * Add days to a date
     */
    public function addDays($date, $days) {
        $newDate = clone $date;
        $newDate->add(new DateInterval('P' . abs($days) . 'D'));
        if ($days < 0) {
            $newDate->sub(new DateInterval('P' . (abs($days) * 2) . 'D'));
        }
        return $newDate;
    }
    
    /**
     * Add months to a date
     */
    public function addMonths($date, $months) {
        $newDate = clone $date;
        $newDate->add(new DateInterval('P' . abs($months) . 'M'));
        if ($months < 0) {
            $newDate->sub(new DateInterval('P' . (abs($months) * 2) . 'M'));
        }
        return $newDate;
    }
    
    /**
     * Check if date is weekend
     */
    public function isWeekend($date) {
        $dayOfWeek = $date->format('w');
        return $dayOfWeek == 0 || $dayOfWeek == 6; // Sunday or Saturday
    }
    
    /**
     * Check if date is holiday
     */
    public function isHoliday($date) {
        $month = $date->format('n');
        $day = $date->format('j');
        
        // Basic holidays
        if ($month == 1 && $day == 1) return true; // New Year
        if ($month == 12 && $day == 25) return true; // Christmas
        
        // Ethiopian holidays
        if ($this->calendarType == 'ethiopian') {
            if ($month == 9 && $day == 11) return true; // Ethiopian New Year
            if ($month == 1 && $day == 19) return true; // Timkat
        }
        
        return false;
    }
    
    /**
     * Get comprehensive date information
     */
    public function getDateInfo($date) {
        $locale = $this->getLocale();
        
        return [
            'formatted' => $this->formatDate($date),
            'dayName' => $locale['dayNames'][$date->format('w')],
            'monthName' => $locale['monthNames'][$date->format('n') - 1],
            'year' => $date->format('Y'),
            'month' => $date->format('n'),
            'day' => $date->format('j'),
            'weekday' => $date->format('w'),
            'isWeekend' => $this->isWeekend($date),
            'isHoliday' => $this->isHoliday($date),
            'calendarType' => $this->calendarType,
            'language' => $this->language
        ];
    }
    
    /**
     * Generate HTML calendar
     */
    public function generateHtmlCalendar($year, $month, $options = []) {
        $calendar = $this->getMonthCalendar($year, $month);
        $locale = $this->getLocale();
        $today = new DateTime();
        
        $html = '<div class="modern-calendar-php">';
        $html .= '<div class="calendar-header">';
        $html .= '<h3>' . $locale['monthNames'][$month - 1] . ' ' . $year . '</h3>';
        $html .= '</div>';
        
        $html .= '<div class="calendar-body">';
        $html .= '<div class="weekdays">';
        foreach ($locale['dayNamesShort'] as $dayName) {
            $html .= '<div class="weekday">' . $dayName . '</div>';
        }
        $html .= '</div>';
        
        $html .= '<div class="days-grid">';
        foreach ($calendar as $week) {
            foreach ($week as $day) {
                $classes = ['day'];
                
                if ($day == 0) {
                    $classes[] = 'empty';
                    $html .= '<div class="' . implode(' ', $classes) . '"></div>';
                } else {
                    $currentDate = new DateTime("$year-$month-$day");
                    
                    if ($currentDate->format('Y-m-d') == $today->format('Y-m-d')) {
                        $classes[] = 'today';
                    }
                    
                    if ($this->isWeekend($currentDate)) {
                        $classes[] = 'weekend';
                    }
                    
                    if ($this->isHoliday($currentDate)) {
                        $classes[] = 'holiday';
                    }
                    
                    $html .= '<div class="' . implode(' ', $classes) . '" data-date="' . $currentDate->format('Y-m-d') . '">';
                    $html .= $day;
                    $html .= '</div>';
                }
            }
        }
        $html .= '</div>';
        $html .= '</div>';
        $html .= '</div>';
        
        return $html;
    }
}

/**
 * Date Display Component
 */
class DateDisplay {
    private $calendar;
    
    public function __construct($calendarType = 'gregorian', $language = 'en') {
        $this->calendar = new ModernCalendar($calendarType, $language);
    }
    
    /**
     * Display formatted date
     */
    public function displayDate($date = null, $formatType = 'full') {
        if ($date === null) {
            $date = new DateTime();
        }
        
        return $this->calendar->formatDate($date, $formatType);
    }
    
    /**
     * Display date information
     */
    public function displayDateInfo($date = null) {
        if ($date === null) {
            $date = new DateTime();
        }
        
        return $this->calendar->getDateInfo($date);
    }
    
    /**
     * Generate HTML date display
     */
    public function generateHtmlDisplay($date = null) {
        if ($date === null) {
            $date = new DateTime();
        }
        
        $info = $this->calendar->getDateInfo($date);
        
        $html = '<div class="date-display">';
        $html .= '<div class="date-display-main">' . $info['formatted'] . '</div>';
        $html .= '<div class="date-display-details">';
        $html .= 'Day: ' . $info['dayName'] . ' | ';
        $html .= 'Calendar: ' . ucfirst($info['calendarType']) . ' | ';
        $html .= 'Language: ' . strtoupper($info['language']);
        $html .= '</div>';
        $html .= '</div>';
        
        return $html;
    }
}

// Example usage
if (basename(__FILE__) == basename($_SERVER['PHP_SELF'])) {
    echo "<h1>Modern Calendar System - PHP Demo</h1>";
    
    // Test Gregorian calendar
    echo "<h2>Gregorian Calendar (English)</h2>";
    $gregCal = new ModernCalendar('gregorian', 'en');
    $today = $gregCal->today();
    echo "<p>Today: " . $gregCal->formatDate($today) . "</p>";
    
    // Test Ethiopian calendar
    echo "<h2>Ethiopian Calendar (Amharic)</h2>";
    $ethCal = new ModernCalendar('ethiopian', 'am');
    echo "<p>Today: " . $ethCal->formatDate($today) . "</p>";
    
    // Test HTML calendar generation
    echo "<h2>HTML Calendar</h2>";
    echo $gregCal->generateHtmlCalendar(date('Y'), date('n'));
    
    // Test DateDisplay
    echo "<h2>Date Display Component</h2>";
    $dateDisplay = new DateDisplay('gregorian', 'en');
    echo $dateDisplay->generateHtmlDisplay();
    
    $ethDisplay = new DateDisplay('ethiopian', 'am');
    echo $ethDisplay->generateHtmlDisplay();
}
?>