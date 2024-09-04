from datetime import *

zeit1 = "2022-07-23T00:00"
zeit2 = "2022-07-23T13:00"

zeit3 = "2022-07-24T03:00"
zeit4 = "2022-07-24T17:00"

duration = "23:00"

von = datetime.strptime(zeit1, "%Y-%m-%dT%H:%M")
bis = datetime.strptime(zeit2, "%Y-%m-%dT%H:%M")

zeitintervall1 = bis - von

start = datetime.strptime(zeit3, "%Y-%m-%dT%H:%M")
end = datetime.strptime(zeit4, "%Y-%m-%dT%H:%M")

zeitintervall2 = end - start

intervall = zeitintervall1 + zeitintervall2

print(intervall)

finish = projekt - intervall


def negative_timedelta(ntd):
    # falls negatives timedelta erreicht
    if ntd < timedelta(0):
        # wandle negatives zu positiven timedelta und return als string mit '-' Zeichen
        return 'Überzeit ' + negative_timedelta(-ntd)
    else:
        return str(ntd)


"""def calculate_time_remaining(self, intervals):
    
    
    time_intervals = []
    duration = datetime.strptime(intervals.get_von(), "%Y-%m-%dT%H:%M")
    
    
    for time_interval in time_intervals:
        
        
    
    
     = datetime.strptime(intervals.get_bis(), "%Y-%m-%dT%H:%M")
    return bis - von"""
