"""
Modern Calendar System - Python Implementation
Supports multiple calendar types with date operations
"""

from datetime import datetime, timedelta
from typing import Optional, Dict, List, Tuple
import calendar as py_calendar


class ModernCalendar:
    """Modern calendar system supporting multiple calendar types"""
    
    def __init__(self, calendar_type: str = 'gregorian', language: str = 'en'):
        self.calendar_type = calendar_type
        self.language = language
        self.current_date = datetime.now()
        
        # Calendar configurations
        self.calendars = {
            'gregorian': GregorianCalendar(),
            'ethiopian': EthiopianCalendar(),
            'islamic': IslamicCalendar()
        }
        
        # Language configurations
        self.languages = {
            'en': EnglishLocale(),
            'am': AmharicLocale(),
            'ar': ArabicLocale(),
            'oro': OromoLocale()
        }
    
    def get_calendar(self):
        """Get the current calendar implementation"""
        return self.calendars.get(self.calendar_type, self.calendars['gregorian'])
    
    def get_locale(self):
        """Get the current language locale"""
        return self.languages.get(self.language, self.languages['en'])
    
    def today(self) -> datetime:
        """Get today's date"""
        return datetime.now()
    
    def format_date(self, date: datetime, format_type: str = 'full') -> str:
        """Format a date according to the current calendar and language"""
        calendar_impl = self.get_calendar()
        locale = self.get_locale()
        
        return calendar_impl.format_date(date, locale, format_type)
    
    def get_month_calendar(self, year: int, month: int) -> List[List[int]]:
        """Get calendar grid for a specific month"""
        calendar_impl = self.get_calendar()
        return calendar_impl.get_month_calendar(year, month)
    
    def get_month_name(self, month: int) -> str:
        """Get month name in current language"""
        locale = self.get_locale()
        return locale.month_names[month - 1]
    
    def get_day_name(self, day: int) -> str:
        """Get day name in current language"""
        locale = self.get_locale()
        return locale.day_names[day]
    
    def add_days(self, date: datetime, days: int) -> datetime:
        """Add days to a date"""
        return date + timedelta(days=days)
    
    def add_months(self, date: datetime, months: int) -> datetime:
        """Add months to a date"""
        calendar_impl = self.get_calendar()
        return calendar_impl.add_months(date, months)
    
    def is_weekend(self, date: datetime) -> bool:
        """Check if date is weekend"""
        return date.weekday() >= 5  # Saturday = 5, Sunday = 6
    
    def is_holiday(self, date: datetime) -> bool:
        """Check if date is a holiday (can be extended)"""
        calendar_impl = self.get_calendar()
        return calendar_impl.is_holiday(date)
    
    def get_date_info(self, date: datetime) -> Dict:
        """Get comprehensive date information"""
        calendar_impl = self.get_calendar()
        locale = self.get_locale()
        
        return {
            'formatted': self.format_date(date),
            'day_name': locale.day_names[date.weekday()],
            'month_name': locale.month_names[date.month - 1],
            'year': date.year,
            'month': date.month,
            'day': date.day,
            'weekday': date.weekday(),
            'is_weekend': self.is_weekend(date),
            'is_holiday': self.is_holiday(date),
            'calendar_type': self.calendar_type,
            'language': self.language
        }


class BaseCalendar:
    """Base calendar implementation"""
    
    def format_date(self, date: datetime, locale, format_type: str = 'full') -> str:
        """Format date - to be implemented by subclasses"""
        raise NotImplementedError
    
    def get_month_calendar(self, year: int, month: int) -> List[List[int]]:
        """Get month calendar grid"""
        cal = py_calendar.monthcalendar(year, month)
        return cal
    
    def add_months(self, date: datetime, months: int) -> datetime:
        """Add months to date"""
        month = date.month - 1 + months
        year = date.year + month // 12
        month = month % 12 + 1
        day = min(date.day, py_calendar.monthrange(year, month)[1])
        return date.replace(year=year, month=month, day=day)
    
    def is_holiday(self, date: datetime) -> bool:
        """Check if date is holiday - basic implementation"""
        # New Year's Day
        if date.month == 1 and date.day == 1:
            return True
        # Christmas
        if date.month == 12 and date.day == 25:
            return True
        return False


class GregorianCalendar(BaseCalendar):
    """Gregorian calendar implementation"""
    
    def format_date(self, date: datetime, locale, format_type: str = 'full') -> str:
        if format_type == 'full':
            return f"{locale.day_names[date.weekday()]}, {locale.month_names[date.month - 1]} {date.day}, {date.year}"
        elif format_type == 'short':
            return f"{date.month}/{date.day}/{date.year}"
        else:
            return f"{locale.month_names[date.month - 1]} {date.day}, {date.year}"


