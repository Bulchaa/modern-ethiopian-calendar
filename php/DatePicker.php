<?php
/**
 * Modern Calendar DatePicker - PHP Implementation
 * Supports Ethiopian, Gregorian, and Islamic calendars
 */

require_once 'ModernCalendar.php';

class ModernDatePicker {
    private $options;
    private $calendar;
    
    public function __construct($options = []) {
        $this->options = array_merge([
            'calendar' => 'gregorian',
            'language' => 'en',
            'theme' => 'modern',
            'format' => 'Y-m-d',
            'placeholder' => 'Select date...',
            'class' => '',
            'id' => '',
            'name' => '',
            'value' => '',
            'required' => false,
            'disabled' => false
        ], $options);
        
        $this->calendar = new ModernCalendar($this->options['calendar'], $this->options['language']);
    }
    
    /**
     * Render the DatePicker HTML
     */
    public function render($name = null, $attributes = []) {
        if ($name) {
            $this->options['name'] = $name;
        }
        
        $id = $this->options['id'] ?: 'datepicker_' . uniqid();
        $class = 'modern-datepicker-input ' . $this->options['class'];
        $placeholder = htmlspecialchars($this->options['placeholder']);
        $value = htmlspecialchars($this->options['value']);
        $required = $this->options['required'] ? 'required' : '';
        $disabled = $this->options['disabled'] ? 'disabled' : '';
        
        // Additional attributes
        $attr_string = '';
        foreach ($attributes as $key => $val) {
            $attr_string .= ' ' . htmlspecialchars($key) . '="' . htmlspecialchars($val) . '"';
        }
        
        $html = '<div class="datepicker-wrapper">';
        $html .= '<input type="text" ';
        $html .= 'id="' . htmlspecialchars($id) . '" ';
        $html .= 'name="' . htmlspecialchars($this->options['name']) . '" ';
        $html .= 'class="' . htmlspecialchars($class) . '" ';
        $html .= 'placeholder="' . $placeholder . '" ';
        $html .= 'value="' . $value . '" ';
        $html .= 'readonly ' . $required . ' ' . $disabled . $attr_string . '>';
        $html .= '<span class="datepicker-icon">📅</span>';
        $html .= '</div>';
        
        // Add JavaScript initialization
        $html .= $this->renderScript($id);
        
        return $html;
    }
    
