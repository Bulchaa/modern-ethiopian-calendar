#!/usr/bin/env python3
"""
Modern Calendar System - Python Demo
Demonstrates all features of the Python implementation
"""

from modern_calendar import ModernCalendar, DateDisplay
from datetime import datetime, timedelta
import sys

def print_separator(title):
    """Print a formatted separator"""
    print("\n" + "="*50)
    print(f" {title}")
    print("="*50)

def demo_basic_usage():
    """Demonstrate basic calendar usage"""
    print_separator("BASIC USAGE")
    
    # Create Gregorian calendar
    greg_cal = ModernCalendar('gregorian', 'en')
    today = greg_cal.today()
    
    print(f"Today (Gregorian): {greg_cal.format_date(today)}")
    print(f"Short format: {greg_cal.format_date(today, 'short')}")
    print(f"Medium format: {greg_cal.format_date(today, 'medium')}")
    
    # Create Ethiopian calendar
    eth_cal = ModernCalendar('ethiopian', 'am')
    print(f"Today (Ethiopian): {eth_cal.format_date(today)}")
    
    # Create Islamic calendar
    islamic_cal = ModernCalendar('islamic', 'ar')
    print(f"Today (Islamic): {islamic_cal.format_date(today)}")

def demo_date_operations():
    """Demonstrate date operations"""
    print_separator("DATE OPERATIONS")
    
    calendar = ModernCalendar('gregorian', 'en')
    today = calendar.today()
    
    # Add days
    future_date = calendar.add_days(today, 30)
    print(f"30 days from now: {calendar.format_date(future_date)}")
    
    # Add months
    future_month = calendar.add_months(today, 3)
    print(f"3 months from now: {calendar.format_date(future_month)}")
    
    # Check weekend
    print(f"Is today weekend? {calendar.is_weekend(today)}")
    
    # Check holiday
    print(f"Is today holiday? {calendar.is_holiday(today)}")

def demo_date_info():
    """Demonstrate comprehensive date information"""
    print_separator("DATE INFORMATION")
    
    calendar = ModernCalendar('gregorian', 'en')
    today = calendar.today()
    
    date_info = calendar.get_date_info(today)
    
    print("Comprehensive Date Information:")
    for key, value in date_info.items():
        print(f"  {key}: {value}")

def demo_month_calendar():
    """Demonstrate month calendar generation"""
    print_separator("MONTH CALENDAR")
    
    calendar = ModernCalendar('gregorian', 'en')
    current_year = datetime.now().year
    current_month = datetime.now().month
    
    month_grid = calendar.get_month_calendar(current_year, current_month)
    month_name = calendar.get_month_name(current_month)
    
    print(f"\n{month_name} {current_year}")
    print("Mo Tu We Th Fr Sa Su")
    print("-" * 21)
    
    for week in month_grid:
        week_str = ""
        for day in week:
            if day == 0:
                week_str += "   "
            else:
                week_str += f"{day:2d} "
        print(week_str)

def demo_date_display():
    """Demonstrate DateDisplay component"""
    print_separator("DATE DISPLAY COMPONENT")
    
    # English Gregorian
    display_en = DateDisplay('gregorian', 'en')
    print("English Gregorian:")
    print(f"  {display_en.display_date()}")
    
    # Amharic Ethiopian
    display_am = DateDisplay('ethiopian', 'am')
    print("\nAmharic Ethiopian:")
    print(f"  {display_am.display_date()}")
    
    # Display date info
    print("\nDate Information:")
    date_info = display_en.display_date_info()
    for key, value in date_info.items():
        print(f"  {key}: {value}")

def demo_multi_language():
    """Demonstrate multi-language support"""
    print_separator("MULTI-LANGUAGE SUPPORT")
    
    today = datetime.now()
    
    # English
    cal_en = ModernCalendar('gregorian', 'en')
    print(f"English: {cal_en.format_date(today)}")
    
    # Amharic (Ethiopian calendar)
    cal_am = ModernCalendar('ethiopian', 'am')
    print(f"Amharic: {cal_am.format_date(today)}")
    
    # Show month names in different languages
    print("\nMonth names:")
    print("English:", [cal_en.get_month_name(i) for i in range(1, 13)][:3], "...")
    print("Amharic:", [cal_am.get_month_name(i) for i in range(1, 13)][:3], "...")