class EthiopianCalendar(BaseCalendar):
    """Ethiopian calendar implementation"""
    
    def __init__(self):
        self.jd_epoch = 1724220.5  # Ethiopian epoch: August 29, 8 CE
        self.ethiopian_months = [
            'መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሳስ', 'ጥር', 'የካቲት',
            'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜ'
        ]
    
    def gregorian_to_jd(self, date: datetime) -> float:
        """Convert Gregorian date to Julian Day"""
        year = date.year
        month = date.month
        day = date.day
        
        if year < 0:
            year += 1
        if month < 3:
            month += 12
            year -= 1
            
        a = year // 100
        b = 2 - a + a // 4
        
        return int(365.25 * (year + 4716)) + int(30.6001 * (month + 1)) + day + b - 1524.5
    
    def jd_to_ethiopian(self, jd: float) -> Tuple[int, int, int]:
        """Convert Julian Day to Ethiopian date"""
        c = int(jd) + 0.5 - self.jd_epoch
        year = int((c - int((c + 366) / 1461)) / 365) + 1
        if year <= 0:
            year -= 1
            
        year_start = self.ethiopian_to_jd(year, 1, 1)
        day_of_year = int(jd) + 0.5 - year_start + 1
        month = int((day_of_year - 1) / 30) + 1
        day = int(day_of_year - (month - 1) * 30)
        
        return year, month, day
    
    def ethiopian_to_jd(self, year: int, month: int, day: int) -> float:
        """Convert Ethiopian date to Julian Day"""
        if year < 0:
            year += 1
        return day + (month - 1) * 30 + (year - 1) * 365 + year // 4 + self.jd_epoch - 1
    
    def gregorian_to_ethiopian(self, date: datetime) -> Tuple[int, int, int]:
        """Convert Gregorian date to Ethiopian date"""
        jd = self.gregorian_to_jd(date)
        return self.jd_to_ethiopian(jd)
    
    def is_leap_year(self, year: int) -> bool:
        """Check if Ethiopian year is leap year"""
        return year % 4 == 3
    
    def format_date(self, date: datetime, locale, format_type: str = 'full') -> str:
        eth_year, eth_month, eth_day = self.gregorian_to_ethiopian(date)
        
        if format_type == 'full':
            day_name = locale.day_names[date.weekday()] if hasattr(locale, 'day_names') else ''
            month_name = self.ethiopian_months[eth_month - 1] if eth_month <= 13 else self.ethiopian_months[12]
            return f"{day_name}, {eth_day} {month_name} {eth_year}"
        elif format_type == 'short':
            return f"{eth_month}/{eth_day}/{eth_year}"
        else:
            month_name = self.ethiopian_months[eth_month - 1] if eth_month <= 13 else self.ethiopian_months[12]
            return f"{eth_day} {month_name} {eth_year}"
    
    def get_month_calendar(self, year: int, month: int) -> List[List[int]]:
        """Get Ethiopian month calendar grid"""
        # For Ethiopian calendar, we need to handle 13 months
        days_in_month = 30 if month <= 12 else (6 if self.is_leap_year(year) else 5)
        
        # Convert Ethiopian date to Gregorian to get day of week
        first_day_jd = self.ethiopian_to_jd(year, month, 1)
        # Convert JD back to Gregorian to get weekday
        greg_date = self.jd_to_gregorian(first_day_jd)
        first_gregorian = datetime(greg_date[0], greg_date[1], greg_date[2])
        
        calendar = []
        week = []
        
        # Fill in days before month starts
        start_day_of_week = first_gregorian.weekday()  # Monday = 0
        for i in range(start_day_of_week):
            week.append(0)
        
        # Fill in days of the month
        for day in range(1, days_in_month + 1):
            week.append(day)
            if len(week) == 7:
                calendar.append(week)
                week = []
        
        # Fill in remaining days
        while len(week) < 7 and len(week) > 0:
            week.append(0)
        
        if week:
            calendar.append(week)
        
        return calendar
    
    def jd_to_gregorian(self, jd: float) -> Tuple[int, int, int]:
        """Convert Julian Day to Gregorian date"""
        z = int(jd + 0.5)
        a = int((z - 1867216.25) / 36524.25)
        aa = z + 1 + a - a // 4
        b = aa + 1524
        c = int((b - 122.1) / 365.25)
        d = int(365.25 * c)
        e = int((b - d) / 30.6001)
        day = b - d - int(e * 30.6001)
        month = e - (13 if e > 13.5 else 1)
        year = c - (4716 if month > 2.5 else 4715)
        if year <= 0:
            year -= 1
        return year, month, day
    
    def is_holiday(self, date: datetime) -> bool:
        """Ethiopian holidays"""
        # Ethiopian New Year (Enkutatash) - September 11
        if date.month == 9 and date.day == 11:
            return True
        # Timkat (Epiphany) - January 19
        if date.month == 1 and date.day == 19:
            return True
        return super().is_holiday(date)


