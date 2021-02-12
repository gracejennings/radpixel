# you have to run this script from regular mac terminal!!

import numpy as np
import cv2
from datetime import datetime
import matplotlib.pyplot as plt

start_time = datetime.now()

FILENAME = './data/lotsOfEvents.mp4'

#this function creates histogram live with the video 
def create_live_histogram(fname):
    capture = cv2.VideoCapture(fname)
    # dividing pixel intensity range (0-255) into bins to reduce computation
    bins = 16
    resizeWidth=0

    # Initialize plot
    fig, ax = plt.subplots()
    ax.set_title('Histogram')
    ax.set_xlabel('Bin')
    ax.set_ylabel('Frequency')

    lw = 3
    alpha = .5
    lineR, = ax.plot(np.arange(bins), np.zeros((bins,)), c='r', lw=lw, alpha=alpha, label='Red')
    lineG, = ax.plot(np.arange(bins), np.zeros((bins,)), c='g', lw=lw, alpha=alpha, label='Green')
    lineB, = ax.plot(np.arange(bins), np.zeros((bins,)), c='b', lw=lw, alpha=alpha, label='Blue')

    ax.set_xlim(0, bins-1)
    ax.set_ylim(0, 1)
    ax.legend()
    plt.ion()
    plt.show()

    # Grab, process, and display video frames. Update plot line object(s).
    while True:
        (grabbed, frame) = capture.read()

        if not grabbed:
            break

        # Resize frame to width, if specified.
        if resizeWidth > 0:
            (height, width) = frame.shape[:2]
            resizeHeight = int(float(resizeWidth / width) * height)
            frame = cv2.resize(frame, (resizeWidth, resizeHeight),
                interpolation=cv2.INTER_AREA)

        # Normalize histograms based on number of pixels per frame.
        numPixels = np.prod(frame.shape[:2])
        
        cv2.imshow('RGB', frame)
        (b, g, r) = cv2.split(frame)
        histogramR = cv2.calcHist([r], [0], None, [bins], [0, 255]) / numPixels
        histogramG = cv2.calcHist([g], [0], None, [bins], [0, 255]) / numPixels
        histogramB = cv2.calcHist([b], [0], None, [bins], [0, 255]) / numPixels
        lineR.set_ydata(histogramR)
        lineG.set_ydata(histogramG)
        lineB.set_ydata(histogramB)
        
        fig.canvas.draw()

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    capture.release()


# use this function to create a histogram that will help us decide on a threshold
# warning: this takes a while
def create_histogram(fname):
    bins = [i * 5 for i in range(1, 52)]

    cap = cv2.VideoCapture(fname)
    
    idx = 0
    while(cap.isOpened()):
        ret, frame = cap.read()
        if ret:
            if (idx == 0):
                hist = np.histogram(frame, bins)
                #hist = np.histogram(frame.ravel(),256,[0,256])
            else:
                hist += np.histogram(frame, bins)
                #hist += np.histogram(frame.ravel(),256,[0,256])
        else:
            break
            
        idx += 1
        
    cap.release()

    # aggregate histogram data from all frames
    values = np.array(hist[0])
    for i in range(2, len(hist), 2):
        values = np.add(values, np.array(hist[i]))

    plt.hist(x=values, bins=hist[1])
    plt.show()


def threshold_event_count(fname, threshold):
    event_count = 0

    cap = cv2.VideoCapture(fname)
    
    while(cap.isOpened()):
        ret, frame = cap.read()

        if ret:
            mask = np.where(frame > threshold, 255, 0).astype(np.uint8)
            event_count += np.count_nonzero(mask)
        else:
            break
        
    cap.release()

    return event_count


# driver code
#create_histogram(FILENAME)
create_live_histogram(FILENAME)

threshold = 100
events = threshold_event_count(FILENAME, threshold) # got this threshold from the histogram ^
print('There were ' + str(events) + ' pixels above the '+str(threshold) + ' threshold')

print("execution time:", datetime.now() - start_time)