    /**
     * Render initialization script
     */
    private function renderScript($id) {
        $options_json = json_encode([
            'calendar' => $this->options['calendar'],
            'language' => $this->options['language'],
            'theme' => $this->options['theme'],
            'format' => $this->convertPhpToJsFormat($this->options['format'])
        ]);
        
        return "
        <script>
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof ModernDatePicker !== 'undefined') {
                new ModernDatePicker('#$id', $options_json);
            }
        });
        </script>";
    }
    
    /**
     * Convert PHP date format to JavaScript format
     */
    private function convertPhpToJsFormat($phpFormat) {
        $conversions = [
            'Y' => 'yyyy',
            'y' => 'yy',
            'm' => 'mm',
            'n' => 'm',
            'd' => 'dd',
            'j' => 'd'
        ];
        
        return str_replace(array_keys($conversions), array_values($conversions), $phpFormat);
    }
    
    /**
     * Format date according to calendar type
     */
    public function formatDate($date, $format = null) {
        $format = $format ?: $this->options['format'];
        
        if (!$date instanceof DateTime) {
            $date = new DateTime($date);
        }
        
        if ($this->options['calendar'] === 'ethiopian') {
            return $this->formatEthiopianDate($date, $format);
        } elseif ($this->options['calendar'] === 'islamic') {
            return $this->formatIslamicDate($date, $format);
        } else {
            return $date->format($format);
        }
    }
    
    /**
     * Format Ethiopian date
     */
    private function formatEthiopianDate($date, $format) {
        $ethDate = $this->calendar->gregorianToEthiopian($date);
        
        $replacements = [
            'Y' => $ethDate['year'],
            'y' => substr($ethDate['year'], -2),
            'm' => sprintf('%02d', $ethDate['month']),
            'n' => $ethDate['month'],
            'd' => sprintf('%02d', $ethDate['day']),
            'j' => $ethDate['day']
        ];
        
        return str_replace(array_keys($replacements), array_values($replacements), $format);
    }
    
    /**
     * Format Islamic date
     */
    private function formatIslamicDate($date, $format) {
        $islamicDate = $this->calendar->gregorianToIslamic($date);
        
        $replacements = [
            'Y' => $islamicDate['year'],
            'y' => substr($islamicDate['year'], -2),
            'm' => sprintf('%02d', $islamicDate['month']),
            'n' => $islamicDate['month'],
            'd' => sprintf('%02d', $islamicDate['day']),
            'j' => $islamicDate['day']
        ];
        
        return str_replace(array_keys($replacements), array_values($replacements), $format);
    }
    
    /**
     * Parse date from string according to calendar type
     */
    public function parseDate($dateString, $format = null) {
        $format = $format ?: $this->options['format'];
        
        if ($this->options['calendar'] === 'ethiopian') {
            return $this->parseEthiopianDate($dateString, $format);
        } elseif ($this->options['calendar'] === 'islamic') {
            return $this->parseIslamicDate($dateString, $format);
        } else {
            return DateTime::createFromFormat($format, $dateString);
        }
    }
    
    /**
     * Parse Ethiopian date string
     */
    private function parseEthiopianDate($dateString, $format) {
        // Extract year, month, day from format
        $pattern = str_replace(
            ['Y', 'y', 'm', 'n', 'd', 'j'],
            ['(\d{4})', '(\d{2})', '(\d{2})', '(\d{1,2})', '(\d{2})', '(\d{1,2})'],
            preg_quote($format, '/')
        );
        
        if (preg_match("/$pattern/", $dateString, $matches)) {
            // Determine which capture group corresponds to which part
            $year = $month = $day = null;
            
            // Simple parsing - assumes Y-m-d format
            if (count($matches) >= 4) {
                $year = (int)$matches[1];
                $month = (int)$matches[2];
                $day = (int)$matches[3];
                
                // Convert Ethiopian to Gregorian
                return $this->calendar->ethiopianToGregorian($year, $month, $day);
            }
        }
        
        return false;
    }
    
    /**
     * Parse Islamic date string
     */
    private function parseIslamicDate($dateString, $format) {
        // Similar to Ethiopian parsing
        $pattern = str_replace(
            ['Y', 'y', 'm', 'n', 'd', 'j'],
            ['(\d{4})', '(\d{2})', '(\d{2})', '(\d{1,2})', '(\d{2})', '(\d{1,2})'],
            preg_quote($format, '/')
        );
        
        if (preg_match("/$pattern/", $dateString, $matches)) {
            if (count($matches) >= 4) {
                $year = (int)$matches[1];
                $month = (int)$matches[2];
                $day = (int)$matches[3];
                
                // Convert Islamic to Gregorian
                return $this->calendar->islamicToGregorian($year, $month, $day);
            }
        }
        
        return false;
    }
    
    /**
     * Validate date string
     */
    public function validateDate($dateString, $format = null) {
        $date = $this->parseDate($dateString, $format);
        return $date !== false;
    }
    
    /**
     * Get current date in the specified calendar
     */
    public function getCurrentDate($format = null) {
        $format = $format ?: $this->options['format'];
        return $this->formatDate(new DateTime(), $format);
    }
    
    /**
     * Convert between calendar types
     */
    public function convertDate($dateString, $fromCalendar, $toCalendar, $format = null) {
        $format = $format ?: $this->options['format'];
        
        // Parse date from source calendar
        $originalCalendar = $this->options['calendar'];
        $this->options['calendar'] = $fromCalendar;
        $date = $this->parseDate($dateString, $format);
        
        if ($date === false) {
            return false;
        }
        
        // Format date in target calendar
        $this->options['calendar'] = $toCalendar;
        $result = $this->formatDate($date, $format);
        
        // Restore original calendar
        $this->options['calendar'] = $originalCalendar;
        
        return $result;
    }
    
    /**
     * Render CSS styles
     */
    public static function renderStyles() {
        return '
        <style>
        .datepicker-wrapper {
            position: relative;
            display: inline-block;
        }
        
        .modern-datepicker-input {
            padding: 10px 40px 10px 12px;
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            font-size: 14px;
            background: white;
            cursor: pointer;
            transition: all 0.3s ease;
            min-width: 200px;
        }
        
        .modern-datepicker-input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .modern-datepicker-input:hover {
            border-color: #667eea;
        }
        
        .datepicker-icon {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            font-size: 16px;
            color: #667eea;
        }
        
        .datepicker-wrapper:hover .datepicker-icon {
            color: #764ba2;
        }
        </style>';
    }
    
    /**
     * Render required JavaScript
     */
    public static function renderScripts() {
        return '
        <link rel="stylesheet" href="css/modern-calendar.css">
        <link rel="stylesheet" href="css/datepicker.css">
        <script src="js/modern-calendar.js"></script>
        <script src="js/datepicker.js"></script>';
    }
}