class IslamicCalendar(BaseCalendar):
    """Islamic calendar implementation (simplified)"""
    
    def format_date(self, date: datetime, locale, format_type: str = 'full') -> str:
        # Simplified Islamic date formatting
        # In production, use proper Hijri calendar conversion
        islamic_year = date.year - 579  # Approximate conversion
        
        if format_type == 'full':
            return f"{date.day} {locale.month_names[date.month - 1]} {islamic_year} هـ"
        elif format_type == 'short':
            return f"{date.month}/{date.day}/{islamic_year}"
        else:
            return f"{date.day} {locale.month_names[date.month - 1]} {islamic_year}"


class BaseLocale:
    """Base locale class"""
    
    def __init__(self):
        self.month_names = []
        self.day_names = []
        self.day_names_short = []


class EnglishLocale(BaseLocale):
    """English locale"""
    
    def __init__(self):
        super().__init__()
        self.month_names = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ]
        self.day_names = [
            'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
        ]
        self.day_names_short = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']


class AmharicLocale(BaseLocale):
    """Amharic locale"""
    
    def __init__(self):
        super().__init__()
        self.month_names = [
            'መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሳስ', 'ጥር', 'የካቲት',
            'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜ'
        ]
        self.day_names = [
            'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ', 'እሑድ'
        ]
        self.day_names_short = ['ሰኞ', 'ማክሰ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ', 'እሑድ']


class OromoLocale(BaseLocale):
    """Afaan Oromo locale"""
    
    def __init__(self):
        super().__init__()
        self.month_names = [
            'Fuulbaana', 'Onkolooleessaa', 'Sadaasaa', 'Muddee', 'Ammajjii', 'Gurraandhala',
            'Bitooteessaa', 'Ebla', 'Caamsaa', 'Waxabajjii', 'Adoolessa', 'Hagayya', 'Qaamee'
        ]
        self.day_names = [
            'Kibxata', 'Roobii', 'Khamisa', 'Jimaata', 'Sanbata', 'Dilbata', 'Wiixata'
        ]
        self.day_names_short = ['Kib', 'Ro', 'Ka', 'Ji', 'Sa', 'Di', 'Wi']


class ArabicLocale(BaseLocale):
    """Arabic locale"""
    
    def __init__(self):
        super().__init__()
        self.month_names = [
            'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
            'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
        ]
        self.day_names = [
            'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'
        ]
        self.day_names_short = ['اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت', 'أحد']


class DateDisplay:
    """Date display utility class"""
    
    def __init__(self, calendar_type: str = 'gregorian', language: str = 'en'):
        self.calendar = ModernCalendar(calendar_type, language)
    
    def display_date(self, date: datetime = None, format_type: str = 'full') -> str:
        """Display formatted date"""
        if date is None:
            date = datetime.now()
        
        return self.calendar.format_date(date, format_type)
    
    def display_date_info(self, date: datetime = None) -> Dict:
        """Display comprehensive date information"""
        if date is None:
            date = datetime.now()
        
        return self.calendar.get_date_info(date)
    
    def display_month_calendar(self, year: int = None, month: int = None) -> List[List[int]]:
        """Display month calendar grid"""
        if year is None:
            year = datetime.now().year
        if month is None:
            month = datetime.now().month
        
        return self.calendar.get_month_calendar(year, month)


# Example usage and testing
if __name__ == "__main__":
    # Test Gregorian calendar
    print("=== Gregorian Calendar (English) ===")
    greg_cal = ModernCalendar('gregorian', 'en')
    today = greg_cal.today()
    print(f"Today: {greg_cal.format_date(today)}")
    print(f"Date Info: {greg_cal.get_date_info(today)}")
    
    # Test Ethiopian calendar
    print("\n=== Ethiopian Calendar (Amharic) ===")
    eth_cal = ModernCalendar('ethiopian', 'am')
    print(f"Today: {eth_cal.format_date(today)}")
    print(f"Date Info: {eth_cal.get_date_info(today)}")
    
    # Test date operations
    print("\n=== Date Operations ===")
    future_date = greg_cal.add_days(today, 30)
    print(f"30 days from now: {greg_cal.format_date(future_date)}")
    
    # Test DateDisplay
    print("\n=== Date Display Component ===")
    date_display = DateDisplay('gregorian', 'en')
    print(f"Display: {date_display.display_date()}")
    
    eth_display = DateDisplay('ethiopian', 'am')
    print(f"Ethiopian Display: {eth_display.display_date()}")