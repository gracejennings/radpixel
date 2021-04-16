# startup_aggregate.py
#
# Description: 
# Run all the aggregate functions for a video on startup
#
# Functions:
# 1. total event count
# 2. full histogram data
# 3. event rate over time
# 4. hot/stuck pixel data
#
# Params: filename, threshold
#
import sys
import json
import numpy as np
import cv2

fname = sys.argv[1]
threshold = int(sys.argv[2])

event_count = 0
quadrant_event_count = [0, 0, 0, 0] # top left, top right, bottom left, bottom right

cap = cv2.VideoCapture(fname)

chart_arr = []

bins = [i * 5 for i in range(0, 52)]

frameWidth = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
frameHeight = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
heatmap = np.zeros((frameHeight, frameWidth))

idx = 0
while(cap.isOpened()):
    ret, frame = cap.read()

    if ret:
        # mask array using threshold (out of 255)
        mask = np.where(frame > threshold, 255, 0).astype(np.uint8)
        lit = np.count_nonzero(mask)

        # split into quadrants
        q1, q2, q3, q4 = [M for subMask in np.split(mask,2, axis = 0) for M in np.split(subMask,2, axis = 1)]

        # aggregate event counts
        quadrant_event_count[0] += np.count_nonzero(q1)
        quadrant_event_count[1] += np.count_nonzero(q2)
        quadrant_event_count[2] += np.count_nonzero(q3)
        quadrant_event_count[3] += np.count_nonzero(q4)

        # line chart of event rate
        chart_arr.append({"frame": idx, "events": lit})

        # histogram
        if (idx == 0):
            hist = np.histogram(frame, bins)
        else:
            hist += np.histogram(frame, bins)

        # heatmap
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY) # convert to grayscale
        heatmap = np.add(heatmap, np.where(gray > threshold, 1, 0))

        event_count += lit
    else:
        break

    idx += 1
    
cap.release()

# clean up histogram data
hist_values = hist[0]
for i in range(2, len(hist), 2):
    hist_values = np.add(hist_values, hist[i])

# get the top 10 pixels of interest based on event count
# get the top ten pixels of interest
max_events = np.unique(heatmap)
pixel_data = dict()
count = 0
idx = -1
while count < 10:
    result = np.where(heatmap == max_events[idx])
    values = list(zip(result[1].tolist(), result[0].tolist()))
    count += len(values)
    if count <= 10: # sometimes we get a huge bin here
        pixel_data[str(int(max_events[idx]))] = values
    else:
        pixel_data[str(int(max_events[idx]))] = values[:(10-count)]

    idx -= 1

print(json.dumps(
    {
        "eventCount": event_count, 
        "eventsTime": chart_arr, 
        "histogram": {"values": hist_values.tolist(), "bins": bins}, 
        "hotpixels": pixel_data,
        "quadrants": quadrant_event_count
    }
))