def demo_calendar_comparison():
    """Compare dates across different calendars"""
    print_separator("CALENDAR COMPARISON")
    
    today = datetime.now()
    
    calendars = [
        ('Gregorian (English)', ModernCalendar('gregorian', 'en')),
        ('Ethiopian (Amharic)', ModernCalendar('ethiopian', 'am')),
        ('Islamic (Arabic)', ModernCalendar('islamic', 'ar'))
    ]
    
    print("Same date in different calendars:")
    for name, calendar in calendars:
        formatted = calendar.format_date(today)
        print(f"  {name}: {formatted}")

def demo_special_dates():
    """Demonstrate special dates and holidays"""
    print_separator("SPECIAL DATES & HOLIDAYS")
    
    calendar = ModernCalendar('gregorian', 'en')
    
    # Test some known holidays
    test_dates = [
        datetime(2024, 1, 1),   # New Year
        datetime(2024, 12, 25), # Christmas
        datetime(2024, 7, 4),   # Independence Day (US)
    ]
    
    print("Holiday check:")
    for date in test_dates:
        is_holiday = calendar.is_holiday(date)
        is_weekend = calendar.is_weekend(date)
        formatted = calendar.format_date(date)
        print(f"  {formatted}: Holiday={is_holiday}, Weekend={is_weekend}")

def demo_performance():
    """Demonstrate performance with multiple operations"""
    print_separator("PERFORMANCE DEMO")
    
    import time
    
    calendar = ModernCalendar('gregorian', 'en')
    
    # Time date formatting
    start_time = time.time()
    for i in range(1000):
        date = calendar.add_days(calendar.today(), i)
        calendar.format_date(date)
    end_time = time.time()
    
    print(f"Formatted 1000 dates in {end_time - start_time:.4f} seconds")
    
    # Time calendar generation
    start_time = time.time()
    for month in range(1, 13):
        calendar.get_month_calendar(2024, month)
    end_time = time.time()
    
    print(f"Generated 12 month calendars in {end_time - start_time:.4f} seconds")

def interactive_demo():
    """Interactive demo allowing user input"""
    print_separator("INTERACTIVE DEMO")
    
    calendar = ModernCalendar('gregorian', 'en')
    
    while True:
        print("\nChoose an option:")
        print("1. Format today's date")
        print("2. Add days to today")
        print("3. Check if date is weekend")
        print("4. Switch calendar type")
        print("5. Exit")
        
        try:
            choice = input("\nEnter choice (1-5): ").strip()
            
            if choice == '1':
                today = calendar.today()
                print(f"Today: {calendar.format_date(today)}")
                
            elif choice == '2':
                days = int(input("Enter number of days to add: "))
                future_date = calendar.add_days(calendar.today(), days)
                print(f"Date: {calendar.format_date(future_date)}")
                
            elif choice == '3':
                today = calendar.today()
                is_weekend = calendar.is_weekend(today)
                print(f"Is today weekend? {is_weekend}")
                
            elif choice == '4':
                print("Available calendars: gregorian, ethiopian, islamic")
                cal_type = input("Enter calendar type: ").strip()
                if cal_type in ['gregorian', 'ethiopian', 'islamic']:
                    calendar = ModernCalendar(cal_type, 'en')
                    print(f"Switched to {cal_type} calendar")
                else:
                    print("Invalid calendar type")
                    
            elif choice == '5':
                print("Goodbye!")
                break
                
            else:
                print("Invalid choice")
                
        except (ValueError, KeyboardInterrupt):
            print("\nExiting...")
            break

def main():
    """Main demo function"""
    print("🌍 Modern Calendar System - Python Demo")
    print("=" * 50)
    
    try:
        # Run all demos
        demo_basic_usage()
        demo_date_operations()
        demo_date_info()
        demo_month_calendar()
        demo_date_display()
        demo_multi_language()
        demo_calendar_comparison()
        demo_special_dates()
        demo_performance()
        
        # Ask if user wants interactive demo
        print("\n" + "="*50)
        response = input("Run interactive demo? (y/n): ").strip().lower()
        if response in ['y', 'yes']:
            interactive_demo()
            
    except KeyboardInterrupt:
        print("\n\nDemo interrupted by user")
    except Exception as e:
        print(f"\nError occurred: {e}")
        sys.exit(1)
    
    print("\n🎉 Demo completed successfully!")

if __name__ == "__main__":
    main()