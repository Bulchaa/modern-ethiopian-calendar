"""
Modern Calendar DatePicker - Python Implementation
Supports Ethiopian, Gregorian, and Islamic calendars with GUI integration
"""

import tkinter as tk
from tkinter import ttk
from datetime import datetime, date
import calendar
from typing import Optional, Callable, Dict, Any
from .modern_calendar import ModernCalendar, EthiopianLocale, OromoLocale, EnglishLocale

class ModernDatePicker:
    """
    DatePicker widget for Python GUI applications
    Supports multiple calendar systems and languages
    """
    
    def __init__(self, parent=None, **options):
        self.parent = parent
        self.options = {
            'calendar': options.get('calendar', 'gregorian'),
            'language': options.get('language', 'en'),
            'format': options.get('format', '%Y-%m-%d'),
            'on_select': options.get('on_select', None),
            'width': options.get('width', 200),
            'height': options.get('height', 30)
        }
        
        self.selected_date = None
        self.popup_window = None
        self.calendar_widget = None
        
        # Initialize calendar engine
        self.calendar_engine = ModernCalendar(
            self.options['calendar'], 
            self.options['language']
        )
        
        self.setup_widget()
    
    def setup_widget(self):
        """Setup the main datepicker widget"""
        self.frame = ttk.Frame(self.parent)
        
        # Entry widget for date display
        self.entry = ttk.Entry(
            self.frame,
            width=self.options['width'] // 10,
            state='readonly'
        )
        self.entry.pack(side=tk.LEFT, padx=(0, 5))
        
        # Calendar button
        self.button = ttk.Button(
            self.frame,
            text="📅",
            width=3,
            command=self.show_calendar
        )
        self.button.pack(side=tk.LEFT)
        
        # Bind events
        self.entry.bind('<Button-1>', lambda e: self.show_calendar())
    
    def show_calendar(self):
        """Show the calendar popup"""
        if self.popup_window:
            return
            
        self.popup_window = tk.Toplevel(self.parent)
        self.popup_window.title("Select Date")
        self.popup_window.geometry("350x400")
        self.popup_window.resizable(False, False)
        
        # Make popup modal
        self.popup_window.transient(self.parent)
        self.popup_window.grab_set()
        
        # Position popup near the entry widget
        self.position_popup()
        
        # Create calendar widget
        self.create_calendar_widget()
        
        # Handle window close
        self.popup_window.protocol("WM_DELETE_WINDOW", self.hide_calendar)
        
        # Bind escape key
        self.popup_window.bind('<Escape>', lambda e: self.hide_calendar())
    
    def hide_calendar(self):
        """Hide the calendar popup"""
        if self.popup_window:
            self.popup_window.destroy()
            self.popup_window = None
            self.calendar_widget = None
    
    def position_popup(self):
        """Position popup near the entry widget"""
        try:
            # Get entry widget position
            x = self.entry.winfo_rootx()
            y = self.entry.winfo_rooty() + self.entry.winfo_height() + 5
            
            # Adjust if popup goes off screen
            screen_width = self.popup_window.winfo_screenwidth()
            screen_height = self.popup_window.winfo_screenheight()
            
            if x + 350 > screen_width:
                x = screen_width - 350 - 10
            
            if y + 400 > screen_height:
                y = self.entry.winfo_rooty() - 400 - 5
            
            self.popup_window.geometry(f"350x400+{x}+{y}")
        except:
            # Fallback to center of screen
            self.popup_window.geometry("350x400+300+200")
    
    def create_calendar_widget(self):
        """Create the calendar widget inside popup"""
        main_frame = ttk.Frame(self.popup_window)
        main_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # Header with navigation
        header_frame = ttk.Frame(main_frame)
        header_frame.pack(fill=tk.X, pady=(0, 10))
        
        self.prev_button = ttk.Button(
            header_frame, 
            text="◀", 
            width=3,
            command=self.prev_month
        )
        self.prev_button.pack(side=tk.LEFT)
        
        self.month_label = ttk.Label(
            header_frame, 
            text="", 
            font=('Arial', 12, 'bold')
        )
        self.month_label.pack(side=tk.LEFT, expand=True)
        
        self.next_button = ttk.Button(
            header_frame, 
            text="▶", 
            width=3,
            command=self.next_month
        )
        self.next_button.pack(side=tk.RIGHT)
        
        # Calendar grid
        self.calendar_frame = ttk.Frame(main_frame)
        self.calendar_frame.pack(fill=tk.BOTH, expand=True)
        
        # Current date for navigation
        self.current_date = datetime.now()
        
        # Render calendar
        self.render_calendar()
        
        # Footer with today button
        footer_frame = ttk.Frame(main_frame)
        footer_frame.pack(fill=tk.X, pady=(10, 0))
        
        today_button = ttk.Button(
            footer_frame,
            text="Today",
            command=self.select_today
        )
        today_button.pack(side=tk.LEFT)
        
        close_button = ttk.Button(
            footer_frame,
            text="Close",
            command=self.hide_calendar
        )
        close_button.pack(side=tk.RIGHT)
    
    def render_calendar(self):
        """Render the calendar grid"""
        # Clear existing widgets
        for widget in self.calendar_frame.winfo_children():
            widget.destroy()
        
        # Update month label
        if self.options['calendar'] == 'ethiopian':
            month_name = self.get_ethiopian_month_name()
            year = self.get_ethiopian_year()
            self.month_label.config(text=f"{month_name} {year}")
        else:
            month_name = calendar.month_name[self.current_date.month]
            self.month_label.config(text=f"{month_name} {self.current_date.year}")
        
        # Day headers
        day_names = self.get_day_names()
        for i, day_name in enumerate(day_names):
            label = ttk.Label(
                self.calendar_frame, 
                text=day_name, 
                font=('Arial', 9, 'bold')
            )
            label.grid(row=0, column=i, padx=1, pady=1, sticky='nsew')
        
        # Calendar days
        if self.options['calendar'] == 'ethiopian':
            self.render_ethiopian_days()
        else:
            self.render_gregorian_days()
        
        # Configure grid weights
        for i in range(7):
            self.calendar_frame.columnconfigure(i, weight=1)
        for i in range(7):
            self.calendar_frame.rowconfigure(i, weight=1)
    
    def render_gregorian_days(self):
        """Render Gregorian calendar days"""
        year = self.current_date.year
        month = self.current_date.month
        
        # Get first day of month and number of days
        first_day = datetime(year, month, 1)
        first_weekday = first_day.weekday()
        if first_weekday == 6:  # Sunday = 0 in our system
            first_weekday = 0
        else:
            first_weekday += 1
        
        days_in_month = calendar.monthrange(year, month)[1]
        
        # Previous month days
        if month == 1:
            prev_month_days = calendar.monthrange(year - 1, 12)[1]
            prev_year, prev_month = year - 1, 12
        else:
            prev_month_days = calendar.monthrange(year, month - 1)[1]
            prev_year, prev_month = year, month - 1
        
        day_num = 1
        row = 1
        
        for week in range(6):
            for day_col in range(7):
                if week == 0 and day_col < first_weekday:
                    # Previous month days
                    day = prev_month_days - first_weekday + day_col + 1
                    self.create_day_button(
                        row, day_col, day, 
                        datetime(prev_year, prev_month, day),
                        other_month=True
                    )
                elif day_num <= days_in_month:
                    # Current month days
                    current_day = datetime(year, month, day_num)
                    self.create_day_button(row, day_col, day_num, current_day)
                    day_num += 1
                else:
                    # Next month days
                    next_day = day_num - days_in_month
                    if month == 12:
                        next_year, next_month = year + 1, 1
                    else:
                        next_year, next_month = year, month + 1
                    
                    self.create_day_button(
                        row, day_col, next_day,
                        datetime(next_year, next_month, next_day),
                        other_month=True
                    )
                    day_num += 1
            row += 1
            if day_num > days_in_month + 7:
                break
    
    def render_ethiopian_days(self):
        """Render Ethiopian calendar days"""
        # Convert current Gregorian date to Ethiopian
        eth_date = self.calendar_engine.gregorian_to_ethiopian(self.current_date)
        
        # Ethiopian months have 30 days (except Pagume)
        days_in_month = 30 if eth_date['month'] <= 12 else (6 if self.is_ethiopian_leap_year(eth_date['year']) else 5)
        
        # Create Ethiopian calendar grid
        day_num = 1
        row = 1
        
        for week in range(6):
            for day_col in range(7):
                if day_num <= days_in_month:
                    # Convert Ethiopian date back to Gregorian for button
                    greg_date = self.calendar_engine.ethiopian_to_gregorian(
                        eth_date['year'], eth_date['month'], day_num
                    )
                    self.create_day_button(row, day_col, day_num, greg_date)
                    day_num += 1
                else:
                    # Empty cells
                    empty_label = ttk.Label(self.calendar_frame, text="")
                    empty_label.grid(row=row, column=day_col, padx=1, pady=1, sticky='nsew')
            row += 1
            if day_num > days_in_month:
                break
    
    def create_day_button(self, row, col, day_text, date_obj, other_month=False):
        """Create a day button in the calendar grid"""
        style = 'Other.TButton' if other_month else 'Day.TButton'
        
        # Check if this is today
        today = datetime.now().date()
        is_today = date_obj.date() == today
        
        # Check if this is selected date
        is_selected = (self.selected_date and 
                      date_obj.date() == self.selected_date.date())
        
        if is_today:
            style = 'Today.TButton'
        elif is_selected:
            style = 'Selected.TButton'
        
        button = ttk.Button(
            self.calendar_frame,
            text=str(day_text),
            width=4,
            command=lambda d=date_obj: self.select_date(d)
        )
        button.grid(row=row, column=col, padx=1, pady=1, sticky='nsew')
        
        # Configure button styles
        if is_today:
            button.configure(style='Today.TButton')
        elif is_selected:
            button.configure(style='Selected.TButton')
        elif other_month:
            button.configure(style='Other.TButton')
    
    def select_date(self, date_obj):
        """Select a date and update the entry"""
        self.selected_date = date_obj
        
        # Format date according to calendar type
        if self.options['calendar'] == 'ethiopian':
            formatted = self.format_ethiopian_date(date_obj)
        else:
            formatted = date_obj.strftime(self.options['format'])
        
        # Update entry
        self.entry.config(state='normal')
        self.entry.delete(0, tk.END)
        self.entry.insert(0, formatted)
        self.entry.config(state='readonly')
        
        # Call callback
        if self.options['on_select']:
            self.options['on_select'](date_obj, formatted)
        
        # Hide calendar
        self.hide_calendar()
    
    def format_ethiopian_date(self, date_obj):
        """Format date in Ethiopian calendar"""
        eth_date = self.calendar_engine.gregorian_to_ethiopian(date_obj)
        
        format_str = self.options['format']
        year_str = str(eth_date['year'])
        month_str = str(eth_date['month']).zfill(2)
        day_str = str(eth_date['day']).zfill(2)
        
        return (format_str
                .replace('%Y', year_str)
                .replace('%m', month_str)
                .replace('%d', day_str)
                .replace('%y', year_str[-2:]))
    
    def get_day_names(self):
        """Get day names for current language"""
        if self.options['language'] == 'am':
            return ['እሑድ', 'ሰኞ', 'ማክሰ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ']
        elif self.options['language'] == 'oro':
            return ['Wix', 'Kib', 'Rob', 'Kam', 'Jim', 'San', 'Dil']
        else:
            return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    
    def get_ethiopian_month_name(self):
        """Get Ethiopian month name"""
        eth_date = self.calendar_engine.gregorian_to_ethiopian(self.current_date)
        month_names = self.calendar_engine.get_month_names()
        return month_names[eth_date['month'] - 1]
    
    def get_ethiopian_year(self):
        """Get Ethiopian year"""
        eth_date = self.calendar_engine.gregorian_to_ethiopian(self.current_date)
        return eth_date['year']
    
    def is_ethiopian_leap_year(self, year):
        """Check if Ethiopian year is leap year"""
        return year % 4 == 3
    
    def prev_month(self):
        """Navigate to previous month"""
        if self.current_date.month == 1:
            self.current_date = self.current_date.replace(
                year=self.current_date.year - 1, month=12
            )
        else:
            self.current_date = self.current_date.replace(
                month=self.current_date.month - 1
            )
        self.render_calendar()
    
    def next_month(self):
        """Navigate to next month"""
        if self.current_date.month == 12:
            self.current_date = self.current_date.replace(
                year=self.current_date.year + 1, month=1
            )
        else:
            self.current_date = self.current_date.replace(
                month=self.current_date.month + 1
            )
        self.render_calendar()
    
    def select_today(self):
        """Select today's date"""
        today = datetime.now()
        self.select_date(today)
    
    def get_selected_date(self):
        """Get the currently selected date"""
        return self.selected_date
    
    def set_date(self, date_obj):
        """Set the selected date programmatically"""
        if isinstance(date_obj, str):
            date_obj = datetime.strptime(date_obj, self.options['format'])
        
        self.selected_date = date_obj
        self.current_date = date_obj
        
        # Update entry
        if self.options['calendar'] == 'ethiopian':
            formatted = self.format_ethiopian_date(date_obj)
        else:
            formatted = date_obj.strftime(self.options['format'])
        
        self.entry.config(state='normal')
        self.entry.delete(0, tk.END)
        self.entry.insert(0, formatted)
        self.entry.config(state='readonly')
    
    def pack(self, **kwargs):
        """Pack the datepicker widget"""
        self.frame.pack(**kwargs)
    
    def grid(self, **kwargs):
        """Grid the datepicker widget"""
        self.frame.grid(**kwargs)
    
    def place(self, **kwargs):
        """Place the datepicker widget"""
        self.frame.place(**kwargs)


# Example usage and demo
if __name__ == "__main__":
    def on_date_select(date_obj, formatted):
        print(f"Selected date: {formatted}")
        print(f"Date object: {date_obj}")
    
    # Create demo window
    root = tk.Tk()
    root.title("Modern DatePicker Demo")
    root.geometry("400x300")
    
    # Gregorian DatePicker
    ttk.Label(root, text="Gregorian DatePicker:").pack(pady=5)
    gregorian_picker = ModernDatePicker(
        root,
        calendar='gregorian',
        language='en',
        on_select=on_date_select
    )
    gregorian_picker.pack(pady=5)
    
    # Ethiopian DatePicker
    ttk.Label(root, text="Ethiopian DatePicker (አማርኛ):").pack(pady=5)
    ethiopian_picker = ModernDatePicker(
        root,
        calendar='ethiopian',
        language='am',
        on_select=on_date_select
    )
    ethiopian_picker.pack(pady=5)
    
    # Set test date
    from datetime import datetime
    test_date = datetime(2017, 6, 12)  # June 12, 2017
    ethiopian_picker.set_date(test_date)
    
    root.mainloop()