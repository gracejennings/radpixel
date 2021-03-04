# aggregate event count data for a given filename and threshold
# params: filename, threshold
import sys
import json
import numpy as np
import cv2

fname = sys.argv[1]
threshold = int(sys.argv[2])

event_count = 0

cap = cv2.VideoCapture(fname)

chart_arr = []

idx = 0
while(cap.isOpened()):
    ret, frame = cap.read()

    if ret:
        mask = np.where(frame > threshold, 255, 0).astype(np.uint8)
        lit = np.count_nonzero(mask)

        chart_arr.append({"frame": idx, "events": lit})

        event_count += lit
    else:
        break

    idx += 1
    
cap.release()

print(json.dumps({"eventCount": event_count, "eventsTime": chart_arr}))