/**
 * Helper function to create a DatePicker quickly
 */
function datepicker($name, $options = []) {
    $picker = new ModernDatePicker($options);
    return $picker->render($name);
}

/**
 * Form helper class for easy integration
 */
class DatePickerForm {
    private $datepickers = [];
    
    public function addDatePicker($name, $options = []) {
        $this->datepickers[$name] = new ModernDatePicker($options);
        return $this;
    }
    
    public function render($name, $attributes = []) {
        if (isset($this->datepickers[$name])) {
            return $this->datepickers[$name]->render($name, $attributes);
        }
        return '';
    }
    
    public function processSubmission($postData) {
        $results = [];
        
        foreach ($this->datepickers as $name => $picker) {
            if (isset($postData[$name]) && !empty($postData[$name])) {
                $date = $picker->parseDate($postData[$name]);
                $results[$name] = [
                    'raw' => $postData[$name],
                    'parsed' => $date,
                    'valid' => $date !== false
                ];
            }
        }
        
        return $results;
    }
}

// Example usage
if (basename(__FILE__) == basename($_SERVER['PHP_SELF'])) {
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <title>PHP DatePicker Demo</title>
        <?php echo ModernDatePicker::renderStyles(); ?>
        <?php echo ModernDatePicker::renderScripts(); ?>
    </head>
    <body style="padding: 20px; font-family: Arial, sans-serif;">
        <h1>Modern DatePicker - PHP Demo</h1>
        
        <form method="POST">
            <h3>Gregorian DatePicker</h3>
            <?php
            $gregorianPicker = new ModernDatePicker([
                'calendar' => 'gregorian',
                'language' => 'en',
                'theme' => 'modern',
                'placeholder' => 'Select Gregorian date...'
            ]);
            echo $gregorianPicker->render('gregorian_date');
            ?>
            
            <h3>Ethiopian DatePicker (አማርኛ)</h3>
            <?php
            $ethiopianPicker = new ModernDatePicker([
                'calendar' => 'ethiopian',
                'language' => 'am',
                'theme' => 'green',
                'placeholder' => 'የኢትዮጵያ ቀን ይምረጡ...'
            ]);
            echo $ethiopianPicker->render('ethiopian_date');
            ?>
            
            <h3>Islamic DatePicker</h3>
            <?php
            $islamicPicker = new ModernDatePicker([
                'calendar' => 'islamic',
                'language' => 'en',
                'theme' => 'purple',
                'placeholder' => 'Select Islamic date...'
            ]);
            echo $islamicPicker->render('islamic_date');
            ?>
            
            <br><br>
            <button type="submit" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Submit Form
            </button>
        </form>
        
        <?php
        if ($_POST) {
            echo '<h3>Form Results:</h3>';
            echo '<pre>';
            
            foreach ($_POST as $key => $value) {
                if (strpos($key, '_date') !== false) {
                    echo "$key: $value\n";
                    
                    // Try to parse and convert
                    if ($key === 'ethiopian_date' && !empty($value)) {
                        $parsed = $ethiopianPicker->parseDate($value);
                        if ($parsed) {
                            echo "  Parsed: " . $parsed->format('Y-m-d') . "\n";
                            echo "  Gregorian: " . $parsed->format('F j, Y') . "\n";
                        }
                    }
                }
            }
            
            echo '</pre>';
        }
        ?>
        
        <h3>Date Conversion Examples</h3>
        <?php
        $testDate = new DateTime('2017-06-12'); // June 12, 2017
        echo '<p><strong>Test Date:</strong> June 12, 2017</p>';
        echo '<p><strong>Ethiopian:</strong> ' . $ethiopianPicker->formatDate($testDate) . '</p>';
        echo '<p><strong>Islamic:</strong> ' . $islamicPicker->formatDate($testDate) . '</p>';
        ?>
    </body>
    </html>
    <?php
}
?>