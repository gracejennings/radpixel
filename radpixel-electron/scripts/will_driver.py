"""
Will's driver code / sandbox
"""

# you have to run this script from regular mac terminal!!

import numpy as np
import cv2
from datetime import datetime
import matplotlib.pyplot as plt
from video_utils import realtime_histogram, threshold_event_count

start_time = datetime.now()

FILENAME = './data/alpha_manyevents.mp4'

# driver code
realtime_histogram(FILENAME, 200)

#events = threshold_event_count(FILENAME, 150) # got this threshold from the histogram ^
#print('There were ' + str(events) + ' pixels above the 150 threshold')

print("execution time:", datetime.now() - start_time)
© 2021 GitHub, Inc.
Terms
Privacy
Security
Status
Docs
Contact GitHub
Pricing
API
Training
Blog
About

